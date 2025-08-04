-- Add INSERT policy for questions table to allow service role to insert questions
CREATE POLICY "Service role can insert questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (true);