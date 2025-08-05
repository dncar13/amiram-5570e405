-- Create function to send welcome email on user registration (updated for current schema)
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS trigger AS $$
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
        -- Use pg_net to call the email service function
        PERFORM
            net.http_post(
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for immediate welcome email (without email confirmation)
CREATE OR REPLACE FUNCTION send_immediate_welcome_email()
RETURNS trigger AS $$
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
        net.http_post(
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_user_confirmed_send_welcome_email ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_send_welcome_email ON auth.users;

-- Create trigger on auth.users table for welcome emails (after email confirmation)
CREATE TRIGGER on_user_confirmed_send_welcome_email
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at))
    EXECUTE FUNCTION send_welcome_email();

-- Create trigger for immediate welcome email (uncomment if you want immediate emails)
-- CREATE TRIGGER on_user_created_send_welcome_email
--     AFTER INSERT ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION send_immediate_welcome_email();

-- Grant necessary permissions for pg_net
DO $$
BEGIN
    -- Grant usage on net schema if it exists
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'net') THEN
        GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA net TO postgres, anon, authenticated, service_role;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Could not grant permissions on net schema: %', SQLERRM;
END $$;