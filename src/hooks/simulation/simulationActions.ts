
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
      
      const updatedUserAnswers = { ...prevState.userAnswers, [prevState.currentQuestionIndex]: prevState.selectedAnswerIndex };
      const newScore = isCorrect ? prevState.score + 1 : prevState.score;
      const newCorrectQuestionsCount = isCorrect ? prevState.correctQuestionsCount + 1 : prevState.correctQuestionsCount;
      const newAnsweredQuestionsCount = prevState.answeredQuestionsCount + 1;
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
        return {
          ...prevState,
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
          currentQuestion: prevState.questions[prevState.currentQuestionIndex + 1],
          isAnswerSubmitted: false,
          showExplanation: false,
          selectedAnswerIndex: null
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
        return {
          ...prevState,
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
          currentQuestion: prevState.questions[prevState.currentQuestionIndex - 1],
          isAnswerSubmitted: false,
          showExplanation: false,
          selectedAnswerIndex: null
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
    setState((prevState: any) => ({
      ...prevState,
      currentQuestionIndex: questionIndex,
      currentQuestion: prevState.questions[questionIndex],
      isAnswerSubmitted: false,
      showExplanation: false,
      selectedAnswerIndex: null
    }));
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
