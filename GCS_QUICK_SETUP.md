📋 **QUICK SOLUTION: Manual GCS Bucket Creation**

**Option 1: Google Cloud Console (Fastest - 30 seconds)**
1. Go to: https://console.cloud.google.com/storage
2. Click "Create Bucket"
3. Name: amiram-audio-files
4. Location: Choose closest to your users
5. Access Control: Fine-grained
6. Create bucket
7. Go to Permissions tab → Add Principal
8. Principal: allUsers
9. Role: Storage Object Viewer
10. Save

**Option 2: Install gcloud CLI (if you want command line)**
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
source ~/.bashrc
gcloud init

# Create bucket
gsutil mb gs://amiram-audio-files
gsutil iam ch allUsers:objectViewer gs://amiram-audio-files
```

**Option 3: Alternative bucket name (if amiram-audio-files is taken)**
Try: amiram-audio-files-YOUR_PROJECT_ID

**After creating the bucket:**
```bash
node check-gcs-status.cjs  # Verify it works
```
