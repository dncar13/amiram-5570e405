
export const saveSimulationProgress = (simulationId: string, state: any, setNumber?: string | null, type?: string, difficulty?: string) => {
  try {
    const progress = {
      currentQuestionIndex: state.currentQuestionIndex,
      userAnswers: state.userAnswers,
      questionFlags: state.questionFlags,
      remainingTime: state.remainingTime,
      isTimerActive: state.isTimerActive,
      examMode: state.examMode,
      showAnswersImmediately: state.showAnswersImmediately,
      answeredQuestionsCount: state.answeredQuestionsCount,
      correctQuestionsCount: state.correctQuestionsCount,
      progressPercentage: state.progressPercentage,
      currentScorePercentage: state.currentScorePercentage
    };
    
    sessionStorage.setItem(`simulation_progress_${simulationId}`, JSON.stringify(progress));
    
    // Also save set progress if this is a set-based simulation
    if (setNumber && type && difficulty && state.answeredQuestionsCount > 0) {
      const setProgressKey = `set_progress_${type}_${difficulty}_${setNumber}`;
      const setProgress = {
        completed: false,
        inProgress: true,
        score: undefined,
        answeredQuestions: state.answeredQuestionsCount
      };
      sessionStorage.setItem(setProgressKey, JSON.stringify(setProgress));
    }
    
    console.log(`Simulation progress saved for ${simulationId}`);
  } catch (error) {
    console.error("Error saving simulation progress:", error);
  }
};

export const loadSimulationProgress = (simulationId: string) => {
  try {
    const savedProgress = sessionStorage.getItem(`simulation_progress_${simulationId}`);
    return savedProgress ? JSON.parse(savedProgress) : null;
  } catch (error) {
    console.error("Error loading simulation progress:", error);
    return null;
  }
};

export const saveSetProgress = (type: string, difficulty: string, setNumber: string, score: number, totalQuestions: number) => {
  const setProgressKey = `set_progress_${type}_${difficulty}_${setNumber}`;
  const setProgress = {
    completed: true,
    inProgress: false,
    score: Math.round((score / totalQuestions) * 100),
    answeredQuestions: totalQuestions
  };
  sessionStorage.setItem(setProgressKey, JSON.stringify(setProgress));
};
