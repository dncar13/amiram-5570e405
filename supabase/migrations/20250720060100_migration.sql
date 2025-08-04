-- Add metadata column to questions table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' 
                   AND column_name = 'metadata' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.questions ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
        
        -- Create index for better performance on metadata queries
        CREATE INDEX IF NOT EXISTS idx_questions_metadata ON public.questions USING GIN(metadata);
        
        -- Add comment for documentation
        COMMENT ON COLUMN public.questions.metadata IS 'Additional metadata for questions including set information and tags';
    END IF;
END $$;