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
   * Get premium set questions with access control (dynamic set support)
   */
  static async getPremiumSetQuestions(setId: string): Promise<{ 
    questions: Question[]; 
    accessCheck: PremiumAccessCheck 
  }> {
    console.log(`👑 [PremiumSetService] Getting questions for premium set: ${setId}`);

    // First check access
    const accessCheck = await this.checkPremiumAccess();
    
    if (!accessCheck.hasAccess) {
      console.log(`🚫 Access denied to premium set: ${setId}`);
      return { questions: [], accessCheck };
    }

    try {
      // Get premium questions from database by set_id
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_premium', true)
        .filter('metadata->set_id', 'eq', setId)
        .order('metadata->set_order', { ascending: true });
        
      if (error) {
        console.error(`❌ Error fetching questions for set ${setId}:`, error);
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
      
      if (!questionsData || questionsData.length === 0) {
        console.log(`⚠️ No questions found for premium set: ${setId}`);
        return {
          questions: [],
          accessCheck: {
            ...accessCheck,
            hasAccess: false,
            reason: 'server_error',
            message: 'Premium set is empty or not found'
          }
        };
      }
      
      // Transform database questions to app format
      const questions = questionsData.map(q => ({
        id: q.id,
        text: q.question_text,
        options: Array.isArray(q.answer_options) 
          ? q.answer_options 
          : JSON.parse(q.answer_options || '[]'),
        correctAnswer: parseInt(q.correct_answer),
        explanation: q.explanation || '',
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
        type: q.type as 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'vocabulary',
        passageText: q.passage_content,
        passageTitle: q.passage_title,
        topicId: q.topic_id,
        is_premium: q.is_premium || false,
        ai_generated: q.ai_generated || false,
        generation_model: q.generation_model || undefined,
        batch_id: q.batch_id || undefined,
        quality_score: q.quality_score || undefined,
        tags: [],
        metadata: q.metadata || {}
      }));
      
      console.log(`✅ Retrieved ${questions.length} questions for premium set: ${setId}`);
      return { questions, accessCheck };

    } catch (error) {
      console.error(`❌ Error fetching premium set questions for ${setId}:`, error);
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
   * Get premium Set 1 questions (legacy method for backward compatibility)
   */
  static async getPremiumSet1Questions(): Promise<{ 
    questions: Question[]; 
    accessCheck: PremiumAccessCheck 
  }> {
    // Try to find the first available premium set
    const premiumSets = await this.getAvailablePremiumSets();
    const firstSet = premiumSets[0];
    
    if (!firstSet) {
      const accessCheck = await this.checkPremiumAccess();
      return {
        questions: [],
        accessCheck: {
          ...accessCheck,
          hasAccess: false,
          reason: 'server_error',
          message: 'No premium sets found'
        }
      };
    }
    
    return this.getPremiumSetQuestions(firstSet.id);
  }

  /**
   * Get premium sets by type and difficulty from database
   */
  static async getPremiumSetsByTypeAndDifficulty(type?: string, difficulty?: string): Promise<PremiumSet[]> {
    console.log('📋 [PremiumSetService] Getting premium sets from database...', { type, difficulty });
    
    try {
      let query = supabase
        .from('questions')
        .select('metadata, type, difficulty, is_premium')
        .eq('is_premium', true)
        .not('metadata->set_id', 'is', null);
      
      // Apply filters if provided
      if (type) {
        query = query.eq('type', type);
      }
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      
      const { data: questions, error } = await query;
      
      if (error) {
        console.error('❌ Error fetching premium questions:', error);
        return [];
      }
      
      if (!questions || questions.length === 0) {
        console.log('📋 No premium questions found with given filters');
        return [];
      }
      
      // Group questions by set_id to create set summaries
      const setsMap = new Map<string, {
        setId: string;
        title: string;
        description: string;
        questions: any[];
        types: Set<string>;
        difficulties: Set<string>;
      }>();
      
      questions.forEach(question => {
        const metadata = question.metadata as any;
        const setId = metadata?.set_id;
        
        if (!setId) return;
        
        if (!setsMap.has(setId)) {
          // Create title from set metadata or generate from setId
          const setNumber = metadata?.set_number || setId.match(/\d+/)?.[0] || '1';
          const title = metadata?.set_title || `Set ${setNumber} – Premium`;
          const description = metadata?.set_description || `שאלות פרימיום מתקדמות - סט ${setNumber}`;
          
          setsMap.set(setId, {
            setId,
            title,
            description,
            questions: [],
            types: new Set(),
            difficulties: new Set()
          });
        }
        
        const setData = setsMap.get(setId)!;
        setData.questions.push(question);
        setData.types.add(question.type);
        setData.difficulties.add(question.difficulty);
      });
      
      // Convert to PremiumSet format
      const premiumSets: PremiumSet[] = Array.from(setsMap.values()).map(setData => {
        const typeArray = Array.from(setData.types);
        const difficultyArray = Array.from(setData.difficulties);
        
        return {
          id: setData.setId,
          title: setData.title,
          description: setData.description,
          questionCount: setData.questions.length,
          difficulty: difficultyArray.length === 1 ? difficultyArray[0] : 'mixed',
          type: typeArray.length === 1 ? typeArray[0] : 'mixed',
          is_premium: true
        };
      });
      
      console.log(`✅ Found ${premiumSets.length} premium sets with real data:`, 
        premiumSets.map(set => ({ id: set.id, count: set.questionCount })));
      
      return premiumSets;
      
    } catch (error) {
      console.error('❌ Error in getPremiumSetsByTypeAndDifficulty:', error);
      return [];
    }
  }
  
  /**
   * Get all available premium sets (legacy method for backward compatibility)
   */
  static async getAvailablePremiumSets(): Promise<PremiumSet[]> {
    return this.getPremiumSetsByTypeAndDifficulty();
  }

  /**
   * Get detailed information about a specific premium set
   */
  static async getPremiumSetDetails(setId: string): Promise<PremiumSet | null> {
    console.log(`🔍 [PremiumSetService] Getting details for set: ${setId}`);
    
    try {
      const { data: questions, error } = await supabase
        .from('questions')
        .select('metadata, type, difficulty, is_premium')
        .eq('is_premium', true)
        .filter('metadata->set_id', 'eq', setId);
      
      if (error || !questions || questions.length === 0) {
        console.log(`❌ Set not found or error: ${setId}`, error);
        return null;
      }
      
      const metadata = questions[0].metadata as any;
      const types = new Set(questions.map(q => q.type));
      const difficulties = new Set(questions.map(q => q.difficulty));
      
      const setNumber = metadata?.set_number || setId.match(/\d+/)?.[0] || '1';
      const title = metadata?.set_title || `Set ${setNumber} – Premium`;
      const description = metadata?.set_description || `שאלות פרימיום מתקדמות - סט ${setNumber}`;
      
      return {
        id: setId,
        title,
        description,
        questionCount: questions.length,
        difficulty: difficulties.size === 1 ? Array.from(difficulties)[0] : 'mixed',
        type: types.size === 1 ? Array.from(types)[0] : 'mixed',
        is_premium: true
      };
      
    } catch (error) {
      console.error(`❌ Error getting set details for ${setId}:`, error);
      return null;
    }
  }
  
  /**
   * Validate premium access for direct URL access prevention
   */
  static async validateDirectAccess(setId: string): Promise<PremiumAccessCheck> {
    console.log('🔒 [PremiumSetService] Validating direct access to set:', setId);
    
    // First verify the set actually exists
    const setDetails = await this.getPremiumSetDetails(setId);
    if (!setDetails) {
      console.log(`❌ Premium set not found: ${setId}`);
      return {
        hasAccess: false,
        user: null,
        reason: 'server_error',
        message: 'Premium set not found'
      };
    }
    
    // This is the server-side validation that cannot be bypassed
    const accessCheck = await this.checkPremiumAccess();
    
    // Log access attempt for security
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Access attempt logged:', {
        setId,
        setExists: !!setDetails,
        questionCount: setDetails.questionCount,
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