import { supabase } from '@/integrations/supabase/client';
import type { Difficulty, Mode } from '@/constants/listening';

export async function fetchQuestionsFor(
  types: string[],
  level: Difficulty,
  mode: Mode,
  opts?: { readingNoAudio?: boolean }
) {
  const limit = mode === 'free' ? 5 : 100;
  let q = supabase.from('questions').select('*').in('type', types).eq('difficulty', level);
  // No audio filter here; per spec, grammar-context never requires audio
  const { data, error } = await q.limit(limit);
  if (error) throw error;
  return data ?? [];
}
