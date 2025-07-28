/**
 * CardCom Payment Integration Types
 */

export interface CardcomConfig {
  terminalNumber: string;
  userName: string;
  apiName?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  language: string;
  productName: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  webhookUrl?: string;
  customerEmail?: string;
  customFields?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  errorMessage?: string;
  lowProfileCode?: string;
}

export interface CardcomTransaction {
  terminalNumber: string;
  lowProfileCode: string;
  operation: string;
  amount: number;
  currency: string;
  transactionId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cvv?: string;
  customerName?: string;
  customerEmail?: string;
  customFields?: Record<string, any>;
}

export interface WebhookPayload {
  terminalNumber: string;
  lowProfileCode: string;
  transactionId: string;
  operation: string;
  responseCode: string;
  description: string;
  amount: number;
  currency: string;
  transactionType: string;
  cardNumber?: string;
  cardExpiry?: string;
  customerName?: string;
  customerEmail?: string;
  customFields?: Record<string, any>;
  timestamp: string;
}

export interface PaymentTransaction {
  id?: string;
  user_id: string;
  transaction_id: string;
  low_profile_code: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  plan_type: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}