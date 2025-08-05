-- Create function to send welcome email on user registration
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS trigger AS $$
DECLARE
    user_email text;
    user_name text;
    supabase_url text;
    supabase_anon_key text;
BEGIN
    -- Get user email from the auth.users table
    user_email := NEW.email;
    
    -- Extract first name from display_name or email
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        split_part(user_email, '@', 1)
    );
    
    -- Get Supabase URL from environment (you'll need to set this)
    supabase_url := current_setting('app.supabase_url', true);
    
    -- Only send welcome email if this is a confirmed user
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
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
                )
            );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table for welcome emails
DROP TRIGGER IF EXISTS on_user_confirmed_send_welcome_email ON auth.users;
CREATE TRIGGER on_user_confirmed_send_welcome_email
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
    EXECUTE FUNCTION send_welcome_email();

-- Alternative: Create trigger for immediate welcome email (without email confirmation)
-- This version sends welcome email immediately when user signs up
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
    
    -- Get Supabase URL from environment
    supabase_url := current_setting('app.supabase_url', true);
    
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
            )
        );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for immediate welcome email
DROP TRIGGER IF EXISTS on_user_created_send_welcome_email ON auth.users;
CREATE TRIGGER on_user_created_send_welcome_email
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION send_immediate_welcome_email();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;