
// Re-export all service functions from this unified API
import { 
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  addQuestion,
  deleteQuestion,
  saveChanges,
  resetChanges
} from './crud';

import {
  getQuestions,
  saveQuestions,
  refreshQuestionsFromStorage,
  reloadQuestionsFromSource,
  initializeQuestions
} from './storage';

import {
  getSimulationProgress,
  saveSimulationProgress,
  resetSimulation,
  onProgressChange,
  getProgressKey,
  type SimulationProgress
} from './progress';

// Export unified API
export {
  // CRUD Operations
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  addQuestion,
  deleteQuestion,
  saveChanges,
  resetChanges,
  
  // Storage Operations
  getQuestions,
  saveQuestions,
  refreshQuestionsFromStorage,
  reloadQuestionsFromSource,
  initializeQuestions,
  
  // Progress Operations
  getSimulationProgress,
  saveSimulationProgress,
  resetSimulation,
  onProgressChange,
  getProgressKey,
  
  // Types
  type SimulationProgress
};
