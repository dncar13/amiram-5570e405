-- Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email text NOT NULL,
    email_type text NOT NULL,
    status text NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
    sent_at timestamptz,
    error_message text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON public.email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Service role can manage email logs" ON public.email_logs;
CREATE POLICY "Service role can manage email logs" ON public.email_logs
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view their own email logs" ON public.email_logs;
CREATE POLICY "Users can view their own email logs" ON public.email_logs
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        recipient_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_email_logs_updated_at
    BEFORE UPDATE ON public.email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Welcome email trigger function
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    first_name text;
BEGIN
    -- Extract first name from display_name or email
    first_name := COALESCE(
        (NEW.raw_user_meta_data->>'display_name')::text,
        split_part(NEW.email, '@', 1)
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
                'firstName', first_name
            )
        ) as request_id;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to send welcome email for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for new user registrations
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION send_welcome_email();

-- Function to send welcome email for existing users without email logs
CREATE OR REPLACE FUNCTION send_missing_welcome_emails()
RETURNS TABLE(user_email text, user_name text, welcome_sent boolean)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
    user_record RECORD;
    first_name text;
BEGIN
    -- Find users who don't have welcome email logs
    FOR user_record IN 
        SELECT u.email, u.raw_user_meta_data, u.created_at
        FROM auth.users u
        LEFT JOIN email_logs el ON (el.recipient_email = u.email AND el.email_type = 'welcome')
        WHERE el.id IS NULL 
        AND u.email IS NOT NULL 
        AND u.confirmed_at IS NOT NULL
        ORDER BY u.created_at DESC
    LOOP
        -- Extract first name
        first_name := COALESCE(
            (user_record.raw_user_meta_data->>'display_name')::text,
            split_part(user_record.email, '@', 1)
        );

        -- Call the edge function
        SELECT 
            net.http_post(
                url := 'https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/email-service-simple',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
                ),
                body := jsonb_build_object(
                    'to', user_record.email,
                    'type', 'welcome',
                    'firstName', first_name
                )
            ) INTO STRICT user_email; -- This will store the response

        -- Return the result
        user_email := user_record.email;
        user_name := first_name;
        welcome_sent := true;
        
        RETURN NEXT;
    END LOOP;
    
    RETURN;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in send_missing_welcome_emails: %', SQLERRM;
    RETURN;
END;
$$;
