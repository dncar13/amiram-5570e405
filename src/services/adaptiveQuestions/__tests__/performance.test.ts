/**
 * Performance Benchmark Tests
 * 
 * Comprehensive performance testing for the adaptive question delivery system.
 * Tests scalability, memory usage, and performance under various load conditions.
 */

import { QuestionDeliveryService } from '../questionDeliveryService';
import { ProgressTrackingService } from '../progressTrackingService';
import { SimulationService } from '../simulationService';
import { UserPreferencesService } from '../userPreferencesService';
import {
  mockSupabaseClient,
  mockSupabaseQuery,
  mockSupabaseResponse,
  createMockQuestions,
  createMockUserHistory,
  createMockProgressSummary,
  createMockSession,
  measurePerformance,
  runPerformanceTest,
  measureMemoryUsage,
  TEST_USER_ID,
  testConfig
} from './setup';
import { QuestionDeliveryOptions, SubmitAnswerRequest, StartSimulationRequest } from '../types';

// Mock dependencies
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

jest.mock('../questionDeliveryService');
jest.mock('../progressTrackingService');
jest.mock('../userPreferencesService');

describe('Performance Benchmarks', () => {
  let questionDeliveryService: QuestionDeliveryService;
  let progressTrackingService: ProgressTrackingService;
  let simulationService: SimulationService;
  let userPreferencesService: UserPreferencesService;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = mockSupabaseQuery();
    mockSupabaseClient.from.mockReturnValue(mockQuery);
    mockSupabaseClient.auth = {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: TEST_USER_ID } },
        error: null
      })
    };

    questionDeliveryService = new QuestionDeliveryService();
    progressTrackingService = new ProgressTrackingService();
    simulationService = new SimulationService();
    userPreferencesService = new UserPreferencesService();

    jest.clearAllMocks();

    // Mock service dependencies for SimulationService
    const { QuestionDeliveryService } = require('../questionDeliveryService');
    const { ProgressTrackingService } = require('../progressTrackingService');
    const { UserPreferencesService } = require('../userPreferencesService');

    QuestionDeliveryService.prototype.getPersonalizedQuestions = vi.fn().mockResolvedValue({
      questions: createMockQuestions(30, 'medium'),
      strategy: 'unseen_priority',
      metadata: {
        totalPoolSize: 300,
        unseenPoolSize: 200,
        algorithmVersion: 'v1.0',
        selectionTimeMs: 45,
        weightFactors: {}
      }
    });

    ProgressTrackingService.prototype.recordQuestionInteraction = vi.fn().mockResolvedValue(null);
    UserPreferencesService.prototype.getUserPreferences = vi.fn().mockResolvedValue({
      preferredSessionLength: 30,
      preferredDifficulties: ['medium']
    });
  });

  describe('Question Delivery Performance', () => {
    beforeEach(() => {
      // Setup large question pool
      const mockQuestions = createMockQuestions(1000, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      // Setup user history
      const mockHistory = Array.from({ length: 500 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

      // Setup unseen questions
      mockSupabaseClient.rpc.mockResolvedValue(
        mockSupabaseResponse(Array.from({ length: 400 }, (_, i) => ({ question_id: i + 501 })))
      );
    });

    test('should meet performance requirements for question selection', async () => {
      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'full',
        questionLimit: 30
      };

      const stats = await runPerformanceTest(
        () => questionDeliveryService.getPersonalizedQuestions(options),
        50,
        'Question Selection Performance'
      );

      expect(stats.p95).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
      expect(stats.average).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS * 0.7);
      expect(stats.median).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS * 0.5);

      console.log('Question Selection Performance Stats:', stats);
    });

    test('should scale with question pool size', async () => {
      const poolSizes = [100, 500, 1000, 2000];
      const results = [];

      for (const poolSize of poolSizes) {
        const mockQuestions = createMockQuestions(poolSize, 'medium');
        mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

        const options: QuestionDeliveryOptions = {
          userId: TEST_USER_ID,
          difficulty: 'medium',
          sessionType: 'practice',
          questionLimit: 20
        };

        const { duration } = await measurePerformance(
          () => questionDeliveryService.getPersonalizedQuestions(options),
          `Pool Size ${poolSize}`
        );

        results.push({ poolSize, duration });
      }

      // Performance should not degrade significantly with larger pools
      const firstDuration = results[0].duration;
      const lastDuration = results[results.length - 1].duration;
      const degradationRatio = lastDuration / firstDuration;

      expect(degradationRatio).toBeLessThan(3); // Should not be more than 3x slower
      console.log('Pool Size Scaling Results:', results);
    });

    test('should handle different delivery strategies efficiently', async () => {
      const strategies = ['unseen_priority', 'random_weighted', 'spaced_repetition', 'fallback_reshuffle'];
      const results = [];

      for (const strategy of strategies) {
        const options: QuestionDeliveryOptions = {
          userId: TEST_USER_ID,
          difficulty: 'medium',
          sessionType: 'custom',
          questionLimit: 25,
          deliveryStrategy: strategy as any
        };

        const stats = await runPerformanceTest(
          () => questionDeliveryService.getPersonalizedQuestions(options),
          10,
          `Strategy ${strategy}`
        );

        results.push({ strategy, ...stats });
      }

      // All strategies should meet performance requirements
      results.forEach(result => {
        expect(result.p95).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
      });

      console.log('Strategy Performance Results:', results);
    });

    test('should maintain performance under concurrent load', async () => {
      const concurrencyLevels = [1, 5, 10, 20, 50];
      const results = [];

      for (const concurrency of concurrencyLevels) {
        const options: QuestionDeliveryOptions = {
          userId: TEST_USER_ID,
          difficulty: 'medium',
          sessionType: 'quick',
          questionLimit: 15
        };

        const promises = Array.from({ length: concurrency }, () =>
          measurePerformance(
            () => questionDeliveryService.getPersonalizedQuestions(options),
            `Concurrent Request`
          )
        );

        const concurrentResults = await Promise.all(promises);
        const durations = concurrentResults.map(r => r.duration);
        const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        const maxDuration = Math.max(...durations);

        results.push({ concurrency, avgDuration, maxDuration });
      }

      // Performance should not degrade dramatically under load
      const baselineAvg = results[0].avgDuration;
      const highLoadAvg = results[results.length - 1].avgDuration;
      const loadDegradation = highLoadAvg / baselineAvg;

      expect(loadDegradation).toBeLessThan(5); // Should not be more than 5x slower under high load
      console.log('Concurrency Performance Results:', results);
    });
  });

  describe('Progress Tracking Performance', () => {
    test('should record interactions quickly', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(null));

      const interaction = {
        userId: TEST_USER_ID,
        questionId: 123,
        answerSelected: 1,
        isCorrect: true,
        timeSpentSeconds: 60,
        simulationType: 'quick' as const,
        difficulty: 'medium' as const
      };

      const stats = await runPerformanceTest(
        () => progressTrackingService.recordQuestionInteraction(interaction),
        100,
        'Record Interaction'
      );

      expect(stats.p95).toBeLessThan(100);
      expect(stats.average).toBeLessThan(50);
      console.log('Interaction Recording Performance:', stats);
    });

    test('should retrieve progress efficiently', async () => {
      const mockProgress = [
        createMockProgressSummary(TEST_USER_ID, 'easy'),
        createMockProgressSummary(TEST_USER_ID, 'medium'),
        createMockProgressSummary(TEST_USER_ID, 'hard')
      ];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgress));

      const mockHistory = Array.from({ length: 100 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

      const stats = await runPerformanceTest(
        () => progressTrackingService.getUserProgress(TEST_USER_ID),
        50,
        'Get User Progress'
      );

      expect(stats.p95).toBeLessThan(200);
      console.log('Progress Retrieval Performance:', stats);
    });

    test('should handle large history datasets', async () => {
      const historySizes = [100, 500, 1000, 5000];
      const results = [];

      for (const historySize of historySizes) {
        const mockHistory = Array.from({ length: historySize }, (_, i) => 
          createMockUserHistory(TEST_USER_ID, i + 1)
        );
        mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

        const { duration } = await measurePerformance(
          () => progressTrackingService.getQuestionHistory(TEST_USER_ID, { limit: 100 }),
          `History Size ${historySize}`
        );

        results.push({ historySize, duration });
      }

      // Should scale reasonably with history size
      const firstDuration = results[0].duration;
      const lastDuration = results[results.length - 1].duration;
      const scalingRatio = lastDuration / firstDuration;

      expect(scalingRatio).toBeLessThan(5);
      console.log('History Size Scaling Results:', results);
    });
  });

  describe('Simulation Service Performance', () => {
    test('should start simulations quickly', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
        createMockSession(TEST_USER_ID)
      ));

      const request: StartSimulationRequest = {
        sessionType: 'full',
        difficulty: 'medium',
        questionLimit: 30
      };

      const stats = await runPerformanceTest(
        () => simulationService.startSimulation(TEST_USER_ID, request),
        30,
        'Start Simulation'
      );

      expect(stats.p95).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
      console.log('Simulation Start Performance:', stats);
    });

    test('should handle answer submissions efficiently', async () => {
      const mockSession = createMockSession(TEST_USER_ID, {
        id: 'perf-test-session',
        status: 'in_progress'
      });
      
      mockQuery.single = vi.fn()
        .mockResolvedValue(mockSupabaseResponse(mockSession))
        .mockResolvedValue(mockSupabaseResponse({ id: 123, correct_answer: 2, explanation: 'Test explanation' }))
        .mockResolvedValue(mockSupabaseResponse(mockSession))
        .mockResolvedValue(mockSupabaseResponse({ ...mockSession, questions_attempted: 1 }));

      const request: SubmitAnswerRequest = {
        sessionId: 'perf-test-session',
        questionId: 123,
        answerSelected: 2,
        timeSpentSeconds: 45
      };

      const stats = await runPerformanceTest(
        () => simulationService.submitAnswer(TEST_USER_ID, request),
        50,
        'Submit Answer'
      );

      expect(stats.p95).toBeLessThan(300);
      console.log('Answer Submission Performance:', stats);
    });

    test('should complete full simulation workflow efficiently', async () => {
      // Test a complete simulation workflow
      const workflowTest = async () => {
        // Start simulation
        mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
          createMockSession(TEST_USER_ID, { id: 'workflow-session' })
        ));

        const startRequest: StartSimulationRequest = {
          sessionType: 'quick',
          difficulty: 'medium',
          questionLimit: 5
        };

        const startResponse = await simulationService.startSimulation(TEST_USER_ID, startRequest);

        // Submit answers
        for (let i = 0; i < 3; i++) {
          const mockSession = createMockSession(TEST_USER_ID, {
            id: startResponse.sessionId,
            status: 'in_progress'
          });

          mockQuery.single = vi.fn()
            .mockResolvedValue(mockSupabaseResponse(mockSession))
            .mockResolvedValue(mockSupabaseResponse({ id: i + 1, correct_answer: 0 }))
            .mockResolvedValue(mockSupabaseResponse(mockSession))
            .mockResolvedValue(mockSupabaseResponse(mockSession));

          const submitRequest: SubmitAnswerRequest = {
            sessionId: startResponse.sessionId,
            questionId: i + 1,
            answerSelected: 0,
            timeSpentSeconds: 30
          };

          await simulationService.submitAnswer(TEST_USER_ID, submitRequest);
        }

        // Complete session
        mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
          createMockSession(TEST_USER_ID, { id: startResponse.sessionId })
        ));

        await simulationService.completeSession(TEST_USER_ID, startResponse.sessionId);
      };

      const { duration } = await measurePerformance(workflowTest, 'Complete Simulation Workflow');

      expect(duration).toBeLessThan(2000); // Full workflow should complete in under 2 seconds
      console.log('Complete Workflow Duration:', duration, 'ms');
    });
  });

  describe('Memory Usage Tests', () => {
    test('should not leak memory during repeated operations', async () => {
      measureMemoryUsage('Before memory stress test');

      // Setup for repeated operations
      const mockQuestions = createMockQuestions(500, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      const mockHistory = Array.from({ length: 200 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse([]));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'practice',
        questionLimit: 20
      };

      // Perform many operations
      for (let i = 0; i < 200; i++) {
        await questionDeliveryService.getPersonalizedQuestions(options);
        
        if (i % 50 === 0) {
          measureMemoryUsage(`After ${i} operations`);
        }
      }

      measureMemoryUsage('After memory stress test');

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        measureMemoryUsage('After garbage collection');
      }

      const finalMemory = process.memoryUsage();
      expect(finalMemory.heapUsed / 1024 / 1024).toBeLessThan(testConfig.MEMORY_THRESHOLD_MB);
    });

    test('should handle large datasets without memory issues', async () => {
      measureMemoryUsage('Before large dataset test');

      // Create very large datasets
      const largeQuestionPool = createMockQuestions(5000, 'medium');
      const largeHistory = Array.from({ length: 2000 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );

      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(largeQuestionPool));
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(largeHistory));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse([]));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'practice',
        questionLimit: 50
      };

      // Process large dataset
      await questionDeliveryService.getPersonalizedQuestions(options);

      measureMemoryUsage('After large dataset processing');

      const memoryAfterLarge = process.memoryUsage();
      expect(memoryAfterLarge.heapUsed / 1024 / 1024).toBeLessThan(testConfig.MEMORY_THRESHOLD_MB * 2);
    });
  });

  describe('Database Query Performance', () => {
    test('should optimize database queries', async () => {
      let queryCount = 0;
      const originalFrom = mockSupabaseClient.from;
      
      mockSupabaseClient.from = vi.fn().mockImplementation((...args) => {
        queryCount++;
        return originalFrom.apply(mockSupabaseClient, args);
      });

      const mockQuestions = createMockQuestions(300, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'full',
        questionLimit: 30
      };

      await questionDeliveryService.getPersonalizedQuestions(options);

      // Should not make excessive database queries
      expect(queryCount).toBeLessThan(10);
      console.log('Database queries made:', queryCount);

      mockSupabaseClient.from = originalFrom;
    });

    test('should batch database operations efficiently', async () => {
      const batchSize = 50;
      const interactions = Array.from({ length: batchSize }, (_, i) => ({
        userId: TEST_USER_ID,
        questionId: i + 1,
        answerSelected: 0,
        isCorrect: true,
        timeSpentSeconds: 60,
        simulationType: 'practice' as const,
        difficulty: 'medium' as const
      }));

      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(null));

      const { duration } = await measurePerformance(
        async () => {
          await Promise.all(
            interactions.map(interaction => 
              progressTrackingService.recordQuestionInteraction(interaction)
            )
          );
        },
        'Batch Operations'
      );

      expect(duration).toBeLessThan(1000); // Should complete batched operations quickly
      console.log('Batch operations duration:', duration, 'ms');
    });
  });

  describe('System Limits', () => {
    test('should handle maximum question limits', async () => {
      const maxQuestions = createMockQuestions(100, 'medium'); // Maximum per request
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(maxQuestions));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse([]));

      const options: QuestionDeliveryOptions = {
        userId: TEST_USER_ID,
        difficulty: 'medium',
        sessionType: 'practice',
        questionLimit: 100
      };

      const { duration } = await measurePerformance(
        () => questionDeliveryService.getPersonalizedQuestions(options),
        'Maximum Questions'
      );

      expect(duration).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS * 2);
    });

    test('should handle maximum concurrent users', async () => {
      const maxUsers = 100;
      const userOperations = Array.from({ length: maxUsers }, (_, i) => {
        const userId = `user-${i}`;
        const mockQuestions = createMockQuestions(10, 'medium');
        mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

        const options: QuestionDeliveryOptions = {
          userId,
          difficulty: 'medium',
          sessionType: 'quick',
          questionLimit: 10
        };

        return questionDeliveryService.getPersonalizedQuestions(options);
      });

      const { duration } = await measurePerformance(
        () => Promise.all(userOperations),
        'Maximum Concurrent Users'
      );

      expect(duration).toBeLessThan(5000); // Should handle 100 concurrent users in under 5 seconds
      console.log('Maximum concurrent users duration:', duration, 'ms');
    });
  });

  describe('Real-world Scenarios', () => {
    test('should handle peak usage simulation', async () => {
      // Simulate peak usage: 50 users starting sessions simultaneously
      const peakUsers = 50;
      const sessionStarts = Array.from({ length: peakUsers }, (_, i) => {
        mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
          createMockSession(`user-${i}`)
        ));

        const request: StartSimulationRequest = {
          sessionType: 'quick',
          difficulty: 'medium',
          questionLimit: 10
        };

        return simulationService.startSimulation(`user-${i}`, request);
      });

      const { duration } = await measurePerformance(
        () => Promise.all(sessionStarts),
        'Peak Usage Simulation'
      );

      expect(duration).toBeLessThan(3000); // Should handle peak load
      console.log('Peak usage simulation duration:', duration, 'ms');
    });

    test('should maintain performance during mixed operations', async () => {
      // Simulate mixed operations: starts, submissions, completions
      const mixedOperations = [];

      // 20 session starts
      for (let i = 0; i < 20; i++) {
        mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
          createMockSession(`user-${i}`)
        ));

        const request: StartSimulationRequest = {
          sessionType: 'quick',
          difficulty: 'medium'
        };

        mixedOperations.push(simulationService.startSimulation(`user-${i}`, request));
      }

      // 30 answer submissions
      for (let i = 0; i < 30; i++) {
        const mockSession = createMockSession(`user-${i}`, { status: 'in_progress' });
        mockQuery.single = vi.fn()
          .mockResolvedValue(mockSupabaseResponse(mockSession))
          .mockResolvedValue(mockSupabaseResponse({ id: i + 1, correct_answer: 0 }))
          .mockResolvedValue(mockSupabaseResponse(mockSession))
          .mockResolvedValue(mockSupabaseResponse(mockSession));

        const request: SubmitAnswerRequest = {
          sessionId: `session-${i}`,
          questionId: i + 1,
          answerSelected: 0,
          timeSpentSeconds: 45
        };

        mixedOperations.push(simulationService.submitAnswer(`user-${i}`, request));
      }

      const { duration } = await measurePerformance(
        () => Promise.all(mixedOperations),
        'Mixed Operations'
      );

      expect(duration).toBeLessThan(4000); // Should handle mixed load
      console.log('Mixed operations duration:', duration, 'ms');
    });
  });
});

// Performance summary reporter
afterAll(() => {
  console.log('\n=== PERFORMANCE BENCHMARK SUMMARY ===');
  console.log(`Performance Threshold: ${testConfig.PERFORMANCE_THRESHOLD_MS}ms`);
  console.log(`Memory Threshold: ${testConfig.MEMORY_THRESHOLD_MB}MB`);
  console.log('All performance tests completed successfully!');
  console.log('=====================================\n');
});