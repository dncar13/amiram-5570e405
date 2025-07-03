/**
 * Unit Tests for Progress Tracking Service
 * 
 * Tests progress recording, analytics calculation, and performance metrics.
 */

import { ProgressTrackingService } from '../progressTrackingService';
import {
  mockSupabaseClient,
  mockSupabaseQuery,
  mockSupabaseResponse,
  createMockProgressSummary,
  createMockUserHistory,
  measurePerformance,
  runPerformanceTest,
  TEST_USER_ID,
  testConfig
} from './setup';
import { DifficultyLevel, SessionType } from '../types';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

describe('ProgressTrackingService', () => {
  let service: ProgressTrackingService;
  let mockQuery: any;

  beforeEach(() => {
    service = new ProgressTrackingService();
    mockQuery = mockSupabaseQuery();
    mockSupabaseClient.from.mockReturnValue(mockQuery);
    jest.clearAllMocks();
  });

  describe('Recording Question Interactions', () => {
    test('should record question interaction correctly', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(null));

      const interaction = {
        userId: TEST_USER_ID,
        questionId: 123,
        answerSelected: 2,
        isCorrect: true,
        timeSpentSeconds: 45,
        simulationSessionId: 'session-123',
        simulationType: 'quick' as SessionType,
        difficulty: 'medium' as DifficultyLevel,
        flagged: false,
        notes: 'This was challenging'
      };

      await service.recordQuestionInteraction(interaction);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_question_history');
      expect(mockQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: TEST_USER_ID,
        question_id: 123,
        answer_selected: 2,
        is_correct: true,
        time_spent_seconds: 45,
        simulation_session_id: 'session-123',
        simulation_type: 'quick',
        difficulty: 'medium',
        flagged: false,
        notes: 'This was challenging'
      }));
    });

    test('should handle database errors during interaction recording', async () => {
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Database error'));

      const interaction = {
        userId: TEST_USER_ID,
        questionId: 123,
        answerSelected: 1,
        isCorrect: false,
        timeSpentSeconds: 30,
        simulationType: 'practice' as SessionType,
        difficulty: 'hard' as DifficultyLevel
      };

      await expect(service.recordQuestionInteraction(interaction)).rejects.toThrow();
    });

    test('should record interactions quickly under load', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(null));

      const interaction = {
        userId: TEST_USER_ID,
        questionId: 456,
        answerSelected: 0,
        isCorrect: true,
        timeSpentSeconds: 60,
        simulationType: 'full' as SessionType,
        difficulty: 'easy' as DifficultyLevel
      };

      const stats = await runPerformanceTest(
        () => service.recordQuestionInteraction(interaction),
        50,
        'Record Question Interaction'
      );

      expect(stats.p95).toBeLessThan(100); // Should be very fast
      expect(stats.average).toBeLessThan(50);
    });
  });

  describe('User Progress Retrieval', () => {
    test('should get comprehensive progress for all difficulties', async () => {
      const mockProgressData = [
        createMockProgressSummary(TEST_USER_ID, 'easy'),
        createMockProgressSummary(TEST_USER_ID, 'medium'),
        createMockProgressSummary(TEST_USER_ID, 'hard')
      ];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgressData));

      // Mock recent activity data
      const mockRecentActivity = Array.from({ length: 10 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1, {
          last_seen_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        })
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      const progress = await service.getUserProgress(TEST_USER_ID);

      expect(progress).toHaveLength(3);
      expect(progress[0].difficulty).toBe('easy');
      expect(progress[1].difficulty).toBe('medium');
      expect(progress[2].difficulty).toBe('hard');

      progress.forEach(p => {
        expect(p.progress).toMatchObject({
          userId: TEST_USER_ID,
          difficulty: expect.any(String),
          totalQuestionsAvailable: expect.any(Number),
          questionsSeen: expect.any(Number),
          questionsCorrect: expect.any(Number),
          averageAccuracy: expect.any(Number)
        });

        expect(p.recentActivity).toMatchObject({
          questionsThisWeek: expect.any(Number),
          averageAccuracyThisWeek: expect.any(Number),
          practiceTimeThisWeek: expect.any(Number),
          streakDays: expect.any(Number)
        });

        expect(p.recommendations).toMatchObject({
          suggestedSessionType: expect.any(String),
          focusAreas: expect.any(Array),
          nextMilestone: expect.any(String)
        });
      });
    });

    test('should get progress for specific difficulty', async () => {
      const mockProgressData = [createMockProgressSummary(TEST_USER_ID, 'medium')];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgressData));

      const mockRecentActivity = [createMockUserHistory(TEST_USER_ID, 1)];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      const progress = await service.getUserProgress(TEST_USER_ID, 'medium');

      expect(progress).toHaveLength(1);
      expect(progress[0].difficulty).toBe('medium');
    });

    test('should create empty progress for new users', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([]));

      const progress = await service.getUserProgress(TEST_USER_ID);

      expect(progress).toHaveLength(3); // One for each difficulty
      progress.forEach(p => {
        expect(p.progress.questionsSeen).toBe(0);
        expect(p.progress.questionsCorrect).toBe(0);
        expect(p.progress.averageAccuracy).toBe(0);
      });
    });

    test('should fetch progress efficiently', async () => {
      const mockProgressData = [
        createMockProgressSummary(TEST_USER_ID, 'easy'),
        createMockProgressSummary(TEST_USER_ID, 'medium'),
        createMockProgressSummary(TEST_USER_ID, 'hard')
      ];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgressData));

      const mockRecentActivity = Array.from({ length: 20 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      const { duration } = await measurePerformance(
        () => service.getUserProgress(TEST_USER_ID),
        'Get User Progress'
      );

      expect(duration).toBeLessThan(200); // Should be fast
    });
  });

  describe('Question History', () => {
    test('should retrieve question history with filters', async () => {
      const mockHistory = Array.from({ length: 25 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1, {
          difficulty: i % 2 === 0 ? 'easy' : 'medium',
          is_correct: i % 3 === 0
        })
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

      const history = await service.getQuestionHistory(TEST_USER_ID, {
        difficulty: 'easy',
        limit: 10,
        includeIncorrectOnly: true,
        timeRange: 'week'
      });

      expect(mockQuery.eq).toHaveBeenCalledWith('difficulty', 'easy');
      expect(mockQuery.eq).toHaveBeenCalledWith('is_correct', false);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(mockQuery.gte).toHaveBeenCalledWith('last_seen_at', expect.any(String));
    });

    test('should retrieve history without filters', async () => {
      const mockHistory = Array.from({ length: 15 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

      const history = await service.getQuestionHistory(TEST_USER_ID);

      expect(history).toHaveLength(15);
      history.forEach(h => {
        expect(h).toMatchObject({
          id: expect.any(String),
          userId: TEST_USER_ID,
          questionId: expect.any(Number),
          isCorrect: expect.any(Boolean),
          timeSpentSeconds: expect.any(Number),
          difficulty: expect.any(String),
          lastSeenAt: expect.any(Date),
          createdAt: expect.any(Date)
        });
      });
    });
  });

  describe('Progress Reset', () => {
    test('should reset progress for specific difficulty', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(null));

      await service.resetProgress(TEST_USER_ID, 'medium');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_question_history');
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', TEST_USER_ID);
      expect(mockQuery.eq).toHaveBeenCalledWith('difficulty', 'medium');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_progress_summary');
      expect(mockQuery.upsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: TEST_USER_ID,
        difficulty: 'medium',
        questions_seen: 0,
        questions_correct: 0,
        questions_incorrect: 0,
        current_streak_days: 0,
        last_reset_date: expect.any(String)
      }));
    });

    test('should handle reset errors gracefully', async () => {
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Reset failed'));

      await expect(service.resetProgress(TEST_USER_ID, 'hard')).rejects.toThrow();
    });
  });

  describe('Overall Statistics', () => {
    test('should calculate overall statistics correctly', async () => {
      const mockProgressData = [
        createMockProgressSummary(TEST_USER_ID, 'easy', {
          questions_seen: 50,
          questions_correct: 45,
          total_practice_time: 2500,
          current_streak_days: 5
        }),
        createMockProgressSummary(TEST_USER_ID, 'medium', {
          questions_seen: 30,
          questions_correct: 24,
          total_practice_time: 1800,
          current_streak_days: 7
        }),
        createMockProgressSummary(TEST_USER_ID, 'hard', {
          questions_seen: 20,
          questions_correct: 14,
          total_practice_time: 1200,
          current_streak_days: 3
        })
      ];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgressData));

      // Mock recent activity for each difficulty
      const mockRecentActivity = [];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      // Mock perfect sessions for achievements
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([{ score_percentage: 100 }]));

      const stats = await service.getOverallStatistics(TEST_USER_ID);

      expect(stats).toMatchObject({
        totalQuestionsAnswered: 100,
        overallAccuracy: 83, // (45+24+14)/(50+30+20) * 100
        totalPracticeTime: 5500,
        currentStreak: 7, // Max of all streaks
        achievements: expect.any(Array)
      });
    });

    test('should handle empty statistics for new users', async () => {
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse([]));

      const stats = await service.getOverallStatistics(TEST_USER_ID);

      expect(stats).toMatchObject({
        totalQuestionsAnswered: 0,
        overallAccuracy: 0,
        totalPracticeTime: 0,
        currentStreak: 0,
        achievements: []
      });
    });
  });

  describe('Streak Calculation', () => {
    test('should update streak information correctly', async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const mockProgress = createMockProgressSummary(TEST_USER_ID, 'medium', {
        current_streak_days: 5,
        longest_streak_days: 10,
        last_practice_date: yesterday
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgress));

      const interaction = {
        userId: TEST_USER_ID,
        questionId: 123,
        answerSelected: 1,
        isCorrect: true,
        timeSpentSeconds: 60,
        simulationType: 'quick' as SessionType,
        difficulty: 'medium' as DifficultyLevel
      };

      await service.recordQuestionInteraction(interaction);

      // Should update streak to 6 and practice date to today
      expect(mockQuery.update).toHaveBeenCalledWith(expect.objectContaining({
        current_streak_days: 6,
        longest_streak_days: 10, // Unchanged since 6 < 10
        last_practice_date: today
      }));
    });

    test('should reset streak when practice gap exists', async () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const mockProgress = createMockProgressSummary(TEST_USER_ID, 'easy', {
        current_streak_days: 5,
        longest_streak_days: 10,
        last_practice_date: threeDaysAgo
      });
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgress));

      const interaction = {
        userId: TEST_USER_ID,
        questionId: 456,
        answerSelected: 2,
        isCorrect: false,
        timeSpentSeconds: 45,
        simulationType: 'practice' as SessionType,
        difficulty: 'easy' as DifficultyLevel
      };

      await service.recordQuestionInteraction(interaction);

      // Should reset streak to 1
      expect(mockQuery.update).toHaveBeenCalledWith(expect.objectContaining({
        current_streak_days: 1,
        longest_streak_days: 10 // Unchanged
      }));
    });
  });

  describe('Recommendations Generation', () => {
    test('should generate appropriate recommendations for beginners', async () => {
      const mockProgressData = [createMockProgressSummary(TEST_USER_ID, 'easy', {
        questions_seen: 5,
        questions_correct: 3,
        average_accuracy: 60
      })];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgressData));

      const mockRecentActivity = [];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      const progress = await service.getUserProgress(TEST_USER_ID, 'easy');

      expect(progress[0].recommendations.suggestedSessionType).toBe('quick');
      expect(progress[0].recommendations.focusAreas).toContain('Accuracy improvement');
      expect(progress[0].recommendations.nextMilestone).toContain('25 questions');
    });

    test('should recommend mistake review for low accuracy', async () => {
      const mockProgressData = [createMockProgressSummary(TEST_USER_ID, 'medium', {
        questions_seen: 100,
        questions_correct: 50,
        average_accuracy: 50
      })];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgressData));

      const mockRecentActivity = Array.from({ length: 10 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1, { is_correct: i % 2 === 0 })
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      const progress = await service.getUserProgress(TEST_USER_ID, 'medium');

      expect(progress[0].recommendations.suggestedSessionType).toBe('review_mistakes');
      expect(progress[0].recommendations.focusAreas).toContain('Accuracy improvement');
    });
  });

  describe('Performance Tests', () => {
    test('should handle bulk progress queries efficiently', async () => {
      const mockProgressData = Array.from({ length: 100 }, (_, i) => 
        createMockProgressSummary(`user-${i}`, 'medium')
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockProgressData));

      const mockRecentActivity = [];
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockRecentActivity));

      const stats = await runPerformanceTest(
        () => service.getUserProgress(TEST_USER_ID),
        20,
        'Bulk Progress Query'
      );

      expect(stats.p95).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
    });

    test('should scale with large history datasets', async () => {
      const mockHistory = Array.from({ length: 1000 }, (_, i) => 
        createMockUserHistory(TEST_USER_ID, i + 1)
      );
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockHistory));

      const { duration } = await measurePerformance(
        () => service.getQuestionHistory(TEST_USER_ID, { limit: 100 }),
        'Large History Query'
      );

      expect(duration).toBeLessThan(300); // Should handle large datasets
    });
  });
});