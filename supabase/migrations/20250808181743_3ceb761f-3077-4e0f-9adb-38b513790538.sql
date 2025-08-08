-- Create a safe public stats function for homepage
CREATE OR REPLACE FUNCTION public.get_public_homepage_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  result jsonb;
BEGIN
  result := jsonb_build_object(
    'total_questions', (SELECT COUNT(*) FROM public.questions),
    'total_topics', (SELECT COUNT(*) FROM public.topics),
    'simulations_display', (SELECT COUNT(*) * 100 FROM public.simulation_sessions),
    'question_sets', (SELECT COUNT(*) FROM public.question_sets),
    'topics', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'name', t.name,
          'questions', COALESCE(q.count, 0),
          'difficulty_levels', COALESCE(q.difficulty_levels, 0)
        )
        ORDER BY t.id
      ), '[]'::jsonb)
      FROM public.topics t
      LEFT JOIN (
        SELECT 
          topic_id,
          COUNT(*) AS count,
          COALESCE(array_length(ARRAY(SELECT DISTINCT difficulty FROM public.questions q2 WHERE q2.topic_id = q.topic_id), 1), 0) AS difficulty_levels
        FROM public.questions q
        WHERE topic_id IS NOT NULL
        GROUP BY topic_id
      ) q ON q.topic_id = t.id
    )
  );
  RETURN result;
END;
$$;

-- Allow anonymous/public access to execute this function
GRANT EXECUTE ON FUNCTION public.get_public_homepage_stats() TO anon, authenticated, service_role;
