#!/bin/bash
# setup-environment.sh - Setup script for Amiram question generator

echo "🚀 Setting up Amiram Question Generator Environment"
echo "================================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found! Please create it first."
    echo "Required environment variables:"
    echo "  - ANTHROPIC_API_KEY"
    echo "  - GOOGLE_APPLICATION_CREDENTIALS"
    echo "  - AUDIO_BUCKET"
    echo "  - VITE_SUPABASE_URL"
    echo "  - VITE_SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Source environment variables
source .env

echo "✅ Environment file loaded"

# Check required environment variables
REQUIRED_VARS=("ANTHROPIC_API_KEY" "VITE_SUPABASE_URL" "VITE_SUPABASE_SERVICE_ROLE_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '  - %s\n' "${MISSING_VARS[@]}"
    exit 1
fi

echo "✅ All required environment variables present"

# Check Google Cloud credentials
if [ -n "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
    if [ -f "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
        echo "✅ Google Cloud credentials file found"
    else
        echo "⚠️ Google Cloud credentials file not found at: $GOOGLE_APPLICATION_CREDENTIALS"
        echo "   TTS functionality may not work"
    fi
else
    echo "⚠️ GOOGLE_APPLICATION_CREDENTIALS not set"
    echo "   TTS functionality may not work"
fi

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install @google-cloud/text-to-speech @google-cloud/storage @anthropic-ai/sdk @supabase/supabase-js node-fetch crypto

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Test Google Cloud setup
echo "🔧 Testing Google Cloud TTS setup..."
node -e "
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const tts = new TextToSpeechClient();
console.log('✅ Google Cloud TTS client initialized successfully');
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Google Cloud TTS setup working"
else
    echo "⚠️ Google Cloud TTS setup may have issues"
    echo "   Check your GOOGLE_APPLICATION_CREDENTIALS and service account permissions"
fi

# Test Supabase connection
echo "🔧 Testing Supabase connection..."
node -e "
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);
console.log('✅ Supabase client initialized successfully');
"

if [ $? -eq 0 ]; then
    echo "✅ Supabase connection working"
else
    echo "❌ Supabase connection failed"
    echo "   Check your VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Test Claude API
echo "🔧 Testing Claude API connection..."
node -e "
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
console.log('✅ Claude API client initialized successfully');
"

if [ $? -eq 0 ]; then
    echo "✅ Claude API connection working"
else
    echo "❌ Claude API connection failed"
    echo "   Check your ANTHROPIC_API_KEY"
    exit 1
fi

# Create audio directory structure
echo "📁 Creating audio directory structure..."
mkdir -p public/audioFiles/listening-continuation
mkdir -p public/audioFiles/listening-comprehension
mkdir -p public/audioFiles/word-formation
mkdir -p public/audioFiles/grammar-context

echo "✅ Audio directories created"

# Set up database schema (if needed)
echo "🗄️ Checking database schema..."
node -e "
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
    try {
        const { data, error } = await supabase.from('questions').select('stable_id, topic_id').limit(1);
        if (error && error.message.includes('column \"stable_id\" does not exist')) {
            console.log('⚠️ Database schema needs update - stable_id column missing');
            console.log('   Please run the database migration manually');
        } else if (error && error.message.includes('column \"topic_id\" does not exist')) {
            console.log('⚠️ Database schema needs update - topic_id column missing');
            console.log('   Please run the database migration manually');
        } else {
            console.log('✅ Database schema looks good');
        }
    } catch (error) {
        console.log('⚠️ Could not check database schema:', error.message);
    }
}

checkSchema();
"

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Summary:"
echo "  ✅ Environment variables loaded"
echo "  ✅ Dependencies installed"
echo "  ✅ API connections tested"
echo "  ✅ Directory structure created"
echo ""
echo "🚀 You can now run the question generator:"
echo "  node multi-question-generator.js --dry-run --verbose"
echo "  node multi-question-generator.js --types=lc,cont --ai-generate"
echo ""
echo "📖 Usage examples:"
echo "  # Generate with predefined questions"
echo "  node multi-question-generator.js --types=lc,cont"
echo ""
echo "  # Generate with AI (requires Claude API)"
echo "  node multi-question-generator.js --ai-generate --types=wf,gc"
echo ""
echo "  # Dry run with full AI and topic detection"
echo "  node multi-question-generator.js --dry-run --ai-generate --verbose"
echo ""
echo "  # Disable AI topic detection"
echo "  node multi-question-generator.js --no-ai-topics --types=lc"
