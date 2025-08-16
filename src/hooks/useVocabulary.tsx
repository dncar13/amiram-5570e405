import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Simple interface for vocabulary stats
export interface VocabularyFlags {
  word_id: string;
  is_saved: boolean;
  is_known: boolean;
  mastery: number;
  next_review: string | null;
  last_reviewed: string | null;
}

export interface VocabularyStats {
  learnedToday: number;
  totalKnown: number;
  totalSaved: number;
  needsReview: number;
  streak: number;
}

export interface UseVocabularyReturn {
  // State
  saved: Set<string>;
  known: Set<string>;
  mastery: Map<string, number>;
  loading: boolean;
  stats: VocabularyStats;
  
  // Actions
  onStar: (wordId: string) => Promise<void>;
  onCheck: (wordId: string) => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshFlags: () => Promise<void>;
}

export function useVocabulary(wordIds: string[]): UseVocabularyReturn {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [mastery, setMastery] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VocabularyStats>({
    learnedToday: 0,
    totalKnown: 0,
    totalSaved: 0,
    needsReview: 0,
    streak: 0
  });
  
  const { toast } = useToast();
  
  // Load vocabulary flags and stats (simplified version without database)
  const loadData = useCallback(async () => {
    if (wordIds.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // For now, initialize with empty states
      // TODO: Implement when vocabulary tracking is needed
      setSaved(new Set());
      setKnown(new Set());
      setMastery(new Map());
      
      // Mock stats
      setStats({
        learnedToday: 0,
        totalKnown: 0,
        totalSaved: 0,
        needsReview: 0,
        streak: 0
      });
      
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
      toast({
        title: "שגיאה בטעינת נתונים",
        description: "לא הצלחנו לטעון את נתוני אוצר המילים. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [wordIds, toast]);
  
  // Load data on mount and when wordIds change
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Toggle star (saved) status with optimistic updates
  const onStar = useCallback(async (wordId: string) => {
    const isCurrentlySaved = saved.has(wordId);
    const newSavedState = !isCurrentlySaved;
    
    // Optimistic update
    const newSaved = new Set(saved);
    if (newSavedState) {
      newSaved.add(wordId);
    } else {
      newSaved.delete(wordId);
    }
    setSaved(newSaved);
    
    // Update stats optimistically
    setStats(prev => ({
      ...prev,
      totalSaved: prev.totalSaved + (newSavedState ? 1 : -1)
    }));
    
    // Show success toast immediately (no backend call for now)
    toast({
      title: newSavedState ? "המילה נשמרה!" : "המילה הוסרה מהרשימה",
      description: newSavedState 
        ? "המילה נוספה לרשימת המילים השמורות שלך"
        : "המילה הוסרה מרשימת המילים השמורות",
      duration: 2000
    });
  }, [saved, toast]);
  
  // Toggle check (known) status with optimistic updates
  const onCheck = useCallback(async (wordId: string) => {
    const isCurrentlyKnown = known.has(wordId);
    const newKnownState = !isCurrentlyKnown;
    const currentMasteryLevel = mastery.get(wordId) || 0;
    
    // Optimistic update
    const newKnown = new Set(known);
    if (newKnownState) {
      newKnown.add(wordId);
    } else {
      newKnown.delete(wordId);
    }
    setKnown(newKnown);
    
    // Update mastery optimistically
    const newMastery = new Map(mastery);
    if (newKnownState) {
      newMastery.set(wordId, Math.min(currentMasteryLevel + 1, 5));
    }
    setMastery(newMastery);
    
    // Update stats optimistically
    setStats(prev => ({
      ...prev,
      totalKnown: prev.totalKnown + (newKnownState ? 1 : -1),
      learnedToday: newKnownState ? prev.learnedToday + 1 : prev.learnedToday
    }));
    
    // Show success toast immediately (no backend call for now)
    toast({
      title: newKnownState ? "מעולה! המילה מוכרת לך" : "המילה הוסרה מהרשימה",
      description: newKnownState 
        ? "המילה סומנה כמוכרת ותופיע פחות בחידונים"
        : "המילה הוסרה מרשימת המילים הידועות",
      duration: 2000
    });
  }, [known, mastery, toast]);
  
  // Refresh stats manually
  const refreshStats = useCallback(async () => {
    // Mock refresh for now
    console.log('Stats refreshed');
  }, []);
  
  // Refresh flags manually
  const refreshFlags = useCallback(async () => {
    // Mock refresh for now
    console.log('Flags refreshed');
  }, []);
  
  return {
    saved,
    known,
    mastery,
    loading,
    stats,
    onStar,
    onCheck,
    refreshStats,
    refreshFlags
  };
}