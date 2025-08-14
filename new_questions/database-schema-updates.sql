-- Database Schema Updates for Multi-Question Generator
-- Run these SQL commands in Supabase SQL Editor

-- 1. Add topic_id column to questions table if it doesn't exist
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS stable_id TEXT,
ADD COLUMN IF NOT EXISTS topic_id INTEGER;

-- 2. Create unique index for stable_id
CREATE UNIQUE INDEX IF NOT EXISTS questions_stable_id_idx ON questions(stable_id);

-- 3. Add foreign key constraint to link questions to topics
ALTER TABLE questions 
ADD CONSTRAINT IF NOT EXISTS fk_questions_topic_id 
FOREIGN KEY (topic_id) REFERENCES topics(id);

-- 4. Add listening category (ID 4) if it doesn't exist
INSERT INTO categories (id, name, description, icon, color, order_index, created_at, updated_at) 
VALUES (
  4, 
  'Listening Skills', 
  'Audio comprehension and processing skills', 
  'headphones', 
  'bg-green-500', 
  4,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 5. Add listening topics (IDs 11-14)
INSERT INTO topics (id, title, description, difficulty, category_id, estimated_time, tags, order_index, recommended, created_at, updated_at) VALUES
(11, 'Academic Listening', 'Listening comprehension for academic contexts like lectures and discussions', 'medium', 4, 45, ARRAY['listening', 'academic', 'comprehension'], 11, true, NOW(), NOW()),
(12, 'Workplace Listening', 'Professional workplace conversations and meetings', 'medium', 4, 40, ARRAY['listening', 'workplace', 'business'], 12, true, NOW(), NOW()),
(13, 'Daily Conversation', 'Everyday conversational listening skills', 'easy', 4, 35, ARRAY['listening', 'daily', 'conversation'], 13, true, NOW(), NOW()),
(14, 'Logical Completion', 'Logical sentence completion and reasoning through audio', 'medium', 4, 30, ARRAY['listening', 'reasoning', 'completion'], 14, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Update existing questions to have proper topic_id if they don't have one
-- This is a safe update that only affects questions without topic_id
UPDATE questions 
SET topic_id = CASE 
  WHEN type = 'listening_comprehension' THEN 11
  WHEN type = 'listening_continuation' THEN 14  
  WHEN type = 'word_formation' THEN 6
  WHEN type = 'grammar_in_context' THEN 3
  ELSE 1  -- Default to vocabulary
END
WHERE topic_id IS NULL;

-- 7. Verify the updates
SELECT 
  'Questions with topic_id' as metric,
  COUNT(*) as count
FROM questions 
WHERE topic_id IS NOT NULL

UNION ALL

SELECT 
  'Listening topics created' as metric,
  COUNT(*) as count
FROM topics 
WHERE id BETWEEN 11 AND 14

UNION ALL

SELECT 
  'Categories with listening' as metric,
  COUNT(*) as count
FROM categories 
WHERE name = 'Listening Skills';

-- 8. Show topic distribution for verification
SELECT 
  t.title as topic_title,
  t.id as topic_id,
  COUNT(q.id) as question_count,
  ARRAY_AGG(DISTINCT q.type) as question_types
FROM topics t
LEFT JOIN questions q ON q.topic_id = t.id
WHERE t.id BETWEEN 1 AND 14
GROUP BY t.id, t.title
ORDER BY t.id;