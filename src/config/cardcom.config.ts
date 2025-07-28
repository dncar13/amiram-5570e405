/**
 * CardCom Payment Gateway Configuration
 */

import type { CardComCredentials } from '@/types/cardcom.types';

// CardCom API Configuration
export const CARDCOM_CONFIG = {
  API_URL: 'https://secure.cardcom.solutions',
  TERMINAL_NUMBER: 172801,
  API_USERNAME: 'pML8b6EltAb6KxdFMeDg',
  API_PASSWORD: '9YYTm4iSvzW3nhGxGzu6',
  
  // URLs for payment flow (use environment or fallback to production)
  SUCCESS_URL: typeof window !== 'undefined' ? `${window.location.origin}/thankyou` : 'https://amiram.net/thankyou',
  FAILURE_URL: typeof window !== 'undefined' ? `${window.location.origin}/payment-failed` : 'https://amiram.net/payment-failed',
  WEBHOOK_URL: 'https://amiram.net/functions/v1/cardcom-webhook', // Supabase Edge Function URL
  
  // Payment settings
  DEFAULT_CURRENCY_ISO: 1, // ILS
  DEFAULT_LANGUAGE: 'he' as const,
  
  // Timeouts and retries
  API_TIMEOUT: 30000, // 30 seconds
  WEBHOOK_TIMEOUT: 10000, // 10 seconds
} as const;

export const getCardComCredentials = (): CardComCredentials => ({
  terminalNumber: CARDCOM_CONFIG.TERMINAL_NUMBER,
  apiName: CARDCOM_CONFIG.API_USERNAME,
  apiPassword: CARDCOM_CONFIG.API_PASSWORD,
});

export const generateReturnValue = (userId: string, planType: string, timestamp?: number): string => {
  return JSON.stringify({
    userId,
    planType,
    timestamp: timestamp || Date.now(),
    source: 'amiram-premium'
  });
};

export const parseReturnValue = (returnValue: string): {
  userId: string;
  planType: string;
  timestamp: number;
  source: string;
} | null => {
  try {
    return JSON.parse(returnValue);
  } catch (error) {
    console.error('Failed to parse CardCom return value:', error);
    return null;
  }
};

// Helper function to get complete URLs (for server-side usage)
export const getCardComUrls = (baseUrl?: string) => {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://amiram.net');
  
  return {
    successUrl: `${base}/thankyou`,
    failureUrl: `${base}/payment-failed`,
    webhookUrl: CARDCOM_CONFIG.WEBHOOK_URL, // Always use the Supabase edge function URL
  };
};
