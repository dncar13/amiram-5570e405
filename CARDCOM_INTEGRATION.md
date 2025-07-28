# CardCom Payment Integration

This document describes the CardCom payment integration implementation for the Amiram premium subscription system.

## Overview

The integration uses CardCom's LowProfile API to create secure payment pages and handle webhook notifications for subscription management.

## Components

### 1. Configuration (`src/config/cardcom.config.ts`)
- CardCom API credentials
- Payment flow URLs
- Helper functions for URL generation

### 2. Types (`src/types/cardcom.types.ts`)
- TypeScript interfaces for CardCom API
- Request/response types
- Webhook payload definitions

### 3. Service (`src/services/cardcomService.ts`)
- API integration functions
- Payment initialization
- Transaction verification
- Webhook processing

### 4. Webhook Handler (`supabase/functions/cardcom-webhook/index.ts`)
- Processes payment notifications from CardCom
- Creates subscriptions in database
- Handles transaction logging

### 5. UI Components
- `CardcomPaymentForm.tsx` - Payment form component
- `ThankYou.tsx` - Success page
- `PaymentFailed.tsx` - Failure page

### 6. Database Migration (`supabase/migrations/20250728120000_add_payment_transactions.sql`)
- Adds payment_transactions table
- Sets up RLS policies
- Creates helper functions

## Payment Flow

1. User selects plan and applies coupon (if any)
2. System calls `initializePayment()` with payment details
3. CardCom creates payment page and returns URL
4. User is redirected to CardCom payment page
5. User completes payment on CardCom
6. CardCom sends webhook notification to our endpoint
7. Webhook handler processes payment and creates subscription
8. User is redirected to success/failure page

## API Credentials

**Terminal Number:** 172801
**API Username:** pML8b6EltAb6KxdFMeDg
**API Password:** 9YYTm4iSvzW3nhGxGzu6

## URLs Configuration

- **Success URL:** https://amiram.net/thankyou
- **Failure URL:** https://amiram.net/payment-failed
- **Webhook URL:** https://amiram.net/functions/v1/cardcom-webhook

## Testing

To test the integration:

1. Ensure all environment variables are set
2. Deploy the webhook edge function to Supabase
3. Run database migrations
4. Test payment flow with CardCom sandbox (if available)
5. Verify webhook handling with test transactions

## Security Considerations

- All API credentials are stored securely
- Webhook validation includes terminal number verification
- Transaction IDs are checked for duplicates
- No credit card data is stored locally
- All communication uses HTTPS

## Error Handling

- API failures are logged and user-friendly errors displayed
- Failed payments are tracked for analytics
- Webhook failures are logged but don't affect user experience
- Retry mechanisms for transient failures

## Monitoring

- Payment success/failure rates tracked via analytics
- Transaction logs stored in payment_transactions table
- Webhook processing logs available in Supabase functions
- Admin dashboard can view payment history

## Support

For integration issues or questions:
- WhatsApp: 0525602218
- Email: support@amiram.net