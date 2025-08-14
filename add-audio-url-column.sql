-- Add audio_url column to questions table
-- Run this in Supabase SQL Editor

-- Add the column if it doesn't exist
ALTER TABLE questions ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_questions_audio_url 
ON questions(audio_url) WHERE audio_url IS NOT NULL;

-- Update existing questions to copy audio_url from metadata
UPDATE questions 
SET audio_url = metadata->>'audio_url'
WHERE metadata->>'audio_url' IS NOT NULL 
  AND audio_url IS NULL;

-- Verify the update
SELECT 
  type,
  COUNT(*) as total,
  COUNT(audio_url) as with_audio_url,
  COUNT(metadata->>'audio_url') as with_metadata_audio
FROM questions 
WHERE type IN ('listening_comprehension', 'listening_continuation', 'word_formation', 'grammar_in_context')
GROUP BY type
ORDER BY type;
