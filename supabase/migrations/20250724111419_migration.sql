-- Fix database functions to prevent SQL injection by setting search_path

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$function$;

-- Update update_coupons_updated_at function
CREATE OR REPLACE FUNCTION public.update_coupons_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update has_active_premium function
CREATE OR REPLACE FUNCTION public.has_active_premium(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE subscriptions.user_id = has_active_premium.user_id
    AND status = 'active' 
    AND end_date > now()
  );
END;
$function$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update validate_set_metadata function
CREATE OR REPLACE FUNCTION public.validate_set_metadata(metadata jsonb)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    -- בדוק שכל השדות הנדרשים קיימים
    IF metadata->>'is_set_based' IS NULL OR
       metadata->>'set_id' IS NULL OR
       metadata->>'set_type' IS NULL OR
       metadata->>'set_difficulty' IS NULL OR
       metadata->>'set_number' IS NULL OR
       metadata->>'questions_in_set' IS NULL THEN
        RETURN false;
    END IF;
    
    -- בדוק שהערכים תקינים
    IF metadata->>'is_set_based' NOT IN ('true', 'false') THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;

-- Update clean_duplicate_set_sessions function
CREATE OR REPLACE FUNCTION public.clean_duplicate_set_sessions()
RETURNS TABLE(deleted_count integer)
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
    count integer;
BEGIN
    -- מחק כפילויות ושמור רק את הרשומה החדשה ביותר
    WITH duplicates AS (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY user_id, 
                                metadata->>'set_id',
                                metadata->>'set_type',
                                metadata->>'set_difficulty',
                                status
                   ORDER BY created_at DESC
               ) as rn
        FROM public.simulation_sessions
        WHERE metadata->>'is_set_based' = 'true'
    )
    DELETE FROM public.simulation_sessions
    WHERE id IN (
        SELECT id FROM duplicates WHERE rn > 1
    );
    
    GET DIAGNOSTICS count = ROW_COUNT;
    deleted_count := count;
    RETURN NEXT;
END;
$function$;

-- Update get_user_set_progress_summary function
CREATE OR REPLACE FUNCTION public.get_user_set_progress_summary(p_user_id uuid)
RETURNS TABLE(set_type text, set_difficulty text, total_sets bigint, completed_sets bigint, in_progress_sets bigint, average_score numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        metadata->>'set_type' as set_type,
        metadata->>'set_difficulty' as set_difficulty,
        COUNT(DISTINCT metadata->>'set_id')::bigint as total_sets,
        COUNT(DISTINCT CASE WHEN status = 'completed' THEN metadata->>'set_id' END)::bigint as completed_sets,
        COUNT(DISTINCT CASE WHEN status = 'in_progress' THEN metadata->>'set_id' END)::bigint as in_progress_sets,
        AVG(CASE WHEN status = 'completed' THEN correct_answers END)::numeric as average_score
    FROM public.simulation_sessions
    WHERE user_id = p_user_id
    AND metadata->>'is_set_based' = 'true'
    GROUP BY metadata->>'set_type', metadata->>'set_difficulty';
END;
$function$;

-- Update set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$function$;