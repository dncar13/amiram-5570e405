-- database-migration.sql - Database schema updates for enhanced question generator
-- Run this in your Supabase SQL editor

-- 1. Add missing columns to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS stable_id TEXT,
ADD COLUMN IF NOT EXISTS topic_id INTEGER;

-- 2. Create unique index for stable_id
CREATE UNIQUE INDEX IF NOT EXISTS questions_stable_id_idx ON questions(stable_id);

-- 3. Add foreign key constraint for topic_id (optional - depends on your schema)
-- ALTER TABLE questions ADD CONSTRAINT fk_questions_topic_id FOREIGN KEY (topic_id) REFERENCES topics(id);

-- 4. Add listening category if not exists
INSERT INTO categories (id, name, description, icon, color, order_index) VALUES
(4, 'Listening Skills', 'הבנת הנשמע ועיבוד מידע אודיטיבי', 'headphones', 'bg-green-500', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 5. Add new listening topics
INSERT INTO topics (id, title, description, difficulty, category_id, estimated_time, tags, order_index, recommended) VALUES
(11, 'Listening - Academic Content', 'הבנת הנשמע ברמה אקדמית - הרצאות ודיונים', 'medium', 4, 45, ARRAY['listening', 'academic'], 11, true),
(12, 'Listening - Workplace Situations', 'הבנת הנשמע בסביבת עבודה - פגישות ושיחות מקצועיות', 'medium', 4, 40, ARRAY['listening', 'workplace'], 12, true),
(13, 'Listening - Daily Conversations', 'הבנת הנשמע יומיומית - שיחות חברתיות ומצבי חיים', 'easy', 4, 35, ARRAY['listening', 'daily'], 13, true),
(14, 'Listening - Logical Completion', 'השלמת משפטים בהקשר הגיוני - חשיבה לוגית', 'medium', 4, 30, ARRAY['listening', 'reasoning'], 14, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  category_id = EXCLUDED.category_id,
  estimated_time = EXCLUDED.estimated_time,
  tags = EXCLUDED.tags,
  order_index = EXCLUDED.order_index,
  recommended = EXCLUDED.recommended,
  updated_at = NOW();

-- 6. Update existing questions to have stable_id if missing
UPDATE questions 
SET stable_id = COALESCE(stable_id, 'legacy_' || id::text)
WHERE stable_id IS NULL;

-- 7. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_ai_generated ON questions(ai_generated);

-- 8. Create view for question statistics
CREATE OR REPLACE VIEW question_stats AS
SELECT 
    type,
    difficulty,
    topic_id,
    COUNT(*) as question_count,
    COUNT(CASE WHEN ai_generated THEN 1 END) as ai_generated_count,
    AVG(CASE WHEN metadata->>'audio_url' IS NOT NULL THEN 1 ELSE 0 END) as audio_percentage
FROM questions 
GROUP BY type, difficulty, topic_id;

-- 9. Create function to get questions by topic with audio info
CREATE OR REPLACE FUNCTION get_questions_with_audio(
    p_topic_id INTEGER DEFAULT NULL,
    p_type TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    stable_id TEXT,
    type TEXT,
    question_text TEXT,
    answer_options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    difficulty TEXT,
    topic_id INTEGER,
    audio_url TEXT,
    created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.stable_id,
        q.type,
        q.question_text,
        q.answer_options,
        q.correct_answer,
        q.explanation,
        q.difficulty,
        q.topic_id,
        q.metadata->>'audio_url' as audio_url,
        q.created_at
    FROM questions q
    WHERE 
        (p_topic_id IS NULL OR q.topic_id = p_topic_id)
        AND (p_type IS NULL OR q.type = p_type)
    ORDER BY q.created_at DESC
    LIMIT p_limit;
END;
$$;

-- 10. Grant necessary permissions (adjust role name as needed)
-- GRANT SELECT, INSERT, UPDATE ON questions TO your_role;
-- GRANT USAGE ON SEQUENCE questions_id_seq TO your_role;

-- 11. Add comments for documentation
COMMENT ON COLUMN questions.stable_id IS 'Stable identifier for question deduplication and upserts';
COMMENT ON COLUMN questions.topic_id IS 'Foreign key to topics table for categorization';
COMMENT ON INDEX questions_stable_id_idx IS 'Unique index for stable_id to prevent duplicates';

-- 12. Verify the migration
SELECT 
    'questions' as table_name,
    COUNT(*) as total_questions,
    COUNT(stable_id) as with_stable_id,
    COUNT(topic_id) as with_topic_id,
    COUNT(CASE WHEN metadata->>'audio_url' IS NOT NULL THEN 1 END) as with_audio
FROM questions;

-- Show new topics
SELECT id, title, description, category_id, tags 
FROM topics 
WHERE id >= 11 
ORDER BY id;

-- Show categories
SELECT id, name, description 
FROM categories 
ORDER BY order_index;
