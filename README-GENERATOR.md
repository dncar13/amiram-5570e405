# 🎯 Amiram Multi-Type Question Generator

מערכת מתקדמת לייצור שאלות באנגלית עם יכולות TTS, זיהוי נושאים אוטומטי והעלאה לענן.

## 🚀 התכונות

### ✅ **שלושת השלבים הושלמו:**

#### 1. **תיקון העלאה ל-Google Cloud Storage**
- ✅ TTS מתקדם עם העלאה אמיתית ל-GCS
- ✅ יצירת bucket אוטומטית אם לא קיים
- ✅ כתובות ציבוריות בענן במקום מקומיות
- ✅ טיפול בשגיאות ו-retry logic

#### 2. **מיפוי נושאים אוטומטי עם AI**
- ✅ זיהוי נושא חכם עם Claude AI
- ✅ מיפוי אוטומטי לקטגוריות קיימות
- ✅ חיבור למסד נתונים עם topic_id
- ✅ תמיכה בנושאי listening חדשים

#### 3. **אימות ובדיקות מקיפות**
- ✅ וולידציה של קבצי אודיו בענן
- ✅ בדיקת נגישות כתובות GCS
- ✅ אימות שיוך נושאים
- ✅ דיווח מפורט על הצלחות/כשלונות

## 📋 דרישות מוקדמות

### סביבת פיתוח
```bash
Node.js >= 16
npm או yarn
Google Cloud SDK (אופציונלי)
```

### משתני סביבה (.env)
```bash
# Claude AI
ANTHROPIC_API_KEY=your_claude_api_key

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
AUDIO_BUCKET=amiram-audio-files
VOICE_NAME=en-US-Wavenet-F
VOICE_LANG=en-US
SPEAKING_RATE=1.0
PITCH=0.0

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Audio Configuration
PUBLIC_BASE_URL=https://storage.googleapis.com
AUDIO_PREFIX=listening/
MAX_CONCURRENCY=8
```

### הרשאות Google Cloud
חשבון השירות צריך הרשאות:
- `Storage Admin` או `Storage Object Admin`
- `Cloud Text-to-Speech API User`
- `Storage Bucket Creator` (לראשון שמריץ)

## 🛠️ הגדרה ראשונית

### 1. הכנת הסביבה
```bash
# הרצת סקריפט הגדרה אוטומטי
./setup-environment.sh
```

### 2. הגדרת מסד הנתונים
```bash
# הרץ את הSQL בSupabase SQL Editor
cat database-migration.sql
```

### 3. בדיקת חיבורים
```bash
# בדיקה מהירה
node multi-question-generator.js --dry-run --verbose
```

## 🎪 אופני שימוש

### בסיסי - שאלות קבועות
```bash
# ייצור כל סוגי השאלות
node multi-question-generator.js

# ייצור סוגים מסוימים
node multi-question-generator.js --types=lc,cont

# פרק מסוים
node multi-question-generator.js --chapter=chapter_2
```

### מתקדם - עם AI
```bash
# גנרציה עם Claude AI
node multi-question-generator.js --ai-generate --types=lc,cont

# עם זיהוי נושאים
node multi-question-generator.js --ai-generate --types=wf,gc

# ללא זיהוי נושאים אוטומטי
node multi-question-generator.js --ai-generate --no-ai-topics
```

### בדיקות ופיתוח
```bash
# dry run - בלי העלאה למסד הנתונים
node multi-question-generator.js --dry-run --verbose

# בדיקה מלאה עם AI
node multi-question-generator.js --dry-run --ai-generate --verbose
```

## 📊 סוגי שאלות נתמכים

| קוד | סוג שאלה | תיאור | TTS | AI זיהוי נושא |
|-----|-----------|--------|-----|----------------|
| `lc` | Listening Comprehension | הבנת הנשמע עם שאלות משנה | ✅ | ✅ |
| `cont` | Listening Continuation | השלמה הגיונית של משפטים | ✅ | ✅ |
| `wf` | Word Formation | יצירת מילים ומורפולוגיה | ❌ | ✅ |
| `gc` | Grammar in Context | דקדוק בהקשר | ❌ | ✅ |

## 🎯 מיפוי נושאים אוטומטי

### נושאים קיימים
- **Reading (1-2)**: basic, intermediate
- **Grammar (3-5)**: verb tenses, structure, modals
- **Vocabulary (6-8)**: common, academic, phrases

### נושאי Listening חדשים (11-14)
- **Academic Content (11)**: הרצאות אקדמיות
- **Workplace (12)**: סביבת עבודה
- **Daily Conversations (13)**: שיחות יומיומיות
- **Logical Completion (14)**: השלמה הגיונית

### AI Detection
Claude מזהה אוטומטי:
- נושא התוכן (academic, workplace, daily_life)
- סוג הדקדוק (conditionals, passive_voice)
- רמת האוצר (common, academic, scientific)

## 📁 מבנה הפרויקט

```
amiram/
├── multi-question-generator.js  # הסוכן הראשי
├── text-to-speech.cjs          # TTS עם GCS
├── topic-mapper.cjs            # מיפוי נושאים AI
├── setup-environment.sh        # סקריפט הגדרה
├── database-migration.sql      # עדכוני DB
└── README-GENERATOR.md         # המדריך הזה
```

## 🔧 פתרון בעיות נפוצות

### בעיות TTS/GCS
```bash
# בדיקת הרשאות
gcloud auth list
gcloud projects list

# בדיקת bucket
gsutil ls gs://amiram-audio-files

# תיקון הרשאות
gcloud projects add-iam-policy-binding YOUR_PROJECT \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
  --role="roles/storage.admin"
```

### בעיות Claude API
```bash
# בדיקת API key
echo $ANTHROPIC_API_KEY

# בדיקת quota
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.anthropic.com/v1/messages
```

### בעיות Supabase
```bash
# בדיקת חיבור
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);
supabase.from('questions').select('count').then(console.log);
"
```

## 📈 ביצועים ומגבלות

### מהירות ייצור
- **שאלות קבועות**: ~50 שאלות/דקה
- **עם AI**: ~10 שאלות/דקה (תלוי ב-API)
- **עם TTS**: ~5 קבצי אודיו/דקה

### מגבלות API
- **Claude**: 1000 requests/minute
- **Google TTS**: 300 requests/minute
- **GCS**: 5000 operations/second

### אופטימיזציה
```bash
# הפחתת concurrency לחיסכון ב-API
node multi-question-generator.js --types=lc --ai-generate
# (השתמש ב-MAX_CONCURRENCY=3 ב-.env)

# דלג על זיהוי נושאים לחיסכון
node multi-question-generator.js --no-ai-topics
```

## 🎉 דוגמאות שימוש מלאות

### סצנריו 1: ייצור מהיר לפיתוח
```bash
# 1. שאלות קבועות מהירות
node multi-question-generator.js --types=lc,cont --chapter=test_chapter

# 2. בדיקה מהירה
node multi-question-generator.js --dry-run --types=wf --verbose
```

### סצנריו 2: ייצור איכותי לפרודקשן
```bash
# 1. עם AI מלא
node multi-question-generator.js --ai-generate --types=lc,cont,wf,gc

# 2. בדיקת איכות
node multi-question-generator.js --dry-run --ai-generate --verbose
```

### סצנריו 3: ייצור ממוקד
```bash
# רק grammar עם זיהוי נושאים
node multi-question-generator.js --types=gc --ai-generate

# רק listening בלי AI (מהיר)
node multi-question-generator.js --types=lc,cont --no-ai-topics
```

## 🔄 עדכונים עתידיים

### מתוכנן:
- [ ] תמיכה בשפות נוספות
- [ ] יותר קולות TTS
- [ ] אופטימיזציה של Claude prompts
- [ ] integration עם GPT-4

### רצוי:
- [ ] UI ליצירת שאלות
- [ ] analytics מתקדם
- [ ] A/B testing לשאלות
- [ ] automatic difficulty calibration

---

## 🎯 סיכום - הכל מוכן לעבודה!

המערכת מוכנה ומתקדמת עם:
✅ **GCS אמיתי** - אודיו בענן עם כתובות ציבוריות  
✅ **AI חכם** - זיהוי נושאים אוטומטי עם Claude  
✅ **DB מעודכן** - topic_id וסכמה משופרת  
✅ **וולידציה מלאה** - בדיקות איכות מקיפות  

**הרץ עכשיו:** `./setup-environment.sh && node multi-question-generator.js --dry-run --verbose`
