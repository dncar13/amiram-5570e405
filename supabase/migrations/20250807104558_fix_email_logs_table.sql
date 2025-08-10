-- Fix email_logs table and ensure welcome email triggers work properly

-- Create email_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.email_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_address TEXT NOT NULL,
    email_type TEXT NOT NULL,
    subject TEXT,
    template_used TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
DROP POLICY IF EXISTS "Service role can access email_logs" ON public.email_logs;
CREATE POLICY "Service role can access email_logs" ON public.email_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON public.email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at);

-- Function to send welcome email immediately upon user registration
CREATE OR REPLACE FUNCTION public.send_immediate_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
    response record;
BEGIN
    -- Log the trigger execution
    INSERT INTO public.email_logs (user_id, email_address, email_type, subject, status)
    VALUES (
        NEW.id,
        NEW.email,
        'welcome',
        'ברוכים הבאים לאמירם!',
        'pending'
    );

    -- Call the edge function to send welcome email
    SELECT 
        net.http_post(
            url := 'https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/email-service-simple',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
            ),
            body := jsonb_build_object(
                'to', NEW.email,
                'type', 'welcome',
                'userId', NEW.id::text,
                'userName', COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
            )
        ) INTO response;

    -- Update the log with the response
    UPDATE public.email_logs 
    SET 
        status = CASE 
            WHEN response.status_code = 200 THEN 'sent'
            ELSE 'failed'
        END,
        error_message = CASE 
            WHEN response.status_code != 200 THEN 'HTTP ' || response.status_code || ': ' || response.content
            ELSE NULL
        END,
        sent_at = CASE 
            WHEN response.status_code = 200 THEN NOW()
            ELSE NULL
        END,
        updated_at = NOW()
    WHERE user_id = NEW.id AND email_type = 'welcome' AND status = 'pending';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_send_welcome_email ON auth.users;

-- Create trigger for immediate welcome email on user registration
CREATE TRIGGER on_auth_user_created_send_welcome_email
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.send_immediate_welcome_email();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.email_logs TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.email_logs_id_seq TO service_role;
GRANT EXECUTE ON FUNCTION public.send_immediate_welcome_email() TO service_role;

-- Create a test function to manually trigger welcome email
CREATE OR REPLACE FUNCTION public.test_welcome_email(user_email TEXT, user_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    response record;
    log_id BIGINT;
BEGIN
    -- Insert a test log entry
    INSERT INTO public.email_logs (user_id, email_address, email_type, subject, status)
    VALUES (
        COALESCE(user_id, gen_random_uuid()),
        user_email,
        'welcome_test',
        'ברוכים הבאים לאמירם! (מבחן)',
        'pending'
    ) RETURNING id INTO log_id;

    -- Call the edge function
    SELECT 
        net.http_post(
            url := 'https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/email-service-simple',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
            ),
            body := jsonb_build_object(
                'to', user_email,
                'type', 'welcome',
                'userId', COALESCE(user_id, gen_random_uuid())::text,
                'userName', user_email
            )
        ) INTO response;

    -- Update the log
    UPDATE public.email_logs 
    SET 
        status = CASE 
            WHEN response.status_code = 200 THEN 'sent'
            ELSE 'failed'
        END,
        error_message = CASE 
            WHEN response.status_code != 200 THEN 'HTTP ' || response.status_code || ': ' || response.content
            ELSE NULL
        END,
        sent_at = CASE 
            WHEN response.status_code = 200 THEN NOW()
            ELSE NULL
        END,
        updated_at = NOW()
    WHERE id = log_id;

    RETURN 'Email test completed. Status: ' || 
           (SELECT status FROM public.email_logs WHERE id = log_id) ||
           '. Check email_logs table for details.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.test_welcome_email TO service_role;
