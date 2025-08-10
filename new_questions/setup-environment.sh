#!/bin/bash

# setup-environment.sh - Configure environment for multi-question generator

echo "🚀 Setting up Multi-Question Generator Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment variable
check_env_var() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}❌ Missing environment variable: $1${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 is set${NC}"
        return 0
    fi
}

echo -e "\n${BLUE}📋 Step 1: Checking Required Environment Variables${NC}"
echo "---------------------------------------------------"

# Load .env file if it exists
if [ -f "../.env" ]; then
    echo -e "${GREEN}📄 Loading .env file...${NC}"
    source "../.env"
else
    echo -e "${YELLOW}⚠️ No .env file found. Please create one with required variables.${NC}"
fi

# Check required environment variables
ENV_OK=true

if ! check_env_var "ANTHROPIC_API_KEY"; then ENV_OK=false; fi
if ! check_env_var "VITE_SUPABASE_URL"; then ENV_OK=false; fi
if ! check_env_var "VITE_SUPABASE_SERVICE_ROLE_KEY"; then ENV_OK=false; fi
if ! check_env_var "GOOGLE_APPLICATION_CREDENTIALS"; then ENV_OK=false; fi

# Optional but recommended
if ! check_env_var "AUDIO_BUCKET"; then 
    echo -e "${YELLOW}⚠️ AUDIO_BUCKET not set. Using default: amiram-audio-files${NC}"
    export AUDIO_BUCKET="amiram-audio-files"
fi

if ! check_env_var "VOICE_NAME"; then
    echo -e "${YELLOW}⚠️ VOICE_NAME not set. Using default: en-US-Wavenet-F${NC}"  
    export VOICE_NAME="en-US-Wavenet-F"
fi

echo -e "\n${BLUE}📋 Step 2: Checking Dependencies${NC}"
echo "-----------------------------------"

# Check Node.js and npm
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    ENV_OK=false
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    ENV_OK=false
fi

# Check Google Cloud SDK
if command_exists gcloud; then
    GCLOUD_VERSION=$(gcloud --version | head -n1)
    echo -e "${GREEN}✅ $GCLOUD_VERSION${NC}"
    
    # Check if authenticated
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
        ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
        echo -e "${GREEN}✅ Authenticated as: $ACTIVE_ACCOUNT${NC}"
    else
        echo -e "${YELLOW}⚠️ Not authenticated with gcloud${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Google Cloud SDK not found (optional for local development)${NC}"
fi

echo -e "\n${BLUE}📋 Step 3: Testing API Connections${NC}"
echo "------------------------------------"

# Test Anthropic API
echo -e "${BLUE}🤖 Testing Claude API...${NC}"
if [ ! -z "$ANTHROPIC_API_KEY" ]; then
    TEST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
        https://api.anthropic.com/v1/messages \
        -H "Content-Type: application/json" \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":10,"messages":[{"role":"user","content":"Test"}]}')
    
    if [ "$TEST_RESPONSE" = "200" ]; then
        echo -e "${GREEN}✅ Claude API connection successful${NC}"
    else
        echo -e "${RED}❌ Claude API connection failed (HTTP $TEST_RESPONSE)${NC}"
        ENV_OK=false
    fi
else
    echo -e "${RED}❌ Cannot test Claude API - ANTHROPIC_API_KEY not set${NC}"
fi

# Test Supabase connection
echo -e "${BLUE}🗄️ Testing Supabase connection...${NC}"
if [ ! -z "$VITE_SUPABASE_URL" ] && [ ! -z "$VITE_SUPABASE_SERVICE_ROLE_KEY" ]; then
    TEST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "apikey: $VITE_SUPABASE_SERVICE_ROLE_KEY" \
        -H "Authorization: Bearer $VITE_SUPABASE_SERVICE_ROLE_KEY" \
        "$VITE_SUPABASE_URL/rest/v1/")
    
    if [ "$TEST_RESPONSE" = "200" ]; then
        echo -e "${GREEN}✅ Supabase connection successful${NC}"
    else
        echo -e "${RED}❌ Supabase connection failed (HTTP $TEST_RESPONSE)${NC}"
        ENV_OK=false
    fi
else
    echo -e "${RED}❌ Cannot test Supabase - credentials not set${NC}"
fi

echo -e "\n${BLUE}📋 Step 4: Google Cloud Storage Setup${NC}"
echo "---------------------------------------"

if [ ! -z "$AUDIO_BUCKET" ]; then
    if command_exists gsutil; then
        echo -e "${BLUE}📦 Checking if bucket exists: $AUDIO_BUCKET${NC}"
        if gsutil ls "gs://$AUDIO_BUCKET" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Bucket exists: gs://$AUDIO_BUCKET${NC}"
        else
            echo -e "${YELLOW}⚠️ Bucket doesn't exist. Creating it...${NC}"
            if gsutil mb "gs://$AUDIO_BUCKET" 2>/dev/null; then
                echo -e "${GREEN}✅ Created bucket: gs://$AUDIO_BUCKET${NC}"
                
                # Make bucket public
                gsutil iam ch allUsers:objectViewer "gs://$AUDIO_BUCKET"
                echo -e "${GREEN}✅ Made bucket publicly accessible${NC}"
            else
                echo -e "${RED}❌ Failed to create bucket. Check permissions.${NC}"
                echo -e "${YELLOW}💡 Try running: gsutil mb gs://$AUDIO_BUCKET${NC}"
                ENV_OK=false
            fi
        fi
    else
        echo -e "${YELLOW}⚠️ gsutil not available. Bucket creation will happen automatically.${NC}"
    fi
fi

echo -e "\n${BLUE}📋 Step 5: Installing Node.js Dependencies${NC}"
echo "--------------------------------------------"

if [ -f "../package.json" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    cd .. && npm install >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        ENV_OK=false
    fi
    cd new_questions
else
    echo -e "${YELLOW}⚠️ No package.json found in parent directory${NC}"
fi

# Final status
echo -e "\n${BLUE}🎯 Setup Summary${NC}"
echo "=================="

if [ "$ENV_OK" = true ]; then
    echo -e "${GREEN}🎉 Environment setup completed successfully!${NC}"
    echo -e "\n${GREEN}✅ Ready to run:${NC}"
    echo -e "   ${BLUE}node multi-question-generator.cjs --dry-run --verbose${NC}"
    echo -e "   ${BLUE}node multi-question-generator.cjs --types=wf,gc${NC}"
    echo -e "   ${BLUE}node multi-question-generator.cjs --ai-generate --types=lc,cont${NC}"
    echo -e "\n${GREEN}🔗 Next steps:${NC}"
    echo -e "   1. Run the database schema updates in Supabase SQL Editor"
    echo -e "   2. Test question generation with --dry-run"
    echo -e "   3. Generate your first batch of questions!"
else
    echo -e "${RED}❌ Environment setup incomplete. Please fix the issues above.${NC}"
    echo -e "\n${YELLOW}📋 Common fixes:${NC}"
    echo -e "   1. Set missing environment variables in ../.env"
    echo -e "   2. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
    echo -e "   3. Authenticate: gcloud auth login"
    echo -e "   4. Set up service account for Text-to-Speech"
    exit 1
fi

echo -e "\n${BLUE}📖 For help, see README-GENERATOR.md${NC}"