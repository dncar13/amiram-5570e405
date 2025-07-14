-- Create simulation_sessions table for tracking complete simulation attempts
CREATE TABLE public.simulation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('practice', 'simulation', 'exam', 'story')),
  topic_id INTEGER,
  difficulty TEXT,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.simulation_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for simulation_sessions
CREATE POLICY "Users can view their own simulation sessions" 
ON public.simulation_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own simulation sessions" 
ON public.simulation_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulation sessions" 
ON public.simulation_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_simulation_sessions_updated_at
BEFORE UPDATE ON public.simulation_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_simulation_sessions_user_id ON public.simulation_sessions(user_id);
CREATE INDEX idx_simulation_sessions_completed_at ON public.simulation_sessions(completed_at);
CREATE INDEX idx_simulation_sessions_session_type ON public.simulation_sessions(session_type);