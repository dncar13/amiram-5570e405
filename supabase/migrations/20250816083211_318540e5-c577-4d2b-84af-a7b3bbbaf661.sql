-- Create user_vocabulary table for vocabulary tracking and spaced repetition
CREATE TABLE public.user_vocabulary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  is_saved BOOLEAN NOT NULL DEFAULT false,
  is_known BOOLEAN NOT NULL DEFAULT false,
  mastery INTEGER NOT NULL DEFAULT 0 CHECK (mastery >= 0 AND mastery <= 5),
  next_review TIMESTAMP WITH TIME ZONE,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  review_count INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, word_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own vocabulary data" 
ON public.user_vocabulary 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabulary data" 
ON public.user_vocabulary 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocabulary data" 
ON public.user_vocabulary 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocabulary data" 
ON public.user_vocabulary 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_vocabulary_updated_at
BEFORE UPDATE ON public.user_vocabulary
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_user_vocabulary_user_word ON public.user_vocabulary(user_id, word_id);
CREATE INDEX idx_user_vocabulary_next_review ON public.user_vocabulary(next_review) WHERE next_review IS NOT NULL;