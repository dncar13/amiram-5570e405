import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Crown, 
  Lock, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PremiumSetService, PremiumAccessCheck } from "@/services/premiumSetService";
import { Question } from "@/data/types/questionTypes";
import { useAuth } from "@/context/AuthContext";
import PremiumUpgradeModal from "@/components/ui/PremiumUpgradeModal";
import UnifiedQuestionCard from "@/components/common/UnifiedQuestionCard";
import { toast } from "sonner";

const PremiumSetPractice: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { currentUser, isPremium } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [accessCheck, setAccessCheck] = useState<PremiumAccessCheck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

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

        // Access granted - load questions
        console.log('✅ Premium access granted, loading questions...');
        const result = await PremiumSetService.getPremiumSet1Questions();
        
        if (result.questions.length === 0) {
          toast.error("לא נמצאו שאלות בסט פרימיום זה");
          navigate(-1);
          return;
        }

        setQuestions(result.questions);
        toast.success(`נטענו ${result.questions.length} שאלות פרימיום`);
        
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

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions.includes(currentQuestionIndex)) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
    
    toast(isCorrect ? "תשובה נכונה!" : "תשובה לא נכונה", {
      icon: isCorrect ? "✅" : "❌"
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const prevAnswered = answeredQuestions.includes(currentQuestionIndex - 1);
      if (prevAnswered) {
        setShowExplanation(true);
      } else {
        setSelectedAnswer(null);
        setShowExplanation(false);
      }
    }
  };

  const handleBackToSets = () => {
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600">טוען תוכן פרימיום...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Access denied state
  if (!accessCheck?.hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16">
          <div className="container mx-auto px-4 text-center max-w-md">
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  {accessCheck?.reason === 'not_authenticated' ? (
                    <Lock className="h-16 w-16 text-red-500" />
                  ) : (
                    <Shield className="h-16 w-16 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-red-800">גישה נדרשת</CardTitle>
                <CardDescription className="text-red-600">
                  {accessCheck?.message || "אין גישה לתוכן זה"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleBackToSets}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  חזרה
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
        
        <PremiumUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          setTitle="Set 1 – Premium"
        />
      </div>
    );
  }

  // Practice interface
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={handleBackToSets}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              חזרה לסטים
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-200 text-orange-800 border-orange-300">
                <Crown className="w-3 h-3 mr-1" />
                Set 1 Premium
              </Badge>
              <Badge variant="outline">
                {currentQuestionIndex + 1} / {questions.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">התקדמות</span>
              <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Question */}
          {currentQuestion && (
            <UnifiedQuestionCard
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              selectedAnswerIndex={selectedAnswer}
              showExplanation={showExplanation}
              onAnswerSelect={handleAnswerSelect}
              variant="practice"
              showAnswersImmediately={true}
              isAnswerSubmitted={showExplanation}
              isCorrect={selectedAnswer === currentQuestion.correctAnswer}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              שאלה קודמת
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                disabled={!answeredQuestions.includes(currentQuestionIndex)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                שאלה הבאה
              </Button>
            ) : (
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    סיימת! ציון: {correctAnswers}/{questions.length}
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PremiumSetPractice;