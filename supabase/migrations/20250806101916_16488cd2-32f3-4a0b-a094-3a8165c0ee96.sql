-- Fix security issues and recreate email triggers

-- Fix search_path for existing email functions
ALTER FUNCTION public.send_welcome_email() SET search_path TO '';
ALTER FUNCTION public.send_immediate_welcome_email() SET search_path TO '';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS send_welcome_email_trigger ON auth.users;
DROP TRIGGER IF EXISTS send_immediate_welcome_email_trigger ON auth.users;

-- Create trigger for welcome emails on user confirmation
CREATE TRIGGER send_welcome_email_trigger
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.send_welcome_email();

-- Also trigger on user creation for immediate sending
CREATE TRIGGER send_immediate_welcome_email_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.send_immediate_welcome_email();

-- Ensure pg_net extension is enabled for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;