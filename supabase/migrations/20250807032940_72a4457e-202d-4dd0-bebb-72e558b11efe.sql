-- Update email functions to use correct net extension path
CREATE OR REPLACE FUNCTION public.send_welcome_email()
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
    -- Get user email from the auth.users table
    user_email := NEW.email;
    
    -- Extract first name from display_name or email
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        split_part(user_email, '@', 1)
    );
    
    -- Get Supabase URL from environment variable
    supabase_url := current_setting('app.supabase_url', true);
    
    -- If supabase_url is not set, try to construct it from the project reference
    IF supabase_url IS NULL OR supabase_url = '' THEN
        supabase_url := 'https://llyunioulzfbgqvmeaxq.supabase.co';
    END IF;
    
    -- Only send welcome email if this is a confirmed user
    IF NEW.email_confirmed_at IS NOT NULL AND (OLD IS NULL OR OLD.email_confirmed_at IS NULL) THEN
        -- Use extensions.net to call the email service function
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
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user registration
        RAISE WARNING 'Failed to send welcome email for user %: %', user_email, SQLERRM;
        RETURN NEW;
END;
$function$;