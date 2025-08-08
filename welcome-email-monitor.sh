#!/bin/bash

# Welcome Email Monitor - מוודא שכל משתמש חדש מקבל מייל קבלת פנים
# הרץ את הסקריפט הזה כל 5-10 דקות

echo "🕒 $(date '+%Y-%m-%d %H:%M:%S') - Starting welcome email check..."

cd /home/daniel_pogodin/amiram

# הרצת הסקריפט האוטומטי
node auto-welcome-emails.cjs

echo "✅ $(date '+%Y-%m-%d %H:%M:%S') - Welcome email check completed"
echo "---"
