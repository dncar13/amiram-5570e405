/**
 * Question Count Service
 * 
 * Provides accurate question counts for different topics and types
 */

import { supabase } from './supabaseClient';

interface QuestionCountOptions {
  topicId?: number;
  questionType?: string;
  difficulty?: string;
  includeInactive?: boolean;
}

interface TopicQuestionCount {
  topicId: number;
  count: number;
  byDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export class QuestionCountService {
  /**
   * Get question count for a specific topic
   */
  async getTopicQuestionCount(topicId: number, options: QuestionCountOptions = {}): Promise<number> {
    try {
      let query = supabase
        .from('questions')
        .select('id', { count: 'exact', head: true });

      // Apply filters
      if (!options.includeInactive) {
        query = query.eq('is_active', true);
      }

      if (topicId !== 0) { // 0 means mixed/all topics
        query = query.eq('topic_id', topicId);
      }

      if (options.questionType) {
        query = query.eq('type', options.questionType);
      }

      if (options.difficulty) {
        query = query.eq('difficulty', options.difficulty);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error counting questions:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getTopicQuestionCount:', error);
      return 0;
    }
  }

  /**
   * Get question counts for all topics
   */
  async getAllTopicCounts(questionType?: string): Promise<Record<number, number>> {
    try {
      let query = supabase
        .from('questions')
        .select('topic_id')
        .eq('is_active', true);

      if (questionType) {
        query = query.eq('type', questionType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error getting all topic counts:', error);
        return {};
      }

      if (!data) return {};

      // Count questions by topic
      const counts: Record<number, number> = {};
      
      // Initialize all topics with 0
      for (let i = 0; i <= 10; i++) {
        counts[i] = 0;
      }

      // Count actual questions
      data.forEach(question => {
        const topicId = question.topic_id || 0;
        counts[topicId] = (counts[topicId] || 0) + 1;
      });

      // Mixed topic (0) should include all questions
      const totalQuestions = Object.values(counts).reduce((sum, count) => sum + count, 0);
      counts[0] = totalQuestions;

      return counts;
    } catch (error) {
      console.error('Error in getAllTopicCounts:', error);
      return {};
    }
  }

  /**
   * Get detailed topic counts with difficulty breakdown
   */
  async getDetailedTopicCounts(questionType?: string): Promise<TopicQuestionCount[]> {
    try {
      let query = supabase
        .from('questions')
        .select('topic_id, difficulty')
        .eq('is_active', true);

      if (questionType) {
        query = query.eq('type', questionType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error getting detailed topic counts:', error);
        return [];
      }

      if (!data) return [];

      // Group by topic and difficulty
      const topicData: Record<number, TopicQuestionCount> = {};

      data.forEach(question => {
        const topicId = question.topic_id || 0;
        const difficulty = question.difficulty || 'medium';

        if (!topicData[topicId]) {
          topicData[topicId] = {
            topicId,
            count: 0,
            byDifficulty: { easy: 0, medium: 0, hard: 0 }
          };
        }

        topicData[topicId].count++;
        if (difficulty in topicData[topicId].byDifficulty) {
          topicData[topicId].byDifficulty[difficulty as keyof typeof topicData[topicId].byDifficulty]++;
        }
      });

      // Add mixed topic (all topics combined)
      const allTopicsData = Object.values(topicData);
      const mixedCount: TopicQuestionCount = {
        topicId: 0,
        count: allTopicsData.reduce((sum, topic) => sum + topic.count, 0),
        byDifficulty: {
          easy: allTopicsData.reduce((sum, topic) => sum + topic.byDifficulty.easy, 0),
          medium: allTopicsData.reduce((sum, topic) => sum + topic.byDifficulty.medium, 0),
          hard: allTopicsData.reduce((sum, topic) => sum + topic.byDifficulty.hard, 0)
        }
      };

      return [mixedCount, ...Object.values(topicData).filter(topic => topic.topicId !== 0)];
    } catch (error) {
      console.error('Error in getDetailedTopicCounts:', error);
      return [];
    }
  }

  /**
   * Check if a topic has sufficient questions for a simulation
   */
  async checkTopicSufficiency(topicId: number, requiredCount: number, questionType?: string): Promise<{
    hasSufficient: boolean;
    actualCount: number;
    fallbackAvailable: boolean;
    fallbackCount: number;
  }> {
    try {
      // Get count for specific topic
      const actualCount = await this.getTopicQuestionCount(topicId, { questionType });
      
      // Get fallback count (mixed/all topics)
      const fallbackCount = await this.getTopicQuestionCount(0, { questionType });

      return {
        hasSufficient: actualCount >= requiredCount,
        actualCount,
        fallbackAvailable: fallbackCount >= requiredCount,
        fallbackCount
      };
    } catch (error) {
      console.error('Error checking topic sufficiency:', error);
      return {
        hasSufficient: false,
        actualCount: 0,
        fallbackAvailable: false,
        fallbackCount: 0
      };
    }
  }
}

// Export singleton instance
export const questionCountService = new QuestionCountService();