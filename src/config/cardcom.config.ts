/**
 * CardCom Payment Gateway Configuration
 * 
 * This configuration handles CardCom payment integration for AmirAM Academy.
 * Update the webhook URL after deploying to Supabase.
 */

export const cardcomConfig = {
  // CardCom API Configuration
  terminalNumber: '1000', // Replace with your actual terminal number
  userName: 'barak9611', // Replace with your actual username
  
  // Payment URLs - these will be dynamically set based on current origin
  getPaymentUrls: () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://amiram.net';
    return {
      successUrl: `${origin}/thankyou`,
      cancelUrl: `${origin}/premium`,
      failureUrl: `${origin}/payment-failed`,
      // TODO: Update this URL after deploying to Supabase
      webhookUrl: `https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/cardcom-webhook`
    };
  },
  
  // CardCom API endpoints
  api: {
    baseUrl: 'https://secure.cardcom.solutions',
    lowProfileUrl: '/Interface/LowProfile.aspx'
  },
  
  // Payment configuration
  currency: 'ILS',
  language: 'he',
  
  // Product information
  productName: 'AmirAM Academy Premium Subscription'
};

export default cardcomConfig;