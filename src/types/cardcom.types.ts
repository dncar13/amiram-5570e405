/**
 * CardCom API Types
 * Based on CardCom API v11.0 OpenAPI specification
 */

export interface CardComCredentials {
  terminalNumber: number;
  apiName: string;
  apiPassword?: string;
}

export interface CreateLowProfileRequest {
  TerminalNumber: number;
  ApiName: string;
  Operation?: 'ChargeOnly';
  ReturnValue?: string;
  Amount: number;
  SuccessRedirectUrl: string;
  FailedRedirectUrl: string;
  WebHookUrl: string;
  ProductName?: string;
  Language?: 'he' | 'en';
  ISOCoinId?: number;
  Document?: DocumentLP;
}

export interface DocumentLP {
  Name?: string;
  Email?: string;
  Products?: ProductLP[];
}

export interface ProductLP {
  Description: string;
  UnitCost: number;
  Quantity?: number;
}

export interface CreateLowProfileResponse {
  ResponseCode: number;
  Description?: string;
  LowProfileId?: string;
  Url?: string;
  UrlToPayPal?: string;
  UrlToBit?: string;
}

export interface LowProfileResult {
  ResponseCode: number;
  Description?: string;
  TerminalNumber: number;
  LowProfileId: string;
  TranzactionId: number;
  ReturnValue?: string;
  Amount?: number;
  ISOCoinId?: number;
  CardHolderName?: string;
  CardNum?: string;
  CardExpiration?: string;
  OperationResult?: string;
  OperationResultDescription?: string;
  DealDate?: string;
  VoucherNumber?: string;
  AuthNumber?: string;
}

export interface GetLowProfileResult {
  TerminalNumber: number;
  ApiName: string;
  LowProfileId: string;
}

export interface CardComErrorInfo {
  ResponseCode: number;
  Description?: string;
}

export interface PaymentInitRequest {
  planType: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  amount: number;
  originalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  userEmail?: string;
  userName?: string;
  userId: string;
}

export interface PaymentInitResponse {
  success: boolean;
  paymentUrl?: string;
  lowProfileId?: string;
  error?: string;
}

export interface WebhookPayload extends LowProfileResult {
  // Additional fields that might be sent in webhook
  timestamp?: string;
  signature?: string;
}

export interface PaymentStatus {
  success: boolean;
  transactionId?: number;
  amount?: number;
  error?: string;
  description?: string;
}