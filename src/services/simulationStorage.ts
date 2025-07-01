import { Question } from "@/data/types/questionTypes";

export interface SimulationProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  timeSpent?: number;
  startedAt?: string;
  lastAnsweredAt?: string;
}

export interface SavedSimulation {
  id: string;
  title: string;
  questions: Question[];
  progress: SimulationProgress;
  createdAt: string;
  updatedAt: string;
  type: 'practice' | 'exam' | 'review';
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  isCompleted: boolean;
}

export interface SimulationStats {
  totalSimulations: number;
  completedSimulations: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageScore: number;
  totalTimeSpent: number;
  lastSimulationDate: string;
}

export const hasProgressUnified = async (
  topicId: number, 
  isQuestionSet: boolean
): Promise<{ success: boolean; data?: Record<string, unknown> }> => {
  try {
    const key = isQuestionSet ? `questionset_${topicId}_progress` : `topic_${topicId}_progress`;
    const progressData = localStorage.getItem(key);
    
    if (progressData) {
      const parsed = JSON.parse(progressData);
      return { success: true, data: parsed };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error checking progress:', error);
    return { success: false };
  }
};

export const saveSimulation = (simulation: SavedSimulation): boolean => {
  try {
    const savedSimulations = getSavedSimulations();
    const existingIndex = savedSimulations.findIndex(s => s.id === simulation.id);
    
    if (existingIndex >= 0) {
      savedSimulations[existingIndex] = {
        ...simulation,
        updatedAt: new Date().toISOString()
      };
    } else {
      savedSimulations.push(simulation);
    }
    
    localStorage.setItem('saved_simulations', JSON.stringify(savedSimulations));
    return true;
  } catch (error) {
    console.error('Error saving simulation:', error);
    return false;
  }
};

export const getSavedSimulations = (): SavedSimulation[] => {
  try {
    const saved = localStorage.getItem('saved_simulations');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved simulations:', error);
    return [];
  }
};

export const getSimulationById = (id: string): SavedSimulation | null => {
  try {
    const savedSimulations = getSavedSimulations();
    return savedSimulations.find(s => s.id === id) || null;
  } catch (error) {
    console.error('Error getting simulation by ID:', error);
    return null;
  }
};

export const deleteSimulation = (id: string): boolean => {
  try {
    const savedSimulations = getSavedSimulations();
    const filteredSimulations = savedSimulations.filter(s => s.id !== id);
    
    localStorage.setItem('saved_simulations', JSON.stringify(filteredSimulations));
    return true;
  } catch (error) {
    console.error('Error deleting simulation:', error);
    return false;
  }
};

export const getSimulationStats = (): SimulationStats => {
  try {
    const savedSimulations = getSavedSimulations();
    
    const stats: SimulationStats = {
      totalSimulations: savedSimulations.length,
      completedSimulations: savedSimulations.filter(s => s.isCompleted).length,
      totalQuestionsAnswered: savedSimulations.reduce((sum, s) => sum + s.answeredQuestions, 0),
      totalCorrectAnswers: savedSimulations.reduce((sum, s) => sum + s.correctAnswers, 0),
      averageScore: 0,
      totalTimeSpent: 0,
      lastSimulationDate: savedSimulations.length > 0 
        ? Math.max(...savedSimulations.map(s => new Date(s.updatedAt).getTime())).toString()
        : ''
    };
    
    if (stats.totalQuestionsAnswered > 0) {
      stats.averageScore = (stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100;
    }
    
    return stats;
  } catch (error) {
    console.error('Error calculating simulation stats:', error);
    return {
      totalSimulations: 0,
      completedSimulations: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      lastSimulationDate: ''
    };
  }
};

export const updateSimulationProgress = (
  id: string, 
  progress: Partial<SimulationProgress>
): boolean => {
  try {
    const simulation = getSimulationById(id);
    if (!simulation) return false;
    
    const updatedSimulation: SavedSimulation = {
      ...simulation,
      progress: { ...simulation.progress, ...progress },
      updatedAt: new Date().toISOString()
    };
    
    return saveSimulation(updatedSimulation);
  } catch (error) {
    console.error('Error updating simulation progress:', error);
    return false;
  }
};

export const clearAllSimulations = (): boolean => {
  try {
    localStorage.removeItem('saved_simulations');
    return true;
  } catch (error) {
    console.error('Error clearing all simulations:', error);
    return false;
  }
};

export const exportSimulations = (): string => {
  try {
    const savedSimulations = getSavedSimulations();
    return JSON.stringify(savedSimulations, null, 2);
  } catch (error) {
    console.error('Error exporting simulations:', error);
    return '';
  }
};

export const importSimulations = (jsonData: string): boolean => {
  try {
    const importedSimulations: SavedSimulation[] = JSON.parse(jsonData);
    
    // Validate the imported data structure
    if (!Array.isArray(importedSimulations)) {
      throw new Error('Invalid data format');
    }
    
    // Merge with existing simulations
    const existingSimulations = getSavedSimulations();
    const mergedSimulations = [...existingSimulations];
    
    importedSimulations.forEach(imported => {
      const existingIndex = mergedSimulations.findIndex(s => s.id === imported.id);
      if (existingIndex >= 0) {
        mergedSimulations[existingIndex] = imported;
      } else {
        mergedSimulations.push(imported);
      }
    });
    
    localStorage.setItem('saved_simulations', JSON.stringify(mergedSimulations));
    return true;
  } catch (error) {
    console.error('Error importing simulations:', error);
    return false;
  }
};
