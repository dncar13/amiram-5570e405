
import { saveActivity } from "@/hooks/useActivityHistory";
import { saveSetProgress } from "./progressUtils";

export const createSimulationActions = (
  state: any,
  setState: React.Dispatch<React.SetStateAction<any>>,
  clearTimer: () => void,
  setNumber?: string | null,
  type?: string,
  difficulty?: string
) => {
  const handleAnswerSelect = (answerIndex: number) => {
    setState((prevState: any) => ({ ...prevState, selectedAnswerIndex: answerIndex }));
  };

  const handleSubmitAnswer = () => {
    setState((prevState: any) => {
      if (prevState.isAnswerSubmitted || prevState.currentQuestion === null || prevState.selectedAnswerIndex === null) {
        return prevState;
      }
      
      const isCorrect = prevState.selectedAnswerIndex === prevState.currentQuestion.correctAnswer;
      const questionId = prevState.currentQuestion.id;
      const currentQuestionIndex = prevState.currentQuestionIndex;
      
      // Save activity record
      saveActivity({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        topic: 'General',
        questionId: String(questionId),
        status: isCorrect ? 'correct' : 'wrong',
        isCorrect: isCorrect,
        isCompleted: false
      });
      
      const updatedUserAnswers = { ...prevState.userAnswers, [currentQuestionIndex]: prevState.selectedAnswerIndex };
      
      // Check if this question was already answered before
      const wasAlreadyAnswered = prevState.userAnswers[currentQuestionIndex] !== undefined && prevState.userAnswers[currentQuestionIndex] !== null;
      
      // Update score: add 1 if correct, subtract 1 if this question was previously correct but now wrong
      let newScore = prevState.score;
      let newCorrectQuestionsCount = prevState.correctQuestionsCount;
      
      if (wasAlreadyAnswered) {
        // This question was answered before - we need to update the score accordingly
        const previousAnswer = prevState.userAnswers[currentQuestionIndex];
        const wasPreviouslyCorrect = previousAnswer === prevState.currentQuestion.correctAnswer;
        
        if (wasPreviouslyCorrect && !isCorrect) {
          // Was correct, now wrong
          newScore = prevState.score - 1;
          newCorrectQuestionsCount = prevState.correctQuestionsCount - 1;
        } else if (!wasPreviouslyCorrect && isCorrect) {
          // Was wrong, now correct
          newScore = prevState.score + 1;
          newCorrectQuestionsCount = prevState.correctQuestionsCount + 1;
        }
        // If both were correct or both were wrong, no change needed
      } else {
        // This is a new answer
        if (isCorrect) {
          newScore = prevState.score + 1;
          newCorrectQuestionsCount = prevState.correctQuestionsCount + 1;
        }
      }
      
      // Calculate answered questions count based on unique questions that have answers
      const answeredQuestions = Object.keys(updatedUserAnswers).filter(key => 
        updatedUserAnswers[parseInt(key)] !== null && updatedUserAnswers[parseInt(key)] !== undefined
      );
      const newAnsweredQuestionsCount = answeredQuestions.length;
      
      const newProgressPercentage = Math.round((newAnsweredQuestionsCount / prevState.totalQuestions) * 100);
      const newCurrentScorePercentage = Math.round((newScore / prevState.totalQuestions) * 100);
      
      return {
        ...prevState,
        userAnswers: updatedUserAnswers,
        score: newScore,
        isAnswerSubmitted: true,
        showExplanation: true,
        correctQuestionsCount: newCorrectQuestionsCount,
        answeredQuestionsCount: newAnsweredQuestionsCount,
        progressPercentage: newProgressPercentage,
        currentScorePercentage: newCurrentScorePercentage
      };
    });
  };

  const handleNextQuestion = () => {
    setState((prevState: any) => {
      if (prevState.currentQuestionIndex < prevState.totalQuestions - 1) {
        const nextQuestionIndex = prevState.currentQuestionIndex + 1;
        const previousAnswer = prevState.userAnswers[nextQuestionIndex];
        const wasAnswered = previousAnswer !== undefined && previousAnswer !== null;
        
        return {
          ...prevState,
          currentQuestionIndex: nextQuestionIndex,
          currentQuestion: prevState.questions[nextQuestionIndex],
          isAnswerSubmitted: wasAnswered,
          showExplanation: wasAnswered,
          selectedAnswerIndex: wasAnswered ? previousAnswer : null
        };
      } else {
        // End of simulation - save set progress if this is a set-based simulation
        clearTimer();
        
        if (setNumber && type && difficulty) {
          saveSetProgress(type, difficulty, setNumber, prevState.score, prevState.totalQuestions);
        }
        
        // Save activity record for completion
        saveActivity({
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          topic: 'General',
          questionId: 'N/A',
          status: 'correct',
          score: prevState.score,
          correctAnswers: prevState.correctQuestionsCount,
          totalAnswered: prevState.totalQuestions,
          isCompleted: true
        });
        
        return { ...prevState, isTimerActive: false, simulationComplete: true };
      }
    });
  };

  const handlePreviousQuestion = () => {
    setState((prevState: any) => {
      if (prevState.currentQuestionIndex > 0) {
        const prevQuestionIndex = prevState.currentQuestionIndex - 1;
        const previousAnswer = prevState.userAnswers[prevQuestionIndex];
        const wasAnswered = previousAnswer !== undefined && previousAnswer !== null;
        
        return {
          ...prevState,
          currentQuestionIndex: prevQuestionIndex,
          currentQuestion: prevState.questions[prevQuestionIndex],
          isAnswerSubmitted: wasAnswered,
          showExplanation: wasAnswered,
          selectedAnswerIndex: wasAnswered ? previousAnswer : null
        };
      }
      return prevState;
    });
  };

  const handleToggleExplanation = () => {
    setState((prevState: any) => ({ ...prevState, showExplanation: !prevState.showExplanation }));
  };

  const toggleQuestionFlag = (questionIndex: number) => {
    setState((prevState: any) => {
      const questionId = prevState.questions[questionIndex].id;
      const newFlags = { ...prevState.questionFlags, [questionId]: !prevState.questionFlags[questionId] };
      return { ...prevState, questionFlags: newFlags };
    });
  };

  const navigateToQuestion = (questionIndex: number) => {
    setState((prevState: any) => {
      const previousAnswer = prevState.userAnswers[questionIndex];
      const wasAnswered = previousAnswer !== undefined && previousAnswer !== null;
      
      return {
        ...prevState,
        currentQuestionIndex: questionIndex,
        currentQuestion: prevState.questions[questionIndex],
        isAnswerSubmitted: wasAnswered,
        showExplanation: wasAnswered,
        selectedAnswerIndex: wasAnswered ? previousAnswer : null
      };
    });
  };

  const setSimulationComplete = (complete: boolean) => {
    setState((prevState: any) => ({ ...prevState, simulationComplete: complete }));
  };

  return {
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleToggleExplanation,
    toggleQuestionFlag,
    navigateToQuestion,
    setSimulationComplete
  };
};
