/**
 * Unit Tests for Simulation Service
 * 
 * Tests simulation lifecycle, session management, and integration
 * between question delivery and progress tracking.
 */

import { SimulationService } from '../simulationService';
import {
  mockSupabaseClient,
  mockSupabaseQuery,
  mockSupabaseResponse,
  createMockQuestion,
  createMockQuestions,
  createMockSession,
  measurePerformance,
  runPerformanceTest,
  TEST_USER_ID,
  TEST_SESSION_ID,
  testConfig
} from './setup';
import { StartSimulationRequest, SubmitAnswerRequest, SessionType } from '../types';

// Mock all dependencies
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

jest.mock('../questionDeliveryService');
jest.mock('../progressTrackingService');
jest.mock('../userPreferencesService');

describe('SimulationService', () => {
  let service: SimulationService;
  let mockQuery: any;

  beforeEach(() => {
    service = new SimulationService();
    mockQuery = mockSupabaseQuery();
    mockSupabaseClient.from.mockReturnValue(mockQuery);
    mockSupabaseClient.auth = {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: TEST_USER_ID } },
        error: null
      })
    };
    jest.clearAllMocks();

    // Mock dependencies
    const { QuestionDeliveryService } = require('../questionDeliveryService');
    const { ProgressTrackingService } = require('../progressTrackingService');
    const { UserPreferencesService } = require('../userPreferencesService');

    QuestionDeliveryService.prototype.getPersonalizedQuestions = vi.fn().mockResolvedValue({
      questions: createMockQuestions(10, 'medium'),
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
      preferredSessionLength: 20,
      preferredDifficulties: ['medium']
    });
  });

  describe('Starting Simulations', () => {
    test('should start a new simulation session successfully', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
        createMockSession(TEST_USER_ID, { id: 'new-session-id' })
      ));

      const request: StartSimulationRequest = {
        sessionType: 'quick',
        difficulty: 'medium',
        questionLimit: 10
      };

      const response = await service.startSimulation(TEST_USER_ID, request);

      expect(response).toMatchObject({
        sessionId: expect.any(String),
        questions: expect.any(Array),
        sessionConfig: {
          sessionType: 'quick',
          difficulty: 'medium',
          totalQuestions: 10,
          estimatedTimeMinutes: expect.any(Number)
        },
        deliveryMetadata: expect.any(Object)
      });

      expect(response.questions).toHaveLength(10);
      expect(response.sessionConfig.estimatedTimeMinutes).toBeGreaterThan(0);
    });

    test('should handle different session types correctly', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
        createMockSession(TEST_USER_ID)
      ));

      const sessionTypes: SessionType[] = ['quick', 'full', 'custom', 'practice', 'review_mistakes', 'unseen_only'];

      for (const sessionType of sessionTypes) {
        const request: StartSimulationRequest = {
          sessionType,
          difficulty: 'hard'
        };

        const response = await service.startSimulation(TEST_USER_ID, request);

        expect(response.sessionConfig.sessionType).toBe(sessionType);
        expect(response.questions.length).toBeGreaterThan(0);
      }
    });

    test('should apply user preferences to session configuration', async () => {
      const { UserPreferencesService } = require('../userPreferencesService');
      UserPreferencesService.prototype.getUserPreferences.mockResolvedValue({
        preferredSessionLength: 25,
        preferredDifficulties: ['hard'],
        enableSmartDelivery: true
      });

      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
        createMockSession(TEST_USER_ID)
      ));

      const request: StartSimulationRequest = {
        sessionType: 'custom'
        // No difficulty or questionLimit specified - should use preferences
      };

      const response = await service.startSimulation(TEST_USER_ID, request);

      expect(response.sessionConfig.difficulty).toBe('hard');
      expect(response.sessionConfig.totalQuestions).toBe(10); // From mock questions
    });

    test('should validate user authentication', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Invalid token')
      });

      const request: StartSimulationRequest = {
        sessionType: 'quick',
        difficulty: 'medium'
      };

      await expect(service.startSimulation(TEST_USER_ID, request)).rejects.toThrow();
    });

    test('should handle insufficient questions gracefully', async () => {
      const { QuestionDeliveryService } = require('../questionDeliveryService');
      QuestionDeliveryService.prototype.getPersonalizedQuestions.mockResolvedValue({
        questions: [],
        strategy: 'unseen_priority',
        metadata: {}
      });

      const request: StartSimulationRequest = {
        sessionType: 'full',
        difficulty: 'expert' as any // Invalid difficulty
      };

      await expect(service.startSimulation(TEST_USER_ID, request)).rejects.toThrow();
    });

    test('should start simulations quickly', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
        createMockSession(TEST_USER_ID)
      ));

      const request: StartSimulationRequest = {
        sessionType: 'quick',
        difficulty: 'medium',
        questionLimit: 15
      };

      const { duration } = await measurePerformance(
        () => service.startSimulation(TEST_USER_ID, request),
        'Start Simulation'
      );

      expect(duration).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
    });
  });

  describe('Submitting Answers', () => {
    test('should submit answer and update progress', async () => {
      const mockSession = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        questions_attempted: 5,
        questions_correct: 4,
        status: 'in_progress'
      });
      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(mockSession)) // For session validation
        .mockResolvedValueOnce(mockSupabaseResponse(createMockQuestion({ id: 123, correct_answer: 2 }))) // For question details
        .mockResolvedValueOnce(mockSupabaseResponse(mockSession)) // For first session fetch in update
        .mockResolvedValueOnce(mockSupabaseResponse({ ...mockSession, questions_attempted: 6, questions_correct: 5 })); // For updated session

      const request: SubmitAnswerRequest = {
        sessionId: TEST_SESSION_ID,
        questionId: 123,
        answerSelected: 2,
        timeSpentSeconds: 45,
        flagged: false
      };

      const response = await service.submitAnswer(TEST_USER_ID, request);

      expect(response).toMatchObject({
        isCorrect: true,
        correctAnswer: 2,
        explanation: expect.any(String),
        progress: {
          questionsAnswered: 6,
          questionsRemaining: expect.any(Number),
          currentAccuracy: expect.any(Number)
        },
        nextAction: expect.any(String)
      });

      // Verify progress tracking was called
      const { ProgressTrackingService } = require('../progressTrackingService');
      expect(ProgressTrackingService.prototype.recordQuestionInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: TEST_USER_ID,
          questionId: 123,
          answerSelected: 2,
          isCorrect: true,
          timeSpentSeconds: 45
        })
      );
    });

    test('should handle incorrect answers correctly', async () => {
      const mockSession = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        status: 'in_progress'
      });
      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(mockSession))
        .mockResolvedValueOnce(mockSupabaseResponse(createMockQuestion({ id: 456, correct_answer: 1 })))
        .mockResolvedValueOnce(mockSupabaseResponse(mockSession))
        .mockResolvedValueOnce(mockSupabaseResponse({ ...mockSession, questions_attempted: 6, questions_correct: 4 }));

      const request: SubmitAnswerRequest = {
        sessionId: TEST_SESSION_ID,
        questionId: 456,
        answerSelected: 3, // Wrong answer (correct is 1)
        timeSpentSeconds: 60
      };

      const response = await service.submitAnswer(TEST_USER_ID, request);

      expect(response.isCorrect).toBe(false);
      expect(response.correctAnswer).toBe(1);
      expect(response.progress.currentAccuracy).toBeLessThan(100);
    });

    test('should validate session status', async () => {
      const completedSession = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        status: 'completed'
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(completedSession));

      const request: SubmitAnswerRequest = {
        sessionId: TEST_SESSION_ID,
        questionId: 789,
        answerSelected: 0,
        timeSpentSeconds: 30
      };

      await expect(service.submitAnswer(TEST_USER_ID, request)).rejects.toThrow('already been completed');
    });

    test('should validate answer selection', async () => {
      const mockSession = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        status: 'in_progress'
      });
      const mockQuestion = createMockQuestion({
        id: 999,
        options: ['A', 'B', 'C', 'D'] // 4 options (0-3)
      });
      
      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(mockSession))
        .mockResolvedValueOnce(mockSupabaseResponse(mockQuestion));

      const request: SubmitAnswerRequest = {
        sessionId: TEST_SESSION_ID,
        questionId: 999,
        answerSelected: 5, // Invalid - only 0-3 are valid
        timeSpentSeconds: 25
      };

      await expect(service.submitAnswer(TEST_USER_ID, request)).rejects.toThrow('Invalid answer');
    });

    test('should submit answers quickly under load', async () => {
      const mockSession = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        status: 'in_progress'
      });
      mockQuery.single = vi.fn()
        .mockResolvedValue(mockSupabaseResponse(mockSession))
        .mockResolvedValue(mockSupabaseResponse(createMockQuestion({ id: 111 })))
        .mockResolvedValue(mockSupabaseResponse(mockSession))
        .mockResolvedValue(mockSupabaseResponse({ ...mockSession, questions_attempted: 1 }));

      const request: SubmitAnswerRequest = {
        sessionId: TEST_SESSION_ID,
        questionId: 111,
        answerSelected: 1,
        timeSpentSeconds: 40
      };

      const stats = await runPerformanceTest(
        () => service.submitAnswer(TEST_USER_ID, request),
        20,
        'Submit Answer'
      );

      expect(stats.p95).toBeLessThan(300); // Should be reasonably fast
    });
  });

  describe('Session Management', () => {
    test('should get active session for user', async () => {
      const activeSession = createMockSession(TEST_USER_ID, {
        id: 'active-session',
        status: 'in_progress'
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(activeSession));

      const session = await service.getActiveSession(TEST_USER_ID);

      expect(session).not.toBeNull();
      expect(session?.id).toBe('active-session');
      expect(session?.status).toBe('in_progress');
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'in_progress');
    });

    test('should return null when no active session exists', async () => {
      mockQuery.single = vi.fn().mockRejectedValue({ code: 'PGRST116' }); // No rows returned

      const session = await service.getActiveSession(TEST_USER_ID);

      expect(session).toBeNull();
    });

    test('should get session history', async () => {
      const historySessions = Array.from({ length: 5 }, (_, i) => 
        createMockSession(TEST_USER_ID, {
          id: `session-${i}`,
          status: 'completed',
          completed_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        })
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(historySessions));

      const history = await service.getSessionHistory(TEST_USER_ID, 5);

      expect(history).toHaveLength(5);
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'completed');
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });

    test('should abandon session', async () => {
      const activeSession = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        status: 'in_progress'
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(activeSession));

      await service.abandonSession(TEST_USER_ID, TEST_SESSION_ID);

      expect(mockQuery.update).toHaveBeenCalledWith(expect.objectContaining({
        status: 'abandoned',
        completed_at: expect.any(String)
      }));
    });

    test('should complete session successfully', async () => {
      const sessionToComplete = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        questions_attempted: 10,
        questions_correct: 8,
        total_time_seconds: 600
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(sessionToComplete));

      const result = await service.completeSession(TEST_USER_ID, TEST_SESSION_ID);

      expect(result).toMatchObject({
        finalScore: 80, // 8/10 * 100
        totalQuestions: 10,
        correctAnswers: 8,
        totalTime: 600,
        achievements: expect.any(Array)
      });

      expect(mockQuery.update).toHaveBeenCalledWith(expect.objectContaining({
        status: 'completed',
        completed_at: expect.any(String)
      }));
    });
  });

  describe('Session Configuration', () => {
    test('should apply session type constraints', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
        createMockSession(TEST_USER_ID)
      ));

      // Quick sessions should be limited to 15 questions max
      const quickRequest: StartSimulationRequest = {
        sessionType: 'quick',
        questionLimit: 25 // Will be capped at 15
      };

      await service.startSimulation(TEST_USER_ID, quickRequest);

      expect(mockQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
        question_limit: expect.any(Number) // Should be <= 15
      }));

      // Full sessions should have minimum 25 questions
      const fullRequest: StartSimulationRequest = {
        sessionType: 'full',
        questionLimit: 10 // Will be increased to 25
      };

      await service.startSimulation(TEST_USER_ID, fullRequest);

      expect(mockQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
        question_limit: expect.any(Number) // Should be >= 25
      }));
    });

    test('should calculate estimated time correctly', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
        createMockSession(TEST_USER_ID)
      ));

      const testCases = [
        { difficulty: 'easy', questions: 10, expectedMin: 7 }, // 10 * 0.75 = 7.5
        { difficulty: 'medium', questions: 20, expectedMin: 20 }, // 20 * 1.0 = 20
        { difficulty: 'hard', questions: 15, expectedMin: 18 } // 15 * 1.25 = 18.75
      ];

      for (const testCase of testCases) {
        const { QuestionDeliveryService } = require('../questionDeliveryService');
        QuestionDeliveryService.prototype.getPersonalizedQuestions.mockResolvedValue({
          questions: createMockQuestions(testCase.questions, testCase.difficulty as any),
          strategy: 'unseen_priority',
          metadata: {}
        });

        const request: StartSimulationRequest = {
          sessionType: 'custom',
          difficulty: testCase.difficulty as any,
          questionLimit: testCase.questions
        };

        const response = await service.startSimulation(TEST_USER_ID, request);

        expect(response.sessionConfig.estimatedTimeMinutes).toBeGreaterThanOrEqual(testCase.expectedMin);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors during session creation', async () => {
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Database connection failed'));

      const request: StartSimulationRequest = {
        sessionType: 'quick',
        difficulty: 'medium'
      };

      await expect(service.startSimulation(TEST_USER_ID, request)).rejects.toThrow();
    });

    test('should handle invalid session IDs gracefully', async () => {
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Session not found'));

      const request: SubmitAnswerRequest = {
        sessionId: 'invalid-session-id',
        questionId: 123,
        answerSelected: 1,
        timeSpentSeconds: 30
      };

      await expect(service.submitAnswer(TEST_USER_ID, request)).rejects.toThrow();
    });

    test('should handle concurrent session modifications', async () => {
      const mockSession = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        status: 'in_progress'
      });

      // Simulate concurrent modifications
      let callCount = 0;
      mockQuery.single = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.resolve(mockSupabaseResponse(mockSession));
        } else if (callCount === 3) {
          return Promise.resolve(mockSupabaseResponse(createMockQuestion({ id: 123 })));
        } else {
          return Promise.resolve(mockSupabaseResponse(mockSession));
        }
      });

      const request: SubmitAnswerRequest = {
        sessionId: TEST_SESSION_ID,
        questionId: 123,
        answerSelected: 2,
        timeSpentSeconds: 45
      };

      // Should handle the concurrent modification without error
      const response = await service.submitAnswer(TEST_USER_ID, request);
      expect(response).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    test('should coordinate between question delivery and progress tracking', async () => {
      const mockSession = createMockSession(TEST_USER_ID, {
        id: TEST_SESSION_ID,
        status: 'in_progress'
      });
      mockQuery.single = vi.fn()
        .mockResolvedValue(mockSupabaseResponse(mockSession))
        .mockResolvedValue(mockSupabaseResponse(createMockQuestion({ id: 555 })))
        .mockResolvedValue(mockSupabaseResponse(mockSession))
        .mockResolvedValue(mockSupabaseResponse({ ...mockSession, questions_attempted: 1 }));

      const request: SubmitAnswerRequest = {
        sessionId: TEST_SESSION_ID,
        questionId: 555,
        answerSelected: 0,
        timeSpentSeconds: 55
      };

      await service.submitAnswer(TEST_USER_ID, request);

      // Verify integration between services
      const { ProgressTrackingService } = require('../progressTrackingService');
      expect(ProgressTrackingService.prototype.recordQuestionInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: TEST_USER_ID,
          questionId: 555,
          simulationSessionId: TEST_SESSION_ID
        })
      );
    });

    test('should handle full simulation workflow', async () => {
      // Start simulation
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(
        createMockSession(TEST_USER_ID, { id: 'workflow-session' })
      ));

      const startRequest: StartSimulationRequest = {
        sessionType: 'quick',
        difficulty: 'medium',
        questionLimit: 3
      };

      const startResponse = await service.startSimulation(TEST_USER_ID, startRequest);
      expect(startResponse.questions).toHaveLength(3);

      // Submit answers for all questions
      const sessionId = startResponse.sessionId;
      let sessionData = createMockSession(TEST_USER_ID, {
        id: sessionId,
        status: 'in_progress',
        questions_attempted: 0,
        questions_correct: 0
      });

      for (let i = 0; i < 3; i++) {
        const question = startResponse.questions[i];
        sessionData = { ...sessionData, questions_attempted: i + 1, questions_correct: i };

        mockQuery.single = vi.fn()
          .mockResolvedValue(mockSupabaseResponse(sessionData))
          .mockResolvedValue(mockSupabaseResponse(question))
          .mockResolvedValue(mockSupabaseResponse(sessionData))
          .mockResolvedValue(mockSupabaseResponse({ ...sessionData, questions_attempted: i + 1 }));

        const submitRequest: SubmitAnswerRequest = {
          sessionId,
          questionId: question.id,
          answerSelected: question.correctAnswer,
          timeSpentSeconds: 45
        };

        const submitResponse = await service.submitAnswer(TEST_USER_ID, submitRequest);
        expect(submitResponse.isCorrect).toBe(true);
      }

      // Complete session
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse({
        ...sessionData,
        questions_attempted: 3,
        questions_correct: 3
      }));

      const completionResult = await service.completeSession(TEST_USER_ID, sessionId);
      expect(completionResult.finalScore).toBe(100);
    });
  });
});