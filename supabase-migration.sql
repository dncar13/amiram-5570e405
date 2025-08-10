-- COPY THIS EXACT SQL TO SUPABASE SQL EDITOR
-- ===============================================

-- 1. Add missing columns to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS stable_id TEXT,
ADD COLUMN IF NOT EXISTS topic_id INTEGER;

-- 2. Create unique index for stable_id
CREATE UNIQUE INDEX IF NOT EXISTS questions_stable_id_idx ON questions(stable_id);

-- 3. Add listening category if not exists
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

-- 5. Update existing questions to mark them as non-AI generated (optional)
UPDATE questions SET ai_generated = false WHERE ai_generated IS NULL;

-- SUCCESS MESSAGE
SELECT 'Database migration completed successfully!' as status;
