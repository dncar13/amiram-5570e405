-- Enhanced Progress Tracking Schema
-- This migration adds new tables for comprehensive progress tracking

-- Create simulation_sessions table
CREATE TABLE IF NOT EXISTS public.simulation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('practice', 'simulation', 'exam', 'story')),
  topic_id INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  time_spent INTEGER DEFAULT 0, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create user_streaks table
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create user_goals table
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('daily_questions', 'weekly_accuracy', 'streak_days', 'topic_mastery')),
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  deadline DATE,
  is_active BOOLEAN DEFAULT true,
  achieved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create performance_analytics table for aggregated data
CREATE TABLE IF NOT EXISTS public.performance_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2) DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  topics_covered INTEGER DEFAULT 0,
  difficulty_breakdown JSONB DEFAULT '{}'::jsonb,
  type_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period_type, period_start)
);

-- Enable Row Level Security
ALTER TABLE public.simulation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for simulation_sessions
CREATE POLICY "Users can view their own simulation sessions" ON public.simulation_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own simulation sessions" ON public.simulation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own simulation sessions" ON public.simulation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_streaks
CREATE POLICY "Users can view their own streaks" ON public.user_streaks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own streaks" ON public.user_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_goals
CREATE POLICY "Users can view their own goals" ON public.user_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own goals" ON public.user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for performance_analytics
CREATE POLICY "Users can view their own analytics" ON public.performance_analytics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analytics" ON public.performance_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analytics" ON public.performance_analytics
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_simulation_sessions_user_id ON public.simulation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_sessions_completed_at ON public.simulation_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_simulation_sessions_session_type ON public.simulation_sessions(session_type);

CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_last_activity ON public.user_streaks(last_activity_date);

CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_active ON public.user_goals(is_active);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON public.user_achievements(achievement_type);

CREATE INDEX IF NOT EXISTS idx_performance_analytics_user_id ON public.performance_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_period ON public.performance_analytics(period_type, period_start);

-- Create function to update user streaks
CREATE OR REPLACE FUNCTION public.update_user_streak(user_id UUID)
RETURNS void AS $$
DECLARE
  last_activity DATE;
  current_streak INTEGER;
  longest_streak INTEGER;
BEGIN
  -- Get the last activity date for this user
  SELECT DATE(answered_at) INTO last_activity
  FROM public.user_progress
  WHERE user_progress.user_id = update_user_streak.user_id
  ORDER BY answered_at DESC
  LIMIT 1;
  
  -- Get or create streak record
  SELECT current_streak, longest_streak INTO current_streak, longest_streak
  FROM public.user_streaks
  WHERE user_streaks.user_id = update_user_streak.user_id;
  
  -- If no streak record exists, create one
  IF current_streak IS NULL THEN
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date)
    VALUES (update_user_streak.user_id, 1, 1, last_activity);
    RETURN;
  END IF;
  
  -- Update streak logic
  IF last_activity = CURRENT_DATE THEN
    -- Activity today, maintain or increment streak
    IF last_activity = (SELECT last_activity_date FROM public.user_streaks WHERE user_streaks.user_id = update_user_streak.user_id) THEN
      -- Same day, no change
      RETURN;
    ELSE
      -- New day, increment streak
      current_streak := current_streak + 1;
      longest_streak := GREATEST(longest_streak, current_streak);
    END IF;
  ELSIF last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Activity yesterday, maintain streak
    current_streak := current_streak;
  ELSE
    -- No recent activity, reset streak
    current_streak := 1;
  END IF;
  
  -- Update the streak record
  UPDATE public.user_streaks
  SET current_streak = current_streak,
      longest_streak = longest_streak,
      last_activity_date = last_activity,
      updated_at = NOW()
  WHERE user_streaks.user_id = update_user_streak.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate user analytics
CREATE OR REPLACE FUNCTION public.calculate_user_analytics(user_id UUID, period_type TEXT, period_start DATE)
RETURNS void AS $$
DECLARE
  period_end DATE;
  total_questions INTEGER;
  correct_answers INTEGER;
  accuracy_percentage DECIMAL(5,2);
  time_spent INTEGER;
  topics_covered INTEGER;
  difficulty_breakdown JSONB;
  type_breakdown JSONB;
BEGIN
  -- Calculate period end based on type
  CASE period_type
    WHEN 'daily' THEN period_end := period_start;
    WHEN 'weekly' THEN period_end := period_start + INTERVAL '6 days';
    WHEN 'monthly' THEN period_end := period_start + INTERVAL '1 month' - INTERVAL '1 day';
  END CASE;
  
  -- Calculate basic statistics
  SELECT 
    COUNT(*),
    SUM(CASE WHEN answered_correctly THEN 1 ELSE 0 END),
    SUM(COALESCE(time_spent, 0))
  INTO total_questions, correct_answers, time_spent
  FROM public.user_progress
  WHERE user_progress.user_id = calculate_user_analytics.user_id
    AND DATE(answered_at) >= period_start
    AND DATE(answered_at) <= period_end;
  
  -- Calculate accuracy
  accuracy_percentage := CASE WHEN total_questions > 0 THEN (correct_answers::DECIMAL / total_questions) * 100 ELSE 0 END;
  
  -- Calculate topics covered
  SELECT COUNT(DISTINCT q.topic_id) INTO topics_covered
  FROM public.user_progress up
  JOIN public.questions q ON up.question_id = q.id
  WHERE up.user_id = calculate_user_analytics.user_id
    AND DATE(up.answered_at) >= period_start
    AND DATE(up.answered_at) <= period_end;
  
  -- Calculate difficulty breakdown
  SELECT json_object_agg(
    q.difficulty,
    json_build_object(
      'total', COUNT(*),
      'correct', SUM(CASE WHEN up.answered_correctly THEN 1 ELSE 0 END),
      'accuracy', CASE WHEN COUNT(*) > 0 THEN ROUND((SUM(CASE WHEN up.answered_correctly THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2) ELSE 0 END
    )
  ) INTO difficulty_breakdown
  FROM public.user_progress up
  JOIN public.questions q ON up.question_id = q.id
  WHERE up.user_id = calculate_user_analytics.user_id
    AND DATE(up.answered_at) >= period_start
    AND DATE(up.answered_at) <= period_end
  GROUP BY q.difficulty;
  
  -- Calculate type breakdown
  SELECT json_object_agg(
    q.type,
    json_build_object(
      'total', COUNT(*),
      'correct', SUM(CASE WHEN up.answered_correctly THEN 1 ELSE 0 END),
      'accuracy', CASE WHEN COUNT(*) > 0 THEN ROUND((SUM(CASE WHEN up.answered_correctly THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2) ELSE 0 END
    )
  ) INTO type_breakdown
  FROM public.user_progress up
  JOIN public.questions q ON up.question_id = q.id
  WHERE up.user_id = calculate_user_analytics.user_id
    AND DATE(up.answered_at) >= period_start
    AND DATE(up.answered_at) <= period_end
  GROUP BY q.type;
  
  -- Insert or update analytics record
  INSERT INTO public.performance_analytics (
    user_id, period_type, period_start, period_end,
    total_questions, correct_answers, accuracy_percentage, time_spent,
    topics_covered, difficulty_breakdown, type_breakdown
  ) VALUES (
    calculate_user_analytics.user_id, period_type, period_start, period_end,
    COALESCE(total_questions, 0), COALESCE(correct_answers, 0), 
    COALESCE(accuracy_percentage, 0), COALESCE(time_spent, 0),
    COALESCE(topics_covered, 0), COALESCE(difficulty_breakdown, '{}'::jsonb), 
    COALESCE(type_breakdown, '{}'::jsonb)
  )
  ON CONFLICT (user_id, period_type, period_start)
  DO UPDATE SET
    period_end = EXCLUDED.period_end,
    total_questions = EXCLUDED.total_questions,
    correct_answers = EXCLUDED.correct_answers,
    accuracy_percentage = EXCLUDED.accuracy_percentage,
    time_spent = EXCLUDED.time_spent,
    topics_covered = EXCLUDED.topics_covered,
    difficulty_breakdown = EXCLUDED.difficulty_breakdown,
    type_breakdown = EXCLUDED.type_breakdown,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update streaks when progress is added
CREATE OR REPLACE FUNCTION public.trigger_update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user streak when new progress is added
  PERFORM public.update_user_streak(NEW.user_id);
  
  -- Update daily analytics
  PERFORM public.calculate_user_analytics(NEW.user_id, 'daily', DATE(NEW.answered_at));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on user_progress table
CREATE TRIGGER update_user_streak_trigger
  AFTER INSERT ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_user_streak();

-- Create updated_at triggers for new tables
CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_analytics_updated_at
  BEFORE UPDATE ON public.performance_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.simulation_sessions TO authenticated;
GRANT ALL ON public.user_streaks TO authenticated;
GRANT ALL ON public.user_goals TO authenticated;
GRANT ALL ON public.user_achievements TO authenticated;
GRANT ALL ON public.performance_analytics TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.simulation_sessions IS 'Tracks complete simulation/practice sessions';
COMMENT ON TABLE public.user_streaks IS 'Tracks user daily activity streaks';
COMMENT ON TABLE public.user_goals IS 'User-defined learning goals';
COMMENT ON TABLE public.user_achievements IS 'User achievement badges and milestones';
COMMENT ON TABLE public.performance_analytics IS 'Aggregated performance data for analytics';

COMMENT ON FUNCTION public.update_user_streak(UUID) IS 'Updates user streak based on latest activity';
COMMENT ON FUNCTION public.calculate_user_analytics(UUID, TEXT, DATE) IS 'Calculates and stores user analytics for a specific period';