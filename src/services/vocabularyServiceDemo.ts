// Local demo vocabulary service - works without database
export interface VocabularyFlags {
  word_id: string;
  is_saved: boolean;
  is_known: boolean;
  mastery: number;
  next_review: string | null;
  last_reviewed: string | null;
}

export interface DailyStats {
  known: number;
  saved: number;
  reviewed: number;
  needsReview: number;
  streak: number;
}

export interface QuizResult {
  date: string;
  score: number;
  total: number;
  timeSpent: number;
  questions: Array<{
    word: string;
    type: 'spelling' | 'meaning';
    isCorrect: boolean;
    userAnswer: string;
  }>;
}

// In-memory storage for demo mode
class LocalVocabularyStore {
  private flags = new Map<string, VocabularyFlags>();
  private stats = {
    known: 0,
    saved: 0,
    reviewed: 0,
    needsReview: 0,
    streak: 3
  };
  private quizResults: QuizResult[] = [];
  private lastQuizDate: string | null = null;

  constructor() {
    // Load from localStorage if available
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('demo-vocab-flags');
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((item: VocabularyFlags) => {
          this.flags.set(item.word_id, item);
        });
      }
      
      const storedStats = localStorage.getItem('demo-vocab-stats');
      if (storedStats) {
        this.stats = { ...this.stats, ...JSON.parse(storedStats) };
      }

      const storedQuizResults = localStorage.getItem('demo-quiz-results');
      if (storedQuizResults) {
        this.quizResults = JSON.parse(storedQuizResults);
      }

      const storedLastQuizDate = localStorage.getItem('demo-last-quiz-date');
      if (storedLastQuizDate) {
        this.lastQuizDate = storedLastQuizDate;
      }
    } catch (error) {
      console.warn('Could not load demo data from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      const flagsArray = Array.from(this.flags.values());
      localStorage.setItem('demo-vocab-flags', JSON.stringify(flagsArray));
      localStorage.setItem('demo-vocab-stats', JSON.stringify(this.stats));
      localStorage.setItem('demo-quiz-results', JSON.stringify(this.quizResults));
      if (this.lastQuizDate) {
        localStorage.setItem('demo-last-quiz-date', this.lastQuizDate);
      }
    } catch (error) {
      console.warn('Could not save demo data to localStorage:', error);
    }
  }

  getFlags(wordIds: string[]): Map<string, VocabularyFlags> {
    const result = new Map<string, VocabularyFlags>();
    wordIds.forEach(wordId => {
      if (this.flags.has(wordId)) {
        result.set(wordId, this.flags.get(wordId)!);
      }
    });
    return result;
  }

  toggleSaved(wordId: string, isSaved: boolean): void {
    const existing = this.flags.get(wordId);
    if (existing) {
      existing.is_saved = isSaved;
    } else {
      this.flags.set(wordId, {
        word_id: wordId,
        is_saved: isSaved,
        is_known: false,
        mastery: 0,
        next_review: null,
        last_reviewed: null
      });
    }
    
    // Update stats
    this.updateStats();
    this.saveToStorage();
  }

  toggleKnown(wordId: string, isKnown: boolean): void {
    const existing = this.flags.get(wordId);
    if (existing) {
      existing.is_known = isKnown;
    } else {
      this.flags.set(wordId, {
        word_id: wordId,
        is_saved: false,
        is_known: isKnown,
        mastery: isKnown ? 1 : 0,
        next_review: null,
        last_reviewed: new Date().toISOString()
      });
    }
    
    this.updateStats();
    this.saveToStorage();
  }

  updateMastery(wordId: string, isCorrect: boolean, currentMasteryLevel: number): void {
    const newMastery = this.calculateNewMastery(currentMasteryLevel, isCorrect);
    const nextReview = this.schedule(newMastery);
    
    const existing = this.flags.get(wordId);
    if (existing) {
      existing.mastery = newMastery;
      existing.last_reviewed = new Date().toISOString();
      existing.next_review = nextReview.toISOString();
      if (newMastery >= 2) {
        existing.is_known = true;
      }
    } else {
      this.flags.set(wordId, {
        word_id: wordId,
        is_saved: false,
        is_known: newMastery >= 2,
        mastery: newMastery,
        next_review: nextReview.toISOString(),
        last_reviewed: new Date().toISOString()
      });
    }
    
    this.updateStats();
    this.saveToStorage();
  }

  private calculateNewMastery(currentLevel: number, isCorrect: boolean): number {
    if (isCorrect) {
      return Math.min(currentLevel + 1, 5);
    } else {
      return Math.max(currentLevel - 1, 0);
    }
  }

  private schedule(masteryLevel: number): Date {
    const now = new Date();
    const intervals = [1, 3, 7, 14, 30]; // days
    const days = intervals[Math.min(masteryLevel, intervals.length - 1)];
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  }

  private updateStats() {
    const allFlags = Array.from(this.flags.values());
    this.stats.known = allFlags.filter(f => f.is_known).length;
    this.stats.saved = allFlags.filter(f => f.is_saved).length;
    this.stats.reviewed = allFlags.filter(f => f.last_reviewed).length;
    
    const now = new Date();
    this.stats.needsReview = allFlags.filter(f => 
      f.next_review && new Date(f.next_review) <= now
    ).length;
  }

  getDailyStats(): DailyStats {
    this.updateStats();
    return { ...this.stats };
  }

  getWeeklyProgress(): number[] {
    // Return demo weekly progress
    return [5, 8, 12, 15, 18, 22, this.stats.reviewed];
  }

  saveQuizResult(score: number, total: number, timeSpent: number, questions: Array<{question: {word: string; type: string}; isCorrect: boolean; userAnswer: string}>): void {
    const today = new Date().toDateString();
    
    const result: QuizResult = {
      date: today,
      score,
      total,
      timeSpent,
      questions: questions.map(q => ({
        word: q.question.word,
        type: q.question.type as 'spelling' | 'meaning',
        isCorrect: q.isCorrect,
        userAnswer: q.userAnswer
      }))
    };

    this.quizResults.push(result);
    
    // Update streak
    if (this.lastQuizDate) {
      const lastDate = new Date(this.lastQuizDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day - increase streak
        this.stats.streak += 1;
      } else if (diffDays > 1) {
        // Missed days - reset streak
        this.stats.streak = 1;
      }
      // Same day - keep streak as is
    } else {
      // First quiz ever
      this.stats.streak = 1;
    }
    
    this.lastQuizDate = today;
    this.saveToStorage();
  }

  getQuizHistory(): QuizResult[] {
    return [...this.quizResults].reverse(); // Most recent first
  }

  getTodayQuizResult(): QuizResult | null {
    const today = new Date().toDateString();
    return this.quizResults.find(result => result.date === today) || null;
  }

  canTakeQuizToday(): boolean {
    return !this.getTodayQuizResult();
  }
}

// Global instance
const localStore = new LocalVocabularyStore();

// Demo service functions
export async function getFlags(wordIds: string[]): Promise<Map<string, VocabularyFlags>> {
  console.log('🎯 Demo mode: Getting flags for', wordIds.length, 'words');
  return localStore.getFlags(wordIds);
}

export async function toggleSaved(wordId: string, isSaved: boolean): Promise<void> {
  console.log('⭐ Demo mode: Toggling saved for', wordId, '=', isSaved);
  localStore.toggleSaved(wordId, isSaved);
}

export async function toggleKnown(wordId: string, isKnown: boolean): Promise<void> {
  console.log('✅ Demo mode: Toggling known for', wordId, '=', isKnown);
  localStore.toggleKnown(wordId, isKnown);
}

export async function updateMastery(wordId: string, isCorrect: boolean, currentMasteryLevel: number): Promise<void> {
  console.log('📈 Demo mode: Updating mastery for', wordId, 'correct:', isCorrect, 'current:', currentMasteryLevel);
  localStore.updateMastery(wordId, isCorrect, currentMasteryLevel);
}

export async function getDailyStats(): Promise<DailyStats> {
  console.log('📊 Demo mode: Getting daily stats');
  return localStore.getDailyStats();
}

export async function getWeeklyProgress(): Promise<number[]> {
  console.log('📈 Demo mode: Getting weekly progress');
  return localStore.getWeeklyProgress();
}

export async function saveQuizResult(score: number, total: number, timeSpent: number, questions: Array<{question: {word: string; type: string}; isCorrect: boolean; userAnswer: string}>): Promise<void> {
  console.log('🏆 Demo mode: Saving quiz result', { score, total, timeSpent });
  localStore.saveQuizResult(score, total, timeSpent, questions);
}

export async function getQuizHistory(): Promise<QuizResult[]> {
  console.log('📚 Demo mode: Getting quiz history');
  return localStore.getQuizHistory();
}

export async function getTodayQuizResult(): Promise<QuizResult | null> {
  console.log('📅 Demo mode: Getting today quiz result');
  return localStore.getTodayQuizResult();
}

export async function canTakeQuizToday(): Promise<boolean> {
  console.log('❓ Demo mode: Checking if can take quiz today');
  return localStore.canTakeQuizToday();
}
