import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getFlags, 
  toggleSaved, 
  toggleKnown, 
  getDailyStats,
  VocabularyFlags 
} from '@/services/vocabularyService';

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
  
  // Load vocabulary flags and stats
  const loadData = useCallback(async () => {
    if (wordIds.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Load flags for current words
      const flags = await getFlags(wordIds);
      
      // Update state based on flags
      const newSaved = new Set<string>();
      const newKnown = new Set<string>();
      const newMastery = new Map<string, number>();
      
      flags.forEach((flag, wordId) => {
        if (flag.is_saved) newSaved.add(wordId);
        if (flag.is_known) newKnown.add(wordId);
        newMastery.set(wordId, flag.mastery);
      });
      
      setSaved(newSaved);
      setKnown(newKnown);
      setMastery(newMastery);
      
      // Load daily stats
      const dailyStats = await getDailyStats();
      setStats(dailyStats);
      
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
  }, [wordIds.join(','), toast]);
  
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
    
    try {
      await toggleSaved(wordId, newSavedState);
      
      // Show success toast
      toast({
        title: newSavedState ? "המילה נשמרה!" : "המילה הוסרה מהרשימה",
        description: newSavedState 
          ? "המילה נוספה לרשימת המילים השמורות שלך"
          : "המילה הוסרה מרשימת המילים השמורות",
        duration: 2000
      });
      
    } catch (error) {
      // Rollback on error
      setSaved(saved);
      setStats(prev => ({
        ...prev,
        totalSaved: prev.totalSaved + (newSavedState ? -1 : 1)
      }));
      
      console.error('Error toggling saved status:', error);
      toast({
        title: "שגיאה בשמירה",
        description: "לא הצלחנו לעדכן את המילה. נסה שוב.",
        variant: "destructive"
      });
    }
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
    
    try {
      await toggleKnown(wordId, newKnownState, currentMasteryLevel);
      
      // Show success toast
      toast({
        title: newKnownState ? "מעולה! המילה מוכרת לך" : "המילה הוסרה מהרשימה",
        description: newKnownState 
          ? "המילה סומנה כמוכרת ותופיע פחות בחידונים"
          : "המילה הוסרה מרשימת המילים הידועות",
        duration: 2000
      });
      
    } catch (error) {
      // Rollback on error
      setKnown(known);
      setMastery(mastery);
      setStats(prev => ({
        ...prev,
        totalKnown: prev.totalKnown + (newKnownState ? -1 : 1),
        learnedToday: newKnownState ? prev.learnedToday - 1 : prev.learnedToday
      }));
      
      console.error('Error toggling known status:', error);
      toast({
        title: "שגיאה בעדכון",
        description: "לא הצלחנו לעדכן את המילה. נסה שוב.",
        variant: "destructive"
      });
    }
  }, [known, mastery, toast]);
  
  // Refresh stats manually
  const refreshStats = useCallback(async () => {
    try {
      const dailyStats = await getDailyStats();
      setStats(dailyStats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, []);
  
  // Refresh flags manually
  const refreshFlags = useCallback(async () => {
    if (wordIds.length === 0) return;
    
    try {
      const flags = await getFlags(wordIds);
      
      const newSaved = new Set<string>();
      const newKnown = new Set<string>();
      const newMastery = new Map<string, number>();
      
      flags.forEach((flag, wordId) => {
        if (flag.is_saved) newSaved.add(wordId);
        if (flag.is_known) newKnown.add(wordId);
        newMastery.set(wordId, flag.mastery);
      });
      
      setSaved(newSaved);
      setKnown(newKnown);
      setMastery(newMastery);
      
    } catch (error) {
      console.error('Error refreshing flags:', error);
    }
  }, [wordIds.join(',')]);
  
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