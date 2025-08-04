-- Add columns for live simulation tracking to existing simulation_sessions table
ALTER TABLE public.simulation_sessions 
ADD COLUMN IF NOT EXISTS current_question_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS progress_percentage FLOAT DEFAULT 0;

-- Create index for fast lookups of active sessions
CREATE INDEX IF NOT EXISTS idx_simulation_sessions_active 
ON public.simulation_sessions(user_id, is_completed, updated_at DESC);

-- Update existing records to have is_completed = true (they're already completed)
UPDATE public.simulation_sessions 
SET is_completed = TRUE, status = 'completed' 
WHERE completed_at IS NOT NULL AND is_completed IS NULL;