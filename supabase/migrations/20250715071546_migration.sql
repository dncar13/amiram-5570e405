-- ================================================
-- Phase 1: Database Schema Fixes
-- ================================================

-- 1.1 בדוק ותקן את טבלת simulation_sessions
DO $$ 
BEGIN
    -- הוסף עמודת updated_at אם חסרה
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'simulation_sessions' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE simulation_sessions 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW());
        
        RAISE NOTICE 'Added updated_at column to simulation_sessions';
    END IF;

    -- ודא שיש trigger לעדכון אוטומטי
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_simulation_sessions_updated_at'
    ) THEN
        CREATE TRIGGER update_simulation_sessions_updated_at 
        BEFORE UPDATE ON simulation_sessions 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE 'Added updated_at trigger';
    END IF;
END $$;

-- 1.2 יצירת אינדקסים לשיפור ביצועים
CREATE INDEX IF NOT EXISTS idx_simulation_sessions_user_id 
ON simulation_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_simulation_sessions_metadata_set 
ON simulation_sessions (
    (metadata->>'is_set_based'),
    (metadata->>'set_id'),
    (metadata->>'set_type'),
    (metadata->>'set_difficulty')
);

CREATE INDEX IF NOT EXISTS idx_simulation_sessions_created_at 
ON simulation_sessions(created_at DESC);

-- 1.3 יצירת Debug View מקיף
DROP VIEW IF EXISTS set_progress_debug;
CREATE VIEW set_progress_debug AS
SELECT 
    s.id,
    s.user_id,
    s.created_at,
    s.updated_at,
    s.session_type,
    s.difficulty,
    s.status,
    s.current_question_index,
    s.correct_answers,
    s.metadata->>'is_set_based' as is_set_based,
    s.metadata->>'set_id' as set_id,
    s.metadata->>'set_type' as set_type,
    s.metadata->>'set_difficulty' as set_difficulty,
    s.metadata->>'set_number' as set_number,
    s.metadata->>'questions_in_set' as questions_in_set,
    s.total_questions,
    s.questions_answered,
    s.metadata as full_metadata,
    CASE 
        WHEN s.updated_at IS NULL THEN 'Never Updated'
        WHEN s.updated_at = s.created_at THEN 'Not Modified'
        ELSE 'Modified'
    END as update_status
FROM simulation_sessions s
WHERE s.metadata->>'is_set_based' = 'true'
ORDER BY s.created_at DESC;

-- 1.4 תיקון RLS Policies
ALTER TABLE simulation_sessions ENABLE ROW LEVEL SECURITY;

-- מחק policies ישנות
DROP POLICY IF EXISTS "Users can view own sessions" ON simulation_sessions;
DROP POLICY IF EXISTS "Users can create own sessions" ON simulation_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON simulation_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON simulation_sessions;

-- צור policies חדשות ומקיפות
CREATE POLICY "Users can view own sessions" 
ON simulation_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" 
ON simulation_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" 
ON simulation_sessions FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" 
ON simulation_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- ================================================
-- Phase 2: Data Validation Functions
-- ================================================

-- פונקציה לבדיקת תקינות metadata
CREATE OR REPLACE FUNCTION validate_set_metadata(metadata jsonb)
RETURNS boolean AS $$
BEGIN
    -- בדוק שכל השדות הנדרשים קיימים
    IF metadata->>'is_set_based' IS NULL OR
       metadata->>'set_id' IS NULL OR
       metadata->>'set_type' IS NULL OR
       metadata->>'set_difficulty' IS NULL OR
       metadata->>'set_number' IS NULL OR
       metadata->>'questions_in_set' IS NULL THEN
        RETURN false;
    END IF;
    
    -- בדוק שהערכים תקינים
    IF metadata->>'is_set_based' NOT IN ('true', 'false') THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- פונקציה לניקוי sessions כפולים
CREATE OR REPLACE FUNCTION clean_duplicate_set_sessions()
RETURNS TABLE(deleted_count integer) AS $$
DECLARE
    count integer;
BEGIN
    -- מחק כפילויות ושמור רק את הרשומה החדשה ביותר
    WITH duplicates AS (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY user_id, 
                                metadata->>'set_id',
                                metadata->>'set_type',
                                metadata->>'set_difficulty',
                                status
                   ORDER BY created_at DESC
               ) as rn
        FROM simulation_sessions
        WHERE metadata->>'is_set_based' = 'true'
    )
    DELETE FROM simulation_sessions
    WHERE id IN (
        SELECT id FROM duplicates WHERE rn > 1
    );
    
    GET DIAGNOSTICS count = ROW_COUNT;
    deleted_count := count;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Phase 3: Helper Functions
-- ================================================

-- פונקציה לקבלת סיכום התקדמות לפי משתמש
CREATE OR REPLACE FUNCTION get_user_set_progress_summary(p_user_id uuid)
RETURNS TABLE(
    set_type text,
    set_difficulty text,
    total_sets bigint,
    completed_sets bigint,
    in_progress_sets bigint,
    average_score numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        metadata->>'set_type' as set_type,
        metadata->>'set_difficulty' as set_difficulty,
        COUNT(DISTINCT metadata->>'set_id')::bigint as total_sets,
        COUNT(DISTINCT CASE WHEN status = 'completed' THEN metadata->>'set_id' END)::bigint as completed_sets,
        COUNT(DISTINCT CASE WHEN status = 'in_progress' THEN metadata->>'set_id' END)::bigint as in_progress_sets,
        AVG(CASE WHEN status = 'completed' THEN correct_answers END)::numeric as average_score
    FROM simulation_sessions
    WHERE user_id = p_user_id
    AND metadata->>'is_set_based' = 'true'
    GROUP BY metadata->>'set_type', metadata->>'set_difficulty';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- Phase 4: Testing Queries
-- ================================================

-- Query 1: בדוק כמות sessions לפי סטטוס
SELECT 
    status,
    COUNT(*) as count,
    COUNT(DISTINCT user_id) as unique_users
FROM simulation_sessions
WHERE metadata->>'is_set_based' = 'true'
GROUP BY status;

-- Query 2: בדוק sessions ללא updated_at
SELECT COUNT(*) as sessions_without_updated_at
FROM simulation_sessions
WHERE updated_at IS NULL;

-- Query 3: בדוק metadata structure
SELECT DISTINCT 
    jsonb_object_keys(metadata) as metadata_keys
FROM simulation_sessions
WHERE metadata IS NOT NULL
ORDER BY metadata_keys;

-- Query 4: מצא sessions בעייתיים
SELECT 
    id,
    user_id,
    created_at,
    metadata,
    CASE 
        WHEN NOT validate_set_metadata(metadata) THEN 'Invalid metadata'
        WHEN updated_at IS NULL THEN 'Missing updated_at'
        WHEN total_questions = 0 THEN 'No questions'
        ELSE 'OK'
    END as issue
FROM simulation_sessions
WHERE metadata->>'is_set_based' = 'true'
AND (
    NOT validate_set_metadata(metadata) OR
    updated_at IS NULL OR
    total_questions = 0
);

-- ================================================
-- Success Message
-- ================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database fixes completed successfully!';
    RAISE NOTICE '📊 Run the testing queries to verify the state';
    RAISE NOTICE '🔍 Use set_progress_debug view to monitor progress';
END $$;