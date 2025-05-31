
import { topicsData } from '../topics/topicsData';
import { Topic } from '../types/topicTypes';

// Helper function to get a specific topic by ID
export const getTopicById = (id: number): Topic | undefined => {
  return topicsData.find(topic => topic.id === id);
};

// Helper function to calculate topic completion stats
export const calculateTopicStats = (topicId: number): { 
  totalQuestions: number, 
  targetQuestions: number, 
  completionPercentage: number 
} => {
  const topic = getTopicById(topicId);
  
  if (!topic) {
    return { totalQuestions: 0, targetQuestions: 0, completionPercentage: 0 };
  }
  
  const totalQuestions = topic.totalQuestions || 0;
  const targetQuestions = topic.targetQuestions || 1000; // Default target
  const completionPercentage = Math.round((totalQuestions / targetQuestions) * 100);
  
  return { totalQuestions, targetQuestions, completionPercentage };
};

// Function to check if a topic is the comprehensive exam
export const isComprehensiveExamTopic = (topicId: number): boolean => {
  return topicId === 28;
};

// Function to get section number in comprehensive exam
export const getComprehensiveSectionNumber = (questionIndex: number): number => {
  return Math.floor(questionIndex / 50) + 1;
};

// Function to get questions range for a section in comprehensive exam
export const getComprehensiveSectionRange = (sectionNumber: number): { 
  start: number, 
  end: number 
} => {
  const start = (sectionNumber - 1) * 50 + 1;
  const end = sectionNumber * 50;
  return { start, end };
};

// Function to get completed questions percentage for comprehensive exam
export const getComprehensiveExamProgress = (): number => {
  const comprehensiveTopic = getTopicById(28);
  if (!comprehensiveTopic) return 0;
  
  return Math.round((comprehensiveTopic.totalQuestions / 1000) * 100);
};
