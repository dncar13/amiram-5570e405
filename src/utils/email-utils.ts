import { supabase } from '@/integrations/supabase/client';

export interface EmailResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// Helper function to call the direct email service script
const callDirectEmailService = async (type: string, to: string, firstName: string, subscriptionType?: string): Promise<EmailResponse> => {
  try {
    // In production, this would call your server endpoint
    // For now, we'll use the Supabase function as fallback
    const { data, error } = await supabase.functions.invoke('email-service-simple', {
      body: {
        type,
        to,
        firstName,
        subscriptionType
      }
    });
    
    if (error) {
      console.error('Failed to send email via function:', error);
      return {
        success: false,
        error: 'Failed to send email'
      };
    }
    
    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error calling email service:', error);
    return {
      success: false,
      error: 'Error sending email'
    };
  }
};

export const sendWelcomeEmail = async (email: string, firstName?: string, userId?: string): Promise<EmailResponse> => {
  console.log('Sending welcome email to:', email);
  return await callDirectEmailService('welcome', email, firstName || email.split('@')[0]);
};

export const sendThankYouEmail = async (email: string, firstName?: string, purchaseDetails?: Record<string, unknown>): Promise<EmailResponse> => {
  console.log('Sending thank you email to:', email);
  return await callDirectEmailService(
    'thank-you', 
    email, 
    firstName || email.split('@')[0], 
    purchaseDetails?.subscription_type as string || 'פרימיום'
  );
};
