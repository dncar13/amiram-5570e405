
-- 1) Add stable_id to questions with a safe unique index (ignores NULLs)
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS stable_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS questions_stable_id_idx
ON public.questions(stable_id)
WHERE stable_id IS NOT NULL;

-- 2) Add Listening topics without colliding with existing IDs (11–14 already used)
-- Your topics table columns: id (int), name (text), category (text), description (text), created_at (timestamptz)
INSERT INTO public.topics (id, name, category, description)
VALUES
  (21, 'Listening - Academic Content', 'Listening', 'הבנת הנשמע - תוכן אקדמי'),
  (22, 'Listening - Workplace Situations', 'Listening', 'הבנת הנשמע - מצבים מקצועיים'),
  (23, 'Listening - Daily Conversations', 'Listening', 'הבנת הנשמע - שיחות יומיומיות'),
  (24, 'Listening - Logical Completion', 'Listening', 'השלמת קטעי שמע בהיגיון')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description;

-- 3) Optional: normalize existing NULL ai_generated to false (safe)
UPDATE public.questions
SET ai_generated = COALESCE(ai_generated, false)
WHERE ai_generated IS NULL;

-- 4) Verification
SELECT 'questions columns' AS info,
       column_name, data_type
FROM information_schema.columns
WHERE table_schema='public' AND table_name='questions'
  AND column_name IN ('stable_id','topic_id','ai_generated')
ORDER BY column_name;

SELECT 'listening topics (21-24)' AS info, id, name, category
FROM public.topics
WHERE id BETWEEN 21 AND 24
ORDER BY id;
