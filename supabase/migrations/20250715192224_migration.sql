-- Fix security issue with set_progress_debug view
-- Replace the view to include proper user filtering for RLS compliance

DROP VIEW IF EXISTS public.set_progress_debug;

CREATE VIEW public.set_progress_debug AS
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
  AND s.user_id = auth.uid()  -- Only show current user's data
ORDER BY s.created_at DESC;