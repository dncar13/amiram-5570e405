import { SimulationStateData, ProgressData } from "@/types/common";

export type { ProgressData }; // Export ProgressData for external use

export const saveSimulationProgress = (simulationId: string, state: SimulationStateData, setNumber?: string | null, type?: string, difficulty?: string) => {
  try {
    const progress: SimulationStateData = {
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
    
    localStorage.setItem(`simulation_progress_${simulationId}`, JSON.stringify(progress));
    
    // Also save set progress if this is a set-based simulation
    if (setNumber && type && difficulty && state.answeredQuestionsCount > 0) {
      const setProgressKey = `set_progress_${type}_${difficulty}_${setNumber}`;
      const setProgress: ProgressData = {
        completed: false,
        inProgress: true,
        score: undefined,
        answeredQuestions: state.answeredQuestionsCount
      };
      localStorage.setItem(setProgressKey, JSON.stringify(setProgress));
    }
    
    // Save quick practice progress
    if (simulationId.startsWith('quick_') && state.answeredQuestionsCount > 0) {
      const quickProgressKey = `quick_practice_progress_${type}`;
      const quickProgress: ProgressData = {
        completed: false,
        inProgress: true,
        score: undefined,
        answeredQuestions: state.answeredQuestionsCount,
        totalQuestions: state.answeredQuestionsCount // This should be passed from caller if available
      };
      localStorage.setItem(quickProgressKey, JSON.stringify(quickProgress));
    }
    
    console.log(`Simulation progress saved for ${simulationId}`);
  } catch (error) {
    console.error("Error saving simulation progress:", error);
  }
};

export const loadSimulationProgress = (simulationId: string): SimulationStateData | null => {
  try {
    const savedProgress = localStorage.getItem(`simulation_progress_${simulationId}`);
    return savedProgress ? JSON.parse(savedProgress) as SimulationStateData : null;
  } catch (error) {
    console.error("Error loading simulation progress:", error);
    return null;
  }
};

export const saveSetProgress = (type: string, difficulty: string, setNumber: string, score: number, totalQuestions: number) => {
  const setProgressKey = `set_progress_${type}_${difficulty}_${setNumber}`;
  const setProgress: ProgressData = {
    completed: true,
    inProgress: false,
    score: Math.round((score / totalQuestions) * 100),
    answeredQuestions: totalQuestions
  };
  localStorage.setItem(setProgressKey, JSON.stringify(setProgress));
};

export const saveQuickPracticeProgress = (type: string, score: number, totalQuestions: number) => {
  const quickProgressKey = `quick_practice_progress_${type}`;
  const quickProgress: ProgressData = {
    completed: true,
    inProgress: false,
    score: Math.round((score / totalQuestions) * 100),
    answeredQuestions: totalQuestions
  };
  localStorage.setItem(quickProgressKey, JSON.stringify(quickProgress));
};

export const getQuickPracticeProgress = (type: string): ProgressData | null => {
  try {
    const quickProgressKey = `quick_practice_progress_${type}`;
    const savedProgress = localStorage.getItem(quickProgressKey);
    return savedProgress ? JSON.parse(savedProgress) as ProgressData : null;
  } catch (error) {
    console.error("Error loading quick practice progress:", error);
    return null;
  }
};

export const clearQuickPracticeProgress = (type: string) => {
  try {
    const quickProgressKey = `quick_practice_progress_${type}`;
    localStorage.removeItem(quickProgressKey);
    console.log(`Quick practice progress cleared for ${type}`);
  } catch (error) {
    console.error("Error clearing quick practice progress:", error);
  }
};
