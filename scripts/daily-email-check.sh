#!/bin/bash

# Daily Email Check Script for Amiram Academy
# This script runs daily to check for subscription-end emails

echo "🔍 Starting daily email check at $(date)"

# Configuration
SUPABASE_URL="https://llyunioulzfbgqvmeaxq.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc"

# Log file
LOG_FILE="./daily-emails.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Call the subscription-end-emails function
log_message "📧 Calling subscription-end-emails function..."

response=$(curl -s -w "\n%{http_code}" -X POST "$SUPABASE_URL/functions/v1/subscription-end-emails" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{}')

# Extract response body and status code
response_body=$(echo "$response" | sed '$d')
status_code=$(echo "$response" | tail -n1)

if [ "$status_code" -eq 200 ]; then
    log_message "✅ Subscription-end emails function executed successfully"
    log_message "Response: $response_body"
else
    log_message "❌ Failed to execute subscription-end emails function (HTTP $status_code)"
    log_message "Response: $response_body"
fi

log_message "📧 Daily email check completed at $(date)"
echo "----------------------------------------"
