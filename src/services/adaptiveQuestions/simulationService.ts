
/**
 * Simulation Service
 * 
 * Manages simulation sessions and their lifecycle
 */

import { supabase } from '@/services/supabaseClient';
import { 
  SimulationSession,
  SimulationSessionResult,
  SessionType,
  DifficultyLevel
} from './types';

export class SimulationService {
  async startSession(options: {
    userId: string;
    difficulty: DifficultyLevel;
    sessionType: SessionType;
    questionLimit: number;
    questionGroup?: string[];
  }): Promise<{ sessionId: string }> {
    try {
      const { userId, difficulty, sessionType, questionLimit, questionGroup } = options;

      console.log('[SimulationService] Starting session with options:', {
        userId,
        difficulty,
        sessionType,
        questionLimit,
        questionGroup
      });

      const { data, error } = await supabase
        .from('simulation_sessions')
        .insert({
          user_id: userId,
          session_type: sessionType,
          difficulty: difficulty === 'mixed' ? null : difficulty,
          question_limit: questionLimit,
          questions_attempted: 0,
          questions_correct: 0,
          status: 'in_progress',
          total_time_seconds: 0,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating simulation session:', error);
        throw new Error('Failed to create simulation session');
      }

      console.log('[SimulationService] Session created successfully:', {
        sessionId: data.id,
        questionGroup
      });

      return { sessionId: data.id };
    } catch (error) {
      console.error('Error starting simulation session:', error);
      throw error;
    }
  }

  async completeSession(options: {
    userId: string;
    sessionId: string;
    finalScore: number;
    totalQuestions: number;
    completedAt: Date;
  }): Promise<SimulationSessionResult> {
    try {
      const { userId, sessionId, finalScore, totalQuestions, completedAt } = options;

      const { data, error } = await supabase
        .from('simulation_sessions')
        .update({
          status: 'completed',
          questions_correct: finalScore,
          questions_attempted: totalQuestions,
          completed_at: completedAt.toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error completing simulation session:', error);
        throw new Error('Failed to complete simulation session');
      }

      const accuracy = totalQuestions > 0 ? (finalScore / totalQuestions) * 100 : 0;
      const timeSpent = data.total_time_seconds || 0;

      return {
        sessionId,
        score: finalScore,
        totalQuestions,
        accuracy,
        timeSpent,
        completedAt
      };
    } catch (error) {
      console.error('Error completing simulation session:', error);
      throw error;
    }
  }
}
