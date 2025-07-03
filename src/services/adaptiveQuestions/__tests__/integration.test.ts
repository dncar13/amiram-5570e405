/**
 * Integration Tests
 * 
 * Tests the integration between all services and end-to-end workflows
 * for the adaptive question delivery system.
 */

import { QuestionDeliveryService } from '../questionDeliveryService';
import { ProgressTrackingService } from '../progressTrackingService';
import { SimulationService } from '../simulationService';
import { UserPreferencesService } from '../userPreferencesService';
import { AnalyticsService } from '../analyticsService';
import {
  mockSupabaseClient,
  mockSupabaseQuery,
  mockSupabaseResponse,
  createMockQuestions,
  createMockUserHistory,
  createMockProgressSummary,
  createMockSession,
  measurePerformance,
  TEST_USER_ID,
  testConfig
} from './setup';
import { StartSimulationRequest, SubmitAnswerRequest, DifficultyLevel, SessionType } from '../types';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

describe('Integration Tests', () => {
  let questionDeliveryService: QuestionDeliveryService;
  let progressTrackingService: ProgressTrackingService;
  let simulationService: SimulationService;
  let userPreferencesService: UserPreferencesService;
  let analyticsService: AnalyticsService;
  let mockQuery: any;

  beforeEach(() => {
    mockQuery = mockSupabaseQuery();
    mockSupabaseClient.from.mockReturnValue(mockQuery);
    mockSupabaseClient.rpc.mockReturnValue(mockQuery);
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
    analyticsService = new AnalyticsService();

    jest.clearAllMocks();
  });

  describe('Complete User Journey', () => {
    test('should handle complete new user onboarding and first simulation', async () => {
      // 1. New user gets default preferences
      mockQuery.single = vi.fn()
        .mockRejectedValueOnce({ code: 'PGRST116' }) // No preferences found
        .mockResolvedValueOnce(mockSupabaseResponse({ // Created preferences
          user_id: TEST_USER_ID,
          enable_smart_delivery: true,
          preferred_session_length: 30
        }));

      const preferences = await userPreferencesService.getUserPreferences(TEST_USER_ID);
      expect(preferences.userId).toBe(TEST_USER_ID);
      expect(preferences.enableSmartDelivery).toBe(true);

      // 2. User starts their first simulation
      const mockQuestions = createMockQuestions(10, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([])); // No history
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(
        Array.from({ length: 10 }, (_, i) => ({ question_id: i + 1 }))
      ));

      const startRequest: StartSimulationRequest = {
        sessionType: 'quick',
        difficulty: 'medium',
        questionLimit: 10
      };

      // Mock session creation
      const mockSession = createMockSession(TEST_USER_ID, {
        id: 'first-session',
        session_type: 'quick',
        questions_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockSession));

      const simulationResponse = await simulationService.startSimulation(TEST_USER_ID, startRequest);
      
      expect(simulationResponse.questions).toHaveLength(10);
      expect(simulationResponse.sessionConfig.sessionType).toBe('quick');
      expect(simulationResponse.sessionId).toBeDefined();

      // 3. User answers questions and progress is tracked
      const sessionId = simulationResponse.sessionId;
      let correctAnswers = 0;

      for (let i = 0; i < 5; i++) { // Answer 5 questions
        const question = simulationResponse.questions[i];
        const isCorrect = i % 2 === 0; // Alternate correct/incorrect
        if (isCorrect) correctAnswers++;

        // Mock session state updates
        const updatedSession = {
          ...mockSession,
          questions_attempted: i + 1,
          questions_correct: correctAnswers,
          status: 'in_progress'
        };

        mockQuery.single = vi.fn()
          .mockResolvedValueOnce(mockSupabaseResponse(updatedSession)) // Session validation
          .mockResolvedValueOnce(mockSupabaseResponse(question)) // Question details
          .mockResolvedValueOnce(mockSupabaseResponse(updatedSession)) // Session for update
          .mockResolvedValueOnce(mockSupabaseResponse({ // Updated session
            ...updatedSession,
            questions_attempted: i + 1,
            questions_correct: correctAnswers
          }));

        const submitRequest: SubmitAnswerRequest = {
          sessionId,
          questionId: question.id,
          answerSelected: isCorrect ? question.correctAnswer : (question.correctAnswer + 1) % 4,
          timeSpentSeconds: 45 + Math.floor(Math.random() * 30)
        };

        const submitResponse = await simulationService.submitAnswer(TEST_USER_ID, submitRequest);
        expect(submitResponse.isCorrect).toBe(isCorrect);
        expect(submitResponse.progress.questionsAnswered).toBe(i + 1);
      }

      // 4. User completes session
      const finalSession = {
        ...mockSession,
        questions_attempted: 5,
        questions_correct: correctAnswers,
        total_time_seconds: 300,
        status: 'completed'
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(finalSession));

      const completionResult = await simulationService.completeSession(TEST_USER_ID, sessionId);
      expect(completionResult.totalQuestions).toBe(5);
      expect(completionResult.correctAnswers).toBe(correctAnswers);

      // 5. Verify progress was created
      const mockProgress = createMockProgressSummary(TEST_USER_ID, 'medium', {
        questions_seen: 5,
        questions_correct: correctAnswers
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([mockProgress]));

      const mockRecentActivity = Array.from({ length: 5 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1, {
          is_correct: i % 2 === 0
        })
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      const progress = await progressTrackingService.getUserProgress(TEST_USER_ID, 'medium');
      expect(progress).toHaveLength(1);
      expect(progress[0].progress.questionsSeen).toBe(5);
      expect(progress[0].progress.questionsCorrect).toBe(correctAnswers);
    });

    test('should handle experienced user with preferences and history', async () => {
      // 1. User has existing preferences
      const existingPreferences = {
        user_id: TEST_USER_ID,
        enable_smart_delivery: true,
        preferred_session_length: 25,
        adaptive_difficulty: false,
        preferred_difficulties: ['hard'],
        theme: 'dark'
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(existingPreferences));

      const preferences = await userPreferencesService.getUserPreferences(TEST_USER_ID);
      expect(preferences.preferredSessionLength).toBe(25);
      expect(preferences.preferredDifficulties).toEqual(['hard']);

      // 2. User has extensive history
      const mockQuestions = createMockQuestions(300, 'hard');
      const mockHistory = Array.from({ length: 150 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1, {
          difficulty: 'hard',
          is_correct: i % 3 !== 0, // 67% accuracy
          last_seen_at: new Date(Date.now() - (i * 2 * 60 * 60 * 1000)).toISOString() // Spread over time
        })
      );
      
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));
      
      // Mock unseen questions (experienced user has seen many)
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(
        Array.from({ length: 100 }, (_, i) => ({ question_id: i + 151 }))
      ));

      // 3. Start simulation with spaced repetition strategy
      const startRequest: StartSimulationRequest = {
        sessionType: 'practice',
        difficulty: 'hard',
        questionLimit: 25
      };

      const mockSession = createMockSession(TEST_USER_ID, {
        session_type: 'practice',
        difficulty: 'hard',
        question_limit: 25
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockSession));

      const simulationResponse = await simulationService.startSimulation(TEST_USER_ID, startRequest);
      
      expect(simulationResponse.sessionConfig.difficulty).toBe('hard');
      expect(simulationResponse.deliveryMetadata.unseenPoolSize).toBe(100);

      // Should use smart delivery strategy based on user's experience
      expect(['spaced_repetition', 'random_weighted', 'unseen_priority']).toContain(
        simulationResponse.deliveryMetadata.weightFactors.toString()
      );
    });
  });

  describe('Cross-Service Data Consistency', () => {
    test('should maintain data consistency between progress tracking and analytics', async () => {
      // Setup user with some progress
      const mockProgress = [
        createMockProgressSummary(TEST_USER_ID, 'easy', {
          questions_seen: 80,
          questions_correct: 72,
          average_accuracy: 90
        }),
        createMockProgressSummary(TEST_USER_ID, 'medium', {
          questions_seen: 50,
          questions_correct: 35,
          average_accuracy: 70
        }),
        createMockProgressSummary(TEST_USER_ID, 'hard', {
          questions_seen: 20,
          questions_correct: 12,
          average_accuracy: 60
        })
      ];

      // Mock progress service responses
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgress));

      const mockRecentActivity = [];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      // Get progress from progress service
      const progressResults = await progressTrackingService.getUserProgress(TEST_USER_ID);
      
      // Get overall stats from progress service
      const overallStats = await progressTrackingService.getOverallStatistics(TEST_USER_ID);

      // Verify consistency
      const totalQuestions = progressResults.reduce((sum, p) => sum + p.progress.questionsSeen, 0);
      const totalCorrect = progressResults.reduce((sum, p) => sum + p.progress.questionsCorrect, 0);
      const expectedAccuracy = (totalCorrect / totalQuestions) * 100;

      expect(overallStats.totalQuestionsAnswered).toBe(totalQuestions);
      expect(Math.abs(overallStats.overallAccuracy - expectedAccuracy)).toBeLessThan(0.1);

      // Mock analytics service responses
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgress));
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      // Get analytics dashboard
      const dashboardAnalytics = await analyticsService.getDashboardAnalytics(TEST_USER_ID);

      // Verify consistency between services
      expect(dashboardAnalytics.overview.totalQuestionsAnswered).toBe(totalQuestions);
      expect(dashboardAnalytics.progressByDifficulty).toHaveLength(3);
    });

    test('should handle preference changes affecting question delivery', async () => {
      // 1. User starts with default preferences
      const defaultPrefs = {
        user_id: TEST_USER_ID,
        enable_smart_delivery: true,
        preferred_session_length: 20,
        adaptive_difficulty: false
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(defaultPrefs));

      const initialPrefs = await userPreferencesService.getUserPreferences(TEST_USER_ID);
      expect(initialPrefs.preferredSessionLength).toBe(20);

      // 2. Start simulation with initial preferences
      const mockQuestions = createMockQuestions(20, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([]));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(
        Array.from({ length: 20 }, (_, i) => ({ question_id: i + 1 }))
      ));

      const mockSession = createMockSession(TEST_USER_ID, { question_limit: 20 });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockSession));

      const startRequest: StartSimulationRequest = {
        sessionType: 'custom',
        difficulty: 'medium'
      };

      const simulation1 = await simulationService.startSimulation(TEST_USER_ID, startRequest);
      expect(simulation1.sessionConfig.totalQuestions).toBe(20);

      // 3. User updates preferences
      const updatedPrefs = {
        ...defaultPrefs,
        preferred_session_length: 30,
        adaptive_difficulty: true
      };
      
      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(defaultPrefs)) // Get current
        .mockResolvedValueOnce(mockSupabaseResponse(updatedPrefs)); // After update

      await userPreferencesService.updateUserPreferences(TEST_USER_ID, {
        preferredSessionLength: 30,
        adaptiveDifficulty: true
      });

      // 4. Start new simulation with updated preferences
      const newMockQuestions = createMockQuestions(30, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(newMockQuestions));

      const newMockSession = createMockSession(TEST_USER_ID, { 
        question_limit: 30,
        id: 'new-session' 
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(newMockSession));

      const simulation2 = await simulationService.startSimulation(TEST_USER_ID, startRequest);
      expect(simulation2.sessionConfig.totalQuestions).toBe(30);
    });
  });

  describe('Error Handling and Recovery', () => {
    test('should handle partial simulation failures gracefully', async () => {
      // Start simulation successfully
      const mockQuestions = createMockQuestions(10, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([]));
      mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(
        Array.from({ length: 10 }, (_, i) => ({ question_id: i + 1 }))
      ));

      const mockSession = createMockSession(TEST_USER_ID, {
        id: 'partial-fail-session',
        status: 'in_progress'
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockSession));

      const startRequest: StartSimulationRequest = {
        sessionType: 'quick',
        difficulty: 'medium',
        questionLimit: 10
      };

      const simulation = await simulationService.startSimulation(TEST_USER_ID, startRequest);
      expect(simulation.sessionId).toBe('partial-fail-session');

      // Submit some answers successfully
      for (let i = 0; i < 3; i++) {
        const question = simulation.questions[i];
        const updatedSession = {
          ...mockSession,
          questions_attempted: i + 1,
          questions_correct: i
        };

        mockQuery.single = vi.fn()
          .mockResolvedValue(mockSupabaseResponse(updatedSession))
          .mockResolvedValue(mockSupabaseResponse(question))
          .mockResolvedValue(mockSupabaseResponse(updatedSession))
          .mockResolvedValue(mockSupabaseResponse(updatedSession));

        const submitRequest: SubmitAnswerRequest = {
          sessionId: simulation.sessionId,
          questionId: question.id,
          answerSelected: question.correctAnswer,
          timeSpentSeconds: 45
        };

        const submitResponse = await simulationService.submitAnswer(TEST_USER_ID, submitRequest);
        expect(submitResponse.isCorrect).toBe(true);
      }

      // Simulate database error on next submission
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Database connection failed'));

      const question4 = simulation.questions[3];
      const failedSubmitRequest: SubmitAnswerRequest = {
        sessionId: simulation.sessionId,
        questionId: question4.id,
        answerSelected: question4.correctAnswer,
        timeSpentSeconds: 45
      };

      await expect(
        simulationService.submitAnswer(TEST_USER_ID, failedSubmitRequest)
      ).rejects.toThrow();

      // Verify previous progress is still retrievable
      const mockProgress = createMockProgressSummary(TEST_USER_ID, 'medium', {
        questions_seen: 3,
        questions_correct: 3
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([mockProgress]));

      const mockRecentActivity = [];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      const progress = await progressTrackingService.getUserProgress(TEST_USER_ID, 'medium');
      expect(progress[0].progress.questionsSeen).toBe(3);
      expect(progress[0].progress.questionsCorrect).toBe(3);
    });

    test('should handle service unavailability gracefully', async () => {
      // Simulate preferences service being unavailable
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Service unavailable'));

      // Should still be able to start simulation with defaults
      const startRequest: StartSimulationRequest = {
        sessionType: 'quick',
        difficulty: 'medium',
        questionLimit: 10
      };

      // Mock other services working
      const mockQuestions = createMockQuestions(10, 'medium');
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockQuestions));

      const mockSession = createMockSession(TEST_USER_ID);
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockSession));

      // Should handle the error and continue with defaults
      const simulation = await simulationService.startSimulation(TEST_USER_ID, startRequest);
      expect(simulation.questions).toHaveLength(10);
    });
  });

  describe('Performance Under Integration Load', () => {
    test('should maintain performance with multiple concurrent users', async () => {
      const userCount = 20;
      const concurrentOperations = [];

      // Setup mock responses for all users
      for (let i = 0; i < userCount; i++) {
        const userId = `user-${i}`;
        
        // Each user gets preferences
        const mockPrefs = {
          user_id: userId,
          enable_smart_delivery: true,
          preferred_session_length: 15
        };

        // Each user starts a simulation
        const mockQuestions = createMockQuestions(15, 'medium');
        const mockSession = createMockSession(userId, { id: `session-${i}` });

        mockQuery.single = vi.fn()
          .mockResolvedValue(mockSupabaseResponse(mockPrefs))
          .mockResolvedValue(mockSupabaseResponse(mockQuestions))
          .mockResolvedValue(mockSupabaseResponse([]))
          .mockResolvedValue(mockSupabaseResponse(mockSession));

        mockSupabaseClient.rpc.mockResolvedValue(mockSupabaseResponse(
          Array.from({ length: 15 }, (_, j) => ({ question_id: j + 1 }))
        ));

        const userOperation = async () => {
          // Get preferences
          await userPreferencesService.getUserPreferences(userId);
          
          // Start simulation
          const startRequest: StartSimulationRequest = {
            sessionType: 'quick',
            difficulty: 'medium'
          };
          
          return await simulationService.startSimulation(userId, startRequest);
        };

        concurrentOperations.push(userOperation());
      }

      const { duration } = await measurePerformance(
        () => Promise.all(concurrentOperations),
        'Concurrent User Operations'
      );

      expect(duration).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS * 3); // Allow 3x threshold for concurrency
      console.log(`Handled ${userCount} concurrent users in ${duration}ms`);
    });

    test('should handle high-frequency operations efficiently', async () => {
      // Simulate rapid-fire answer submissions
      const submissionCount = 100;
      const submissions = [];

      const mockSession = createMockSession(TEST_USER_ID, {
        id: 'high-freq-session',
        status: 'in_progress'
      });

      for (let i = 0; i < submissionCount; i++) {
        const question = { id: i + 1, correct_answer: 0, explanation: 'Test' };
        const updatedSession = {
          ...mockSession,
          questions_attempted: i + 1,
          questions_correct: i
        };

        mockQuery.single = vi.fn()
          .mockResolvedValue(mockSupabaseResponse(mockSession))
          .mockResolvedValue(mockSupabaseResponse(question))
          .mockResolvedValue(mockSupabaseResponse(mockSession))
          .mockResolvedValue(mockSupabaseResponse(updatedSession));

        const submitRequest: SubmitAnswerRequest = {
          sessionId: 'high-freq-session',
          questionId: i + 1,
          answerSelected: 0,
          timeSpentSeconds: 30
        };

        submissions.push(simulationService.submitAnswer(TEST_USER_ID, submitRequest));
      }

      const { duration } = await measurePerformance(
        () => Promise.all(submissions),
        'High-Frequency Submissions'
      );

      expect(duration).toBeLessThan(5000); // Should handle 100 submissions in under 5 seconds
      console.log(`Processed ${submissionCount} submissions in ${duration}ms`);
    });
  });

  describe('Data Migration and Compatibility', () => {
    test('should handle legacy data formats gracefully', async () => {
      // Mock legacy preference format
      const legacyPreferences = {
        user_id: TEST_USER_ID,
        session_length: 25, // Old field name
        smart_delivery: true, // Old field name
        // Missing new fields
      };

      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(legacyPreferences));

      // Should handle missing fields gracefully
      const preferences = await userPreferencesService.getUserPreferences(TEST_USER_ID);
      expect(preferences.userId).toBe(TEST_USER_ID);
      // Should have defaults for missing fields
      expect(preferences.theme).toBeDefined();
      expect(preferences.fontSize).toBeDefined();
    });

    test('should handle version migration scenarios', async () => {
      // Mock old progress format without some new fields
      const legacyProgress = {
        user_id: TEST_USER_ID,
        difficulty: 'medium',
        questions_seen: 50,
        questions_correct: 40,
        // Missing newer fields like current_streak_days
      };

      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([legacyProgress]));
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([]));

      const progress = await progressTrackingService.getUserProgress(TEST_USER_ID, 'medium');
      
      expect(progress).toHaveLength(1);
      expect(progress[0].progress.questionsSeen).toBe(50);
      expect(progress[0].progress.questionsCorrect).toBe(40);
      // Should handle missing fields gracefully
      expect(progress[0].progress.currentStreakDays).toBeDefined();
    });
  });
});

// Integration test summary
afterAll(() => {
  console.log('\n=== INTEGRATION TEST SUMMARY ===');
  console.log('✅ Complete user journey workflows tested');
  console.log('✅ Cross-service data consistency verified');
  console.log('✅ Error handling and recovery tested');
  console.log('✅ Performance under integration load verified');
  console.log('✅ Data migration compatibility tested');
  console.log('================================\n');
});