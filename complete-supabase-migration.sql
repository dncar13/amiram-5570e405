-- ================================
-- COMPLETE SQL FOR SUPABASE
-- Copy all of this to Supabase SQL Editor
-- ================================

-- 1. Add missing stable_id column to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS stable_id TEXT;

-- 2. Create unique index for stable_id (prevents duplicates)
CREATE UNIQUE INDEX IF NOT EXISTS questions_stable_id_idx ON questions(stable_id);

-- 3. Add listening category if it doesn't exist
INSERT INTO categories (id, name, description, icon, color, order_index) VALUES
(4, 'Listening Skills', 'הבנת הנשמע ועיבוד מידע אודיטיבי', 'headphones', 'bg-green-500', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index;

-- 4. Add listening topics (11-14) if they don't exist
INSERT INTO topics (id, title, description, category_id, order_index) VALUES
(11, 'Listening Comprehension', 'הבנת קטעים מוקלטים ותרגילי הבנה', 4, 1),
(12, 'Listening Continuation', 'השלמת דיאלוגים וקטעי שמע', 4, 2),
(13, 'Audio Analysis', 'ניתוח קטעי אודיו ותוכן מוקלט', 4, 3),
(14, 'Sound Recognition', 'זיהוי צלילים ודפוסי דיבור', 4, 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  order_index = EXCLUDED.order_index;

-- 5. Mark existing questions as non-AI generated (optional cleanup)
UPDATE questions 
SET ai_generated = COALESCE(ai_generated, false) 
WHERE ai_generated IS NULL;

-- 6. Verification queries (will show results after running)
SELECT 'Database migration completed successfully!' as status;

SELECT 'Questions table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'questions' 
AND column_name IN ('stable_id', 'topic_id', 'ai_generated')
ORDER BY column_name;

SELECT 'Categories count:' as info;
SELECT COUNT(*) as total_categories FROM categories;

SELECT 'Topics count:' as info; 
SELECT COUNT(*) as total_topics FROM topics;

SELECT 'Listening topics:' as info;
SELECT id, title FROM topics WHERE category_id = 4 ORDER BY id;
