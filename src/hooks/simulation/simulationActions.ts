
import { SimulationState, SimulationActions } from './types';
import { 
  saveSimulationProgress, 
  saveSetProgress, 
  saveQuickPracticeProgress 
} from './progressUtils';
import { ProgressService } from '@/services/progressService';
import { supabase } from '@/integrations/supabase/client';

export const createSimulationActions = (
  state: SimulationState,
  setState: React.Dispatch<React.SetStateAction<SimulationState>>,
  clearTimer: () => void,
  scrollToQuestion?: () => void
): SimulationActions => {
  
  const handleAnswerSelect = (answerIndex: number) => {
    setState(prevState => ({
      ...prevState,
      selectedAnswerIndex: answerIndex,
      isAnswerSubmitted: false
    }));
  };

  const handleSubmitAnswer = async () => {
    setState(prevState => {
      if (prevState.selectedAnswerIndex === null || prevState.isAnswerSubmitted) {
        return prevState;
      }

      const currentQuestion = prevState.currentQuestion;
      if (!currentQuestion) return prevState;

      const isCorrect = prevState.selectedAnswerIndex === currentQuestion.correctAnswer;
      const wasAlreadyAnswered = prevState.currentQuestionIndex in prevState.userAnswers;

      const newState = {
        ...prevState,
        userAnswers: {
          ...prevState.userAnswers,
          [prevState.currentQuestionIndex]: prevState.selectedAnswerIndex
        },
        isAnswerSubmitted: true,
        showExplanation: prevState.showAnswersImmediately,
        answeredQuestionsCount: wasAlreadyAnswered 
          ? prevState.answeredQuestionsCount 
          : prevState.answeredQuestionsCount + 1,
        correctQuestionsCount: wasAlreadyAnswered
          ? (isCorrect ? prevState.correctQuestionsCount + (prevState.userAnswers[prevState.currentQuestionIndex] === currentQuestion.correctAnswer ? 0 : 1) 
                      : prevState.correctQuestionsCount - (prevState.userAnswers[prevState.currentQuestionIndex] === currentQuestion.correctAnswer ? 1 : 0))
          : (isCorrect ? prevState.correctQuestionsCount + 1 : prevState.correctQuestionsCount)
      };

      // Calculate progress
      newState.progressPercentage = (newState.answeredQuestionsCount / newState.totalQuestions) * 100;
      newState.currentScorePercentage = newState.answeredQuestionsCount > 0 
        ? (newState.correctQuestionsCount / newState.answeredQuestionsCount) * 100 
        : 0;

      // Save progress to database
      if (currentQuestion.id) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            console.log('🎯 [handleSubmitAnswer] Attempting to save progress for user:', user.id, 'question:', currentQuestion.id);
            
            const progressData = {
              user_id: user.id,
              question_id: String(currentQuestion.id),
              answered_correctly: isCorrect,
              answered_at: new Date().toISOString(),
              time_spent: Math.round((Date.now() - (prevState.questionStartTime || Date.now())) / 1000)
            };
            
            console.log('📊 [handleSubmitAnswer] Progress data:', progressData);
            
            ProgressService.saveUserProgress(progressData).then(result => {
              if (result.success) {
                console.log('✅ [handleSubmitAnswer] Progress saved to database successfully');
              } else {
                console.error('❌ [handleSubmitAnswer] Failed to save progress:', result.error);
              }
            }).catch(error => {
              console.error('❌ [handleSubmitAnswer] Error saving progress:', error);
            });
          } else {
            console.error('❌ [handleSubmitAnswer] No authenticated user found');
          }
        }).catch(error => {
          console.error('❌ [handleSubmitAnswer] Error getting user:', error);
        });
      } else {
        console.error('❌ [handleSubmitAnswer] No question ID found');
      }

      return newState;
    });
  };

  const handleNextQuestion = () => {
    setState(prevState => {
      if (prevState.currentQuestionIndex >= prevState.questions.length - 1) {
        return {
          ...prevState,
          simulationComplete: true,
          score: prevState.correctQuestionsCount
        };
      }

      const nextIndex = prevState.currentQuestionIndex + 1;
      const nextQuestion = prevState.questions[nextIndex];
      const hasAnswer = nextIndex in prevState.userAnswers;

      return {
        ...prevState,
        currentQuestionIndex: nextIndex,
        currentQuestion: nextQuestion,
        selectedAnswerIndex: hasAnswer ? prevState.userAnswers[nextIndex] : null,
        isAnswerSubmitted: hasAnswer,
        showExplanation: false,
        questionStartTime: Date.now() // Reset question start time for new question
      };
    });
  };

  const handlePreviousQuestion = () => {
    setState(prevState => {
      if (prevState.currentQuestionIndex <= 0) return prevState;

      const prevIndex = prevState.currentQuestionIndex - 1;
      const prevQuestion = prevState.questions[prevIndex];
      const hasAnswer = prevIndex in prevState.userAnswers;

      return {
        ...prevState,
        currentQuestionIndex: prevIndex,
        currentQuestion: prevQuestion,
        selectedAnswerIndex: hasAnswer ? prevState.userAnswers[prevIndex] : null,
        isAnswerSubmitted: hasAnswer,
        showExplanation: false,
        questionStartTime: Date.now() // Reset question start time for navigation
      };
    });
  };

  const handleToggleExplanation = () => {
    setState(prevState => ({
      ...prevState,
      showExplanation: !prevState.showExplanation
    }));
  };

  const toggleQuestionFlag = () => {
    setState(prevState => ({
      ...prevState,
      questionFlags: {
        ...prevState.questionFlags,
        [prevState.currentQuestionIndex]: !prevState.questionFlags[prevState.currentQuestionIndex]
      }
    }));
  };

  const handleCompleteSimulation = async () => {
    setState(prevState => {
      const newState = {
        ...prevState,
        simulationComplete: true,
        score: prevState.correctQuestionsCount
      };

      // Save simulation session to database (asynchronously)
      (async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const totalTimeSpent = Math.round((Date.now() - (prevState.sessionStartTime || Date.now())) / 1000);
            
            const sessionData = {
              user_id: user.id,
              session_type: 'simulation' as const,
              questions_answered: prevState.answeredQuestionsCount,
              correct_answers: prevState.correctQuestionsCount,
              total_questions: prevState.totalQuestions,
              time_spent: totalTimeSpent,
              completed_at: new Date().toISOString(),
              metadata: {
                exam_mode: prevState.examMode,
                show_answers_immediately: prevState.showAnswersImmediately,
                flagged_questions: Object.keys(prevState.questionFlags).filter(key => prevState.questionFlags[parseInt(key)]).length,
                completion_percentage: (prevState.answeredQuestionsCount / prevState.totalQuestions) * 100
              }
            };
            
            const result = await ProgressService.saveSimulationSession(sessionData);
            if (result.success) {
              console.log('✅ Simulation session saved to database');
            } else {
              console.error('❌ Failed to save simulation session:', result.error);
            }
          }
        } catch (error) {
          console.error('❌ Error saving simulation session:', error);
        }
      })();

      return newState;
    });
  };

  const handleStartTimer = () => {
    clearTimer();
  };

  const handleStopTimer = () => {
    clearTimer();
  };

  const handleResetTimer = (newDuration?: number) => {
    clearTimer();
  };

  return {
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleToggleExplanation,
    toggleQuestionFlag,
    handleCompleteSimulation,
    handleStartTimer,
    handleStopTimer,
    handleResetTimer
  };
};

