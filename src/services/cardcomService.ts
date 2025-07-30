
/**
 * CardCom Payment Integration Service
 * 
 * Complete implementation for CardCom payment gateway integration
 * Uses CardCom API v11.0 LowProfile endpoints
 */

import type {
  CreateLowProfileRequest,
  CreateLowProfileResponse,
  GetLowProfileResult,
  LowProfileResult,
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentStatus,
  CardComErrorInfo
} from '@/types/cardcom.types';
import { CARDCOM_CONFIG, getCardComCredentials, generateReturnValue, getCardComUrls, isTestEnvironment, getCardComApiUrl, logCardComEnvironment } from '@/config/cardcom.config';
import { PLAN_PRICES } from '@/config/pricing';

/**
 * Initialize payment with CardCom LowProfile API
 * Creates a payment page and returns the URL for user redirection
 */
export const initializePayment = async (request: PaymentInitRequest): Promise<PaymentInitResponse> => {
  try {
    // Get API URL dynamically at runtime
    const API_BASE_URL = getCardComApiUrl();
    
    // CRITICAL DEBUG: Call getCardComApiUrl multiple times to ensure consistency
    const apiUrl1 = getCardComApiUrl();
    const apiUrl2 = getCardComApiUrl();
    const apiUrl3 = getCardComApiUrl();
    
    console.log('🔄 Initializing CardCom payment:', request);
    console.log(`💳 CardCom Environment: ${isTestEnvironment() ? 'TEST' : 'PRODUCTION'} (${API_BASE_URL})`);
    console.log('🔍 MULTIPLE API URL CALLS CHECK:', {
      API_BASE_URL,
      apiUrl1,
      apiUrl2,
      apiUrl3,
      allSame: API_BASE_URL === apiUrl1 && apiUrl1 === apiUrl2 && apiUrl2 === apiUrl3,
      windowLocationOrigin: typeof window !== 'undefined' ? window.location.origin : 'undefined',
      windowLocationHostname: typeof window !== 'undefined' ? window.location.hostname : 'undefined'
    });
    
    // Log environment configuration
    logCardComEnvironment();
    
    const credentials = getCardComCredentials();
    const urls = getCardComUrls();
    const returnValue = generateReturnValue(request.userId, request.planType);
    
    // The amount is already the final amount after discount calculation
    const finalAmount = request.amount;
    
    // CRITICAL DEBUG: Log the exact amount being sent to CardCom
    console.log('🔍 PAYMENT AMOUNT DEBUG:', {
      requestAmount: request.amount,
      requestAmountType: typeof request.amount,
      finalAmount: finalAmount,
      finalAmountType: typeof finalAmount,
      isPositive: finalAmount > 0,
      isNumber: !isNaN(finalAmount),
      isFinite: isFinite(finalAmount)
    });
    
    // Validate amount is a positive number
    if (!finalAmount || typeof finalAmount !== 'number' || isNaN(finalAmount) || !isFinite(finalAmount)) {
      console.error('❌ Invalid payment amount:', { finalAmount, type: typeof finalAmount });
      return {
        success: false,
        error: `סכום התשלום לא תקין: ${finalAmount}`
      };
    }

    if (finalAmount <= 0) {
      console.error('❌ Payment amount must be positive:', { finalAmount });
      return {
        success: false,
        error: `סכום התשלום חייב להיות חיובי. הסכום שלך: ${finalAmount} ש"ח`
      };
    }

    // CardCom minimum amount validation (most payment processors require minimum 1-5 ILS)
    const MINIMUM_AMOUNT = 5; // 5 ILS minimum for CardCom
    if (finalAmount < MINIMUM_AMOUNT) {
      console.warn(`⚠️ Amount too low for payment processing: ${finalAmount} ILS (minimum: ${MINIMUM_AMOUNT} ILS)`);
      return {
        success: false,
        error: `סכום מינימלי לתשלום הוא ${MINIMUM_AMOUNT} ש"ח. הסכום שלך: ${finalAmount} ש"ח`
      };
    }
    
    const createRequest: CreateLowProfileRequest = {
      TerminalNumber: credentials.terminalNumber,
      ApiName: credentials.apiName,
      Operation: 'ChargeOnly',
      ReturnValue: returnValue,
      Amount: finalAmount,
      SuccessRedirectUrl: urls.successUrl,
      FailedRedirectUrl: urls.failureUrl,
      WebHookUrl: urls.webhookUrl,
      ProductName: `גישה פרימיום - ${getPlanDisplayName(request.planType)}`,
      Language: CARDCOM_CONFIG.DEFAULT_LANGUAGE,
      ISOCoinId: CARDCOM_CONFIG.DEFAULT_CURRENCY_ISO,
      Document: {
        Name: request.userName || 'לקוח',
        Email: request.userEmail,
        Products: [{
          Description: `גישה פרימיום - ${getPlanDisplayName(request.planType)}`,
          UnitCost: finalAmount,
          Quantity: 1
        }]
      }
    };
    
    // CRITICAL DEBUG: Log the exact request being sent to CardCom
    console.log('📤 CardCom API Request:', {
      amount: createRequest.Amount,
      amountType: typeof createRequest.Amount,
      unitCost: createRequest.Document.Products[0].UnitCost,
      unitCostType: typeof createRequest.Document.Products[0].UnitCost,
      fullRequest: createRequest
    });
    
    // Note: The amount is already calculated with discount, no need to add discount as separate product
    
    // CRITICAL DEBUG: Log the exact URL being used for the API call
    const fullApiUrl = `${API_BASE_URL}/api/v11/LowProfile/Create`;
    console.log('🚀 CRITICAL DEBUG: Actual API URL being used:', fullApiUrl);
    console.log('🔍 API_BASE_URL variable:', API_BASE_URL);
    console.log('🔍 getCardComApiUrl() result:', getCardComApiUrl());
    
    const response = await fetch(fullApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(createRequest)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: CreateLowProfileResponse = await response.json();
    
    console.log('📥 CardCom response:', {
      responseCode: result.ResponseCode,
      description: result.Description,
      url: result.Url,
      lowProfileId: result.LowProfileId,
      fullResponse: result
    });
    
    if (result.ResponseCode === 0 && result.Url) {
      console.log('✅ Payment initialization successful');
      return {
        success: true,
        paymentUrl: result.Url,
        lowProfileId: result.LowProfileId
      };
    } else {
      console.error('❌ CardCom payment failed:', {
        responseCode: result.ResponseCode,
        description: result.Description
      });
      return {
        success: false,
        error: result.Description || 'Failed to create payment page'
      };
    }
    
  } catch (error) {
    console.error('❌ CardCom payment initialization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get payment result from CardCom using LowProfile ID
 */
export const getPaymentResult = async (lowProfileId: string): Promise<PaymentStatus> => {
  try {
    // Get API URL dynamically at runtime
    const API_BASE_URL = getCardComApiUrl();
    
    console.log('🔍 Getting CardCom payment result for:', lowProfileId);
    
    const credentials = getCardComCredentials();
    
    const request: GetLowProfileResult = {
      TerminalNumber: credentials.terminalNumber,
      ApiName: credentials.apiName,
      LowProfileId: lowProfileId
    };
    
    // CRITICAL DEBUG: Log the exact URL for GetLpResult API call
    const fullGetResultUrl = `${API_BASE_URL}/api/v11/LowProfile/GetLpResult`;
    console.log('🚀 CRITICAL DEBUG: GetLpResult API URL being used:', fullGetResultUrl);
    console.log('🔍 API_BASE_URL variable:', API_BASE_URL);
    console.log('🔍 getCardComApiUrl() result:', getCardComApiUrl());
    
    const response = await fetch(fullGetResultUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: LowProfileResult = await response.json();
    
    console.log('📊 CardCom payment result:', result);
    
    return {
      success: result.ResponseCode === 0,
      transactionId: result.TranzactionId,
      amount: result.Amount,
      error: result.ResponseCode !== 0 ? result.Description : undefined,
      description: result.OperationResultDescription
    };
    
  } catch (error) {
    console.error('❌ Error getting CardCom payment result:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Generate iframe URL for embedding CardCom payment form
 * This creates the payment and returns an iframe-compatible URL
 */
export const getIframeUrl = async (request: PaymentInitRequest): Promise<string | null> => {
  const result = await initializePayment(request);
  
  if (result.success && result.paymentUrl) {
    return result.paymentUrl;
  }
  
  console.error('Failed to get iframe URL:', result.error);
  return null;
};

/**
 * Verify transaction status with CardCom
 */
export const verifyTransaction = async (lowProfileId: string): Promise<boolean> => {
  try {
    const result = await getPaymentResult(lowProfileId);
    return result.success;
  } catch (error) {
    console.error('❌ Transaction verification error:', error);
    return false;
  }
};

/**
 * Helper function to get plan display name in Hebrew
 */
const getPlanDisplayName = (planType: string): string => {
  const displayNames: Record<string, string> = {
    'daily': 'יום אחד',
    'weekly': 'שבוע אחד', 
    'monthly': 'חודש אחד',
    'quarterly': '3 חודשים'
  };
  return displayNames[planType] || planType;
};

/**
 * Process webhook payload from CardCom
 */
export const processWebhook = (payload: any): LowProfileResult | null => {
  try {
    // Validate the webhook payload structure
    if (!payload.LowProfileId || !payload.TerminalNumber) {
      console.error('❌ Invalid webhook payload structure');
      return null;
    }
    
    console.log('📥 Processing CardCom webhook:', payload);
    return payload as LowProfileResult;
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return null;
  }
};

/**
 * CardCom Integration Usage:
 * 
 * 1. Initialize Payment:
 *    const result = await initializePayment({
 *      planType: 'monthly',
 *      amount: 99, // Final amount after discount
 *      userId: 'user-id',
 *      userEmail: 'user@example.com'
 *    });
 * 
 * 2. Redirect user to payment page:
 *    if (result.success) {
 *      window.location.href = result.paymentUrl;
 *    }
 * 
 * 3. Handle webhook notifications:
 *    const webhookResult = processWebhook(payload);
 *    if (webhookResult && webhookResult.ResponseCode === 0) {
 *      // Payment successful - create subscription
 *    }
 * 
 * 4. For iframe integration:
 *    const iframeUrl = await getIframeUrl(paymentRequest);
 *    // Embed in iframe element
 */
