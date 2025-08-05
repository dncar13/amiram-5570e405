# Amiram Academy Automated Email Service

This implementation provides automated email sending for three key user events using NodeMailer with Zoho SMTP, as requested.

## 📧 Email Types Implemented

1. **Welcome Email** - Sent after user registration/sign-up
2. **Thank-You Email** - Sent after subscription purchase
3. **Subscription-End Email** - Sent when subscription expires (with 70% discount offer)

## 🏗️ Implementation Architecture

### Option 1: Supabase Edge Functions (Recommended)
- **Location**: `supabase/functions/email-service/`
- **Benefits**: Integrated with your existing Supabase infrastructure
- **Deployment**: Use `supabase functions deploy email-service`

### Option 2: Standalone Node.js Service
- **File**: `email-service-nodemailer.js`
- **Benefits**: Direct use of NodeMailer with Zoho SMTP as requested
- **Deployment**: Run on separate server or as background service

## 📁 Files Created

### Supabase Edge Functions
```
supabase/functions/
├── email-service/
│   └── index.ts                    # Main email service with templates
├── subscription-end-emails/
│   └── index.ts                    # Scheduled function for expired subscriptions
└── nodemailer-smtp/
    └── index.ts                    # NodeMailer example code
```

### Database Migrations
```
supabase/migrations/
├── 20250805120000_add_email_logs_table.sql      # Email logging table
└── 20250805120001_add_welcome_email_trigger.sql # Auto-welcome email trigger
```

### Standalone Node.js Service
```
email-service-nodemailer.js         # Complete NodeMailer implementation
email-service-package.json          # Package dependencies
```

### Modified Files
```
supabase/functions/cardcom-webhook/index.ts      # Added thank-you email sending
```

## 🚀 Deployment Instructions

### Step 1: Deploy Supabase Functions
```bash
# Navigate to your project
cd /home/daniel_pogodin/amiram

# Deploy the email service function
supabase functions deploy email-service

# Deploy the subscription-end emails function
supabase functions deploy subscription-end-emails

# Deploy the NodeMailer SMTP example (optional)
supabase functions deploy nodemailer-smtp
```

### Step 2: Run Database Migrations
```bash
# Apply the database migrations
supabase db push
```

### Step 3: Set Up Environment Variables
In your Supabase project dashboard, add these environment variables:

```bash
# Required for Supabase functions
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email service options (choose one)
SMTP_USER=support@amiram.net
SMTP_PASSWORD=YhpVaMpFKKYz

# Alternative email services (optional)
RESEND_API_KEY=your-resend-key
SENDGRID_API_KEY=your-sendgrid-key
```

### Step 4: Set Up Scheduled Jobs (Optional)
To automatically send subscription-end emails, set up a cron job or scheduled task:

```bash
# Example cron job (runs daily at 9 AM)
0 9 * * * curl -X POST "https://your-project.supabase.co/functions/v1/subscription-end-emails" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

## 🛠️ Alternative: Standalone Node.js Service

If you prefer to use the exact NodeMailer implementation:

### Step 1: Install Dependencies
```bash
# Copy the package.json
cp email-service-package.json package.json

# Install dependencies
npm install
```

### Step 2: Set Environment Variables
```bash
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Step 3: Run the Service
```bash
# Start the service
node email-service-nodemailer.js

# Or use npm scripts:
npm run send-welcome user@example.com "שם המשתמש"
npm run send-thank-you user@example.com "שם המשתמש" "חודשי"
npm run send-subscription-end user@example.com "שם המשתמש"
npm run process-expired
```

## 📧 Email Templates

All email templates are implemented in Hebrew with RTL support and include:

### Welcome Email
- **Subject**: ברוך הבא לאמירם אקדמי!
- **Content**: Welcome message, site overview, links to articles
- **Dynamic**: User's first name

### Thank-You Email
- **Subject**: תודה רבה שרכשת מנוי באמירם אקדמי!
- **Content**: Purchase confirmation, access instructions
- **Dynamic**: User's first name, subscription type in Hebrew

### Subscription-End Email
- **Subject**: הצעה מיוחדת לחידוש המנוי שלך!
- **Content**: Thank you message, 70% discount offer
- **Dynamic**: User's first name

## 🔄 Integration Points

### 1. User Registration
- **Trigger**: Database trigger on `auth.users` table
- **When**: User confirms email or signs up
- **Email**: Welcome email with user's name

### 2. Subscription Purchase
- **Trigger**: Modified `cardcom-webhook` function
- **When**: Successful payment processed
- **Email**: Thank-you email with subscription type

### 3. Subscription Expiration
- **Trigger**: Scheduled function (daily)
- **When**: Subscription expires
- **Email**: Subscription-end email with discount offer

## 📊 Email Logging

All emails are logged in the `email_logs` table:
- **Email type** (welcome, thank-you, subscription-end)
- **Recipient email**
- **Status** (sent, failed, pending)
- **Timestamp**
- **Error messages** (if failed)

This prevents duplicate emails and provides audit trail.

## 🧪 Testing

### Test Individual Emails
```bash
# Using Supabase function
curl -X POST "https://your-project.supabase.co/functions/v1/email-service" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{
    "type": "welcome",
    "to": "test@example.com",
    "firstName": "ישראל"
  }'

# Using Node.js service
const service = require('./email-service-nodemailer.js');
service.sendEmailWithLogging('welcome', 'test@example.com', 'ישראל');
```

### Test Subscription Processing
```bash
# Test expired subscriptions processing
curl -X POST "https://your-project.supabase.co/functions/v1/subscription-end-emails" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

## 🔒 Security Notes

- All sensitive credentials are stored in environment variables
- Email logs use Row Level Security (RLS)
- Service role key required for function access
- Duplicate email prevention (24-hour window)

## 📞 Support

For any issues or questions:
- Check the Supabase function logs
- Verify environment variables are set correctly
- Ensure email service (Zoho/Resend/SendGrid) is configured
- Check the `email_logs` table for debugging

## 🎯 Next Steps

1. Deploy the functions to your Supabase project
2. Run database migrations
3. Set up environment variables
4. Test each email type
5. Set up scheduled job for subscription-end emails
6. Monitor email logs for successful delivery

The implementation is complete and ready for deployment!