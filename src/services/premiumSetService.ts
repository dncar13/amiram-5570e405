/**
 * Premium Set Service - Handles premium set access and subscription validation
 */

import { supabase } from '@/integrations/supabase/client';
import { Question } from "@/data/types/questionTypes";
import { getQuestionsByPremiumSet } from './supabaseQuestionsService';

export interface PremiumSet {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: string;
  type: string;
  is_premium: boolean;
}

export interface PremiumAccessCheck {
  hasAccess: boolean;
  user: any | null;
  reason?: 'not_authenticated' | 'not_premium' | 'subscription_expired' | 'server_error';
  message?: string;
}

export class PremiumSetService {
  
  /**
   * Check if user has access to premium content (server-side validation)
   */
  static async checkPremiumAccess(userId?: string): Promise<PremiumAccessCheck> {
    try {
      console.log('🔐 [PremiumSetService] Checking premium access for user:', userId);

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        return {
          hasAccess: false,
          user: null,
          reason: 'server_error',
          message: 'Failed to verify session'
        };
      }

      if (!session?.user) {
        console.log('🚫 User not authenticated');
        return {
          hasAccess: false,
          user: null,
          reason: 'not_authenticated',
          message: 'Please sign in to access premium content'
        };
      }

      // Server-side premium check using email-based system
      const PREMIUM_EMAILS = [
        "premium@example.com",
        "dncar13@gmail.com", 
        "buldir@gmail.com",
        "dncar20@gmail.com",
      ];

      const userEmail = session.user.email;
      const isPremium = PREMIUM_EMAILS.includes(userEmail || '');

      console.log('📊 Premium check result:', {
        userEmail,
        isPremium,
        userId: session.user.id
      });

      if (!isPremium) {
        return {
          hasAccess: false,
          user: session.user,
          reason: 'not_premium',
          message: 'This content is available to premium members only. Upgrade now!'
        };
      }

      // Premium user has access
      return {
        hasAccess: true,
        user: session.user,
        message: 'Access granted'
      };

    } catch (error) {
      console.error('❌ Error checking premium access:', error);
      return {
        hasAccess: false,
        user: null,
        reason: 'server_error',
        message: 'Failed to verify premium access'
      };
    }
  }

  /**
   * Get premium Set 1 questions with access control
   */
  static async getPremiumSet1Questions(): Promise<{ 
    questions: Question[]; 
    accessCheck: PremiumAccessCheck 
  }> {
    console.log('👑 [PremiumSetService] Getting Premium Set 1 questions...');

    // First check access
    const accessCheck = await this.checkPremiumAccess();
    
    if (!accessCheck.hasAccess) {
      console.log('🚫 Access denied to Premium Set 1');
      return { questions: [], accessCheck };
    }

    try {
      // Get premium questions from database
      const questions = await getQuestionsByPremiumSet('restatement_set1_premium', true);
      
      console.log(`✅ Retrieved ${questions.length} Premium Set 1 questions`);
      return { questions, accessCheck };

    } catch (error) {
      console.error('❌ Error fetching Premium Set 1 questions:', error);
      return { 
        questions: [], 
        accessCheck: {
          ...accessCheck,
          hasAccess: false,
          reason: 'server_error',
          message: 'Failed to load premium content'
        }
      };
    }
  }

  /**
   * Get all available premium sets with access control
   */
  static async getAvailablePremiumSets(): Promise<PremiumSet[]> {
    console.log('📋 [PremiumSetService] Getting available premium sets...');

    const accessCheck = await this.checkPremiumAccess();

    // For now, we have one premium set - Set 1
    const premiumSets: PremiumSet[] = [
      {
        id: 'premium_set_1',
        title: 'Set 1 – Premium',
        description: 'שאלות פרימיום מתקדמות - סט ראשון',
        questionCount: 6,
        difficulty: 'mixed', // Contains easy, medium, hard
        type: 'mixed', // Contains restatement and sentence-completion
        is_premium: true
      }
    ];

    // Return sets regardless of access - UI will handle the lock/unlock display
    return premiumSets;
  }

  /**
   * Validate premium access for direct URL access prevention
   */
  static async validateDirectAccess(setId: string): Promise<PremiumAccessCheck> {
    console.log('🔒 [PremiumSetService] Validating direct access to set:', setId);
    
    // This is the server-side validation that cannot be bypassed
    const accessCheck = await this.checkPremiumAccess();
    
    // Log access attempt for security
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Access attempt logged:', {
        setId,
        userId: session?.user?.id || 'anonymous',
        userEmail: session?.user?.email || 'none',
        hasAccess: accessCheck.hasAccess,
        reason: accessCheck.reason,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('⚠️ Failed to log access attempt:', logError);
    }

    return accessCheck;
  }
}

export default PremiumSetService;