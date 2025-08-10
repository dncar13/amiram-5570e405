🚀 **STEP 2: Google Cloud Storage Setup**
==========================================

**Instructions for Google Cloud Console:**

1. **Open Google Cloud Storage Console**
   - Already opened in browser: https://console.cloud.google.com/storage
   - Make sure you're in the correct project (amiram-463020)

2. **Create Bucket**
   - Click "CREATE BUCKET" button
   - Bucket name: `amiram-audio-files`
   - If name is taken, try: `amiram-audio-files-463020`
   - Location: Choose "Region" closest to your users
   - Storage class: "Standard"
   - Access control: "Fine-grained"
   - Click "CREATE"

3. **Set Public Access**
   - Go to your new bucket
   - Click "PERMISSIONS" tab
   - Click "ADD PRINCIPAL"
   - New principals: `allUsers`
   - Role: "Storage Object Viewer"
   - Click "SAVE"

4. **Test the Setup**
   - Run: `node check-gcs-status.cjs`
   - Should show "✅ Google Cloud Storage is ready!"

**Alternative: Manual bucket name in .env**
If bucket creation fails, you can:
1. Use any existing bucket you have
2. Update AUDIO_BUCKET_NAME in .env file
3. Make sure the bucket has public read access

**Next step after both are complete:**
```bash
node check-database-status.cjs && node check-gcs-status.cjs
```

Both should show ✅ green checkmarks!
