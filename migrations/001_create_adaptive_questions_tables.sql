-- ===================================================================
-- ADAPTIVE QUESTION DELIVERY SYSTEM - DATABASE MIGRATION
-- ===================================================================
-- Migration: 001_create_adaptive_questions_tables
-- This creates all necessary tables for the adaptive question system
-- ===================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- 1. ENHANCE EXISTING QUESTIONS TABLE
-- ===================================================================
-- Add indexes for adaptive delivery performance
CREATE INDEX IF NOT EXISTS idx_questions_type_difficulty 
ON questions(type, difficulty);

CREATE INDEX IF NOT EXISTS idx_questions_difficulty_created 
ON questions(difficulty, created_at);

CREATE INDEX IF NOT EXISTS idx_questions_original_id 
ON questions(original_id);

-- ===================================================================
-- 2. USER QUESTION HISTORY TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS user_question_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user-question combination per session
    UNIQUE(user_id, question_id, simulation_session_id)
);

-- Performance indexes for user_question_history
CREATE INDEX IF NOT EXISTS idx_user_question_history_user_difficulty 
ON user_question_history(user_id, difficulty);

CREATE INDEX IF NOT EXISTS idx_user_question_history_last_seen 
ON user_question_history(user_id, question_id, last_seen_at);

CREATE INDEX IF NOT EXISTS idx_user_question_history_recency 
ON user_question_history(user_id, difficulty, last_seen_at);

CREATE INDEX IF NOT EXISTS idx_user_question_history_session 
ON user_question_history(simulation_session_id);

-- ===================================================================
-- 3. USER PROGRESS SUMMARY TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS user_progress_summary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    
    -- Progress dates
    first_question_date TIMESTAMP WITH TIME ZONE,
    last_reset_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One record per user per difficulty
    UNIQUE(user_id, difficulty)
);

-- Indexes for progress summary
CREATE INDEX IF NOT EXISTS idx_user_progress_summary_user 
ON user_progress_summary(user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_summary_user_difficulty 
ON user_progress_summary(user_id, difficulty);

-- ===================================================================
-- 4. SIMULATION SESSIONS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS simulation_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Session configuration
    session_type TEXT NOT NULL CHECK (session_type IN ('quick', 'full', 'custom', 'practice', 'review_mistakes')),
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
    topic_filter TEXT[],
    question_limit INTEGER NOT NULL DEFAULT 30,
    
    -- Session results
    questions_attempted INTEGER NOT NULL DEFAULT 0,
    questions_correct INTEGER NOT NULL DEFAULT 0,
    total_time_seconds INTEGER NOT NULL DEFAULT 0,
    score_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN questions_attempted > 0 
            THEN (questions_correct::DECIMAL / questions_attempted) * 100 
            ELSE 0 
        END
    ) STORED,
    
    -- Session status
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    questions_ids INTEGER[],
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for simulation sessions
CREATE INDEX IF NOT EXISTS idx_simulation_sessions_user 
ON simulation_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_simulation_sessions_user_status 
ON simulation_sessions(user_id, status);

CREATE INDEX IF NOT EXISTS idx_simulation_sessions_completed 
ON simulation_sessions(user_id, completed_at) 
WHERE status = 'completed';

-- ===================================================================
-- 5. USER PREFERENCES TABLE (THE MISSING ONE!)
-- ===================================================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Adaptive delivery preferences
    enable_smart_delivery BOOLEAN DEFAULT TRUE,
    preferred_session_length INTEGER DEFAULT 30,
    auto_advance_time INTEGER DEFAULT 0,
    show_explanations_immediately BOOLEAN DEFAULT TRUE,
    
    -- Difficulty preferences
    adaptive_difficulty BOOLEAN DEFAULT FALSE,
    preferred_difficulties TEXT[] DEFAULT ARRAY['medium'],
    
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

-- Index for user preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user 
ON user_preferences(user_id);

-- ===================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Enable RLS on all user-specific tables
ALTER TABLE user_question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_question_history
DROP POLICY IF EXISTS "Users can manage their own question history" ON user_question_history;
CREATE POLICY "Users can manage their own question history" 
ON user_question_history FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for user_progress_summary
DROP POLICY IF EXISTS "Users can view their own progress summary" ON user_progress_summary;
CREATE POLICY "Users can view their own progress summary" 
ON user_progress_summary FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can update progress summary" ON user_progress_summary;
CREATE POLICY "System can update progress summary" 
ON user_progress_summary FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for simulation_sessions
DROP POLICY IF EXISTS "Users can manage their own simulation sessions" ON simulation_sessions;
CREATE POLICY "Users can manage their own simulation sessions" 
ON simulation_sessions FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
DROP POLICY IF EXISTS "Users can manage their own preferences" ON user_preferences;
CREATE POLICY "Users can manage their own preferences" 
ON user_preferences FOR ALL 
USING (auth.uid() = user_id);

-- Questions table - allow all authenticated users to read
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read questions" ON questions;
CREATE POLICY "Authenticated users can read questions" 
ON questions FOR SELECT 
USING (auth.role() = 'authenticated');

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================

-- Check that all tables were created successfully
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_preferences', 'user_question_history', 'user_progress_summary', 'simulation_sessions');
    
    IF table_count = 4 THEN
        RAISE NOTICE '✅ SUCCESS: All 4 adaptive question tables created successfully!';
    ELSE
        RAISE NOTICE '❌ ERROR: Only % out of 4 tables were created', table_count;
    END IF;
END $$;