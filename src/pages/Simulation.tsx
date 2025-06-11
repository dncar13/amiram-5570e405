import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import Header from "@/components/Header";
import SimulationContent from "@/components/simulation/SimulationContent";
import { useSimulation } from "@/hooks/useSimulation";
import { useSimulationData } from "@/hooks/useSimulationData";
import { SimulationLoading } from "@/components/simulation/SimulationLoading";
import { EmptySimulation } from "@/components/simulation/EmptySimulation";
import { BackButton } from "@/components/simulation/BackButton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { checkForResetRequest, removeResetParameterFromUrl, setupAutoSave } from "@/services/storageUtils";
import { 
  getMediumQuestions, 
  getEasyQuestions, 
  getHardQuestions, 
  getMixedDifficultyQuestions,
  getRestatementQuestions 
} from "@/services/questionsService";
import { Question } from "@/data/types/questionTypes";
import { getQuestionsByStory, getStoryById } from "@/services/storyQuestionsService";

const Simulation = () => {
  const navigate = useNavigate();
  const { topicId, setId, difficulty, type, storyId } = useParams<{ 
    topicId: string; 
    setId: string; 
    difficulty: string; 
    type: string; 
    storyId: string;
  }>();
  const [searchParams] = useSearchParams();
  const isContinue = searchParams.get('continue') === 'true' || window.sessionStorage.getItem('continue_simulation') === 'true';
  const contentRef = useRef<HTMLDivElement>(null);
  const initialLoadAttempted = useRef(false);
  const shouldShowResetToast = useRef(false);
  const hasShownToast = useRef(false);
  
  // Check if we're doing a question set simulation vs a topic simulation
  const [isQuestionSet, setIsQuestionSet] = useState<boolean>(false);

  // Check if this is a story-based simulation
  const isStoryBased = Boolean(storyId);
  
  // Get story-specific questions if this is a story simulation - MEMOIZED to prevent infinite loops
  const storyQuestions = useMemo(() => {
    if (!isStoryBased || !storyId) return [];
    
    console.log('Getting questions for story:', storyId);
    return getQuestionsByStory(storyId);
  }, [isStoryBased, storyId]);
  
  const story = useMemo(() => {
    if (!isStoryBased || !storyId) return undefined;
    
    return getStoryById(storyId);
  }, [isStoryBased, storyId]);

  // Get simulation data (questions, topic info, etc.)
  const { 
    isLoading, 
    topicQuestions, 
    topic, 
    questionSetTitle,
    isComprehensiveExam,
    setIdNumber,
    error,
  } = useSimulationData(topicId, setId, isQuestionSet, storyQuestions);

  useEffect(() => {
    console.log("Simulation component mounted or parameters changed", { topicId, setId, difficulty, type, storyId, isContinue });
    
    // Check if there's a reset parameter in the URL - only on first load
    if (!initialLoadAttempted.current) {
      const hasResetParam = checkForResetRequest();
      
      if (hasResetParam) {
        console.log("Reset parameter detected - simulation will reset");
        shouldShowResetToast.current = true;
        
        // Remove the reset parameter from URL to prevent reload issues
        removeResetParameterFromUrl();
      }
    }
      // Save simulation mode in sessionStorage to survive refreshes
    if (storyId) {
      window.sessionStorage.setItem('is_story_simulation', 'true');
      window.sessionStorage.setItem('current_story_id', storyId);
    } else if (setId) {
      window.sessionStorage.setItem('is_question_set', 'true');
    } else if (topicId) {
      window.sessionStorage.setItem('is_question_set', 'false');
    } else if (difficulty && type) {
      window.sessionStorage.setItem('is_question_set', 'false');
      window.sessionStorage.setItem('is_difficulty_based', 'true');
      window.sessionStorage.setItem('difficulty_level', difficulty);
      window.sessionStorage.setItem('difficulty_type', type);
      console.log(`[Simulation] Setting difficulty parameters: ${difficulty}, ${type}`);
    }
    
    // Clean up the continue flag after using it
    if (window.sessionStorage.getItem('continue_simulation') === 'true') {
      console.log('Detected continue_simulation flag, will attempt to continue simulation');
      window.sessionStorage.removeItem('continue_simulation');
    }
    
    // Check if we're doing a story simulation
    const storyFlag = window.sessionStorage.getItem('is_story_simulation');
    const questSetFlag = window.sessionStorage.getItem('is_question_set');
    setIsQuestionSet(questSetFlag === 'true');
    
    console.log(`Simulation opened with ${storyFlag === 'true' ? 'STORY' : questSetFlag === 'true' ? 'QUESTION SET' : difficulty && type ? 'DIFFICULTY-BASED' : 'TOPIC'} - topicId: ${topicId}, setId: ${setId}, difficulty: ${difficulty}, type: ${type}, storyId: ${storyId}, continue: ${isContinue}`);
      // Store the current simulation IDs in sessionStorage to persist across refreshes
    if (storyId) {
      sessionStorage.setItem('current_story_id', storyId);
    }
    
    if (setId) {
      sessionStorage.setItem('current_set_id', setId);
    }
    
    if (difficulty && type) {
      sessionStorage.setItem('current_difficulty_level', difficulty);
      sessionStorage.setItem('current_difficulty_type', type);
    }
      // Force attempt load on first render
    initialLoadAttempted.current = true;
      }, [topicId, setId, difficulty, type, storyId, isContinue]);
  
  // Check if this is a difficulty-based simulation
  const isDifficultyBased = Boolean(difficulty && type);
  
  // Store difficulty parameters in sessionStorage for useSimulation
  useEffect(() => {
    if (difficulty && type) {
      console.log(`Simulation - setting difficulty parameters: ${difficulty}, ${type}`);
      sessionStorage.setItem('current_difficulty_level', difficulty);
      sessionStorage.setItem('current_difficulty_type', type);
      sessionStorage.setItem('is_difficulty_based', 'true');
    } else {
      sessionStorage.removeItem('current_difficulty_level');
      sessionStorage.removeItem('current_difficulty_type');
      sessionStorage.removeItem('is_difficulty_based');
    }
  }, [difficulty, type]);

  // Use appropriate simulation ID
  const simulationId = isStoryBased
    ? `story_${storyId}`
    : isDifficultyBased 
      ? `difficulty_${difficulty}_${type}`
      : setId 
        ? `qs_${setId}` 
        : topicId;
    
  // Ensure the simulationId is properly formatted for storage
  const formattedSimulationId = simulationId ? simulationId : '';    // Only pass the correct arguments to the hook
  const simulation = useSimulation(formattedSimulationId, isQuestionSet, isStoryBased ? storyQuestions : undefined);
    // For story-based simulations, questions are already in simulation.questions; for difficulty-based simulations, use simulation questions; for others, use topicQuestions
  const questionsToUse = isDifficultyBased ? simulation.questions : (isStoryBased ? storyQuestions : topicQuestions);
  const effectiveIsLoading = isDifficultyBased ? !simulation.progressLoaded : (isStoryBased ? false : isLoading);
  
  useEffect(() => {
    if (contentRef.current) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      contentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [simulation.currentQuestionIndex]);
    // Setup auto-save for simulation progress
  useEffect(() => {
    // Only setup auto-save when simulation is loaded and we have questions
    if (simulation && !effectiveIsLoading && questionsToUse.length > 0) {
      console.log("Setting up auto-save for simulation");
      
      // Create auto-save with 30 second interval
      const cleanupAutoSave = setupAutoSave(() => {
        simulation.saveProgress();
      }, 30000); // 30 seconds
      
      return cleanupAutoSave;
    }
  }, [simulation, effectiveIsLoading, questionsToUse.length]);
    // Save progress whenever important state changes
  useEffect(() => {
    if (
      simulation && 
      simulation.progressLoaded && 
      !effectiveIsLoading && 
      questionsToUse.length > 0
    ) {
      // Add a short delay to ensure state has settled
      const saveTimeout = setTimeout(() => {
        simulation.saveProgress();
        console.log("Auto-saving simulation progress after state changes");
      }, 500);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [
    simulation.currentQuestionIndex, 
    simulation.userAnswers, 
    simulation.simulationComplete,
    simulation.progressLoaded,
    effectiveIsLoading,
    questionsToUse.length
  ]);  // Handle navigation to topics
  const handleBackToTopics = () => {
    if (isStoryBased) {
      return "/reading-comprehension";
    } else if (isDifficultyBased) {
      return `/simulation/difficulty/${difficulty}`;
    } else if (setId) {
      return "/questions-sets";
    } else {
      return "/simulations-entry";
    }
  };

  // Handle navigation to a specific question - this function accepts an index parameter
  const handleNavigateToQuestion = useCallback((index: number) => {
    if (simulation.simulationComplete) {
      simulation.setSimulationComplete(false);
    }
    
    simulation.navigateToQuestion(index);
  }, [simulation]);

  // Initial auto-save on page load - show toast only once
  useEffect(() => {
    if (
      simulation && 
      simulation.progressLoaded && 
      !effectiveIsLoading && 
      questionsToUse.length > 0
    ) {
      // Force save on initial load after a short delay
      const initialSaveTimeout = setTimeout(() => {
        console.log("Forcing initial save to ensure persistence");
        simulation.saveProgress();
        
        // If this is a reset, show toast to confirm
        if (shouldShowResetToast.current) {
          toast({
            title: "איפוס סימולציה",
            description: "הנתונים אופסו והסימולציה מתחילה מחדש",
            variant: "default",
          });
          shouldShowResetToast.current = false;
        }
        // Show auto-save toast if we haven't shown it already
        else if (!hasShownToast.current) {
          toast({
            title: "התקדמות הסימולציה נשמרת",
            description: "התקדמותך תישמר באופן אוטומטי גם בעת רענון הדף",
            variant: "default",
          });
          hasShownToast.current = true;
          
          // Store flag in session storage to remember we've shown the toast to this user
          sessionStorage.setItem('simulation_toast_shown', 'true');
        }
      }, 2000);
      
      return () => clearTimeout(initialSaveTimeout);
    }
  }, [simulation, simulation.progressLoaded, effectiveIsLoading, questionsToUse.length]);
  
  // Check on initial load if we need to restore the toast shown state
  useEffect(() => {
    // Check if we've already shown the toast in this session
    const toastShown = sessionStorage.getItem('simulation_toast_shown') === 'true';
    if (toastShown) {
      hasShownToast.current = true;
    }  }, []);
  
  // Show loading state while data is being fetched
  if (effectiveIsLoading) {
    return <SimulationLoading />;
  }
  
  // Show empty state if no questions are available
  if (questionsToUse.length === 0) {
    return (
      <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-grow flex items-center justify-start">
          <div className="max-w-md ml-0 p-8 bg-white rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertCircle className="h-8 w-8" />
              <h2 className="text-xl font-bold">לא נמצאו שאלות</h2>
            </div>
            <p className="text-gray-600 mb-6">
              {error || "לא נמצאו שאלות לסימולציה זו. ייתכן שקבוצת השאלות עדיין לא הושלמה או שאירעה שגיאה בטעינת השאלות."}
            </p>
            <Button 
              onClick={() => navigate(handleBackToTopics())} 
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              {isStoryBased ? "חזרה לסיפורי הבנת הנקרא" : isQuestionSet ? "חזרה לקבוצות השאלות" : "חזרה לרשימת הנושאים"}
            </Button>
          </div>
        </main>
      </RTLWrapper>
    );
  }
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow py-4 md:py-6" ref={contentRef}>
        
        {/* כפתור חזרה - ללא מרכוז */}
        <div className="w-full px-4">
          <BackButton isQuestionSet={isQuestionSet} />
        </div>
        
        {/* תוכן הסימולציה - עם מרכוז */}
        <div className="container mx-auto max-w-5xl px-4">
          <SimulationContent 
            simulationComplete={simulation.simulationComplete}
            currentQuestionIndex={simulation.currentQuestionIndex}
            totalQuestions={simulation.totalQuestions}
            remainingTime={simulation.remainingTime}
            isTimerActive={simulation.isTimerActive}
            currentQuestion={simulation.currentQuestion}
            selectedAnswerIndex={simulation.selectedAnswerIndex}
            isAnswerSubmitted={simulation.isAnswerSubmitted}
            showExplanation={simulation.showExplanation}
            score={simulation.score}
            questionsData={questionsToUse}
            userAnswers={simulation.userAnswers}
            questionFlags={simulation.questionFlags}
            answeredQuestionsCount={simulation.answeredQuestionsCount}
            correctQuestionsCount={simulation.correctQuestionsCount}
            progressPercentage={simulation.progressPercentage}
            currentScorePercentage={simulation.currentScorePercentage}
            examMode={simulation.examMode}
            showAnswersImmediately={simulation.showAnswersImmediately}
            isQuestionSet={isQuestionSet}
            setNumber={setIdNumber}
            onAnswerSelect={simulation.handleAnswerSelect}
            onSubmitAnswer={simulation.handleSubmitAnswer}
            onNextQuestion={simulation.handleNextQuestion}
            onPreviousQuestion={simulation.handlePreviousQuestion}
            onToggleExplanation={simulation.handleToggleExplanation}
            onToggleQuestionFlag={() => simulation.toggleQuestionFlag(simulation.currentQuestionIndex)}
            onNavigateToQuestion={handleNavigateToQuestion}
            onRestart={simulation.handleRestartSimulation}
            onBackToTopics={handleBackToTopics}
            onResetProgress={simulation.resetProgress}
          />
        </div>
      </main>
    </RTLWrapper>
  );
};

export default Simulation;
