
/**
 * DEPRECATED FILE - Use the new API from '@/services/questions' instead
 * This file is kept for backwards compatibility but will be removed in the future
 */

import { 
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  addQuestion,
  deleteQuestion,
  saveChanges,
  resetChanges,
  refreshQuestionsFromStorage
} from './questions';

import {
  getSimulationProgress,
  saveSimulationProgress,
  resetSimulation,
  getProgressKey,
  // Import SimulationProgress as a type explicitly
  type SimulationProgress
} from './questions/progress';

// Import questionsData to re-export it
import { questionsData } from "@/data/questionsData";

// Import the new reload function from storage
import { reloadQuestionsFromSource } from './questions/storage';

// Re-export all service functions from the new API
export {
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  addQuestion,
  deleteQuestion,
  saveChanges,
  resetChanges,
  refreshQuestionsFromStorage,
  reloadQuestionsFromSource, // Export the new function
  getSimulationProgress,
  saveSimulationProgress,
  resetSimulation,
  getProgressKey,
  questionsData // Re-export questionsData for backward compatibility
};

// Re-export the SimulationProgress type properly
export type { SimulationProgress };
