
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
                
                // ✅ Enhanced Set-Based Progress Tracking
                const urlParams = new URLSearchParams(window.location.search);
                const setId = urlParams.get('set');
                const setStart = urlParams.get('start');
                
                console.log('🔍 [Set Progress] Checking parameters:', { 
                  setId, 
                  setStart, 
                  type: prevState.type, 
                  difficulty: prevState.difficulty,
                  currentIndex: newState.currentQuestionIndex,
                  answeredCount: newState.answeredQuestionsCount
                });
                
                if (setId && setStart && prevState.type && prevState.difficulty) {
                  try {
                    const setIdNum = parseInt(setId);
                    const startIndex = parseInt(setStart);
                    
                    // ✅ Validate set boundaries
                    if (isNaN(setIdNum) || isNaN(startIndex) || startIndex < 0) {
                      console.error('❌ [Set Progress] Invalid set parameters:', { setId, setStart });
                      return;
                    }
                    
                    // ✅ Calculate question position within set (0-9)
                    const questionInSet = newState.currentQuestionIndex - startIndex;
                    
                    // ✅ Validate question is within set bounds
                    if (questionInSet < 0 || questionInSet >= 10) {
                      console.log('ℹ️ [Set Progress] Question outside set bounds, skipping:', questionInSet);
                      return;
                    }
                    
                    // ✅ Calculate set-specific progress accurately
                    const setQuestionIndices = Array.from({ length: 10 }, (_, i) => startIndex + i);
                    const setAnsweredCount = setQuestionIndices.filter(index => 
                      index < prevState.questions.length && index in newState.userAnswers
                    ).length;
                    
                    const setCorrectCount = setQuestionIndices.filter(index => {
                      if (index >= prevState.questions.length || !(index in newState.userAnswers)) {
                        return false;
                      }
                      const answer = newState.userAnswers[index];
                      const question = prevState.questions[index];
                      return answer !== undefined && question && answer === question.correctAnswer;
                    }).length;
                    
                    // ✅ Enhanced metadata with validation
                    const setMetadata: SetMetadata = {
                      set_id: setIdNum,
                      set_type: prevState.type,
                      set_difficulty: prevState.difficulty,
                      start_index: startIndex,
                      end_index: startIndex + 9,
                      questions_in_set: 10,
                      set_title: `${prevState.type} - ${prevState.difficulty} - סט ${setId}`,
                      last_question_index: questionInSet,
                      paused_at: new Date().toISOString()
                    };
                    
                    // ✅ Progress data with proper completion check
                    const setProgressData = {
                      current_question_index: questionInSet,
                      questions_answered: setAnsweredCount,
                      correct_answers: setCorrectCount,
                      time_spent: Math.round((Date.now() - (prevState.startTime || Date.now())) / 1000),
                      is_completed: setAnsweredCount >= 10
                    };
                    
                    console.log('📊 [Set Progress] Calculated data:', {
                      setMetadata,
                      setProgressData,
                      validation: {
                        questionInSet,
                        setQuestionIndices,
                        userAnswersInSet: setQuestionIndices.map(i => newState.userAnswers[i]),
                        questionsInSet: setQuestionIndices.map(i => ({
                          index: i,
                          exists: i < prevState.questions.length,
                          correctAnswer: prevState.questions[i]?.correctAnswer
                        }))
                      }
                    });
                    
                    // ✅ Save with enhanced error handling
                    SetProgressService.saveSetProgress(user.id, setMetadata, setProgressData)
                      .then(setResult => {
                        if (setResult.success) {
                          console.log('✅ [Set Progress] Successfully saved');
                          // ✅ Trigger UI update for set completion
                          if (setProgressData.is_completed) {
                            console.log('🎉 [Set Progress] Set completed!');
                            window.dispatchEvent(new CustomEvent('set_completed', {
                              detail: { setId: setIdNum, score: setCorrectCount }
                            }));
                          }
                        } else {
                          console.error('❌ [Set Progress] Save failed:', setResult.error);
                        }
                      })
                      .catch(setError => {
                        console.error('❌ [Set Progress] Exception during save:', setError);
                      });
                      
                  } catch (error) {
                    console.error('❌ [Set Progress] Unexpected error:', error);
                  }
                } else {
                  console.log('ℹ️ [Set Progress] Not a set-based simulation, skipping set progress tracking');
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

      // ✅ Enhanced simulation completion handling
      (async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.error('❌ [Complete Simulation] No authenticated user');
            return;
          }

          const totalTimeSpent = Math.round((Date.now() - (prevState.sessionStartTime || Date.now())) / 1000);
          
          // ✅ Handle set-based completion
          const urlParams = new URLSearchParams(window.location.search);
          const setId = urlParams.get('set');
          const setStart = urlParams.get('start');
          
          if (setId && setStart && prevState.type && prevState.difficulty) {
            console.log('🎯 [Complete Simulation] Completing set-based simulation');
            
            try {
              const setIdNum = parseInt(setId);
              const startIndex = parseInt(setStart);
              
              // Final set progress calculation
              const setQuestionIndices = Array.from({ length: 10 }, (_, i) => startIndex + i);
              const setAnsweredCount = setQuestionIndices.filter(index => 
                index < prevState.questions.length && index in prevState.userAnswers
              ).length;
              
              const setCorrectCount = setQuestionIndices.filter(index => {
                if (index >= prevState.questions.length || !(index in prevState.userAnswers)) {
                  return false;
                }
                const answer = prevState.userAnswers[index];
                const question = prevState.questions[index];
                return answer !== undefined && question && answer === question.correctAnswer;
              }).length;
              
              const setMetadata = {
                set_id: setIdNum,
                set_type: prevState.type,
                set_difficulty: prevState.difficulty,
                start_index: startIndex,
                end_index: startIndex + 9,
                questions_in_set: 10,
                set_title: `${prevState.type} - ${prevState.difficulty} - סט ${setId}`,
                last_question_index: 9, // Set is complete
                paused_at: new Date().toISOString()
              };
              
              const finalSetProgressData = {
                current_question_index: 9, // Completed
                questions_answered: setAnsweredCount,
                correct_answers: setCorrectCount,
                time_spent: totalTimeSpent,
                is_completed: true
              };
              
              console.log('🏁 [Complete Simulation] Final set progress:', { setMetadata, finalSetProgressData });
              
              const { SetProgressService } = await import('@/services/setProgressService');
              const setResult = await SetProgressService.saveSetProgress(user.id, setMetadata, finalSetProgressData);
              
              if (setResult.success) {
                console.log('✅ [Complete Simulation] Set progress finalized');
                window.dispatchEvent(new CustomEvent('set_completed', {
                  detail: { setId: setIdNum, score: setCorrectCount, totalQuestions: 10 }
                }));
              } else {
                console.error('❌ [Complete Simulation] Failed to finalize set progress:', setResult.error);
              }
              
            } catch (setError) {
              console.error('❌ [Complete Simulation] Error handling set completion:', setError);
            }
          }
          
          // ✅ Handle general simulation session completion
          const { completeSimulationSession, loadActiveSimulationSession, saveSimulationSession } = await import('@/services/simulationSessionService');
          
          const activeSessionResult = await loadActiveSimulationSession(user.id);
          
          if (activeSessionResult.success && activeSessionResult.data) {
            // Complete existing session
            const result = await completeSimulationSession(activeSessionResult.data.id, {
              correct_answers: prevState.correctQuestionsCount,
              questions_answered: prevState.answeredQuestionsCount,
              time_spent: totalTimeSpent,
              progress_percentage: 100
            });
            
            if (result.success) {
              console.log('✅ [Complete Simulation] Live session completed');
            } else {
              console.error('❌ [Complete Simulation] Failed to complete live session:', result.error);
            }
          } else {
            // Create new completed session
            const sessionData = {
              user_id: user.id,
              current_question_index: prevState.currentQuestionIndex,
              answers: Object.entries(prevState.userAnswers).map(([index, answer]) => ({
                questionIndex: parseInt(index),
                selectedAnswer: answer,
                isCorrect: answer === prevState.questions[parseInt(index)]?.correctAnswer,
                timeSpent: Math.max(totalTimeSpent / prevState.answeredQuestionsCount, 1)
              })),
              total_questions: prevState.totalQuestions,
              progress_percentage: 100,
              is_completed: true,
              session_type: setId ? 'set' : (prevState.examMode ? 'exam' : 'practice'),
              correct_answers: prevState.correctQuestionsCount,
              questions_answered: prevState.answeredQuestionsCount,
              time_spent: totalTimeSpent,
              metadata: {
                exam_mode: prevState.examMode,
                show_answers_immediately: prevState.showAnswersImmediately,
                flagged_questions: Object.keys(prevState.questionFlags).filter(key => prevState.questionFlags[parseInt(key)]).length,
                completion_percentage: 100,
                ...(setId && {
                  is_set_based: true,
                  set_id: setId,
                  set_type: prevState.type,
                  set_difficulty: prevState.difficulty,
                  set_number: setId,
                  questions_in_set: 10
                })
              }
            };
            
            const result = await saveSimulationSession(sessionData);
            if (result.success) {
              console.log('✅ [Complete Simulation] New session saved as completed');
            } else {
              console.error('❌ [Complete Simulation] Failed to save completed session:', result.error);
            }
          }
          
        } catch (error) {
          console.error('❌ [Complete Simulation] Unexpected error:', error);
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

