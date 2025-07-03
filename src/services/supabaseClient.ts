/**
 * Shared Supabase Client Instance
 * 
 * This ensures all services use the same Supabase client instance
 * to avoid multiple client warnings and potential auth conflicts.
 */

import { createClient } from '@supabase/supabase-js';

// Create a single shared Supabase client instance
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default supabase;