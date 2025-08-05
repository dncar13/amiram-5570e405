-- Create email_logs table to track sent emails
CREATE TABLE email_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email_type text NOT NULL CHECK (email_type IN ('welcome', 'thank-you', 'subscription-end')),
    recipient_email text NOT NULL,
    sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    status text NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
    error_message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- Enable RLS (Row Level Security)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage email logs" ON email_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to view their own email logs (optional)
CREATE POLICY "Users can view their own email logs" ON email_logs
    FOR SELECT USING (recipient_email = auth.jwt() ->> 'email');

-- Add comment to table
COMMENT ON TABLE email_logs IS 'Tracks automated emails sent to users';
COMMENT ON COLUMN email_logs.email_type IS 'Type of email: welcome, thank-you, or subscription-end';
COMMENT ON COLUMN email_logs.recipient_email IS 'Email address of the recipient';
COMMENT ON COLUMN email_logs.status IS 'Status of the email: sent, failed, or pending';
COMMENT ON COLUMN email_logs.error_message IS 'Error message if email failed to send';