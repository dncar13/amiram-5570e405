/**
 * Adaptive Question Delivery System - Main Service
 * 
 * This module provides intelligent question selection and delivery
 * for AMIRAM Premium users with 300+ questions per difficulty level.
 * 
 * Key Features:
 * - 30-day recency tracking
 * - Smart question prioritization
 * - Progress analytics
 * - Performance optimization
 */

export { QuestionDeliveryService } from './questionDeliveryService';
export { ProgressTrackingService } from './progressTrackingService';
export { AnalyticsService } from './analyticsService';
export { UserPreferencesService } from './userPreferencesService';

export type {
  QuestionDeliveryOptions,
  UserProgress,
  SimulationSession,
  DeliveryStrategy,
  ProgressSummary
} from './types';

export {
  DELIVERY_STRATEGIES,
  SESSION_TYPES,
  DIFFICULTY_LEVELS,
  DEFAULT_SESSION_CONFIG
} from './constants';