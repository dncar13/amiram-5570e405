/**
 * Test Setup and Configuration
 * 
 * Provides common test utilities, mocks, and configuration
 * for adaptive question delivery system tests.
 */

import { vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { Question } from '@/data/types/questionTypes';
import {
  DifficultyLevel,
  SessionType,
  UserProgress,
  DatabaseQuestionHistory,
  DatabaseProgressSummary,
  DatabaseSimulationSession
} from '../types';

// Mock Supabase client
export const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn()
  },
  rpc: vi.fn()
};

// Mock data factories
export const createMockQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: 1,
  type: 'restatement',
  text: 'Mock question text',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 0,
  explanation: 'Mock explanation',
  difficulty: 'medium',
  ...overrides
});

export const createMockQuestions = (count: number, difficulty: DifficultyLevel = 'medium'): Question[] => {
  return Array.from({ length: count }, (_, index) => createMockQuestion({
    id: index + 1,
    difficulty,
    text: `Mock question ${index + 1}`
  }));
};

export const createMockUserHistory = (
  userId: string,
  questionId: number,
  overrides: Partial<DatabaseQuestionHistory> = {}
): DatabaseQuestionHistory => ({
  id: `history-${userId}-${questionId}`,
  user_id: userId,
  question_id: questionId,
  answer_selected: 0,
  is_correct: true,
  time_spent_seconds: 60,
  simulation_session_id: 'mock-session-id',
  simulation_type: 'quick',
  difficulty: 'medium',
  flagged: false,
  notes: null,
  last_seen_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  ...overrides
});

export const createMockProgressSummary = (
  userId: string,
  difficulty: DifficultyLevel,
  overrides: Partial<DatabaseProgressSummary> = {}
): DatabaseProgressSummary => ({
  id: `progress-${userId}-${difficulty}`,
  user_id: userId,
  difficulty,
  total_questions_available: 300,
  questions_seen: 50,
  questions_correct: 40,
  questions_incorrect: 10,
  questions_flagged: 5,
  average_accuracy: 80.0,
  average_time_per_question: 65,
  total_practice_time: 3250,
  current_streak_days: 7,
  longest_streak_days: 14,
  last_practice_date: new Date().toISOString().split('T')[0],
  first_question_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  last_reset_date: null,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  ...overrides
});

export const createMockSession = (
  userId: string,
  overrides: Partial<DatabaseSimulationSession> = {}
): DatabaseSimulationSession => ({
  id: 'mock-session-id',
  user_id: userId,
  session_type: 'quick',
  difficulty: 'medium',
  topic_filter: null,
  question_limit: 10,
  questions_attempted: 5,
  questions_correct: 4,
  total_time_seconds: 300,
  score_percentage: 80,
  status: 'in_progress',
  started_at: new Date().toISOString(),
  completed_at: null,
  questions_ids: [1, 2, 3, 4, 5],
  user_agent: 'test-agent',
  created_at: new Date().toISOString(),
  ...overrides
});

// Test utilities
export const mockSupabaseResponse = (data: unknown, error: Error | null = null) => ({
  data,
  error,
  count: data?.length || null,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK'
});

export const mockSupabaseQuery = () => {
  const query = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    range: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis()
  };

  return query;
};

// Performance measurement utilities
export const measurePerformance = async <T>(
  operation: () => Promise<T>,
  label: string
): Promise<{ result: T; duration: number }> => {
  const start = process.hrtime.bigint();
  const result = await operation();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1_000_000; // Convert to milliseconds

  console.log(`${label}: ${duration.toFixed(2)}ms`);
  
  return { result, duration };
};

export const runPerformanceTest = async (
  operation: () => Promise<unknown>,
  iterations: number = 100,
  label: string = 'Operation'
): Promise<{
  min: number;
  max: number;
  average: number;
  median: number;
  p95: number;
  p99: number;
}> => {
  const durations: number[] = [];

  console.log(`Running performance test: ${label} (${iterations} iterations)`);

  for (let i = 0; i < iterations; i++) {
    const { duration } = await measurePerformance(operation, `${label} #${i + 1}`);
    durations.push(duration);
  }

  durations.sort((a, b) => a - b);

  const min = durations[0];
  const max = durations[durations.length - 1];
  const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const median = durations[Math.floor(durations.length / 2)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];

  return {
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    average: Math.round(average * 100) / 100,
    median: Math.round(median * 100) / 100,
    p95: Math.round(p95 * 100) / 100,
    p99: Math.round(p99 * 100) / 100
  };
};

// Memory usage measurement
export const measureMemoryUsage = (label: string): void => {
  const usage = process.memoryUsage();
  console.log(`${label} - Memory Usage:`, {
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(usage.external / 1024 / 1024)}MB`
  });
};

// Test data constants
export const TEST_USER_ID = 'test-user-123';
export const TEST_QUESTION_POOL_SIZE = 300;
export const TEST_SESSION_ID = 'test-session-123';

// Mock environment variables
export const setupTestEnvironment = () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
};

// Cleanup utilities
export const cleanupTestData = async () => {
  // In a real test environment, this would clean up test data
  console.log('Cleaning up test data...');
};

// Vitest setup
import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  setupTestEnvironment();
});

afterAll(async () => {
  await cleanupTestData();
});

// Global test configuration
export const testConfig = {
  PERFORMANCE_THRESHOLD_MS: 500,
  MEMORY_THRESHOLD_MB: 100,
  MAX_ITERATIONS: 1000,
  TIMEOUT_MS: 10000
};