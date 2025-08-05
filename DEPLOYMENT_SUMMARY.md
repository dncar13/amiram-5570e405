# Amiram Academy - Email System Deployment Guide

## 🎉 סיכום הפריסה

המערכת כעת מוכנה לייצור עם כל הרכיבים הבאים:

### ✅ **מה הושלם:**

1. **📧 מערכת האימייל המלאה:**
   - טבלת `email_logs` לניהול לוגי אימיילים
   - פונקציות Edge Functions לשליחת אימיילים
   - תמיכה באימיילי ברכה, תודה וסיום מנוי

2. **🔄 מיגריישנים סינכרוניים:**
   - 39 מיגריישנים סונכרנו בהצלחה
   - כל הבעיות ההיסטוריות נפתרו
   - בסיס הנתונים יציב ומוכן

3. **⚡ Edge Functions פרוסות:**
   - `email-service` - שירות אימיילים מרכזי
   - `subscription-end-emails` - אימיילי סיום מנוי יומיים
   - `cardcom-webhook` - ווב-הוק לתשלומים
   - פונקציות קופונים ובעיות
   - פונקציות החזרים

4. **🕙 אוטומציה יומית:**
   - סקריפט `daily-email-check.sh` 
   - קובץ cron להפעלה יומית
   - לוגים מפורטים

---

## 🚀 **שלבי הפעלה בייצור:**

### 1. **הגדרת Cron Job יומי:**
```bash
# הוסף לקרון של השרת:
crontab -e

# הוסף את השורה:
0 10 * * * /home/daniel_pogodin/amiram/scripts/daily-email-check.sh >> /home/daniel_pogodin/amiram/daily-email-cron.log 2>&1
```

### 2. **בדיקת פונקציות:**
```bash
# בדיקת פונקציית אימיילים:
curl -X POST "https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/email-service" \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"type": "welcome", "to": "test@example.com", "firstName": "Test"}'

# בדיקת אימיילי סיום מנוי:
curl -X POST "https://llyunioulzfbgqvmeaxq.supabase.co/functions/v1/subscription-end-emails" \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 3. **הגדרת משתני סביבה:**
ודא שכל המשתנים הבאים מוגדרים בסביבת הייצור:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_USER` / `SMTP_PASSWORD` (אופציונלי)
- `RESEND_API_KEY` (אופציונלי)

### 4. **מעקב ולוגים:**
- בדוק את הקובץ `/home/daniel_pogodin/amiram/daily-email-cron.log`
- עקוב אחר הטבלה `email_logs` במסד הנתונים
- השתמש ב-Supabase Dashboard לניטור הפונקציות

---

## 📊 **מבנה הנתונים:**

### `email_logs` Table:
```sql
id          UUID PRIMARY KEY
email_type  TEXT ('welcome', 'thank-you', 'subscription-end')
recipient_email TEXT
sent_at     TIMESTAMP
status      TEXT ('sent', 'failed', 'pending')
error_message TEXT
```

### `subscriptions` Table:
```sql
id         UUID PRIMARY KEY  
user_id    UUID REFERENCES auth.users(id)
plan_type  TEXT ('day', 'week', 'month', '3months')
start_date TIMESTAMP
end_date   TIMESTAMP
status     TEXT ('active', 'inactive', 'expired')
```

---

## 🔧 **תחזוקה שוטפת:**

1. **בדיקה שבועית:** וודא שהאימיילים נשלחים
2. **ניקוי לוגים:** נקה לוגים ישנים מעל 30 יום
3. **עדכון CLI:** עדכן Supabase CLI בקביעות
4. **בדיקת מכסות:** וודא שלא חורגים ממכסות האימיילים

---

## 📞 **תמיכה:**

אם יש בעיות, בדוק:
1. לוגי ה-cron job
2. לוגי הפונקציות ב-Supabase Dashboard  
3. טבלת `email_logs` לשגיאות
4. קישוריות למסד הנתונים

**המערכת מוכנה לייצור! 🎉**
