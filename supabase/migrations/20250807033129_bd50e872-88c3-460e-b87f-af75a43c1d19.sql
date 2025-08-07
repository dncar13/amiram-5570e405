-- Update the immediate welcome email function as well
CREATE OR REPLACE FUNCTION public.send_immediate_welcome_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    user_email text;
    user_name text;
    supabase_url text;
BEGIN
    -- Get user email
    user_email := NEW.email;
    
    -- Extract first name from display_name or email
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        split_part(user_email, '@', 1)
    );
    
    -- Get Supabase URL from environment variable
    supabase_url := current_setting('app.supabase_url', true);
    
    -- If supabase_url is not set, use the hardcoded project URL
    IF supabase_url IS NULL OR supabase_url = '' THEN
        supabase_url := 'https://llyunioulzfbgqvmeaxq.supabase.co';
    END IF;
    
    -- Send welcome email immediately on user creation
    PERFORM
        extensions.net.http_post(
            url := supabase_url || '/functions/v1/email-service',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true)
            ),
            body := jsonb_build_object(
                'type', 'welcome',
                'to', user_email,
                'firstName', user_name
            )::text
        );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user registration
        RAISE WARNING 'Failed to send immediate welcome email for user %: %', user_email, SQLERRM;
        RETURN NEW;
END;
$function$;

-- Recreate the triggers since they might not exist
DROP TRIGGER IF EXISTS send_welcome_email_trigger ON auth.users;
DROP TRIGGER IF EXISTS send_immediate_welcome_email_trigger ON auth.users;

CREATE TRIGGER send_welcome_email_trigger
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.send_welcome_email();

CREATE TRIGGER send_immediate_welcome_email_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.send_immediate_welcome_email();