# 🔧 הגדרת Google OAuth עבור localhost:8080

## 📋 מה שצריך לעשות עכשיו

השרת רץ עכשיו על פורט 8080 (כפי שביקשת), אבל כדי שGoogle OAuth יעבוד, צריך להוסיף את localhost:8080 להגדרות Google Cloud Console.

## 🛠️ הגדרת Google Cloud Console

### שלב 1: כניסה ל-Google Cloud Console
1. לכו ל-[Google Cloud Console](https://console.cloud.google.com/)
2. בחרו את הפרויקט הנכון (שמשויך ל-Supabase)

### שלב 2: הוספת localhost:8080 להגדרות OAuth
```
APIs & Services → Credentials → OAuth 2.0 Client IDs
```

**הוסיפו את הכתובות הבאות:**

#### Authorized JavaScript origins:
```
https://amiram.net
http://localhost:8080     ← להוסיף
```

#### Authorized redirect URIs:
```
https://llyunioulzfbgqvmeaxq.supabase.co/auth/v1/callback
https://amiram.net/login
http://localhost:8080/login     ← להוסיף
http://localhost:8080/          ← להוסיף
```

### שלב 3: שמירת השינויים
לחצו "Save" ב-Google Cloud Console

## 🔄 בדיקה מהירה

לאחר הגדרת Google Cloud Console:

1. **פתחו את האתר:** http://localhost:8080/login
2. **לחצו על "התחברות עם Google"**
3. **אם זה עובד:** תתנתבו לחלון Google לבחירת חשבון
4. **אם זה לא עובד:** תקבלו שגיאת `oauth2: "unauthorized_client"`

## 🎯 מה שאמור לקרות אחרי ההגדרה

✅ **Google OAuth יעבוד בפיתוח על localhost:8080**
✅ **Google OAuth ימשיך לעבוד בפרודקשן**
✅ **לא יהיו הפניות לא רצויות בין שרתים**

## 🚨 אם אין לכם גישה ל-Google Cloud Console

אם אין לכם גישה לGoogle Cloud Console של הפרויקט, יש כמה אפשרויות:

### אפשרות 1: בקשת גישה
צרו קשר עם מי שיש לו גישה לפרויקט ובקשו להוסיף את localhost:3000

### אפשרות 2: פתרון זמני עם ngrok
```bash
# התקנת ngrok
npm install -g ngrok

# יצירת tunnel מ-localhost:3000 לכתובת HTTPS זמנית
ngrok http 3000
```

זה ייצור כתובת HTTPS זמנית שיכולה לעבוד עם Google OAuth.

### אפשרות 3: חזרה להתחברות עם אימייל/סיסמה
אם שום דבר לא עובד, תמיד יש את האפשרות להשתמש בהתחברות רגילה.

## 📝 מה עשינו

1. ✅ שינינו את הפורט מ-8080 ל-3000
2. ✅ עדכנו את הקוד לתמוך ב-Google OAuth בפיתוח
3. ✅ הסרנו את החסימה של Google OAuth בסביבת פיתוח
4. ⏳ עכשיו צריך להגדיר את Google Cloud Console

## 🌐 הקישורים החדשים

- **מקומי**: http://localhost:8080/
- **רשת**: http://10.255.255.254:8080/
- **רשת**: http://172.19.245.125:8080/
