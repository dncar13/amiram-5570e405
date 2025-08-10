#!/bin/bash
# verify-setup.sh - Check if both database and GCS are ready

echo "🔍 Verifying Complete Setup"
echo "============================"
echo

echo "📋 Checking Database..."
node check-database-status.cjs
echo

echo "☁️ Checking Google Cloud Storage..."
node check-gcs-status.cjs
echo

echo "🎯 Final Status Check..."
if node check-database-status.cjs | grep -q "Database is ready" && node check-gcs-status.cjs | grep -q "Google Cloud Storage is ready"; then
    echo "🎉 SUCCESS! Everything is ready!"
    echo
    echo "✅ You can now run:"
    echo "   node multi-question-generator.cjs --upload-to-db --generate-audio"
    echo
    echo "📊 This will:"
    echo "   • Generate 27 high-quality questions"
    echo "   • Upload them to your database"
    echo "   • Create audio files in the cloud"
    echo "   • Every question will appear in the correct topic in your UI"
else
    echo "⚠️ Some components still need setup"
    echo "📋 Follow the instructions above to complete setup"
fi
