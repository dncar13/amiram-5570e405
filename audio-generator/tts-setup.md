# 🎵 TTS Module Setup Guide

## 📋 Prerequisites

### 1. Install Dependencies
```bash
npm install @google-cloud/text-to-speech @supabase/supabase-js node-fetch dotenv
```

### 2. Google Cloud Setup

#### A. Create Service Account:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Click **Create Service Account**
4. Name it: `tts-service-account`
5. Grant role: **Cloud Text-to-Speech User**
6. Create and download JSON key

#### B. Enable Text-to-Speech API:
```bash
# Using gcloud CLI
gcloud services enable texttospeech.googleapis.com

# Or enable in Console:
# APIs & Services → Enable APIs → Search "Text-to-Speech" → Enable
```

### 3. Supabase Storage Setup

#### A. Create Storage Bucket:
1. Go to your Supabase project
2. Navigate to **Storage**
3. Click **New Bucket**
4. Name: `audio-files`
5. Public bucket: **Yes** (for public audio URLs)
6. File size limit: **10MB**
7. Allowed MIME types: `audio/*`

#### B. Set Bucket Policies:
```sql
-- Allow public read access
CREATE POLICY "Public Audio Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'audio-files');

-- Allow authenticated uploads (service role)
CREATE POLICY "Service Audio Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'audio-files');

CREATE POLICY "Service Audio Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'audio-files');

CREATE POLICY "Service Audio Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'audio-files');
```

## 🔧 Environment Configuration

Create `.env` file:
```bash
# Supabase (you already have these)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Cloud TTS
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json

# Storage
SUPABASE_STORAGE_BUCKET=audio-files

# TTS Settings (optional - have defaults)
VOICE_NAME=en-US-Wavenet-F
VOICE_LANG=en-US
SPEAKING_RATE=1.0
PITCH=0.0

# Optional: Public base URL for audio validation
PUBLIC_BASE_URL=https://your-project.supabase.co/storage/v1/object/public/audio-files
```

## 📁 Project Structure

```
your-project/
├── new_questions/
│   └── text-to-speech.cjs      # The TTS module we created
├── advanced-question-generator.js   # Your main generator
├── service-account-key.json    # Google Cloud credentials
├── .env                         # Environment variables
├── .gitignore                   # Don't forget to exclude secrets!
└── package.json
```

## 🚫 Update .gitignore

```gitignore
# Secrets - NEVER commit these!
.env
*.env
service-account-key.json
*-service-account*.json

# Audio files (if stored locally)
/audio
*.mp3
*.wav

# Logs
*.log
```

## 🧪 Test the Setup

### 1. Test TTS Module:
```bash
# Run the built-in test
node new_questions/text-to-speech.cjs
```

### 2. Test with Main Generator:
```bash
# Dry run first
node advanced-question-generator.js --dry-run --verbose

# Then production run
node advanced-question-generator.js --types=lc --chapter=test_chapter
```

## 🎯 Voice Options

### Google Cloud Voices (English):
| Voice ID | Type | Gender | Description |
|----------|------|--------|-------------|
| en-US-Wavenet-A | Wavenet | Male | Natural sounding |
| en-US-Wavenet-B | Wavenet | Male | Deep voice |
| en-US-Wavenet-C | Wavenet | Female | Neutral |
| en-US-Wavenet-D | Wavenet | Male | Clear |
| en-US-Wavenet-E | Wavenet | Female | Warm |
| en-US-Wavenet-F | Wavenet | Female | Professional |
| en-US-Neural2-A | Neural2 | Male | Latest model |
| en-US-Neural2-C | Neural2 | Female | Latest model |

### British English:
| Voice ID | Type | Gender |
|----------|------|--------|
| en-GB-Wavenet-A | Wavenet | Female |
| en-GB-Wavenet-B | Wavenet | Male |
| en-GB-Neural2-A | Neural2 | Female |

## 💰 Cost Optimization

### Google Cloud TTS Pricing (as of 2024):
- **WaveNet voices**: $16 per 1 million characters
- **Neural2 voices**: $16 per 1 million characters
- **Standard voices**: $4 per 1 million characters
- **Free tier**: 1 million characters/month (WaveNet) or 4 million (Standard)

### Tips to Reduce Costs:
1. **Cache audio files** - Don't regenerate unchanged text
2. **Use Standard voices** for testing
3. **Batch requests** to reduce API calls
4. **Clean up old files** regularly

## 🔍 Monitoring & Debugging

### Check Google Cloud Usage:
```bash
# View TTS API usage
gcloud monitoring metrics-descriptors list --filter="metric.type:texttospeech.googleapis.com"

# Check quota
gcloud compute project-info describe --project=YOUR_PROJECT_ID
```

### Debug Common Issues:

#### 1. Authentication Error:
```bash
# Verify credentials
export GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
gcloud auth application-default print-access-token
```

#### 2. Storage Permission Error:
```sql
-- Check Supabase storage policies
SELECT * FROM storage.buckets WHERE name = 'audio-files';
SELECT * FROM storage.objects WHERE bucket_id = 'audio-files' LIMIT 10;
```

#### 3. Audio Not Playing:
```javascript
// Test URL accessibility
const { validateAudioUrl } = require('./new_questions/text-to-speech.cjs');
validateAudioUrl('YOUR_AUDIO_URL').then(console.log);
```

## 📊 Database Schema Update

Add audio tracking to your questions table:
```sql
-- Add audio metadata columns if not exists
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS audio_filename TEXT,
ADD COLUMN IF NOT EXISTS audio_duration INTEGER,
ADD COLUMN IF NOT EXISTS audio_generated_at TIMESTAMP;

-- Index for audio queries
CREATE INDEX IF NOT EXISTS idx_questions_audio 
ON questions(audio_url) WHERE audio_url IS NOT NULL;
```

## 🚀 Production Checklist

- [ ] Google Cloud account with billing enabled
- [ ] Text-to-Speech API enabled
- [ ] Service account created with correct permissions
- [ ] Supabase storage bucket configured
- [ ] Environment variables set
- [ ] .gitignore updated
- [ ] Test successful
- [ ] Rate limiting configured
- [ ] Error handling tested
- [ ] Monitoring setup

## 📞 Support Resources

- [Google Cloud TTS Docs](https://cloud.google.com/text-to-speech/docs)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [SSML Reference](https://cloud.google.com/text-to-speech/docs/ssml)
- [Voice Selection Guide](https://cloud.google.com/text-to-speech/docs/voices)

---

Ready to generate audio! 🎉