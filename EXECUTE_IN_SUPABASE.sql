-- ===================================================================
-- EXECUTE THIS SQL IN SUPABASE SQL EDITOR
-- ===================================================================
-- This creates the missing user_preferences table and other required tables
-- Copy and paste this entire script into Supabase > SQL Editor > New Query
-- Then click "Run" to execute
-- ===================================================================

-- Step 1: Create user_preferences table (THE CRITICAL MISSING TABLE)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Core preferences (matching the service expectations)
    preferred_difficulty TEXT DEFAULT 'medium' CHECK (preferred_difficulty IN ('easy', 'medium', 'hard')),
    questions_per_session INTEGER DEFAULT 10,
    delivery_strategy TEXT DEFAULT 'unseen_priority' CHECK (delivery_strategy IN ('unseen_priority', 'random_weighted', 'spaced_repetition', 'mistake_review')),
    show_explanations BOOLEAN DEFAULT TRUE,
    enable_sound BOOLEAN DEFAULT FALSE,
    
    -- Additional preferences
    enable_smart_delivery BOOLEAN DEFAULT TRUE,
    auto_advance_time INTEGER DEFAULT 0,
    adaptive_difficulty BOOLEAN DEFAULT FALSE,
    
    -- Notification preferences
    daily_reminder_enabled BOOLEAN DEFAULT FALSE,
    daily_reminder_time TIME DEFAULT '19:00:00',
    weekly_progress_email BOOLEAN DEFAULT TRUE,
    achievement_notifications BOOLEAN DEFAULT TRUE,
    
    -- UI preferences
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    reduce_animations BOOLEAN DEFAULT FALSE,
    
    -- Analytics preferences
    allow_analytics BOOLEAN DEFAULT TRUE,
    share_anonymous_data BOOLEAN DEFAULT TRUE,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One record per user
    UNIQUE(user_id)
);

-- Step 2: Create other supporting tables if they don't exist
CREATE TABLE IF NOT EXISTS user_question_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL,
    
    -- Interaction details
    answer_selected INTEGER,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Session context
    simulation_session_id UUID,
    simulation_type TEXT CHECK (simulation_type IN ('quick', 'full', 'custom', 'practice')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    
    -- Metadata
    flagged BOOLEAN DEFAULT FALSE,
    notes TEXT,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    
    -- Progress statistics
    total_questions_available INTEGER NOT NULL DEFAULT 0,
    questions_seen INTEGER NOT NULL DEFAULT 0,
    questions_correct INTEGER NOT NULL DEFAULT 0,
    questions_incorrect INTEGER NOT NULL DEFAULT 0,
    questions_flagged INTEGER NOT NULL DEFAULT 0,
    
    -- Performance metrics
    average_accuracy DECIMAL(5,2) DEFAULT 0.00,
    average_time_per_question INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0,
    
    -- Streak and engagement
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_practice_date DATE,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One record per user per difficulty
    UNIQUE(user_id, difficulty)
);

CREATE TABLE IF NOT EXISTS simulation_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Session configuration
    session_type TEXT NOT NULL CHECK (session_type IN ('quick', 'full', 'custom', 'practice', 'review_mistakes')),
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
    question_limit INTEGER NOT NULL DEFAULT 30,
    
    -- Session results
    questions_attempted INTEGER NOT NULL DEFAULT 0,
    questions_correct INTEGER NOT NULL DEFAULT 0,
    total_time_seconds INTEGER NOT NULL DEFAULT 0,
    
    -- Session status
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_question_history_user_id ON user_question_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_summary_user_id ON user_progress_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_sessions_user_id ON simulation_sessions(user_id);

-- Step 4: Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_sessions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
-- User preferences policies
DROP POLICY IF EXISTS "Users can manage their own preferences" ON user_preferences;
CREATE POLICY "Users can manage their own preferences" 
ON user_preferences FOR ALL 
USING (auth.uid() = user_id);

-- User question history policies
DROP POLICY IF EXISTS "Users can manage their own question history" ON user_question_history;
CREATE POLICY "Users can manage their own question history" 
ON user_question_history FOR ALL 
USING (auth.uid() = user_id);

-- User progress summary policies
DROP POLICY IF EXISTS "Users can manage their own progress summary" ON user_progress_summary;
CREATE POLICY "Users can manage their own progress summary" 
ON user_progress_summary FOR ALL 
USING (auth.uid() = user_id);

-- Simulation sessions policies
DROP POLICY IF EXISTS "Users can manage their own simulation sessions" ON simulation_sessions;
CREATE POLICY "Users can manage their own simulation sessions" 
ON simulation_sessions FOR ALL 
USING (auth.uid() = user_id);

-- Step 6: Verification
-- This will show a success message if all tables were created
DO $$
DECLARE
    table_count INTEGER;
    missing_tables TEXT[] := ARRAY[]::TEXT[];
    existing_tables TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Check each required table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_preferences') THEN
        existing_tables := array_append(existing_tables, 'user_preferences');
    ELSE
        missing_tables := array_append(missing_tables, 'user_preferences');
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_question_history') THEN
        existing_tables := array_append(existing_tables, 'user_question_history');
    ELSE
        missing_tables := array_append(missing_tables, 'user_question_history');
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress_summary') THEN
        existing_tables := array_append(existing_tables, 'user_progress_summary');
    ELSE
        missing_tables := array_append(missing_tables, 'user_progress_summary');
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulation_sessions') THEN
        existing_tables := array_append(existing_tables, 'simulation_sessions');
    ELSE
        missing_tables := array_append(missing_tables, 'simulation_sessions');
    END IF;
    
    -- Report results
    RAISE NOTICE 'EXISTING TABLES: %', array_to_string(existing_tables, ', ');
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE 'MISSING TABLES: %', array_to_string(missing_tables, ', ');
        RAISE NOTICE '❌ MIGRATION INCOMPLETE - Some tables were not created';
    ELSE
        RAISE NOTICE '✅ SUCCESS: All adaptive question tables created successfully!';
        RAISE NOTICE '🎉 Database migration completed - user_preferences table is now available!';
    END IF;
END $$;