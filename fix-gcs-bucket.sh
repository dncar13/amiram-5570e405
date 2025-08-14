#!/bin/bash
# fix-gcs-bucket.sh - Create Google Cloud Storage bucket for audio files

echo "🔧 SOLUTION 2: Google Cloud Storage Setup"
echo "========================================"
echo

# Check if gsutil is installed
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil not found. Installing Google Cloud SDK..."
    echo "📋 Run: curl https://sdk.cloud.google.com | bash"
    echo "📋 Then: source ~/.bashrc"
    echo "📋 Then: gcloud init"
    exit 1
fi

echo "📋 Current Google Cloud configuration:"
gcloud config list --format="table(section,property,value)"
echo

# Create bucket
BUCKET_NAME="amiram-audio-files"
PROJECT_ID=$(gcloud config get-value project)

echo "☁️ Creating bucket: gs://$BUCKET_NAME"
echo "📍 Project: $PROJECT_ID"
echo

# Create bucket with public access
if gsutil mb -p "$PROJECT_ID" "gs://$BUCKET_NAME"; then
    echo "✅ Bucket created successfully!"
    
    # Set bucket to be publicly readable
    echo "🔓 Setting bucket permissions for public audio access..."
    gsutil iam ch allUsers:objectViewer "gs://$BUCKET_NAME"
    
    if [ $? -eq 0 ]; then
        echo "✅ Bucket permissions set - audio files will be publicly accessible"
        
        # Test bucket access
        echo "🧪 Testing bucket access..."
        gsutil ls "gs://$BUCKET_NAME" > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ Bucket is ready for audio storage!"
            echo
            echo "🎉 Google Cloud Storage is now configured!"
            echo "📍 Bucket: gs://$BUCKET_NAME"
            echo "🔗 Audio files will be available at: https://storage.googleapis.com/$BUCKET_NAME/"
        else
            echo "⚠️ Bucket created but access test failed"
        fi
    else
        echo "⚠️ Bucket created but permission setting failed"
        echo "💡 You may need to set permissions manually in Google Cloud Console"
    fi
else
    echo "❌ Failed to create bucket"
    echo "💡 You may need to:"
    echo "   1. Enable Cloud Storage API in your project"
    echo "   2. Grant storage.admin role to your service account"
    echo "   3. Or create the bucket manually in Google Cloud Console"
fi

echo
echo "📋 After fixing this, test with:"
echo "node check-gcs-status.cjs"
