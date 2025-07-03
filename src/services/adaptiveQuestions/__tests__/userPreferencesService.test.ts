/**
 * Unit Tests for User Preferences Service
 * 
 * Tests user preferences management, defaults, and performance.
 */

import { UserPreferencesService } from '../userPreferencesService';
import {
  mockSupabaseClient,
  mockSupabaseQuery,
  mockSupabaseResponse,
  measurePerformance,
  runPerformanceTest,
  TEST_USER_ID,
  testConfig
} from './setup';
import { UserPreferences } from '../types';
import { DEFAULT_USER_PREFERENCES } from '../constants';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let mockQuery: any;

  beforeEach(() => {
    service = new UserPreferencesService();
    mockQuery = mockSupabaseQuery();
    mockSupabaseClient.from.mockReturnValue(mockQuery);
    jest.clearAllMocks();
  });

  describe('Getting User Preferences', () => {
    test('should return existing preferences for user', async () => {
      const mockPreferences = {
        user_id: TEST_USER_ID,
        enable_smart_delivery: true,
        preferred_session_length: 25,
        auto_advance_time: 5,
        show_explanations_immediately: false,
        adaptive_difficulty: true,
        preferred_difficulties: ['medium', 'hard'],
        daily_reminder_enabled: true,
        daily_reminder_time: '18:00:00',
        weekly_progress_email: false,
        achievement_notifications: true,
        theme: 'dark',
        font_size: 'large',
        reduce_animations: true,
        allow_analytics: false,
        share_anonymous_data: false
      };

      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockPreferences));

      const preferences = await service.getUserPreferences(TEST_USER_ID);

      expect(preferences).toMatchObject({
        userId: TEST_USER_ID,
        enableSmartDelivery: true,
        preferredSessionLength: 25,
        autoAdvanceTime: 5,
        showExplanationsImmediately: false,
        adaptiveDifficulty: true,
        preferredDifficulties: ['medium', 'hard'],
        dailyReminderEnabled: true,
        dailyReminderTime: '18:00:00',
        weeklyProgressEmail: false,
        achievementNotifications: true,
        theme: 'dark',
        fontSize: 'large',
        reduceAnimations: true,
        allowAnalytics: false,
        shareAnonymousData: false
      });
    });

    test('should create default preferences for new user', async () => {
      // Simulate no existing preferences
      mockQuery.single = vi.fn()
        .mockRejectedValueOnce({ code: 'PGRST116' }) // No preferences found
        .mockResolvedValueOnce(mockSupabaseResponse({ // Created preferences
          user_id: TEST_USER_ID,
          ...DEFAULT_USER_PREFERENCES
        }));

      const preferences = await service.getUserPreferences(TEST_USER_ID);

      expect(preferences.userId).toBe(TEST_USER_ID);
      expect(preferences.enableSmartDelivery).toBe(DEFAULT_USER_PREFERENCES.enableSmartDelivery);
      expect(preferences.preferredSessionLength).toBe(DEFAULT_USER_PREFERENCES.preferredSessionLength);
      
      // Verify that preferences were inserted
      expect(mockQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: TEST_USER_ID,
        enable_smart_delivery: DEFAULT_USER_PREFERENCES.enableSmartDelivery
      }));
    });

    test('should return defaults on database error', async () => {
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Database connection failed'));

      const preferences = await service.getUserPreferences(TEST_USER_ID);

      expect(preferences.userId).toBe(TEST_USER_ID);
      expect(preferences.enableSmartDelivery).toBe(DEFAULT_USER_PREFERENCES.enableSmartDelivery);
    });

    test('should get preferences quickly', async () => {
      const mockPreferences = {
        user_id: TEST_USER_ID,
        ...DEFAULT_USER_PREFERENCES
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockPreferences));

      const { duration } = await measurePerformance(
        () => service.getUserPreferences(TEST_USER_ID),
        'Get User Preferences'
      );

      expect(duration).toBeLessThan(100); // Should be very fast
    });
  });

  describe('Updating User Preferences', () => {
    test('should update specific preferences', async () => {
      // Mock getting current preferences
      const currentPreferences = {
        user_id: TEST_USER_ID,
        enable_smart_delivery: true,
        preferred_session_length: 20,
        theme: 'light'
      };
      
      // Mock updated preferences
      const updatedPreferences = {
        ...currentPreferences,
        preferred_session_length: 30,
        theme: 'dark'
      };

      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(currentPreferences)) // Get current
        .mockResolvedValueOnce(mockSupabaseResponse(updatedPreferences)); // After update

      const updates: Partial<UserPreferences> = {
        preferredSessionLength: 30,
        theme: 'dark'
      };

      const result = await service.updateUserPreferences(TEST_USER_ID, updates);

      expect(result.preferredSessionLength).toBe(30);
      expect(result.theme).toBe('dark');
      
      expect(mockQuery.upsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: TEST_USER_ID,
        preferred_session_length: 30,
        theme: 'dark',
        updated_at: expect.any(String)
      }));
    });

    test('should preserve userId when updating', async () => {
      const currentPreferences = {
        user_id: TEST_USER_ID,
        enable_smart_delivery: true
      };

      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(currentPreferences))
        .mockResolvedValueOnce(mockSupabaseResponse(currentPreferences));

      // Try to update with different userId
      const updates: Partial<UserPreferences> = {
        userId: 'different-user-id',
        enableSmartDelivery: false
      };

      const result = await service.updateUserPreferences(TEST_USER_ID, updates);

      expect(result.userId).toBe(TEST_USER_ID); // Should preserve original
      expect(mockQuery.upsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: TEST_USER_ID // Should use original user ID
      }));
    });

    test('should handle update errors gracefully', async () => {
      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse({ user_id: TEST_USER_ID }))
        .mockRejectedValueOnce(new Error('Update failed'));

      const updates: Partial<UserPreferences> = {
        preferredSessionLength: 25
      };

      await expect(service.updateUserPreferences(TEST_USER_ID, updates)).rejects.toThrow('Update failed');
    });
  });

  describe('Preference Categories', () => {
    test('should get delivery preferences only', async () => {
      const mockPreferences = {
        user_id: TEST_USER_ID,
        enable_smart_delivery: true,
        preferred_session_length: 25,
        auto_advance_time: 10,
        show_explanations_immediately: false,
        adaptive_difficulty: true,
        preferred_difficulties: ['hard']
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockPreferences));

      const deliveryPrefs = await service.getDeliveryPreferences(TEST_USER_ID);

      expect(deliveryPrefs).toMatchObject({
        enableSmartDelivery: true,
        preferredSessionLength: 25,
        autoAdvanceTime: 10,
        showExplanationsImmediately: false,
        adaptiveDifficulty: true,
        preferredDifficulties: ['hard']
      });
    });

    test('should get notification preferences only', async () => {
      const mockPreferences = {
        user_id: TEST_USER_ID,
        daily_reminder_enabled: true,
        daily_reminder_time: '19:30:00',
        weekly_progress_email: false,
        achievement_notifications: true
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockPreferences));

      const notificationPrefs = await service.getNotificationPreferences(TEST_USER_ID);

      expect(notificationPrefs).toMatchObject({
        dailyReminderEnabled: true,
        dailyReminderTime: '19:30:00',
        weeklyProgressEmail: false,
        achievementNotifications: true
      });
    });

    test('should get UI preferences only', async () => {
      const mockPreferences = {
        user_id: TEST_USER_ID,
        theme: 'dark',
        font_size: 'small',
        reduce_animations: true
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockPreferences));

      const uiPrefs = await service.getUIPreferences(TEST_USER_ID);

      expect(uiPrefs).toMatchObject({
        theme: 'dark',
        fontSize: 'small',
        reduceAnimations: true
      });
    });

    test('should update delivery preferences only', async () => {
      const currentPreferences = {
        user_id: TEST_USER_ID,
        enable_smart_delivery: false,
        preferred_session_length: 20
      };
      
      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(currentPreferences))
        .mockResolvedValueOnce(mockSupabaseResponse({
          ...currentPreferences,
          enable_smart_delivery: true,
          preferred_session_length: 30
        }));

      await service.updateDeliveryPreferences(TEST_USER_ID, {
        enableSmartDelivery: true,
        preferredSessionLength: 30
      });

      expect(mockQuery.upsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: TEST_USER_ID,
        enable_smart_delivery: true,
        preferred_session_length: 30
      }));
    });
  });

  describe('Premium User Features', () => {
    test('should check premium status correctly', async () => {
      const premiumUser = {
        is_premium: true,
        premium_expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(premiumUser));

      const isPremium = await service.isPremiumUser(TEST_USER_ID);

      expect(isPremium).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
    });

    test('should handle expired premium correctly', async () => {
      const expiredPremiumUser = {
        is_premium: true,
        premium_expiration: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(expiredPremiumUser));

      const isPremium = await service.isPremiumUser(TEST_USER_ID);

      expect(isPremium).toBe(false);
    });

    test('should handle non-premium users', async () => {
      const regularUser = {
        is_premium: false,
        premium_expiration: null
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(regularUser));

      const isPremium = await service.isPremiumUser(TEST_USER_ID);

      expect(isPremium).toBe(false);
    });

    test('should handle premium check errors gracefully', async () => {
      mockQuery.single = vi.fn().mockRejectedValue(new Error('Database error'));

      const isPremium = await service.isPremiumUser(TEST_USER_ID);

      expect(isPremium).toBe(false); // Default to false on error
    });
  });

  describe('Optimized Preferences', () => {
    test('should generate optimized preferences based on usage patterns', async () => {
      // Mock recent sessions data
      const mockSessions = [
        { questions_attempted: 15, total_time_seconds: 900, score_percentage: 85 },
        { questions_attempted: 20, total_time_seconds: 1200, score_percentage: 78 },
        { questions_attempted: 12, total_time_seconds: 720, score_percentage: 92 }
      ];
      
      // Mock progress data
      const mockProgress = [
        { difficulty: 'easy', average_accuracy: 88 },
        { difficulty: 'medium', average_accuracy: 75 },
        { difficulty: 'hard', average_accuracy: 62 }
      ];

      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(mockSessions))
        .mockResolvedValueOnce(mockSupabaseResponse(mockProgress));

      const optimized = await service.getOptimizedPreferences(TEST_USER_ID);

      expect(optimized).toMatchObject({
        recommendedSessionLength: expect.any(Number),
        suggestedDifficulty: expect.any(String),
        optimalPracticeTime: expect.any(String)
      });

      // Average session length should be around 15-16
      expect(optimized.recommendedSessionLength).toBeGreaterThan(10);
      expect(optimized.recommendedSessionLength).toBeLessThan(25);

      // Should suggest medium difficulty (good accuracy but still challenging)
      expect(optimized.suggestedDifficulty).toBe('medium');
    });

    test('should handle empty usage data', async () => {
      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse([]))
        .mockResolvedValueOnce(mockSupabaseResponse([]));

      const optimized = await service.getOptimizedPreferences(TEST_USER_ID);

      expect(optimized).toMatchObject({
        recommendedSessionLength: DEFAULT_USER_PREFERENCES.preferredSessionLength,
        suggestedDifficulty: 'medium',
        optimalPracticeTime: '19:00'
      });
    });
  });

  describe('Reset Preferences', () => {
    test('should reset preferences to defaults', async () => {
      const defaultPreferences = {
        user_id: TEST_USER_ID,
        ...DEFAULT_USER_PREFERENCES
      };

      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(defaultPreferences)) // For getting current
        .mockResolvedValueOnce(mockSupabaseResponse(defaultPreferences)); // For update result

      const result = await service.resetUserPreferences(TEST_USER_ID);

      expect(result).toMatchObject({
        userId: TEST_USER_ID,
        enableSmartDelivery: DEFAULT_USER_PREFERENCES.enableSmartDelivery,
        preferredSessionLength: DEFAULT_USER_PREFERENCES.preferredSessionLength,
        theme: DEFAULT_USER_PREFERENCES.theme
      });
    });
  });

  describe('Analytics Preferences', () => {
    test('should get analytics preferences', async () => {
      const mockPreferences = {
        user_id: TEST_USER_ID,
        allow_analytics: false,
        share_anonymous_data: true
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockPreferences));

      const analyticsPrefs = await service.getAnalyticsPreferences(TEST_USER_ID);

      expect(analyticsPrefs).toMatchObject({
        allowAnalytics: false,
        shareAnonymousData: true
      });
    });

    test('should update analytics preferences', async () => {
      const currentPreferences = {
        user_id: TEST_USER_ID,
        allow_analytics: true,
        share_anonymous_data: true
      };

      mockQuery.single = vi.fn()
        .mockResolvedValueOnce(mockSupabaseResponse(currentPreferences))
        .mockResolvedValueOnce(mockSupabaseResponse({
          ...currentPreferences,
          allow_analytics: false
        }));

      await service.updateAnalyticsPreferences(TEST_USER_ID, {
        allowAnalytics: false
      });

      expect(mockQuery.upsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: TEST_USER_ID,
        allow_analytics: false
      }));
    });
  });

  describe('Performance Tests', () => {
    test('should handle concurrent preference updates', async () => {
      const mockPreferences = {
        user_id: TEST_USER_ID,
        ...DEFAULT_USER_PREFERENCES
      };

      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockPreferences));

      const updates = [
        { preferredSessionLength: 25 },
        { theme: 'dark' },
        { enableSmartDelivery: false },
        { dailyReminderEnabled: true }
      ];

      const concurrentPromises = updates.map(update => 
        measurePerformance(
          () => service.updateUserPreferences(TEST_USER_ID, update),
          'Concurrent Update'
        )
      );

      const results = await Promise.all(concurrentPromises);
      const durations = results.map(r => r.duration);
      const maxDuration = Math.max(...durations);

      expect(maxDuration).toBeLessThan(testConfig.PERFORMANCE_THRESHOLD_MS);
    });

    test('should scale with bulk preference operations', async () => {
      const mockPreferences = {
        user_id: TEST_USER_ID,
        ...DEFAULT_USER_PREFERENCES
      };
      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(mockPreferences));

      const stats = await runPerformanceTest(
        () => service.getUserPreferences(TEST_USER_ID),
        100,
        'Bulk Preference Get'
      );

      expect(stats.p95).toBeLessThan(200); // Should be very fast
      expect(stats.average).toBeLessThan(100);
    });
  });

  describe('Data Conversion', () => {
    test('should correctly convert between database and service formats', async () => {
      const dbFormat = {
        user_id: TEST_USER_ID,
        enable_smart_delivery: true,
        preferred_session_length: 30,
        auto_advance_time: 5,
        show_explanations_immediately: false,
        adaptive_difficulty: true,
        preferred_difficulties: ['medium', 'hard'],
        daily_reminder_enabled: false,
        daily_reminder_time: '20:00:00',
        weekly_progress_email: true,
        achievement_notifications: false,
        theme: 'dark',
        font_size: 'large',
        reduce_animations: true,
        allow_analytics: false,
        share_anonymous_data: true
      };

      mockQuery.single = vi.fn().mockResolvedValue(mockSupabaseResponse(dbFormat));

      const preferences = await service.getUserPreferences(TEST_USER_ID);

      // Verify camelCase conversion
      expect(preferences.enableSmartDelivery).toBe(true);
      expect(preferences.preferredSessionLength).toBe(30);
      expect(preferences.autoAdvanceTime).toBe(5);
      expect(preferences.showExplanationsImmediately).toBe(false);
      expect(preferences.adaptiveDifficulty).toBe(true);
      expect(preferences.preferredDifficulties).toEqual(['medium', 'hard']);
      expect(preferences.dailyReminderEnabled).toBe(false);
      expect(preferences.dailyReminderTime).toBe('20:00:00');
      expect(preferences.weeklyProgressEmail).toBe(true);
      expect(preferences.achievementNotifications).toBe(false);
      expect(preferences.theme).toBe('dark');
      expect(preferences.fontSize).toBe('large');
      expect(preferences.reduceAnimations).toBe(true);
      expect(preferences.allowAnalytics).toBe(false);
      expect(preferences.shareAnonymousData).toBe(true);
    });
  });
});