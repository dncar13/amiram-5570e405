-- Update the has_active_premium function to properly check for active subscriptions
CREATE OR REPLACE FUNCTION public.has_active_premium(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE subscriptions.user_id = has_active_premium.user_id
    AND status = 'active' 
    AND (end_date IS NULL OR end_date > now())
  );
END;
$function$