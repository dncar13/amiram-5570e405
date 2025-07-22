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
import { useAuth } from "@/context/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";

const Simulation = () => {
  const navigate = useNavigate();
  const { currentUser, isPremium, isLoading: authLoading } = useAuth();
  const { trackSimulationStart, trackSimulationProgress, trackSimulationComplete, trackError } = useAnalytics();
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
  
  // Check if this is a full exam simulation
  const isFullExam = window.location.pathname.includes('/simulation/full');
  
  // Debug logs for theme issues
  // console.log('Simulation page rendered with storyId:', storyId);
  // console.log('Current URL pathname:', window.location.pathname);
  // console.log('Is Full Exam:', isFullExam);
  
  // Get query parameters
  const typeFromQuery = searchParams.get('type');
  const questionLimit = searchParams.get('limit');
  
  // Determine effective type and if this is a quick practice simulation
  const effectiveType = type || typeFromQuery;
  const isQuickPractice = Boolean(effectiveType && questionLimit && !difficulty);
  
  // console.log("Simulation params:", { type, difficulty, typeFromQuery, effectiveType, questionLimit, isQuickPractice, isFullExam });
  
  // Check if we're doing a question set simulation vs a topic simulation
  const [isQuestionSet, setIsQuestionSet] = useState<boolean>(false);

  // Check if this is a story-based simulation
  const isStoryBased = Boolean(storyId);
  // console.log('Is story-based simulation:', isStoryBased, 'Story ID:', storyId);
  
  // State for story-specific data
  const [storyQuestions, setStoryQuestions] = useState<Question[]>([]);
  const [story, setStory] = useState<any>(undefined);
  const [storyLoading, setStoryLoading] = useState(false);

  // Load story-specific questions if this is a story simulation
  useEffect(() => {
    if (!isStoryBased || !storyId) {
      setStoryQuestions([]);
      setStory(undefined);
      return;
    }

    const loadStoryData = async () => {
      setStoryLoading(true);
      try {
        console.log('Getting questions for story:', storyId);
        const [questionsData, storyData] = await Promise.all([
          getQuestionsByStory(storyId),
          getStoryById(storyId)
        ]);
        
        setStoryQuestions(questionsData);
        setStory(storyData);
      } catch (error) {
        console.error('Error loading story data:', error);
        setStoryQuestions([]);
        setStory(undefined);
        
        // Track story loading error
        trackError(error instanceof Error ? error : new Error('Story loading failed'), 'Simulation', {
          story_id: storyId,
          action: 'story_data_loading'
        });
      } finally {
        setStoryLoading(false);
      }
    };

    loadStoryData();
  }, [isStoryBased, storyId]);

  // Get simulation data (questions, topic info, etc.) - only for non-full-exam simulations
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
    // console.log("Simulation component mounted or parameters changed", { 
    //   topicId, 
    //   setId, 
    //   difficulty, 
    //   type, 
    //   storyId, 
    //   isContinue, 
    //   typeFromQuery, 
    //   effectiveType, 
    //   questionLimit,
    //   isFullExam 
    // });
    
    // Check if there's a reset parameter in the URL - only on first load
    if (!initialLoadAttempted.current) {
      const hasResetParam = checkForResetRequest();
      
      console.log('🔍 [Simulation] Checking for reset parameter:', hasResetParam);
      
      if (hasResetParam) {
        console.log('🔄 [Simulation] Reset parameter detected - will trigger reset when simulation is ready');
        shouldShowResetToast.current = true;
        
        // Remove the reset parameter from URL to prevent reload issues
        removeResetParameterFromUrl();
        console.log('🧹 [Simulation] Reset parameter removed from URL');
      }
    }
    
    // Save simulation mode in sessionStorage to survive refreshes
    if (isFullExam) {
      // console.log('Setting full exam simulation flags in sessionStorage');
      window.sessionStorage.setItem('is_full_exam', 'true');
      window.sessionStorage.setItem('current_simulation_type', 'full_exam');
    } else if (storyId) {
      // console.log('Setting story simulation flags in sessionStorage');
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
      // console.log(`[Simulation] Setting difficulty parameters: ${difficulty}, ${type}`);
    } else if (isQuickPractice) {
      // For quick practice, don't set difficulty-based flags
      window.sessionStorage.setItem('is_question_set', 'false');
      window.sessionStorage.removeItem('is_difficulty_based');
      // console.log(`[Simulation] Setting quick practice parameters: ${effectiveType}, limit: ${questionLimit}`);
    }
    
    // Clean up the continue flag after using it
    if (window.sessionStorage.getItem('continue_simulation') === 'true') {
      // console.log('Detected continue_simulation flag, will attempt to continue simulation');
      window.sessionStorage.removeItem('continue_simulation');
    }
    
    // Check if we're doing a story simulation
    const storyFlag = window.sessionStorage.getItem('is_story_simulation');
    const questSetFlag = window.sessionStorage.getItem('is_question_set');
    setIsQuestionSet(questSetFlag === 'true');
    
    // console.log(`Simulation opened with ${isFullExam ? 'FULL EXAM' : storyFlag === 'true' ? 'STORY' : questSetFlag === 'true' ? 'QUESTION SET' : isQuickPractice ? 'QUICK PRACTICE' : difficulty && type ? 'DIFFICULTY-BASED' : 'TOPIC'} - topicId: ${topicId}, setId: ${setId}, difficulty: ${difficulty}, type: ${type}, storyId: ${storyId}, continue: ${isContinue}`);
    
    // Store the current simulation IDs in sessionStorage to persist across refreshes
    if (isFullExam) {
      sessionStorage.setItem('current_simulation_id', 'full');
    } else if (storyId) {
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
  }, [topicId, setId, difficulty, type, storyId, isContinue, typeFromQuery, effectiveType, questionLimit, isQuickPractice, isFullExam]);
  
  // Check if this is a difficulty-based simulation
  const isDifficultyBased = Boolean(difficulty && type);
  
  // Store difficulty parameters in sessionStorage for useSimulation
  useEffect(() => {
    if (difficulty && type) {
      // console.log(`Simulation - setting difficulty parameters: ${difficulty}, ${type}`);
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
  const simulationId = isFullExam
    ? 'full'
    : isStoryBased
      ? `story_${storyId}`
      : isQuickPractice
        ? `quick_${effectiveType}_${questionLimit}`
      : isDifficultyBased 
        ? `difficulty_${difficulty}_${type}`
        : setId 
          ? `qs_${setId}` 
          : topicId;
    
  // Ensure the simulationId is properly formatted for storage
  const formattedSimulationId = simulationId ? simulationId : '';    
  
  // Only pass the correct arguments to the hook
  const simulation = useSimulation(formattedSimulationId, isQuestionSet, isStoryBased ? storyQuestions : undefined);
  
  // Track simulation start when first loaded
  useEffect(() => {
    if (simulation && simulation.progressLoaded && questionsToUse.length > 0 && simulation.currentQuestionIndex === 0 && !simulation.simulationComplete) {
      const simulationType = isFullExam ? 'full_exam' : 
                           isStoryBased ? 'story_based' :
                           isDifficultyBased ? `difficulty_${difficulty}_${type}` :
                           isQuickPractice ? `quick_${effectiveType}` :
                           isQuestionSet ? 'question_set' : 'topic_based';
      
      trackSimulationStart({
        simulation_type: simulationType,
        simulation_id: formattedSimulationId,
        difficulty_level: difficulty || 'mixed',
        question_count: questionsToUse.length,
        time_limit: simulation.examMode ? 90 * 60 : undefined // 90 minutes for exam mode
      });
    }
  }, [simulation?.progressLoaded, questionsToUse.length, formattedSimulationId]);
  
  // Track simulation progress at 25%, 50%, 75% completion
  useEffect(() => {
    if (simulation && simulation.progressLoaded && questionsToUse.length > 0) {
      const progressPercentage = (simulation.currentQuestionIndex / questionsToUse.length) * 100;
      const milestones = [25, 50, 75];
      
      milestones.forEach(milestone => {
        if (progressPercentage >= milestone && progressPercentage < milestone + (100 / questionsToUse.length)) {
          // Only track if we haven't tracked this milestone yet
          const milestoneKey = `milestone_${milestone}_${formattedSimulationId}`;
          if (!sessionStorage.getItem(milestoneKey)) {
            trackSimulationProgress({
              simulation_type: isFullExam ? 'full_exam' : isStoryBased ? 'story_based' : 'standard',
              simulation_id: formattedSimulationId,
              completion_rate: milestone,
              current_score: simulation.currentScorePercentage,
              time_spent: simulation.examMode ? ((90 * 60) - (simulation.remainingTime || 0)) : undefined
            });
            sessionStorage.setItem(milestoneKey, 'true');
          }
        }
      });
    }
  }, [simulation?.currentQuestionIndex, questionsToUse.length, formattedSimulationId, simulation?.currentScorePercentage]);
  
  // Track simulation completion
  useEffect(() => {
    if (simulation && simulation.simulationComplete && questionsToUse.length > 0) {
      const completionKey = `completed_${formattedSimulationId}`;
      if (!sessionStorage.getItem(completionKey)) {
        trackSimulationComplete({
          simulation_type: isFullExam ? 'full_exam' : isStoryBased ? 'story_based' : 'standard',
          simulation_id: formattedSimulationId,
          score: simulation.currentScorePercentage,
          time_spent: simulation.examMode ? ((90 * 60) - (simulation.remainingTime || 0)) : undefined,
          questions_answered: simulation.answeredQuestionsCount,
          questions_correct: simulation.correctQuestionsCount,
          completion_rate: 100
        });
        sessionStorage.setItem(completionKey, 'true');
        
        // Clear milestone tracking for this simulation
        [25, 50, 75].forEach(milestone => {
          sessionStorage.removeItem(`milestone_${milestone}_${formattedSimulationId}`);
        });
      }
    }
  }, [simulation?.simulationComplete, formattedSimulationId, simulation?.currentScorePercentage]);
    
  // For full exam, use simulation questions; for story-based simulations, questions are already in simulation.questions; for difficulty-based simulations, use simulation questions; for others, use topicQuestions
  const questionsToUse = (isFullExam || isDifficultyBased || isQuickPractice) ? simulation.questions : (isStoryBased ? storyQuestions : topicQuestions);
  const effectiveIsLoading = (isFullExam || isDifficultyBased || isQuickPractice) ? !simulation.progressLoaded : (isStoryBased ? storyLoading : isLoading);
  
  useEffect(() => {
    // גלילה אוטומטית לשאלה הנוכחית כל פעם שעוברים לשאלה חדשה
    const scrollToQuestion = () => {
      if (simulation.questionContainerRef?.current) {
        simulation.questionContainerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      } else if (contentRef.current) {
        contentRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    };
    
    // הוספת עיכוב קטן כדי לתת לקומפוננט להתעדכן
    const timeoutId = setTimeout(scrollToQuestion, 100);
    
    return () => clearTimeout(timeoutId);
  }, [simulation.currentQuestionIndex]); // eslint-disable-line react-hooks/exhaustive-deps
    // Setup auto-save for simulation progress
  useEffect(() => {
    // Only setup auto-save when simulation is loaded and we have questions
    if (simulation && !effectiveIsLoading && questionsToUse.length > 0) {
      // console.log("Setting up auto-save for simulation");
      
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
        // console.log("Auto-saving simulation progress after state changes");
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
    if (isFullExam) {
      return "/simulations-entry";
    } else if (isStoryBased) {
      return "/reading-comprehension";
    } else if (isDifficultyBased) {
      return `/simulation/difficulty/${difficulty}`;
    } else if (isQuickPractice) {
      return "/practice-options";
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

  // Handle finishing the simulation
  const handleFinishSimulation = useCallback(() => {
    // console.log("Finishing simulation manually");
    simulation.handleCompleteSimulation();
  }, [simulation]);

  // Initial auto-save on page load - show toast only once
  useEffect(() => {
    if (
      simulation && 
      simulation.progressLoaded && 
      !effectiveIsLoading && 
      questionsToUse.length > 0
    ) {
      // Handle reset parameter when simulation is ready
      if (shouldShowResetToast.current) {
        console.log('🔄 [Simulation] Reset parameter detected - triggering simulation reset');
        
        // Trigger the actual reset
        simulation.resetProgress();
        
        // Show reset confirmation toast
        toast({
          title: "איפוס סימולציה",
          description: "הנתונים אופסו והסימולציה מתחילה מחדש",
          variant: "default",
        });
        
        shouldShowResetToast.current = false;
        console.log('✅ [Simulation] Reset completed successfully');
      } else {
        // Force save on initial load after a short delay (only if not resetting)
        const initialSaveTimeout = setTimeout(() => {
          console.log('💾 [Simulation] Forcing initial save to ensure persistence');
          simulation.saveProgress();
          
          // Show auto-save toast if we haven't shown it already
          if (!hasShownToast.current) {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SimulationLoading />
      </div>
    );
  }
  
  // Show empty state if no questions are available
  if (questionsToUse.length === 0) {
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
              {error || "לא נמצאו שאלות לסימולציה זו. ייתכן שקבוצת השאלות עדיין לא הושלמה או שאירעה שגיאה בטעינת השאלות."}
            </p>
            <Button 
              onClick={() => navigate(handleBackToTopics())} 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
            >
              {isStoryBased ? "חזרה לסיפורי הבנת הנקרא" : isQuestionSet ? "חזרה לקבוצות השאלות" : isQuickPractice ? "חזרה לאפשרויות התרגול" : "חזרה לרשימת הנושאים"}
            </Button>
          </div>
        </main>
      </RTLWrapper>
    );
  }
  
  // console.log('Rendering main simulation page with dark theme');
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="flex-grow py-3 sm:py-6 px-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" ref={contentRef}>
          {/* כפתור חזרה */}
        <div className="w-full mb-3 sm:mb-6 px-2 sm:px-4 max-w-none sm:max-w-7xl sm:mx-auto">
          <BackButton isQuestionSet={isQuestionSet} />
        </div>
        
        {/* תוכן הסימולציה - רחב יותר במובייל */}
        <div className="w-full max-w-none sm:max-w-7xl sm:mx-auto">
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
            questionContainerRef={simulation.questionContainerRef}
            onAnswerSelect={simulation.handleAnswerSelect}
            onSubmitAnswer={simulation.handleSubmitAnswer}
            onNextQuestion={simulation.handleNextQuestion}
            onPreviousQuestion={simulation.handlePreviousQuestion}
            onToggleExplanation={simulation.handleToggleExplanation}
            onToggleQuestionFlag={simulation.toggleQuestionFlag}
            onNavigateToQuestion={handleNavigateToQuestion}
            onRestart={simulation.handleRestartSimulation}
            onBackToTopics={handleBackToTopics}
            onResetProgress={simulation.resetProgress}
            onFinishSimulation={handleFinishSimulation}
          />
        </div>
      </main>
    </RTLWrapper>
  );
};

export default Simulation;
