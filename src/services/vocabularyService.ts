import { supabase } from '@/integrations/supabase/client';

// SRS (Spaced Repetition System) intervals in days
const SRS_INTERVALS = [1, 3, 7, 14, 30];

// Helper function to add days to current date
const addDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Calculate next review date and mastery level based on SRS
export function schedule(currentMastery: number, isCorrect: boolean): { mastery: number; next_review: string } {
  let newMastery = currentMastery;
  
  if (isCorrect) {
    newMastery = Math.min(currentMastery + 1, 5);
    const intervalIndex = Math.max(newMastery - 1, 0);
    const daysUntilNext = SRS_INTERVALS[intervalIndex] || 30;
    return {
      mastery: newMastery,
      next_review: addDays(daysUntilNext)
    };
  } else {
    newMastery = Math.max(currentMastery - 1, 0);
    return {
      mastery: newMastery,
      next_review: new Date().toISOString() // Review immediately
    };
  }
}

// Get current user ID
async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('No authenticated user found');
  }
  return data.user.id;
}

// Interface for vocabulary flags
export interface VocabularyFlags {
  word_id: string;
  is_saved: boolean;
  is_known: boolean;
  mastery: number;
  next_review: string | null;
  last_reviewed: string | null;
}

// Get flags (saved/known status) for multiple words
export async function getFlags(wordIds: string[]): Promise<Map<string, VocabularyFlags>> {
  try {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('user_vocabulary')
      .select('word_id, is_saved, is_known, mastery, next_review, last_reviewed')
      .eq('user_id', userId)
      .in('word_id', wordIds);
      
    if (error) throw error;
    
    const flagsMap = new Map<string, VocabularyFlags>();
    data?.forEach(row => {
      flagsMap.set(row.word_id, row as VocabularyFlags);
    });
    
    return flagsMap;
  } catch (error) {
    console.error('Error fetching vocabulary flags:', error);
    return new Map();
  }
}

// Toggle saved status for a word
export async function toggleSaved(wordId: string, isSaved: boolean): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    
    const { error } = await supabase
      .from('user_vocabulary')
      .upsert(
        {
          user_id: userId,
          word_id: wordId,
          is_saved: isSaved,
        },
        {
          onConflict: 'user_id, word_id'
        }
      );
      
    if (error) throw error;
  } catch (error) {
    console.error('Error toggling saved status:', error);
    throw error;
  }
}

// Toggle known status for a word (with SRS update)
export async function toggleKnown(
  wordId: string, 
  isKnown: boolean, 
  currentMastery: number = 0
): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    
    const updateData: any = {
      user_id: userId,
      word_id: wordId,
      is_known: isKnown,
    };
    
    // If marking as known, update SRS data
    if (isKnown) {
      const srsData = schedule(currentMastery, true);
      updateData.mastery = srsData.mastery;
      updateData.next_review = srsData.next_review;
      updateData.last_reviewed = new Date().toISOString();
      updateData.review_count = 1;
      updateData.correct_count = 1;
    }
    
    const { error } = await supabase
      .from('user_vocabulary')
      .upsert(updateData, {
        onConflict: 'user_id, word_id'
      });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error toggling known status:', error);
    throw error;
  }
}

// Update mastery after quiz/practice (for SRS)
export async function updateMastery(
  wordId: string, 
  isCorrect: boolean, 
  currentMastery: number = 0
): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    const srsData = schedule(currentMastery, isCorrect);
    
    const { data: existingData } = await supabase
      .from('user_vocabulary')
      .select('review_count, correct_count')
      .eq('user_id', userId)
      .eq('word_id', wordId)
      .single();
    
    const reviewCount = (existingData?.review_count || 0) + 1;
    const correctCount = (existingData?.correct_count || 0) + (isCorrect ? 1 : 0);
    
    const { error } = await supabase
      .from('user_vocabulary')
      .upsert({
        user_id: userId,
        word_id: wordId,
        mastery: srsData.mastery,
        next_review: srsData.next_review,
        last_reviewed: new Date().toISOString(),
        review_count: reviewCount,
        correct_count: correctCount,
      }, {
        onConflict: 'user_id, word_id'
      });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error updating mastery:', error);
    throw error;
  }
}

// Get daily statistics for progress tracking
export async function getDailyStats(): Promise<{
  learnedToday: number;
  totalKnown: number;
  totalSaved: number;
  needsReview: number;
  streak: number;
}> {
  try {
    const userId = await getCurrentUserId();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get all user vocabulary data
    const { data, error } = await supabase
      .from('user_vocabulary')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    const now = new Date();
    const todayStart = new Date(today + 'T00:00:00Z');
    
    const stats = {
      learnedToday: 0,
      totalKnown: 0,
      totalSaved: 0,
      needsReview: 0,
      streak: 0
    };
    
    data?.forEach(row => {
      // Count known words
      if (row.is_known) {
        stats.totalKnown++;
        
        // Check if learned today
        if (row.last_reviewed && new Date(row.last_reviewed) >= todayStart) {
          stats.learnedToday++;
        }
      }
      
      // Count saved words
      if (row.is_saved) {
        stats.totalSaved++;
      }
      
      // Count words that need review
      if (row.next_review && new Date(row.next_review) <= now) {
        stats.needsReview++;
      }
    });
    
    // Calculate streak (simplified - just check if user learned anything in consecutive days)
    // This is a basic implementation - could be enhanced with proper date tracking
    stats.streak = await calculateStreak(userId);
    
    return stats;
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    return {
      learnedToday: 0,
      totalKnown: 0,
      totalSaved: 0,
      needsReview: 0,
      streak: 0
    };
  }
}

// Calculate learning streak (simplified version)
async function calculateStreak(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_vocabulary')
      .select('last_reviewed')
      .eq('user_id', userId)
      .not('last_reviewed', 'is', null)
      .order('last_reviewed', { ascending: false })
      .limit(30); // Check last 30 days
      
    if (error || !data || data.length === 0) return 0;
    
    // Simple streak calculation: count consecutive days with activity
    let streak = 0;
    const today = new Date();
    const reviewDates = data.map(row => new Date(row.last_reviewed!).toDateString());
    const uniqueDates = [...new Set(reviewDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      if (uniqueDates.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

// Get words that need review (for spaced repetition)
export async function getWordsForReview(limit: number = 10): Promise<string[]> {
  try {
    const userId = await getCurrentUserId();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('user_vocabulary')
      .select('word_id')
      .eq('user_id', userId)
      .lte('next_review', now)
      .order('next_review', { ascending: true })
      .limit(limit);
      
    if (error) throw error;
    
    return data?.map(row => row.word_id) || [];
  } catch (error) {
    console.error('Error fetching words for review:', error);
    return [];
  }
}

// Get words by mastery level (for progressive learning)
export async function getWordsByMastery(mastery: number, limit: number = 10): Promise<string[]> {
  try {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('user_vocabulary')
      .select('word_id')
      .eq('user_id', userId)
      .eq('mastery', mastery)
      .limit(limit);
      
    if (error) throw error;
    
    return data?.map(row => row.word_id) || [];
  } catch (error) {
    console.error('Error fetching words by mastery:', error);
    return [];
  }
}