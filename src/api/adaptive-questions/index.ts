/**
 * API Endpoints for Adaptive Question Delivery System
 * 
 * Provides RESTful endpoints for:
 * - Starting simulations
 * - Submitting answers
 * - Getting progress analytics
 * - Managing user preferences
 */

export { startSimulation, getActiveSession } from './simulation';
export { submitAnswer, completeSession } from './answers';
export { getProgress, getDetailedAnalytics } from './progress';
export { getPreferences, updatePreferences } from './preferences';
export { getDashboard, getSystemAnalytics } from './analytics';