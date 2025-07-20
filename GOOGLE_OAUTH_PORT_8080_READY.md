# 🎯 Google OAuth על localhost:8080 - מדריך מהיר

## ✅ מה שהושלם

השרת רץ עכשיו על פורט 8080 כפי שביקשת, והקוד מוכן לתמוך ב-Google OAuth.

## 🌐 האתר זמין על:
- **http://localhost:8080/**
- **http://10.255.255.254:8080/**
- **http://172.19.245.125:8080/**

## 🔧 כדי שGoogle OAuth יעבוד - צריך הגדרה חד-פעמית

### 📋 מה לעשות ב-Google Cloud Console:

1. **היכנסו ל-[Google Cloud Console](https://console.cloud.google.com/)**
2. **בחרו את הפרויקט הנכון (הפרויקט של Supabase)**
3. **עברו ל-APIs & Services → Credentials**
4. **בחרו את OAuth 2.0 Client ID**
5. **הוסיפו את הכתובות הבאות:**

#### Authorized JavaScript origins:
```
http://localhost:8080
```

#### Authorized redirect URIs:
```
http://localhost:8080/login
http://localhost:8080/
```

### 🎉 אחרי ההגדרה:
- ✅ Google OAuth יעבוד על localhost:8080
- ✅ לא יהיו הפניות לא רצויות
- ✅ תוכלו להתחבר עם Google בפיתוח

## 🚀 איך לבדוק שזה עובד:

1. **פתחו:** http://localhost:8080/login
2. **לחצו על:** "התחברות עם Google"
3. **אם מוגדר נכון:** יפתח חלון Google לבחירת חשבון
4. **אם לא מוגדר:** תקבלו שגיאה `unauthorized_client`

## 📱 באתר יש הודעה מידעית

ברגע שתפתחו את האתר, תראו הודעה כתומה שמסבירה איך להגדיר את Google OAuth.

## 🔄 עד אז:

**השתמשו בהתחברות עם אימייל וסיסמה** - זה עובד מצוין ומהיר לפיתוח!

---

🎯 **התוצאה:** האתר שלכם רץ על פורט 8080 כמו שרציתם, ואחרי הגדרה קטנה ב-Google Cloud Console, Google OAuth יעבוד מושלם!
