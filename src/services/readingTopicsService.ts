/**
 * Reading Topics Service
 * Handles topic-related operations for reading comprehension questions
 */

import { supabase } from './supabaseClient';
import { READING_COMPREHENSION_TOPICS } from '@/data/readingComprehensionTopics';

export interface TopicStats {
  topicId: number;
  questionCount: number;
  passageCount: number;
  difficulties: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface UserTopicProgress {
  topicId: number;
  questionsAnswered: number;
  correctAnswers: number;
  totalQuestions: number;
  lastAccessed: Date | null;
}

export class ReadingTopicsService {
  /**
   * Get question counts for each topic
   */
  async getTopicQuestionCounts(): Promise<Record<number, number>> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('topic_id')
        .eq('type', 'reading-comprehension')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching topic counts:', error);
        return {};
      }

      // Count questions per topic
      const counts: Record<number, number> = {};
      data?.forEach(question => {
        const topicId = question.topic_id || 0;
        counts[topicId] = (counts[topicId] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Error getting topic question counts:', error);
      return {};
    }
  }

  /**
   * Get detailed statistics for each topic
   */
  async getTopicStatistics(): Promise<TopicStats[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('topic_id, difficulty, passage_title')
        .eq('type', 'reading-comprehension')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching topic statistics:', error);
        return [];
      }

      // Process statistics per topic
      const statsMap: Record<number, TopicStats> = {};

      data?.forEach(question => {
        const topicId = question.topic_id || 0;
        
        if (!statsMap[topicId]) {
          statsMap[topicId] = {
            topicId,
            questionCount: 0,
            passageCount: 0,
            difficulties: { easy: 0, medium: 0, hard: 0 }
          };
        }

        statsMap[topicId].questionCount++;
        
        // Count difficulties
        const difficulty = question.difficulty || 'medium';
        if (difficulty in statsMap[topicId].difficulties) {
          statsMap[topicId].difficulties[difficulty as keyof typeof statsMap[number]['difficulties']]++;
        }
      });

      // Count unique passages per topic
      const passagesPerTopic: Record<number, Set<string>> = {};
      data?.forEach(question => {
        const topicId = question.topic_id || 0;
        if (!passagesPerTopic[topicId]) {
          passagesPerTopic[topicId] = new Set();
        }
        if (question.passage_title) {
          passagesPerTopic[topicId].add(question.passage_title);
        }
      });

      // Update passage counts
      Object.entries(passagesPerTopic).forEach(([topicId, passages]) => {
        if (statsMap[Number(topicId)]) {
          statsMap[Number(topicId)].passageCount = passages.size;
        }
      });

      return Object.values(statsMap);
    } catch (error) {
      console.error('Error getting topic statistics:', error);
      return [];
    }
  }

  /**
   * Get user's progress for each topic
   */
  async getUserTopicProgress(userId: string): Promise<Record<number, UserTopicProgress>> {
    try {
      // Get user's question history
      const { data: history, error } = await supabase
        .from('user_question_history')
        .select(`
          question_id,
          is_correct,
          answered_at,
          questions!inner (
            topic_id,
            type
          )
        `)
        .eq('user_id', userId)
        .eq('questions.type', 'reading-comprehension');

      if (error) {
        console.error('Error fetching user progress:', error);
        return {};
      }

      // Get total questions per topic
      const topicCounts = await this.getTopicQuestionCounts();

      // Process user progress
      const progressMap: Record<number, UserTopicProgress> = {};

      // Initialize progress for all topics
      READING_COMPREHENSION_TOPICS.forEach(topic => {
        progressMap[topic.id] = {
          topicId: topic.id,
          questionsAnswered: 0,
          correctAnswers: 0,
          totalQuestions: topicCounts[topic.id] || 0,
          lastAccessed: null
        };
      });

      // Add mixed topic
      progressMap[0] = {
        topicId: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        totalQuestions: Object.values(topicCounts).reduce((sum, count) => sum + count, 0),
        lastAccessed: null
      };

      // Process history
      history?.forEach(record => {
        const topicId = record.questions?.topic_id || 0;
        
        if (!progressMap[topicId]) {
          progressMap[topicId] = {
            topicId,
            questionsAnswered: 0,
            correctAnswers: 0,
            totalQuestions: topicCounts[topicId] || 0,
            lastAccessed: null
          };
        }

        progressMap[topicId].questionsAnswered++;
        if (record.is_correct) {
          progressMap[topicId].correctAnswers++;
        }

        // Update last accessed date
        const answeredDate = new Date(record.answered_at);
        if (!progressMap[topicId].lastAccessed || answeredDate > progressMap[topicId].lastAccessed!) {
          progressMap[topicId].lastAccessed = answeredDate;
        }

        // Also update mixed topic stats
        progressMap[0].questionsAnswered++;
        if (record.is_correct) {
          progressMap[0].correctAnswers++;
        }
        if (!progressMap[0].lastAccessed || answeredDate > progressMap[0].lastAccessed!) {
          progressMap[0].lastAccessed = answeredDate;
        }
      });

      return progressMap;
    } catch (error) {
      console.error('Error getting user topic progress:', error);
      return {};
    }
  }

  /**
   * Get reading comprehension questions for a specific topic
   */
  async getQuestionsByTopic(topicId: number, limit?: number): Promise<any[]> {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('type', 'reading-comprehension')
        .eq('is_active', true);

      // Filter by topic if not mixed (0)
      if (topicId !== 0) {
        query = query.eq('topic_id', topicId);
      }

      // Apply limit if specified
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions by topic:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting questions by topic:', error);
      return [];
    }
  }
}

// Export singleton instance
export const readingTopicsService = new ReadingTopicsService();