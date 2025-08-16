/**
 * CardCom Payment Gateway Configuration
 */

import type { CardComCredentials } from '@/types/cardcom.types';

// Environment detection for CardCom API URL (runtime)
export const getCardComApiUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: default to production
    console.log('🔴 Server-side rendering: Using CardCom PRODUCTION environment');
    return 'https://secure.cardcom.solutions';
  }
  
  const currentOrigin = window.location.origin;
  const hostname = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol;
  const href = window.location.href;
  
  // COMPREHENSIVE DEBUG LOGGING
  console.log('🔍 CARDCOM ENVIRONMENT DETECTION DEBUG:', {
    currentOrigin,
    hostname,
    port,
    protocol,
    href,
    fullLocation: window.location
  });
  
  // TEMPORARY FIX: Always use production API for now
  // This allows testing with real credentials even on localhost
  console.log('🔧 TEMPORARY: Always using CardCom PRODUCTION API for all environments');
  return 'https://secure.cardcom.solutions';
  
  // Original logic (commented out temporarily):
  /*
  // Test environments - use CardCom sandbox
  // Check for preview environment
  if (currentOrigin === 'https://preview--amiram.lovable.app') {
    console.log('🧪 MATCH: Preview environment detected - Using CardCom TEST environment');
    return 'https://test.cardcom.solutions';
  }
  
  // Check for localhost in various forms (any port)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
    console.log('🧪 MATCH: Localhost detected - Using CardCom TEST environment');
    console.log(`🔧 Localhost details: hostname=${hostname}, port=${port}, origin=${currentOrigin}`);
    return 'https://test.cardcom.solutions';
  }
  
  // Additional check for localhost with any port (fallback)
  if (currentOrigin.startsWith('http://localhost:') || currentOrigin.startsWith('https://localhost:')) {
    console.log('🧪 MATCH: Localhost with port detected - Using CardCom TEST environment');
    console.log(`🔧 Localhost origin: ${currentOrigin}`);
    return 'https://test.cardcom.solutions';
  }
  
  // Production environment - use live CardCom API
  console.log('🔴 NO MATCH: Using CardCom PRODUCTION environment for:', currentOrigin);
  console.log('🔴 Production fallback details:', {
    hostname,
    currentOrigin,
    isPreview: currentOrigin === 'https://preview--amiram.lovable.app',
    isLocalhost: hostname === 'localhost',
    is127: hostname === '127.0.0.1',
    startsWithHttpLocalhost: currentOrigin.startsWith('http://localhost:'),
    startsWithHttpsLocalhost: currentOrigin.startsWith('https://localhost:')
  });
  return 'https://secure.cardcom.solutions';
  */
};

// CardCom API Configuration
export const CARDCOM_CONFIG = {
  // API_URL will be determined dynamically - see getCardComApiUrl()
  
  // Production credentials (YOUR ACTUAL CARDCOM CREDENTIALS)
  PROD_TERMINAL_NUMBER: 172801,
  PROD_API_USERNAME: 'pML8b6EltAb6KxdFMeDg',
  PROD_API_PASSWORD: '9YYTm4iSvzW3nhGxGzu6',
  
  // Sandbox credentials (for test environments)
  SANDBOX_TERMINAL_NUMBER: 1000,
  SANDBOX_API_USERNAME: 'test2025',
  SANDBOX_API_PASSWORD: 'test2025', // Update this if you have a different sandbox password
  
  // URLs for payment flow (use environment or fallback to production)
  SUCCESS_URL: typeof window !== 'undefined' ? `${window.location.origin}/thank-you` : 'https://amiram.net/thank-you',
  FAILURE_URL: typeof window !== 'undefined' ? `${window.location.origin}/payment-failed` : 'https://amiram.net/payment-failed',
  WEBHOOK_URL: 'https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/cardcom-webhook', // Supabase Edge Function URL
  
  // Payment settings
  DEFAULT_CURRENCY_ISO: 1, // ILS
  DEFAULT_LANGUAGE: 'he' as const,
  
  // Timeouts and retries
  API_TIMEOUT: 30000, // 30 seconds
  WEBHOOK_TIMEOUT: 10000, // 10 seconds
} as const;

export const getCardComCredentials = (): CardComCredentials => {
  const isTest = isTestEnvironment();
  
  const credentials = {
    terminalNumber: isTest ? CARDCOM_CONFIG.SANDBOX_TERMINAL_NUMBER : CARDCOM_CONFIG.PROD_TERMINAL_NUMBER,
    apiName: isTest ? CARDCOM_CONFIG.SANDBOX_API_USERNAME : CARDCOM_CONFIG.PROD_API_USERNAME,
    apiPassword: isTest ? CARDCOM_CONFIG.SANDBOX_API_PASSWORD : CARDCOM_CONFIG.PROD_API_PASSWORD,
  };
  
  console.log('🔑 CardCom Credentials Selected:', {
    environment: isTest ? 'SANDBOX' : 'PRODUCTION',
    terminalNumber: credentials.terminalNumber,
    apiName: credentials.apiName,
    // Don't log password for security
    passwordSet: !!credentials.apiPassword
  });
  
  return credentials;
};

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

// Helper function to check if we're in test environment
export const isTestEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const currentOrigin = window.location.origin;
  const hostname = window.location.hostname;
  
  // TEMPORARY FIX: Always use production credentials for now
  // This will help test payment functionality even on localhost
  console.log('🔧 TEMPORARY: Using PRODUCTION credentials for all environments');
  return false;
  
  // Original logic (commented out temporarily):
  /*
  const isTestEnv = currentOrigin === 'https://preview--amiram.lovable.app' || 
                    hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    hostname.endsWith('.localhost') ||
                    currentOrigin.startsWith('http://localhost:') ||
                    currentOrigin.startsWith('https://localhost:');
  
  console.log('🔍 isTestEnvironment check:', {
    currentOrigin,
    hostname,
    isTestEnv,
    checks: {
      isPreview: currentOrigin === 'https://preview--amiram.lovable.app',
      isLocalhost: hostname === 'localhost',
      is127: hostname === '127.0.0.1',
      isLocalhostDomain: hostname.endsWith('.localhost'),
      startsWithHttpLocalhost: currentOrigin.startsWith('http://localhost:'),
      startsWithHttpsLocalhost: currentOrigin.startsWith('https://localhost:')
    }
  });
  
  return isTestEnv;
  */
};

// Helper function to get complete URLs (for server-side usage)
export const getCardComUrls = (baseUrl?: string, paymentDetails?: {
  planType: string;
  amount: number;
  discountAmount?: number;
  couponCode?: string;
}) => {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://amiram.net');
  
  let successUrl = `${base}/thank-you`;
  
  // Add payment details as URL parameters for immediate display
  if (paymentDetails) {
    const params = new URLSearchParams({
      plan: paymentDetails.planType,
      amount: paymentDetails.amount.toString(),
      timestamp: Date.now().toString()
    });
    
    if (paymentDetails.discountAmount && paymentDetails.discountAmount > 0) {
      params.set('discount', paymentDetails.discountAmount.toString());
    }
    
    if (paymentDetails.couponCode) {
      params.set('coupon', paymentDetails.couponCode);
    }
    
    successUrl = `${successUrl}?${params.toString()}`;
  }
  
  return {
    successUrl,
    failureUrl: `${base}/payment-failed`,
    webhookUrl: CARDCOM_CONFIG.WEBHOOK_URL, // Always use the Supabase edge function URL
  };
};

// Log current environment configuration
export const logCardComEnvironment = () => {
  if (typeof window !== 'undefined') {
    console.log('CardCom Configuration:', {
      environment: isTestEnvironment() ? 'TEST' : 'PRODUCTION',
      apiUrl: getCardComApiUrl(),
      origin: window.location.origin
    });
  }
};
