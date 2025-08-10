# 🎯 AMIRAM Multi-Question Generator

Professional-grade question generation system with AI enhancement, automatic topic detection, and cloud audio storage.

## 🚀 Quick Start

### 1. Initial Setup
```bash
# Run the automated setup script
./setup-environment.sh

# Or manually run database updates in Supabase SQL Editor
# Copy contents of database-schema-updates.sql
```

### 2. Generate Your First Questions
```bash
# Test run (no database writes)
node multi-question-generator.cjs --dry-run --verbose

# Generate word formation and grammar questions
node multi-question-generator.cjs --types=wf,gc

# Generate listening questions with audio
node multi-question-generator.cjs --types=lc,cont --verbose

# Full AI-enhanced generation
node multi-question-generator.cjs --ai-generate --verbose
```

## 📋 Features

### ✅ Question Types
- **Listening Comprehension (lc)**: 30-90 second audio passages with questions
- **Listening Continuation (cont)**: Logical sentence completion with audio
- **Word Formation (wf)**: Morphology and word transformation
- **Grammar in Context (gc)**: Advanced grammar in realistic contexts

### ✅ AI Integration
- **Claude 3.5 Sonnet** for question generation
- **Automatic topic detection** and categorization
- **Smart content analysis** for proper topic assignment

### ✅ Audio Generation
- **Google Cloud Text-to-Speech** with professional voices
- **SSML format** with automatic pause insertion
- **Cloud storage** with public URL generation
- **Audio validation** and accessibility checks

### ✅ Database Integration
- **Supabase** integration with proper topic linking
- **Duplicate handling** with stable IDs
- **Metadata preservation** including Hebrew explanations
- **Topic distribution** tracking and reporting

## 🔧 Configuration

### Environment Variables
```bash
# Required
ANTHROPIC_API_KEY=your-claude-api-key
VITE_SUPABASE_URL=your-supabase-url  
VITE_SUPABASE_SERVICE_ROLE_KEY=your-supabase-key
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Optional (with defaults)
AUDIO_BUCKET=amiram-audio-files
AUDIO_PREFIX=audio/
VOICE_NAME=en-US-Wavenet-F
VOICE_LANG=en-US
PUBLIC_FILES=true
MAX_CONCURRENCY=8
```

### CLI Arguments
```bash
--types=lc,cont,wf,gc     # Question types to generate
--chapter=chapter_1       # Chapter identifier  
--ai-generate            # Use AI for question generation
--no-ai-topics          # Disable AI topic detection
--dry-run               # Test mode (no database writes)
--verbose               # Detailed logging
```

## 📊 Topic Mapping

### Grammar & Structure (IDs 1-5)
- **1**: Vocabulary - Basic vocabulary and word meanings
- **2**: Basic Grammar - Fundamental grammar rules  
- **3**: Tenses - Verb tenses and time expressions
- **4**: Sentence Structure - Sentence formation and syntax
- **5**: Modal Verbs - Modal verbs and conditional structures

### Language Skills (IDs 6-10)
- **6**: Common Words - Everyday vocabulary and usage
- **7**: Academic Vocabulary - Academic and formal language
- **8**: Business English - Professional workplace language
- **9**: Phrasal Verbs - Phrasal verbs and idiomatic expressions
- **10**: Collocations - Word combinations and partnerships

### Listening Skills (IDs 11-14)
- **11**: Academic Listening - Academic lectures and discussions
- **12**: Workplace Listening - Professional workplace conversations
- **13**: Daily Conversation - Everyday conversations and situations
- **14**: Logical Completion - Logical reasoning and sentence completion

## 🎵 Audio Processing

### Text-to-Speech Features
- **SSML Conversion**: `______` → `<break time="1s"/>`
- **Professional Voices**: en-US-Wavenet-F (configurable)
- **Cloud Storage**: Automatic GCS upload with public URLs
- **Validation**: HTTP accessibility and content-type verification

### Audio File Organization
```
gs://amiram-audio-files/
├── audio/
│   ├── lc_ch1_short_1.mp3
│   ├── cont_ch1_01.mp3
│   └── ...
```

## 🗄️ Database Schema

### Questions Table Updates
```sql
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS stable_id TEXT,
ADD COLUMN IF NOT EXISTS topic_id INTEGER;

CREATE UNIQUE INDEX questions_stable_id_idx ON questions(stable_id);
```

### New Topics (IDs 11-14)
```sql
INSERT INTO topics (id, title, description, category_id) VALUES
(11, 'Academic Listening', 'Academic contexts', 4),
(12, 'Workplace Listening', 'Professional conversations', 4),
(13, 'Daily Conversation', 'Everyday conversations', 4),
(14, 'Logical Completion', 'Logical reasoning', 4);
```

## 📈 Usage Examples

### Basic Generation
```bash
# Word formation questions only
node multi-question-generator.cjs --types=wf

# Grammar questions with verbose output
node multi-question-generator.cjs --types=gc --verbose

# Multiple types
node multi-question-generator.cjs --types=wf,gc
```

### AI-Enhanced Generation
```bash
# AI-generated questions with topic detection
node multi-question-generator.cjs --ai-generate --verbose

# Specific types with AI
node multi-question-generator.cjs --types=lc,cont --ai-generate

# Disable topic detection but keep AI generation
node multi-question-generator.cjs --ai-generate --no-ai-topics
```

### Audio Generation
```bash
# Listening questions with TTS audio
node multi-question-generator.cjs --types=lc,cont --verbose

# Test audio without database upload
node multi-question-generator.cjs --types=lc --dry-run --verbose
```

### Development & Testing
```bash
# Test mode (no changes)
node multi-question-generator.cjs --dry-run --verbose

# Preview questions without database
node show-questions.cjs

# Validate existing audio files
node validate-audio.cjs
```

## 🔍 Output Examples

### Generation Report
```
🎯 Starting Multi-Type Question Generation
📁 Chapter: chapter_1
📝 Types: wf, gc
🤖 AI Generation: ENABLED
🔧 Mode: PRODUCTION

📚 Generating Word Formation questions...
🎯 Detecting topics for word formation questions...
📦 Processing topic batch 1/4
  📋 wf_ch1_01: academic_vocabulary (ID: 7) [high]
  📋 wf_ch1_02: business_english (ID: 8) [high]
📊 Topic distribution for word_formation: {"academic_vocabulary": 4, "business_english": 3, "common_words": 3}

💾 Uploading questions to database...
✅ Successfully uploaded 10 questions with topic mapping

📊 GENERATION SUMMARY
📁 Chapter: chapter_1
🤖 AI Generation: ENABLED
  • Word Formation: 10
  • Grammar in Context: 10
  • Total Questions: 20
  • Valid Audio Files: 0/0
```

### Topic Distribution
```
📊 Topic distribution for listening_comprehension:
{
  "academic_listening": 2,
  "workplace_listening": 1
}
```

## 🚨 Troubleshooting

### Common Issues

#### Audio Upload Failures
```bash
# Check GCS permissions
gsutil ls gs://amiram-audio-files

# Create bucket if needed  
gsutil mb gs://amiram-audio-files
gsutil iam ch allUsers:objectViewer gs://amiram-audio-files
```

#### Missing Topics
```bash
# Run database schema updates
# Copy database-schema-updates.sql to Supabase SQL Editor
```

#### API Rate Limits
- **Claude**: Max 1000 requests/minute
- **Google TTS**: Max 300 requests/minute  
- **Solution**: Use built-in rate limiting and batching

#### Missing Dependencies
```bash
npm install @anthropic-ai/sdk @google-cloud/text-to-speech @google-cloud/storage @supabase/supabase-js
```

### Debug Mode
```bash
# Maximum verbose output
node multi-question-generator.cjs --dry-run --verbose --types=wf

# Check topic mapping
node -e "console.log(require('./topic-mapper.cjs').getAvailableTopics())"

# Validate audio URLs
curl -I https://storage.googleapis.com/amiram-audio-files/audio/test.mp3
```

## 📝 File Structure
```
new_questions/
├── multi-question-generator.cjs    # Main generator
├── topic-mapper.cjs               # AI topic detection
├── text-to-speech.cjs             # TTS and cloud upload
├── database-schema-updates.sql    # Database setup
├── setup-environment.sh           # Automated setup
├── show-questions.cjs             # Question preview
├── validate-audio.cjs             # Audio validation
└── README-GENERATOR.md            # This file
```

## 🎉 Success Indicators

### ✅ Setup Complete When:
- All environment variables set ✅
- Database schema updated ✅
- GCS bucket created and accessible ✅
- APIs responding successfully ✅

### ✅ Generation Working When:
- Questions saved to database with proper topic_id ✅
- Audio files uploaded to cloud storage ✅
- Topics detected and mapped correctly ✅
- No validation errors in logs ✅

### ✅ Production Ready When:
- Multiple question types generating ✅
- AI topic detection functioning ✅
- Audio accessible via public URLs ✅
- Questions appearing in correct UI categories ✅

---

**📞 Support**: Check logs for detailed error messages and solutions
**🔗 Documentation**: See individual file headers for function-specific docs
**🚀 Updates**: System designed for easy extension with new question types