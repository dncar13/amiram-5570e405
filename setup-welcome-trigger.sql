-- Create a webhook trigger for new user registrations
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    response_status INTEGER;
BEGIN
    -- Get user email from auth.users
    user_email := NEW.email;
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    
    -- Log the trigger execution
    INSERT INTO public.email_logs (user_id, recipient_email, email_type, status, created_at)
    VALUES (NEW.id, user_email, 'welcome', 'pending', NOW());
    
    -- Call the edge function to send welcome email
    -- This uses the pg_net extension to make HTTP requests
    SELECT status INTO response_status
    FROM http((
        'POST',
        'https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/email-service',
        ARRAY[
            http_header('Content-Type', 'application/json'),
            http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true))
        ],
        'application/json',
        json_build_object(
            'to', user_email,
            'type', 'welcome',
            'firstName', user_name,
            'userId', NEW.id::text
        )::text
    ));
    
    -- Update the email log with the result
    UPDATE public.email_logs 
    SET 
        status = CASE 
            WHEN response_status = 200 THEN 'sent'
            ELSE 'failed'
        END,
        error_message = CASE 
            WHEN response_status != 200 THEN 'HTTP ' || response_status
            ELSE NULL
        END,
        sent_at = CASE 
            WHEN response_status = 200 THEN NOW()
            ELSE NULL
        END,
        updated_at = NOW()
    WHERE user_id = NEW.id AND email_type = 'welcome' AND status = 'pending';
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    UPDATE public.email_logs 
    SET 
        status = 'failed',
        error_message = SQLERRM,
        updated_at = NOW()
    WHERE user_id = NEW.id AND email_type = 'welcome' AND status = 'pending';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Set the service role key for the trigger to use
-- This needs to be set as a database setting
ALTER DATABASE postgres SET app.settings.service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';
