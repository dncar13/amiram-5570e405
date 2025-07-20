import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Lock, 
  Shield,
  AlertCircle
} from "lucide-react";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import Header from "@/components/Header";
import SimulationContent from "@/components/simulation/SimulationContent";
import { SimulationLoading } from "@/components/simulation/SimulationLoading";
import { PremiumSetService, PremiumAccessCheck } from "@/services/premiumSetService";
import { Question } from "@/data/types/questionTypes";
import { useAuth } from "@/context/AuthContext";
import PremiumUpgradeModal from "@/components/ui/PremiumUpgradeModal";
import { toast } from "sonner";

const PremiumSetPractice: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { currentUser, isPremium } = useAuth();
  const questionContainerRef = useRef<HTMLDivElement>(null);
  
  // Core simulation state - matching the free simulation structure
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [questionFlags, setQuestionFlags] = useState<Record<number, boolean>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  
  // Premium-specific state
  const [accessCheck, setAccessCheck] = useState<PremiumAccessCheck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [setDetails, setSetDetails] = useState<any>(null);

  // Computed values for SimulationContent
  const answeredQuestionsCount = Object.keys(userAnswers).length;
  const correctQuestionsCount = Object.entries(userAnswers).filter(([index, answer]) => {
    const question = questions[parseInt(index)];
    return question && answer === question.correctAnswer;
  }).length;
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const currentScorePercentage = answeredQuestionsCount > 0 ? (correctQuestionsCount / answeredQuestionsCount) * 100 : 0;
  const score = correctQuestionsCount;

  useEffect(() => {
    const validateAccessAndLoadQuestions = async () => {
      if (!setId) {
        navigate('/');
        return;
      }

      setIsLoading(true);

      try {
        // Server-side access validation - cannot be bypassed
        console.log('🔐 Validating premium access for set:', setId);
        const validation = await PremiumSetService.validateDirectAccess(setId);
        setAccessCheck(validation);

        if (!validation.hasAccess) {
          console.log('🚫 Access denied:', validation.reason, validation.message);
          
          if (validation.reason === 'not_authenticated') {
            toast.error("יש להתחבר כדי לגשת לתוכן פרימיום");
            setShowUpgradeModal(true);
          } else if (validation.reason === 'not_premium') {
            toast.error("תוכן זמין למנויי פרימיום בלבד");
            setShowUpgradeModal(true);
          } else {
            toast.error("שגיאה בגישה לתוכן פרימיום");
            navigate(-1);
          }
          return;
        }

        // Access granted - load questions for the specific set
        console.log(`✅ Premium access granted, loading questions for set: ${setId}`);
        const result = await PremiumSetService.getPremiumSetQuestions(setId);
        
        if (result.questions.length === 0) {
          toast.error("לא נמצאו שאלות בסט פרימיום זה");
          navigate(-1);
          return;
        }

        setQuestions(result.questions);
        
        // Load set details for better UI
        const details = await PremiumSetService.getPremiumSetDetails(setId);
        setSetDetails(details);
        
        toast.success(`נטענו ${result.questions.length} שאלות פרימיום מ-${details?.title || setId}`);
        
      } catch (error) {
        console.error('❌ Error loading premium set:', error);
        toast.error("שגיאה בטעינת התוכן הפרימיום");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    validateAccessAndLoadQuestions();
  }, [setId, navigate, currentUser, isPremium]);

  // Simulation handlers - matching the free simulation interface
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (userAnswers[currentQuestionIndex] !== undefined) return; // Already answered
    
    setSelectedAnswer(answerIndex);
    setIsAnswerSubmitted(true);
    setShowExplanation(false); // Will be shown when user clicks explanation
    
    // Store the answer
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    toast(isCorrect ? "תשובה נכונה!" : "תשובה לא נכונה", {
      icon: isCorrect ? "✅" : "❌"
    });
  }, [currentQuestionIndex, questions, userAnswers]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer !== null) {
      // Answer is already submitted in handleAnswerSelect
      setShowExplanation(true);
    }
  }, [selectedAnswer]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] ?? null);
      setIsAnswerSubmitted(userAnswers[currentQuestionIndex + 1] !== undefined);
      setShowExplanation(false);
    } else {
      // Completed all questions
      setSimulationComplete(true);
    }
  }, [currentQuestionIndex, questions.length, userAnswers]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] ?? null);
      setIsAnswerSubmitted(userAnswers[currentQuestionIndex - 1] !== undefined);
      setShowExplanation(false);
    }
  }, [currentQuestionIndex, userAnswers]);

  const handleToggleExplanation = useCallback(() => {
    setShowExplanation(prev => !prev);
  }, []);

  const handleToggleQuestionFlag = useCallback(() => {
    setQuestionFlags(prev => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex]
    }));
  }, [currentQuestionIndex]);

  const handleNavigateToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setSelectedAnswer(userAnswers[index] ?? null);
      setIsAnswerSubmitted(userAnswers[index] !== undefined);
      setShowExplanation(false);
      setSimulationComplete(false);
    }
  }, [questions.length, userAnswers]);

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuestionFlags({});
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setSimulationComplete(false);
    toast.success("הסימולציה אופסה בהצלחה");
  }, []);

  const handleBackToTopics = useCallback(() => {
    return "/simulation/type/restatement/easy/sets"; // Navigate back to sets page
  }, []);

  const handleResetProgress = useCallback(() => {
    handleRestart();
  }, [handleRestart]);

  const handleFinishSimulation = useCallback(() => {
    setSimulationComplete(true);
  }, []);

  // Loading state - using the same dark theme as free simulation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SimulationLoading />
      </div>
    );
  }

  // Access denied state
  if (!accessCheck?.hasAccess) {
    return (
      <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-start">
          <div className="max-w-md ml-0 p-8 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-2xl border border-slate-600/50">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              {accessCheck?.reason === 'not_authenticated' ? (
                <Lock className="h-8 w-8" />
              ) : (
                <Shield className="h-8 w-8" />
              )}
              <h2 className="text-xl font-bold text-slate-100">גישה נדרשת</h2>
            </div>
            <p className="text-slate-300 mb-6">
              {accessCheck?.message || "אין גישה לתוכן זה"}
            </p>
            <Button 
              onClick={() => navigate(-1)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
            >
              חזרה לסטים
            </Button>
          </div>
        </main>
        
        <PremiumUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          setTitle={setDetails?.title || "תוכן פרימיום"}
        />
      </RTLWrapper>
    );
  }

  // Show empty state if no questions
  if (questions.length === 0) {
    return (
      <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="flex-grow flex items-center justify-start">
          <div className="max-w-md ml-0 p-8 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-2xl border border-slate-600/50">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <AlertCircle className="h-8 w-8" />
              <h2 className="text-xl font-bold text-slate-100">לא נמצאו שאלות</h2>
            </div>
            <p className="text-slate-300 mb-6">
              לא נמצאו שאלות בסט פרימיום זה.
            </p>
            <Button 
              onClick={() => navigate(-1)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
            >
              חזרה לסטים
            </Button>
          </div>
        </main>
      </RTLWrapper>
    );
  }

  // Main premium simulation interface - using SimulationContent like the free simulation
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="flex-grow">
        <SimulationContent
          simulationComplete={simulationComplete}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          remainingTime={null} // No timer for premium practice
          isTimerActive={false}
          currentQuestion={currentQuestion}
          selectedAnswerIndex={selectedAnswer}
          isAnswerSubmitted={isAnswerSubmitted}
          showExplanation={showExplanation}
          score={score}
          questionsData={questions}
          userAnswers={userAnswers}
          questionFlags={questionFlags}
          answeredQuestionsCount={answeredQuestionsCount}
          correctQuestionsCount={correctQuestionsCount}
          progressPercentage={progressPercentage}
          currentScorePercentage={currentScorePercentage}
          examMode={false} // Premium practice is not exam mode
          showAnswersImmediately={true}
          isQuestionSet={true} // Premium sets are question sets
          setNumber={undefined}
          questionContainerRef={questionContainerRef}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          onToggleExplanation={handleToggleExplanation}
          onToggleQuestionFlag={handleToggleQuestionFlag}
          onNavigateToQuestion={handleNavigateToQuestion}
          onRestart={handleRestart}
          onBackToTopics={handleBackToTopics}
          onResetProgress={handleResetProgress}
          onFinishSimulation={handleFinishSimulation}
        />
      </main>
      
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        setTitle={setDetails?.title || "תוכן פרימיום"}
      />
    </RTLWrapper>
  );
};

export default PremiumSetPractice;