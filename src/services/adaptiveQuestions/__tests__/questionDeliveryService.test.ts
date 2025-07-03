/**
 * Unit Tests for Question Delivery Service
 * 
 * Tests the core question selection algorithms, delivery strategies,
 * and performance requirements.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { QuestionDeliveryService } from '../questionDeliveryService';
import {
  mockSupabaseClient,
  mockSupabaseQuery,
  mockSupabaseResponse,
  createMockQuestion,
  createMockQuestions,
  createMockUserHistory,
  measurePerformance,
  runPerformanceTest,
  measureMemoryUsage,
  TEST_USER_ID,
  TEST_QUESTION_POOL_SIZE,
  testConfig
} from './setup';
import { QuestionDeliveryOptions, DeliveryStrategy } from '../types';
import { ALGORITHM_CONFIG } from '../constants';

// Mock the Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}));

describe('QuestionDeliveryService', () => {
  let service: QuestionDeliveryService;
  let mockQuery: any;

  beforeEach(() => {
    service = new QuestionDeliveryService();
    mockQuery = mockSupabaseQuery();
    mockSupabaseClient.from.mockReturnValue(mockQuery);
    mockSupabaseClient.rpc.mockReturnValue(mockQuery);
    vi.clearAllMocks();
  });

  describe('Question Pool Management', () => {
    test('should fetch questions for difficulty level', async () => {
      const mockQuestions = createMockQuestions(50, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'quick',
        questionLimit: 10
      };

      const result = await service.getPersonalizedQuestions(options);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('questions');
      expect(mockQuery.eq).toHaveBeenCalledWith('difficulty', 'medium');
      expect(result.questions.length).toBeLessThanOrEqual(10);
    });

    test('should apply topic filter when specified', async () => {
      const mockQuestions = createMockQuestions(30, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'custom',
        questionLimit: 10,
        topicFilter: ['restatement', 'vocabulary']
      };

      await service.getPersonalizedQuestions(options);

      expect(mockQuery.in).toHaveBeenCalledWith('type', ['restatement', 'vocabulary']);
    });

    test('should exclude specified question IDs', async () => {
      const mockQuestions = createMockQuestions(40, 'hard');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'hard',
        sessionType: 'practice',
        questionLimit: 15,
        excludeQuestionIds: [1, 2, 3]
      };

      await service.getPersonalizedQuestions(options);

      expect(mockQuery.not).toHaveBeenCalledWith('id', 'in', '(1,2,3)');
    });
  });

  describe('Delivery Strategies', () => {
    beforeEach(() => {
      // Mock question pool
      const mockQuestions = createMockQuestions(TEST_QUESTION_POOL_SIZE, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      
      // Mock user history  
      const mockHistory = Array.from({ length: 50 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1, {
          last_seen_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
        })
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

      // Mock unseen count
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(Array.from({ length: 200 }, (_, i) => ({ question_id: i + 51 }))));
    });

    test('should use unseen_priority strategy when many unseen questions available', async () => {
      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'quick',
        questionLimit: 10,
        deliveryStrategy: 'unseen_priority'
      };

      const result = await service.getPersonalizedQuestions(options);

      expect(result.strategy).toBe('unseen_priority');
      expect(result.questions.length).toBe(10);
      expect(result.metadata.unseenPoolSize).toBeGreaterThan(0);
    });

    test('should use fallback_reshuffle when all questions recently seen', async () => {
      // Mock scenario where all questions were seen recently
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse([])); // No unseen questions

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'quick',
        questionLimit: 10,
        deliveryStrategy: 'fallback_reshuffle'
      };

      const result = await service.getPersonalizedQuestions(options);

      expect(result.strategy).toBe('fallback_reshuffle');
      expect(result.questions.length).toBe(10);
    });

    test('should use mistake_review for review_mistakes session type', async () => {
      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'review_mistakes',
        questionLimit: 10
      };

      const result = await service.getPersonalizedQuestions(options);

      expect(result.strategy).toBe('mistake_review');
    });

    test('should use spaced_repetition for users with high coverage', async () => {
      // Mock high coverage scenario
      const mockHistory = Array.from({ length: 240 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'practice',
        questionLimit: 10
      };

      const result = await service.getPersonalizedQuestions(options);

      expect(['spaced_repetition', 'fallback_reshuffle']).toContain(result.strategy);
    });
  });

  describe('Algorithm Performance', () => {
    test('should select questions within performance threshold', async () => {
      const mockQuestions = createMockQuestions(TEST_QUESTION_POOL_SIZE, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      
      const mockHistory = Array.from({ length: 100 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(Array.from({ length: 150 }, (_, i) => ({ question_id: i + 101 }))));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'full',
        questionLimit: 30
      };

      const { duration } = await measurePerformance(
        () => service.getPersonalizedQuestions(options),
        'Question Selection'
      );

      expect(duration).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
    });

    test('should handle large question pools efficiently', async () => {
      const mockQuestions = createMockQuestions(1000, 'medium'); // Large pool
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      
      const mockHistory = Array.from({ length: 500 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(Array.from({ length: 300 }, (_, i) => ({ question_id: i + 501 }))));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'practice',
        questionLimit: 50
      };

      const stats = await runPerformanceTest(
        () => service.getPersonalizedQuestions(options),
        10,
        'Large Pool Question Selection'
      );

      expect(stats.p95).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
      expect(stats.average).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS * 0.8);
    });

    test('should maintain consistent performance under concurrent load', async () => {
      const mockQuestions = createMockQuestions(TEST_QUESTION_POOL_SIZE, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      
      const mockHistory = Array.from({ length: 100 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(Array.from({ length: 150 }, (_, i) => ({ question_id: i + 101 }))));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'quick',
        questionLimit: 10
      };

      // Simulate concurrent requests
      const concurrentPromises = Array.from({ length: 20 }, () => 
        measurePerformance(
          () => service.getPersonalizedQuestions(options),
          'Concurrent Request'
        )
      );

      const results = await Promise.all(concurrentPromises);
      const durations = results.map(r => r.duration);
      const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;

      expect(averageDuration).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
      expect(Math.max(...durations)).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS * 2);
    });
  });

  describe('Memory Usage', () => {
    test('should not leak memory during repeated operations', async () => {
      const mockQuestions = createMockQuestions(TEST_QUESTION_POOL_SIZE, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      
      const mockHistory = Array.from({ length: 100 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(Array.from({ length: 150 }, (_, i) => ({ question_id: i + 101 }))));

      measureMemoryUsage('Before repeated operations');

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'practice',
        questionLimit: 20
      };

      // Perform repeated operations
      for (let i = 0; i < 100; i++) {
        await service.getPersonalizedQuestions(options);
      }

      measureMemoryUsage('After repeated operations');

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        measureMemoryUsage('After garbage collection');
      }

      const finalMemory = process.memoryUsage();
      expect(finalMemory.heapUsed / 1024 / 1024).toBeLessThan(testConfig.MEMORY_THRESHOLD_MB);
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Database connection failed'));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'quick',
        questionLimit: 10
      };

      await expect(service.getPersonalizedQuestions(options)).rejects.toThrow();
    });

    test('should validate input parameters', async () => {
      const invalidOptions: QuestionDeliveryOptions = {
        userId: '',
        difficulty: 'invalid' as any,
        sessionType: 'quick',
        questionLimit: -5
      };

      await expect(service.getPersonalizedQuestions(invalidOptions)).rejects.toThrow();
    });

    test('should handle empty question pools', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([]));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'quick',
        questionLimit: 10
      };

      await expect(service.getPersonalizedQuestions(options)).rejects.toThrow('Not enough questions available');
    });
  });

  describe('Algorithm Correctness', () => {
    test('should respect 30-day recency threshold', async () => {
      const now = new Date();
      const thirtyOneDaysAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
      const twentyNineDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);

      const mockQuestions = createMockQuestions(100, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      // Mock history with questions seen at different times
      const mockHistory = [
        createMockUserHistory(TEST_USER_ID, 1, { last_seen_at: thirtyOneDaysAgo.toISOString() }),
        createMockUserHistory(TEST_USER_ID, 2, { last_seen_at: twentyNineDaysAgo.toISOString() })
      ];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

      // Mock unseen questions (should include question 1 but not question 2)
      mockSupabaseClient.rpc.mockResolvedValue(
        mockSupabaseResponse(Array.from({ length: 90 }, (_, i) => ({ question_id: i + 3 })).concat([{ question_id: 1 }]))
      );

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'unseen_only',
        questionLimit: 10,
        deliveryStrategy: 'unseen_priority'
      };

      const result = await service.getPersonalizedQuestions(options);

      // Should prioritize unseen questions including question 1 (>30 days old)
      expect(result.metadata.unseenPoolSize).toBe(91);
    });

    test('should properly weight questions in random_weighted strategy', async () => {
      const mockQuestions = createMockQuestions(50, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      const mockHistory = [
        createMockUserHistory(TEST_USER_ID, 1, { is_correct: false }), // Should get higher weight
        createMockUserHistory(TEST_USER_ID, 2, { is_correct: true })
      ];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(Array.from({ length: 40 }, (_, i) => ({ question_id: i + 3 }))));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'practice',
        questionLimit: 10,
        deliveryStrategy: 'random_weighted'
      };

      // Run multiple times to test randomness and weighting
      const results = await Promise.all(
        Array.from({ length: 10 }, () => service.getPersonalizedQuestions(options))
      );

      // Verify all results return valid questions
      results.forEach(result => {
        expect(result.questions.length).toBe(10);
        expect(result.strategy).toBe('random_weighted');
      });
    });

    test('should implement spaced repetition correctly', async () => {
      const mockQuestions = createMockQuestions(100, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      const now = new Date();
      const mockHistory = [
        // Question answered correctly 7 days ago (should be ready for review)
        createMockUserHistory(TEST_USER_ID, 1, {
          is_correct: true,
          last_seen_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }),
        // Question answered incorrectly 2 days ago (should appear sooner)
        createMockUserHistory(TEST_USER_ID, 2, {
          is_correct: false,
          last_seen_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        })
      ];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(Array.from({ length: 80 }, (_, i) => ({ question_id: i + 3 }))));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'practice',
        questionLimit: 10,
        deliveryStrategy: 'spaced_repetition'
      };

      const result = await service.getPersonalizedQuestions(options);

      expect(result.strategy).toBe('spaced_repetition');
      expect(result.questions.length).toBe(10);
    });
  });

  describe('Delivery Metadata', () => {
    test('should include comprehensive metadata in results', async () => {
      const mockQuestions = createMockQuestions(TEST_QUESTION_POOL_SIZE, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      
      const mockHistory = Array.from({ length: 50 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(Array.from({ length: 200 }, (_, i) => ({ question_id: i + 51 }))));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'full',
        questionLimit: 30
      };

      const result = await service.getPersonalizedQuestions(options);

      expect(result.metadata).toMatchObject({
        totalPoolSize: expect.any(Number),
        unseenPoolSize: expect.any(Number),
        algorithmVersion: expect.any(String),
        selectionTimeMs: expect.any(Number),
        weightFactors: expect.any(Object)
      });

      expect(result.metadata.totalPoolSize).toBe(TEST_QUESTION_POOL_SIZE);
      expect(result.metadata.unseenPoolSize).toBe(200);
      expect(result.metadata.selectionTimeMs).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
    });
  });
});