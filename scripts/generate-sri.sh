#!/bin/bash

# Generate SRI Hashes for External Scripts
# Usage: ./scripts/generate-sri.sh

set -e

echo "🔐 Generating SRI Hashes for External Resources..."

# Create temp directory
mkdir -p temp-sri

# Function to generate SRI hash
generate_sri() {
    local url=$1
    local filename=$2
    
    echo "📥 Downloading: $url"
    curl -s -o "temp-sri/$filename" "$url"
    
    if [ -s "temp-sri/$filename" ]; then
        echo "🔑 Generating SRI hash for: $filename"
        local hash=$(openssl dgst -sha384 -binary "temp-sri/$filename" | openssl base64 -A)
        echo "   URL: $url"
        echo "   SRI: sha384-$hash"
        echo "   HTML: integrity=\"sha384-$hash\" crossorigin=\"anonymous\""
        echo ""
    else
        echo "⚠️  File is empty or could not be downloaded: $filename"
        echo ""
    fi
}

# Google Fonts CSS
generate_sri "https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&display=swap" "assistant-font.css"

# Add more external resources as needed
# generate_sri "https://example.com/script.js" "example-script.js"

echo "✅ SRI hash generation complete!"
echo "📁 Downloaded files are in temp-sri/ directory"
echo "🧹 Run 'rm -rf temp-sri' to clean up temporary files"

# Cleanup
echo "🧹 Cleaning up temporary files..."
rm -rf temp-sri

echo ""
echo "📋 To use these hashes:"
echo "   1. Copy the integrity attribute to your HTML"
echo "   2. Add crossorigin=\"anonymous\" to the element"
echo "   3. Test that the resource still loads correctly"