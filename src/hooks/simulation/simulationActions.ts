
import { SimulationState, SimulationActions } from './types';
import { 
  saveSimulationProgress, 
  saveSetProgress, 
  saveQuickPracticeProgress 
} from './progressUtils';
import { ProgressService } from '@/services/progressService';
import { SetProgressService, SetMetadata } from '@/services/setProgressService';
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
              question_id: typeof currentQuestion.id === 'string' ? currentQuestion.id : currentQuestion.id.toString(),
              answered_correctly: isCorrect,
              answered_at: new Date().toISOString(),
              time_spent: Math.round((Date.now() - (prevState.questionStartTime || Date.now())) / 1000)
            };
            
            console.log('📊 [handleSubmitAnswer] Progress data:', progressData);
            
            ProgressService.saveUserProgress(progressData).then(async (result) => {
              if (result.success) {
                console.log('✅ [handleSubmitAnswer] Progress saved to database successfully');
                
                // VERIFY it actually saved
                const { data } = await supabase
                  .from('user_progress')
                  .select('*')
                  .eq('question_id', typeof currentQuestion.id === 'string' ? currentQuestion.id : currentQuestion.id.toString())
                  .eq('user_id', user.id)
                  .single();
                
                console.log('🔍 Verification - Record in DB:', !!data);
                if (data) {
                  console.log('📊 Database record:', data);
                }
                
                // Notify activity history to refresh
                window.dispatchEvent(new Event('activity_history_updated'));
                
                // Check if this is a set-based simulation and save set progress
                const urlParams = new URLSearchParams(window.location.search);
                const setId = urlParams.get('set');
                const setStart = urlParams.get('start');
                
                console.log('🔍 Checking set parameters:', { setId, setStart, type: prevState.type, difficulty: prevState.difficulty });
                console.log('🔍 Current state:', { currentQuestionIndex: newState.currentQuestionIndex, answeredCount: newState.answeredQuestionsCount, correctCount: newState.correctQuestionsCount });
                console.log('🔍 URL and question state:', { url: window.location.href, questionId: currentQuestion.id, totalQuestions: prevState.questions.length });
                
                if (setId && setStart && prevState.type && prevState.difficulty) {
                  const setIdNum = parseInt(setId);
                  const startIndex = parseInt(setStart);
                  
                  // Calculate the actual question position within the set (0-9)
                  const questionInSet = newState.currentQuestionIndex - startIndex;
                  console.log('📍 Question position in set:', questionInSet);
                  
                  // Calculate set-specific progress (only questions within this set)
                  const setQuestionIndices = Array.from({ length: 10 }, (_, i) => startIndex + i);
                  const setAnsweredCount = setQuestionIndices.filter(index => index in newState.userAnswers).length;
                  const setCorrectCount = setQuestionIndices.filter(index => {
                    const answer = newState.userAnswers[index];
                    return answer !== undefined && answer === prevState.questions[index]?.correctAnswer;
                  }).length;
                  
                  const setMetadata: SetMetadata = {
                    set_id: setIdNum,
                    set_type: prevState.type,
                    set_difficulty: prevState.difficulty,
                    start_index: startIndex,
                    end_index: startIndex + 9,
                    questions_in_set: 10,
                    set_title: `סט ${setId}`,
                    last_question_index: questionInSet, // Position within the set, not global
                    paused_at: new Date().toISOString()
                  };
                  
                  const setProgressData = {
                    current_question_index: questionInSet, // Position within the set (0-9)
                    questions_answered: setAnsweredCount, // Only count questions within this set
                    correct_answers: setCorrectCount, // Only count correct answers within this set
                    time_spent: Math.round((Date.now() - (prevState.startTime || Date.now())) / 1000),
                    is_completed: setAnsweredCount >= 10 // Complete when all 10 questions are answered
                  };
                  
                  console.log('📊 Set progress calculation:', { 
                    setQuestionIndices, 
                    setAnsweredCount, 
                    setCorrectCount, 
                    userAnswers: newState.userAnswers,
                    currentQuestions: prevState.questions.slice(startIndex, startIndex + 10).map(q => ({ id: q.id, correctAnswer: q.correctAnswer }))
                  });
                  console.log('💾 Saving set progress:', setMetadata, setProgressData);
                  
                  SetProgressService.saveSetProgress(user.id, setMetadata, setProgressData).then(setResult => {
                    if (setResult.success) {
                      console.log('✅ [handleSubmitAnswer] Set progress saved successfully');
                    } else {
                      console.error('❌ [handleSubmitAnswer] Failed to save set progress:', setResult.error);
                    }
                  }).catch(setError => {
                    console.error('❌ [handleSubmitAnswer] Error saving set progress:', setError);
                  });
                }
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

      // Complete the live simulation session
      (async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const totalTimeSpent = Math.round((Date.now() - (prevState.sessionStartTime || Date.now())) / 1000);
            
            // Import the live session service
            const { completeSimulationSession } = await import('@/services/simulationSessionService');
            
            // Complete the active session if it exists
            const activeSessionResult = await import('@/services/simulationSessionService').then(module => 
              module.loadActiveSimulationSession(user.id)
            );
            
            if (activeSessionResult.success && activeSessionResult.data) {
              const result = await completeSimulationSession(activeSessionResult.data.id, {
                correct_answers: prevState.correctQuestionsCount,
                questions_answered: prevState.answeredQuestionsCount,
                time_spent: totalTimeSpent,
                progress_percentage: 100
              });
              
              if (result.success) {
                console.log('✅ Live simulation session completed');
              } else {
                console.error('❌ Failed to complete live session:', result.error);
              }
            } else {
              // Fallback: save as new completed session
              const { saveSimulationSession } = await import('@/services/simulationSessionService');
              
              const sessionData = {
                user_id: user.id,
                current_question_index: prevState.currentQuestionIndex,
                answers: Object.entries(prevState.userAnswers).map(([index, answer]) => ({
                  questionIndex: parseInt(index),
                  selectedAnswer: answer,
                  isCorrect: answer === prevState.questions[parseInt(index)]?.correctAnswer,
                  timeSpent: 60
                })),
                total_questions: prevState.totalQuestions,
                progress_percentage: 100,
                is_completed: true,
                session_type: prevState.examMode ? 'exam' : 'practice',
                correct_answers: prevState.correctQuestionsCount,
                questions_answered: prevState.answeredQuestionsCount,
                time_spent: totalTimeSpent,
                metadata: {
                  exam_mode: prevState.examMode,
                  show_answers_immediately: prevState.showAnswersImmediately,
                  flagged_questions: Object.keys(prevState.questionFlags).filter(key => prevState.questionFlags[parseInt(key)]).length,
                  completion_percentage: 100
                }
              };
              
              const result = await saveSimulationSession(sessionData);
              if (result.success) {
                console.log('✅ Simulation session saved as completed');
              } else {
                console.error('❌ Failed to save completed session:', result.error);
              }
            }
          }
        } catch (error) {
          console.error('❌ Error completing simulation session:', error);
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

