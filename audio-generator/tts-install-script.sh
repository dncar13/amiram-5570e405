#!/bin/bash

# ============================================
# TTS Module Setup Script
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "ℹ️  $1"; }

# ============================================
# Step 1: Check Prerequisites
# ============================================
echo "🚀 Starting TTS Module Setup..."
echo "================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
print_success "Node.js found: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm found: $(npm -v)"

# ============================================
# Step 2: Create Directory Structure
# ============================================
echo ""
echo "📁 Creating directory structure..."

# Create directories
mkdir -p new_questions
mkdir -p credentials
mkdir -p logs

print_success "Directories created"

# ============================================
# Step 3: Install NPM Dependencies
# ============================================
echo ""
echo "📦 Installing npm dependencies..."

npm install @google-cloud/text-to-speech@latest \
           @supabase/supabase-js@latest \
           node-fetch@2 \
           dotenv@latest \
           @anthropic-ai/sdk@latest

print_success "Dependencies installed"

# ============================================
# Step 4: Create TTS Module
# ============================================
echo ""
echo "📝 Creating TTS module..."

# Check if file already exists
if [ -f "new_questions/text-to-speech.cjs" ]; then
    print_warning "text-to-speech.cjs already exists."
    read -p "Overwrite? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping TTS module creation"
    else
        # The module would be created here from the artifact content
        print_success "TTS module created (you need to copy the content from the artifact)"
    fi
else
    print_info "Please copy the text-to-speech.cjs content from the artifact to new_questions/text-to-speech.cjs"
fi

# ============================================
# Step 5: Setup Environment File
# ============================================
echo ""
echo "🔧 Setting up environment configuration..."

# Create .env.example if it doesn't exist
cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Cloud TTS
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account-key.json

# Storage
SUPABASE_STORAGE_BUCKET=audio-files

# TTS Voice Settings
VOICE_NAME=en-US-Wavenet-F
VOICE_LANG=en-US
SPEAKING_RATE=1.0
PITCH=0.0

# Optional
PUBLIC_BASE_URL=https://your-project.supabase.co/storage/v1/object/public/audio-files

# Anthropic API (for AI generation)
ANTHROPIC_API_KEY=your-anthropic-api-key
EOF

print_success ".env.example created"

# Check if .env exists
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_warning ".env file created from template. Please update with your actual values!"
else
    print_info ".env file already exists"
fi

# ============================================
# Step 6: Setup .gitignore
# ============================================
echo ""
echo "🚫 Updating .gitignore..."

# Append to .gitignore if these entries don't exist
declare -a gitignore_entries=(
    "# Environment and credentials"
    ".env"
    "*.env"
    "credentials/"
    "*-service-account*.json"
    "service-account-key.json"
    ""
    "# Audio files"
    "audio/"
    "*.mp3"
    "*.wav"
    ""
    "# Logs"
    "logs/"
    "*.log"
    ""
    "# Node"
    "node_modules/"
    ".npm"
)

for entry in "${gitignore_entries[@]}"; do
    if ! grep -qF "$entry" .gitignore 2>/dev/null; then
        echo "$entry" >> .gitignore
    fi
done

print_success ".gitignore updated"

# ============================================
# Step 7: Google Cloud Setup Instructions
# ============================================
echo ""
echo "📋 Google Cloud Setup Instructions"
echo "==================================="
echo ""
print_info "1. Go to https://console.cloud.google.com"
print_info "2. Create a new project or select existing"
print_info "3. Enable Text-to-Speech API:"
echo "   gcloud services enable texttospeech.googleapis.com"
echo ""
print_info "4. Create Service Account:"
echo "   - Go to IAM & Admin → Service Accounts"
echo "   - Click 'Create Service Account'"
echo "   - Name: tts-service-account"
echo "   - Role: Cloud Text-to-Speech User"
echo "   - Create and download JSON key"
echo "   - Save as: ./credentials/service-account-key.json"
echo ""

# ============================================
# Step 8: Supabase Setup Instructions
# ============================================
echo "📋 Supabase Storage Setup"
echo "========================"
echo ""
print_info "1. Go to your Supabase project"
print_info "2. Navigate to Storage"
print_info "3. Create bucket: 'audio-files'"
print_info "4. Set as Public bucket"
print_info "5. Run these SQL commands in SQL Editor:"
echo ""
cat << 'EOF'
-- Allow public read access
CREATE POLICY "Public Audio Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'audio-files');

-- Allow service role uploads
CREATE POLICY "Service Audio Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'audio-files');

CREATE POLICY "Service Audio Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'audio-files');

CREATE POLICY "Service Audio Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'audio-files');
EOF

# ============================================
# Step 9: Test Setup
# ============================================
echo ""
echo "🧪 Ready to test!"
echo "================="
echo ""
echo "1. First, update your .env file with actual values"
echo "2. Place Google Cloud service account key in ./credentials/"
echo "3. Test TTS module:"
echo "   node new_questions/text-to-speech.cjs"
echo ""
echo "4. Test main generator (dry run):"
echo "   node advanced-question-generator.js --dry-run --verbose"
echo ""

# ============================================
# Step 10: Create Quick Test Script
# ============================================
cat > test-tts.js << 'EOF'
// Quick TTS Test Script
require('dotenv').config();
const { testTTS } = require('./new_questions/text-to-speech.cjs');

console.log('🧪 Running TTS test...\n');

testTTS()
  .then(success => {
    if (success) {
      console.log('\n✅ TTS setup is working correctly!');
    } else {
      console.log('\n❌ TTS test failed. Check your configuration.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Test error:', error.message);
    process.exit(1);
  });
EOF

print_success "Test script created: test-tts.js"

# ============================================
# Final Summary
# ============================================
echo ""
echo "====================================="
echo "✨ Setup Complete!"
echo "====================================="
echo ""
echo "📋 Next Steps:"
echo "1. Update .env with your actual credentials"
echo "2. Add Google Cloud service account JSON to ./credentials/"
echo "3. Copy TTS module content from artifact to new_questions/text-to-speech.cjs"
echo "4. Configure Supabase storage bucket"
echo "5. Run: node test-tts.js"
echo ""
print_success "Happy audio generating! 🎵"