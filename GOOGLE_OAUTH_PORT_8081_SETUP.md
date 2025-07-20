# 🚀 Google OAuth על localhost:8081 - מדריך מהיר

## ✅ השרת רץ על פורט 8081!

🌐 **האתר זמין עכשיו על:**
- **http://localhost:8081/**
- **http://10.255.255.254:8081/**
- **http://172.19.245.125:8081/**

## 🔧 להגדרת Google OAuth על הפורט החדש:

### 📋 ב-Google Cloud Console הוסיפו:

1. **היכנסו ל-[Google Cloud Console](https://console.cloud.google.com/)**
2. **APIs & Services → Credentials → OAuth 2.0 Client IDs**
3. **הוסיפו את הכתובות הבאות:**

#### Authorized JavaScript origins:
```
http://localhost:8081
```

#### Authorized redirect URIs:
```
http://localhost:8081/login
http://localhost:8081/
```

## 🎯 מה שצריך לעשות עכשיו:

1. **הוסיפו את localhost:8081 ב-Google Cloud Console** (במקום 8080)
2. **שמרו את השינויים**
3. **חזרו לאתר על** http://localhost:8081/login
4. **נסו להתחבר עם Google**

## 🔍 איך לבדוק שזה עובד:

✅ **אם זה עובד:** לחיצה על "התחברות עם Google" תפתח חלון Google  
❌ **אם זה לא עובד:** תקבלו שגיאה `unauthorized_client`

## 💡 טיפ:

אם עדיין לא עובד אחרי הוספת 8081, ייתכן שיש cache ב-Google. נסו:
1. לנקות cache בדפדפן
2. לנסות בחלון incognito
3. לחכות כמה דקות (לפעמים Google לוקח זמן לעדכן)

## 🔄 עד שזה יעבוד:

**השתמשו בהתחברות עם אימייל וסיסמה** - זה עובד מושלם!

---

🎯 **תזכורת:** אל תשכחו לעדכן ב-Google Cloud Console מ-8080 ל-8081!
