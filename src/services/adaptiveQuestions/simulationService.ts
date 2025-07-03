/**
 * Simulation Service - Manages complete simulation sessions
 * 
 * Handles session lifecycle, question delivery, answer submission,
 * and session completion with comprehensive tracking.
 */

import { supabase } from '../supabaseClient';
import {
  SimulationSession,
  StartSimulationRequest,
  StartSimulationResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  SessionType,
  DifficultyLevel,
  SessionStatus
} from './types';
import { QuestionDeliveryService } from './questionDeliveryService';
import { ProgressTrackingService } from './progressTrackingService';
import { UserPreferencesService } from './userPreferencesService';
import {
  SESSION_TYPES,
  DEFAULT_SESSION_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from './constants';

export class SimulationService {

  private questionDeliveryService = new QuestionDeliveryService();
  private progressTrackingService = new ProgressTrackingService();
  private userPreferencesService = new UserPreferencesService();

  /**
   * Start a new simulation session (alias for frontend compatibility)
   */
  async startSession(request: {
    userId: string;
    difficulty: DifficultyLevel;
    sessionType: SessionType;
    questionLimit: number;
    questionGroup?: string[];
  }): Promise<StartSimulationResponse> {
    return this.startSimulation(request.userId, {
      sessionType: request.sessionType,
      difficulty: request.difficulty,
      questionLimit: request.questionLimit,
      topicFilter: request.questionGroup
    });
  }

  /**
   * Start a new simulation session
   */
  async startSimulation(
    userId: string,
    request: StartSimulationRequest
  ): Promise<StartSimulationResponse> {
    try {
      // Validate user authentication
      await this.validateUser(userId);

      // Get user preferences
      const userPreferences = await this.userPreferencesService.getUserPreferences(userId);

      // Determine session configuration
      const sessionConfig = await this.buildSessionConfig(request, userPreferences);

      // Generate unique session ID
      const sessionId = crypto.randomUUID();

      // Get personalized questions using delivery service
      const deliveryResult = await this.questionDeliveryService.getPersonalizedQuestions({
        userId,
        difficulty: sessionConfig.difficulty,
        sessionType: sessionConfig.sessionType,
        questionLimit: sessionConfig.questionLimit,
        topicFilter: sessionConfig.topicFilter,
        deliveryStrategy: sessionConfig.deliveryStrategy
      });

      if (deliveryResult.questions.length === 0) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_QUESTIONS);
      }

      // Create session record in database
      const sessionData = await this.createSessionRecord(
        sessionId,
        userId,
        sessionConfig,
        deliveryResult.questions.map(q => q.id)
      );

      // Calculate estimated time
      const estimatedMinutes = this.calculateEstimatedTime(
        deliveryResult.questions.length,
        sessionConfig.difficulty
      );

      return {
        sessionId,
        questions: deliveryResult.questions,
        sessionConfig: {
          sessionType: sessionConfig.sessionType,
          difficulty: sessionConfig.difficulty,
          totalQuestions: deliveryResult.questions.length,
          estimatedTimeMinutes: estimatedMinutes
        },
        deliveryMetadata: deliveryResult.metadata
      };

    } catch (error) {
      console.error('Error starting simulation:', error);
      throw error;
    }
  }

  /**
   * Submit an answer for a question in a session
   */
  async submitAnswer(
    userId: string,
    request: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> {
    try {
      // Validate session and get session data
      const session = await this.validateSessionAndGetData(request.sessionId, userId);

      if (session.status !== 'in_progress') {
        throw new Error(ERROR_MESSAGES.SESSION_ALREADY_COMPLETE);
      }

      // Get question details
      const question = await this.getQuestionDetails(request.questionId);
      if (!question) {
        throw new Error(ERROR_MESSAGES.QUESTION_NOT_FOUND);
      }

      // Validate answer
      if (request.answerSelected < 0 || request.answerSelected >= question.options.length) {
        throw new Error(ERROR_MESSAGES.INVALID_ANSWER);
      }

      // Determine if answer is correct
      const isCorrect = request.answerSelected === question.correct_answer;

      // Record the interaction
      await this.progressTrackingService.recordQuestionInteraction({
        userId,
        questionId: request.questionId,
        answerSelected: request.answerSelected,
        isCorrect,
        timeSpentSeconds: request.timeSpentSeconds,
        simulationSessionId: request.sessionId,
        simulationType: session.session_type as SessionType,
        difficulty: session.difficulty as DifficultyLevel,
        flagged: request.flagged,
        notes: request.notes
      });

      // Update session progress
      const updatedSession = await this.updateSessionProgress(
        request.sessionId,
        isCorrect,
        request.timeSpentSeconds
      );

      // Determine next action
      const nextAction = this.determineNextAction(updatedSession, question);

      return {
        isCorrect,
        correctAnswer: question.correct_answer,
        explanation: question.explanation || '',
        progress: {
          questionsAnswered: updatedSession.questions_attempted,
          questionsRemaining: Math.max(0, updatedSession.question_limit - updatedSession.questions_attempted),
          currentAccuracy: updatedSession.questions_attempted > 0 ? 
            (updatedSession.questions_correct / updatedSession.questions_attempted) * 100 : 0
        },
        nextAction
      };

    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  /**
   * Complete a simulation session (overloaded for different signatures)
   */
  async completeSession(
    userIdOrRequest: string | {
      userId: string;
      sessionId: string;
      finalScore?: number;
      totalQuestions?: number;
      completedAt?: Date;
    },
    sessionId?: string
  ): Promise<{
    finalScore: number;
    totalQuestions: number;
    correctAnswers: number;
    totalTime: number;
    achievements: string[];
  }> {
    try {
      // Handle both signatures
      let userId: string;
      let sessionIdToComplete: string;
      
      if (typeof userIdOrRequest === 'string') {
        userId = userIdOrRequest;
        sessionIdToComplete = sessionId!;
      } else {
        userId = userIdOrRequest.userId;
        sessionIdToComplete = userIdOrRequest.sessionId;
      }
      
      // Validate session
      const session = await this.validateSessionAndGetData(sessionIdToComplete, userId);

      // Mark session as completed
      const { error } = await supabase
        .from('simulation_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionIdToComplete);

      if (error) {
        throw new Error(`Failed to complete session: ${error.message}`);
      }

      // Calculate final statistics
      const finalScore = session.questions_attempted > 0 ? 
        (session.questions_correct / session.questions_attempted) * 100 : 0;

      // Check for new achievements
      const achievements = await this.checkSessionAchievements(userId, session);

      return {
        finalScore: Math.round(finalScore * 100) / 100,
        totalQuestions: session.questions_attempted,
        correctAnswers: session.questions_correct,
        totalTime: session.total_time_seconds,
        achievements
      };

    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  }

  /**
   * Get active session for a user
   */
  async getActiveSession(userId: string): Promise<SimulationSession | null> {
    try {
      const { data, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No active session found
          return null;
        }
        throw new Error(`Failed to get active session: ${error.message}`);
      }

      return this.convertDbSessionToSimulationSession(data);

    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  /**
   * Get session history for a user
   */
  async getSessionHistory(
    userId: string,
    limit: number = 10
  ): Promise<SimulationSession[]> {
    try {
      const { data, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to get session history: ${error.message}`);
      }

      return (data || []).map(this.convertDbSessionToSimulationSession);

    } catch (error) {
      console.error('Error getting session history:', error);
      throw error;
    }
  }

  /**
   * Abandon a session (user quits mid-session)
   */
  async abandonSession(userId: string, sessionId: string): Promise<void> {
    try {
      const session = await this.validateSessionAndGetData(sessionId, userId);

      if (session.status !== 'in_progress') {
        return; // Already completed or abandoned
      }

      const { error } = await supabase
        .from('simulation_sessions')
        .update({
          status: 'abandoned',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        throw new Error(`Failed to abandon session: ${error.message}`);
      }

    } catch (error) {
      console.error('Error abandoning session:', error);
      throw error;
    }
  }

  /**
   * Build session configuration from request and user preferences
   */
  private async buildSessionConfig(
    request: StartSimulationRequest,
    userPreferences: any
  ): Promise<{
    sessionType: SessionType;
    difficulty: DifficultyLevel;
    questionLimit: number;
    topicFilter?: string[];
    deliveryStrategy: string;
  }> {
    const sessionTypeConfig = SESSION_TYPES[request.sessionType];
    
    // Determine difficulty - default to user preference or medium
    let difficulty: DifficultyLevel = request.difficulty || 
      userPreferences?.preferredDifficulty || 
      'medium';

    // Determine question limit
    let questionLimit = request.questionLimit || 
      userPreferences?.questionsPerSession || 
      sessionTypeConfig.defaultQuestionCount;

    // Apply session type constraints
    if (request.sessionType === 'quick') {
      questionLimit = Math.min(questionLimit, 15);
    } else if (request.sessionType === 'full') {
      questionLimit = Math.max(questionLimit, 25);
    }

    return {
      sessionType: request.sessionType,
      difficulty,
      questionLimit,
      topicFilter: request.topicFilter,
      deliveryStrategy: sessionTypeConfig.recommendedStrategy
    };
  }

  /**
   * Create session record in database
   */
  private async createSessionRecord(
    sessionId: string,
    userId: string,
    config: any,
    questionIds: number[]
  ): Promise<any> {
    const { data, error } = await supabase
      .from('simulation_sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        session_type: config.sessionType,
        difficulty: config.difficulty,
        topic_filter: config.topicFilter,
        question_limit: config.questionLimit,
        questions_attempted: 0,
        questions_correct: 0,
        total_time_seconds: 0,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        questions_ids: questionIds,
        user_agent: 'web-app' // Could be dynamic
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }

    return data;
  }

  /**
   * Update session progress after answer submission
   */
  private async updateSessionProgress(
    sessionId: string,
    isCorrect: boolean,
    timeSpent: number
  ): Promise<any> {
    const { data, error } = await supabase
      .from('simulation_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      throw new Error('Session not found');
    }

    const updatedData = {
      questions_attempted: data.questions_attempted + 1,
      questions_correct: data.questions_correct + (isCorrect ? 1 : 0),
      total_time_seconds: data.total_time_seconds + timeSpent
    };

    const { data: updated, error: updateError } = await supabase
      .from('simulation_sessions')
      .update(updatedData)
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update session: ${updateError.message}`);
    }

    return updated;
  }

  /**
   * Validate session and return session data
   */
  private async validateSessionAndGetData(sessionId: string, userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('simulation_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(ERROR_MESSAGES.INVALID_SESSION);
    }

    return data;
  }

  /**
   * Get question details
   */
  private async getQuestionDetails(questionId: number): Promise<any> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Determine next action for user
   */
  private determineNextAction(
    session: any,
    question: any
  ): 'continue' | 'complete' | 'review' {
    // If session is complete
    if (session.questions_attempted >= session.question_limit) {
      return 'complete';
    }

    // For practice sessions, always continue
    if (session.session_type === 'practice') {
      return 'continue';
    }

    return 'continue';
  }

  /**
   * Calculate estimated time for session
   */
  private calculateEstimatedTime(
    questionCount: number,
    difficulty: DifficultyLevel
  ): number {
    const timePerQuestion = {
      easy: 0.75,    // 45 seconds
      medium: 1.0,   // 60 seconds  
      hard: 1.25     // 75 seconds
    };

    return Math.ceil(questionCount * timePerQuestion[difficulty]);
  }

  /**
   * Check for session-based achievements
   */
  private async checkSessionAchievements(
    userId: string,
    session: any
  ): Promise<string[]> {
    const achievements: string[] = [];

    // Perfect score achievement
    if (session.questions_attempted > 0 && 
        session.questions_correct === session.questions_attempted) {
      achievements.push('perfect_session');
    }

    // High accuracy achievement
    const accuracy = (session.questions_correct / session.questions_attempted) * 100;
    if (accuracy >= 90) {
      achievements.push('accuracy_90');
    }

    return achievements;
  }

  /**
   * Validate user exists and is authenticated
   */
  private async validateUser(userId: string): Promise<void> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user || data.user.id !== userId) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
  }

  /**
   * Convert database session to SimulationSession type
   */
  private convertDbSessionToSimulationSession(dbSession: any): SimulationSession {
    return {
      id: dbSession.id,
      userId: dbSession.user_id,
      sessionType: dbSession.session_type as SessionType,
      difficulty: dbSession.difficulty as DifficultyLevel,
      topicFilter: dbSession.topic_filter,
      questionLimit: dbSession.question_limit,
      questionsAttempted: dbSession.questions_attempted,
      questionsCorrect: dbSession.questions_correct,
      totalTimeSeconds: dbSession.total_time_seconds,
      scorePercentage: dbSession.score_percentage || 0,
      status: dbSession.status as SessionStatus,
      startedAt: new Date(dbSession.started_at),
      completedAt: dbSession.completed_at ? new Date(dbSession.completed_at) : undefined,
      questionIds: dbSession.questions_ids || [],
      userAgent: dbSession.user_agent
    };
  }
}