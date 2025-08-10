-- MINIMAL SQL FIX - Only add missing stable_id column
-- ==================================================
-- Copy this to Supabase SQL Editor and run:

-- Add only the missing stable_id column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS stable_id TEXT;

-- Create unique index for stable_id
CREATE UNIQUE INDEX IF NOT EXISTS questions_stable_id_idx ON questions(stable_id);

-- Test the change
SELECT 'stable_id column added successfully!' as status;

-- Show updated structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'questions' 
AND column_name IN ('stable_id', 'topic_id', 'ai_generated');
