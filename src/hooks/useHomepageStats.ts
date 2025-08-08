import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TopicStat {
  id: number;
  name: string;
  questions: number;
  difficulty_levels: number;
}

export interface HomepageStatsResult {
  total_questions: number;
  total_topics: number;
  simulations_display: number;
  question_sets: number;
  topics: TopicStat[];
}

export const useHomepageStats = () => {
  const [data, setData] = useState<HomepageStatsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const { data, error } = await supabase.rpc('get_public_homepage_stats');
        if (error) throw error;
        if (isMounted) {
          setData((data as unknown) as HomepageStatsResult);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load stats');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  return { data, loading, error };
};
