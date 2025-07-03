/**
 * Setup Verification Test
 * 
 * Verifies that the test environment is configured correctly.
 */

import {
  mockSupabaseClient,
  createMockQuestion,
  createMockQuestions,
  createMockUserHistory,
  measurePerformance,
  testConfig,
  TEST_USER_ID
} from './setup';

describe('Test Setup Verification', () => {
  test('should have correct test configuration', () => {
    expect(testConfig.PERFORMANCE_THRESHOLD_MS).toBe(500);
    expect(testConfig.MEMORY_THRESHOLD_MB).toBe(100);
    expect(TEST_USER_ID).toBe('test-user-123');
  });

  test('should create mock questions correctly', () => {
    const question = createMockQuestion({
      id: 999,
      difficulty: 'hard',
      type: 'vocabulary'
    });

    expect(question).toMatchObject({
      id: 999,
      difficulty: 'hard',
      type: 'vocabulary',
      text: expect.any(String),
      options: expect.any(Array),
      correctAnswer: expect.any(Number),
      explanation: expect.any(String)
    });

    expect(question.options).toHaveLength(4);
  });

  test('should create multiple mock questions', () => {
    const questions = createMockQuestions(5, 'easy');
    
    expect(questions).toHaveLength(5);
    questions.forEach((q, index) => {
      expect(q.id).toBe(index + 1);
      expect(q.difficulty).toBe('easy');
    });
  });

  test('should create mock user history', () => {
    const history = createMockUserHistory(TEST_USER_ID, 123, {
      is_correct: false,
      time_spent_seconds: 90
    });

    expect(history).toMatchObject({
      user_id: TEST_USER_ID,
      question_id: 123,
      is_correct: false,
      time_spent_seconds: 90,
      difficulty: 'medium',
      flagged: false
    });
  });

  test('should measure performance correctly', async () => {
    const testOperation = async () => {
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'test-result';
    };

    const { result, duration } = await measurePerformance(testOperation, 'Test Operation');

    expect(result).toBe('test-result');
    expect(duration).toBeGreaterThan(0);
    expect(duration).toBeLessThan(100); // Should complete quickly
  });

  test('should have working mock Supabase client', () => {
    expect(mockSupabaseClient.from).toBeDefined();
    expect(mockSupabaseClient.auth).toBeDefined();
    expect(mockSupabaseClient.rpc).toBeDefined();
    
    expect(typeof mockSupabaseClient.from).toBe('function');
  });

  test('should handle environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co');
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBe('test-service-role-key');
  });

  test('should have memory usage monitoring available', () => {
    const memoryUsage = process.memoryUsage();
    
    expect(memoryUsage).toHaveProperty('rss');
    expect(memoryUsage).toHaveProperty('heapTotal');
    expect(memoryUsage).toHaveProperty('heapUsed');
    expect(memoryUsage).toHaveProperty('external');
    
    expect(typeof memoryUsage.rss).toBe('number');
    expect(memoryUsage.rss).toBeGreaterThan(0);
  });
});