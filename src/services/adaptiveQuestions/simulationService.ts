
/**
 * Simulation Service
 * 
 * Handles simulation session lifecycle and management with Supabase
 */

import { supabase } from '@/services/supabaseClient';
import { Question } from '@/data/types/questionTypes';
import { 
  SimulationSession, 
  StartSimulationRequest, 
  StartSimulationResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  SimulationSessionResult,
  DifficultyLevel,
  SessionType
} from './types';

export class SimulationService {
  async startSession(params: {
    userId: string;
    difficulty: DifficultyLevel;
    sessionType: SessionType;
    questionLimit: number;
    questionGroup?: string[];
  }): Promise<{ sessionId: string }> {
    try {
      const { userId, difficulty, sessionType, questionLimit } = params;
      
      // Create session in database
      const { data: session, error } = await supabase
        .from('simulation_sessions')
        .insert({
          user_id: userId,
          session_type: sessionType,
          difficulty: difficulty === 'mixed' ? 'medium' : difficulty,
          question_limit: questionLimit,
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating simulation session:', error);
        throw error;
      }

      console.log('Simulation session created:', session.id);
      return { sessionId: session.id };
    } catch (error) {
      console.error('Error starting session:', error);
      throw new Error('Failed to start simulation session');
    }
  }

  async startSimulation(userId: string, request: StartSimulationRequest): Promise<StartSimulationResponse> {
    try {
      // Create session first
      const { sessionId } = await this.startSession({
        userId,
        difficulty: request.difficulty || 'medium',
        sessionType: request.sessionType,
        questionLimit: request.questionLimit || 10
      });
      
      // Note: Questions will be fetched by QuestionDeliveryService
      // This service just manages the session lifecycle
      
      return {
        sessionId,
        questions: [], // Will be populated by QuestionDeliveryService
        sessionConfig: {
          sessionType: request.sessionType,
          difficulty: request.difficulty || 'medium',
          totalQuestions: request.questionLimit || 10,
          estimatedTimeMinutes: (request.questionLimit || 10) * 1.5
        },
        deliveryMetadata: {
          totalPoolSize: 0,
          unseenPoolSize: 0,
          algorithmVersion: '1.0.0',
          selectionTimeMs: 25,
          weightFactors: {
            recency: 0.4,
            accuracy: 0.3,
            difficulty: 0.3
          }
        }
      };
    } catch (error) {
      console.error('Error starting simulation:', error);
      throw new Error('Failed to start simulation');
    }
  }

  async submitAnswer(userId: string, request: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    try {
      // Get question from database to verify answer
      const { data: question, error } = await supabase
        .from('questions')
        .select('correct_answer, explanation')
        .eq('original_id', request.questionId)
        .single();

      if (error || !question) {
        console.error('Error fetching question for answer verification:', error);
        throw new Error('Question not found');
      }

      const isCorrect = request.selectedAnswer === question.correct_answer;
      
      // Update session progress
      await this.updateSessionProgress(request.sessionId, isCorrect);

      return {
        isCorrect,
        correctAnswer: question.correct_answer,
        explanation: question.explanation || 'הסבר לא זמין',
        progress: {
          questionsAnswered: 1, // Will be calculated properly in real implementation
          questionsRemaining: 9, // Will be calculated properly in real implementation
          currentAccuracy: isCorrect ? 100 : 0 // Will be calculated properly in real implementation
        },
        nextAction: 'continue'
      };
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw new Error('Failed to submit answer');
    }
  }

  async getActiveSession(userId: string): Promise<SimulationSession | null> {
    try {
      const { data: session, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting active session:', error);
        throw error;
      }

      if (!session) return null;

      return this.convertToSimulationSession(session);
    } catch (error) {
      console.error('Error getting active session:', error);
      throw new Error('Failed to get active session');
    }
  }

  async abandonSession(userId: string, sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('simulation_sessions')
        .update({ 
          status: 'abandoned',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error abandoning session:', error);
        throw error;
      }

      console.log('Session abandoned:', sessionId);
    } catch (error) {
      console.error('Error abandoning session:', error);
      throw new Error('Failed to abandon session');
    }
  }

  async getSessionHistory(userId: string, limit: number): Promise<SimulationSession[]> {
    try {
      const { data: sessions, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting session history:', error);
        throw error;
      }

      return sessions?.map(s => this.convertToSimulationSession(s)) || [];
    } catch (error) {
      console.error('Error getting session history:', error);
      throw new Error('Failed to get session history');
    }
  }

  async completeSession(params: {
    userId: string;
    sessionId: string;
    finalScore: number;
    totalQuestions: number;
    completedAt: Date;
  }): Promise<SimulationSessionResult> {
    try {
      const { userId, sessionId, finalScore, totalQuestions, completedAt } = params;
      
      // Update session as completed
      const { error } = await supabase
        .from('simulation_sessions')
        .update({
          status: 'completed',
          questions_attempted: totalQuestions,
          questions_correct: finalScore,
          completed_at: completedAt.toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error completing session:', error);
        throw error;
      }

      return {
        sessionId,
        score: finalScore,
        totalQuestions,
        accuracy: (finalScore / totalQuestions) * 100,
        timeSpent: 0, // Will be calculated from session data
        completedAt
      };
    } catch (error) {
      console.error('Error completing session:', error);
      throw new Error('Failed to complete session');
    }
  }

  private async updateSessionProgress(sessionId: string, isCorrect: boolean): Promise<void> {
    try {
      // Get current session data
      const { data: session, error: fetchError } = await supabase
        .from('simulation_sessions')
        .select('questions_attempted, questions_correct')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        console.error('Error fetching session for update:', fetchError);
        throw fetchError;
      }

      // Update session progress
      const { error: updateError } = await supabase
        .from('simulation_sessions')
        .update({
          questions_attempted: session.questions_attempted + 1,
          questions_correct: session.questions_correct + (isCorrect ? 1 : 0)
        })
        .eq('id', sessionId);

      if (updateError) {
        console.error('Error updating session progress:', updateError);
        throw updateError;
      }
    } catch (error) {
      console.error('Error updating session progress:', error);
      throw error;
    }
  }

  private convertToSimulationSession(data: any): SimulationSession {
    return {
      id: data.id,
      userId: data.user_id,
      sessionType: data.session_type,
      difficulty: data.difficulty,
      questionLimit: data.question_limit,
      questionsAttempted: data.questions_attempted,
      questionsCorrect: data.questions_correct,
      status: data.status,
      startedAt: new Date(data.started_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : null,
      totalTimeSeconds: data.total_time_seconds
    };
  }
}
