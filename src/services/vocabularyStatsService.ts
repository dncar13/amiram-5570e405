import { supabase } from '@/integrations/supabase/client';

export interface VocabularyStats {
  totalWords: number;
  knownWords: number;
  streak: number;
  accuracy: number;
  wordsThisWeek: number;
  progressToNext: number;
  learnedToday: number;
  totalSaved: number;
  needsReview: number;
}

// Get current user ID or return null for anonymous users
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null; // Anonymous user
    }
    return data.user.id;
  } catch (error) {
    console.warn('Error getting user:', error);
    return null;
  }
}

// Get vocabulary statistics for authenticated users
export async function getVocabularyStats(): Promise<VocabularyStats> {
  const userId = await getCurrentUserId();
  
  // Default stats for anonymous users
  const defaultStats: VocabularyStats = {
    totalWords: 120,
    knownWords: 0,
    streak: 0,
    accuracy: 0,
    wordsThisWeek: 0,
    progressToNext: 0,
    learnedToday: 0,
    totalSaved: 0,
    needsReview: 0
  };

  if (!userId) {
    // For anonymous users, check localStorage for any saved data
    try {
      const localStats = localStorage.getItem('vocab_stats_anonymous');
      if (localStats) {
        const parsed = JSON.parse(localStats);
        return { ...defaultStats, ...parsed };
      }
    } catch (error) {
      console.warn('Error reading local stats:', error);
    }
    return defaultStats;
  }

  try {
    // For authenticated users, get data from database
    const { data: vocabularyData, error: vocabError } = await supabase
      .from('user_vocabulary')
      .select('*')
      .eq('user_id', userId);

    if (vocabError) {
      console.error('Error fetching vocabulary data:', vocabError);
      return defaultStats;
    }

    // Get user progress data for accuracy calculation
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('answered_correctly, answered_at')
      .eq('user_id', userId);

    if (progressError) {
      console.warn('Error fetching progress data:', progressError);
    }

    // Calculate statistics
    const stats = calculateStats(vocabularyData || [], progressData || []);
    
    return {
      ...defaultStats,
      ...stats
    };
  } catch (error) {
    console.error('Error fetching vocabulary stats:', error);
    return defaultStats;
  }
}

// Calculate statistics from raw data
function calculateStats(vocabularyData: any[], progressData: any[]): Partial<VocabularyStats> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Vocabulary statistics
  const knownWords = vocabularyData.filter(item => item.is_known).length;
  const totalSaved = vocabularyData.filter(item => item.is_saved).length;
  const needsReview = vocabularyData.filter(item => 
    item.next_review && new Date(item.next_review) <= now
  ).length;

  // Today's learned words
  const learnedToday = vocabularyData.filter(item => 
    item.last_reviewed && new Date(item.last_reviewed) >= todayStart
  ).length;

  // Calculate streak (simplified - consecutive days with activity)
  let streak = 0;
  const activityDates = vocabularyData
    .filter(item => item.last_reviewed)
    .map(item => new Date(item.last_reviewed).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index) // unique dates
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  for (let i = 0; i < activityDates.length; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() - i);
    
    if (activityDates.includes(checkDate.toDateString())) {
      streak++;
    } else {
      break;
    }
  }

  // Calculate accuracy from progress data
  let accuracy = 0;
  if (progressData.length > 0) {
    const correct = progressData.filter(item => item.answered_correctly).length;
    accuracy = Math.round((correct / progressData.length) * 100);
  }

  // Words this week
  const wordsThisWeek = vocabularyData.filter(item =>
    item.last_reviewed && new Date(item.last_reviewed) >= weekStart
  ).length;

  // Progress to next level (based on known words out of total)
  const progressToNext = knownWords > 0 ? Math.round((knownWords / 120) * 100) : 0;

  return {
    knownWords,
    streak,
    accuracy,
    wordsThisWeek,
    progressToNext,
    learnedToday,
    totalSaved,
    needsReview
  };
}

// Save vocabulary stats to localStorage for anonymous users
export function saveAnonymousStats(stats: Partial<VocabularyStats>): void {
  try {
    const currentStats = localStorage.getItem('vocab_stats_anonymous');
    const merged = currentStats ? { ...JSON.parse(currentStats), ...stats } : stats;
    localStorage.setItem('vocab_stats_anonymous', JSON.stringify(merged));
  } catch (error) {
    console.warn('Error saving anonymous stats:', error);
  }
}

// Update user vocabulary progress (for both authenticated and anonymous users)
export async function updateVocabularyProgress(
  wordId: string, 
  isCorrect: boolean, 
  isKnown?: boolean,
  isSaved?: boolean
): Promise<void> {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    // For anonymous users, update localStorage
    updateAnonymousProgress(wordId, isCorrect, isKnown, isSaved);
    return;
  }

  try {
    // Update user_vocabulary table
    if (isKnown !== undefined || isSaved !== undefined) {
      const updateData: any = {};
      if (isKnown !== undefined) updateData.is_known = isKnown;
      if (isSaved !== undefined) updateData.is_saved = isSaved;
      if (isKnown) {
        updateData.last_reviewed = new Date().toISOString();
        updateData.review_count = 1;
        updateData.correct_count = isCorrect ? 1 : 0;
      }

      await supabase
        .from('user_vocabulary')
        .upsert({
          user_id: userId,
          word_id: wordId,
          ...updateData
        }, {
          onConflict: 'user_id, word_id'
        });
    }

    // Record progress in user_progress table
    await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        question_id: wordId, // Using word_id as question_id for vocabulary
        answered_correctly: isCorrect,
        answered_at: new Date().toISOString()
      });

  } catch (error) {
    console.error('Error updating vocabulary progress:', error);
  }
}

// Update progress for anonymous users in localStorage
function updateAnonymousProgress(
  wordId: string, 
  isCorrect: boolean, 
  isKnown?: boolean,
  isSaved?: boolean
): void {
  try {
    // Get current anonymous data
    const vocabData = JSON.parse(localStorage.getItem('vocab_anonymous_data') || '{}');
    const progressData = JSON.parse(localStorage.getItem('vocab_anonymous_progress') || '[]');
    
    // Update vocabulary data
    if (!vocabData[wordId]) {
      vocabData[wordId] = {
        word_id: wordId,
        is_known: false,
        is_saved: false,
        review_count: 0,
        correct_count: 0
      };
    }
    
    if (isKnown !== undefined) {
      vocabData[wordId].is_known = isKnown;
      if (isKnown) {
        vocabData[wordId].last_reviewed = new Date().toISOString();
        vocabData[wordId].review_count = (vocabData[wordId].review_count || 0) + 1;
        if (isCorrect) {
          vocabData[wordId].correct_count = (vocabData[wordId].correct_count || 0) + 1;
        }
      }
    }
    
    if (isSaved !== undefined) {
      vocabData[wordId].is_saved = isSaved;
    }

    // Add progress entry
    progressData.push({
      word_id: wordId,
      answered_correctly: isCorrect,
      answered_at: new Date().toISOString()
    });

    // Save back to localStorage
    localStorage.setItem('vocab_anonymous_data', JSON.stringify(vocabData));
    localStorage.setItem('vocab_anonymous_progress', JSON.stringify(progressData));

    // Update stats
    const vocabArray = Object.values(vocabData) as any[];
    const stats = calculateStats(vocabArray, progressData);
    saveAnonymousStats(stats);
    
  } catch (error) {
    console.warn('Error updating anonymous progress:', error);
  }
}