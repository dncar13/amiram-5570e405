-- Create user_vocabulary table for vocabulary learning progress
CREATE TABLE public.user_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  is_saved BOOLEAN NOT NULL DEFAULT false,
  is_known BOOLEAN NOT NULL DEFAULT false,
  mastery SMALLINT NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 5),
  last_reviewed TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  review_count INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, word_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_vocabulary_user_saved ON public.user_vocabulary (user_id, is_saved);
CREATE INDEX idx_user_vocabulary_user_known ON public.user_vocabulary (user_id, is_known);
CREATE INDEX idx_user_vocabulary_user_review ON public.user_vocabulary (user_id, next_review);

-- Enable Row Level Security
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own vocabulary data" 
  ON public.user_vocabulary FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own vocabulary data" 
  ON public.user_vocabulary FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own vocabulary data" 
  ON public.user_vocabulary FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid()) 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role has full access" 
  ON public.user_vocabulary FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER trg_user_vocabulary_updated_at
  BEFORE UPDATE ON public.user_vocabulary
  FOR EACH ROW 
  EXECUTE FUNCTION public.set_updated_at();