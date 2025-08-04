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
  amount: number; // Final amount after discount calculation
  userEmail?: string;
  userName?: string;
  userId: string;
  discountAmount?: number; // For URL parameter passing
  couponCode?: string; // For URL parameter passing
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

// Refund API Types based on CardCom RefundByTransactionId endpoint
export interface RefundByTransactionIdRequest {
  ApiName: string;
  ApiPassword: string;
  TransactionId: number;
  PartialSum?: number; // For partial refunds
  ExternalDealId?: string;
  ExternalMerchantId?: string;
  AllowMultipleRefunds?: boolean;
  CancelOnly?: boolean;
  CustomFields?: Array<{
    FieldName: string;
    FieldValue: string;
  }>;
}

export interface RefundByTransactionIdResponse {
  ResponseCode: number;
  Description?: string;
  NewTranzactionId?: number; // The ID of the created refund transaction
}

export interface RefundResult {
  success: boolean;
  refundTransactionId?: number;
  error?: string;
  description?: string;
}

// Refund calculation types for Israeli law compliance
export interface RefundCalculation {
  refundAmount: number;
  cancellationFee: number;
  unusedDays: number;
  totalDays: number;
  eligibleForRefund: boolean;
  originalAmount: number;
}

export interface RefundPreview {
  calculation: RefundCalculation;
  planType: string;
  subscriptionId: string;
  transactionId: number;
  refundFormula: string;
  processingTime: string;
}