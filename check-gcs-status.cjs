// check-gcs-status.cjs - Check Google Cloud Storage configuration
require('dotenv').config();
const { Storage } = require('@google-cloud/storage');

async function checkGCSStatus() {
  console.log('☁️ Google Cloud Storage Status Check');
  console.log('='.repeat(50));
  
  try {
    // Initialize storage client
    const storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    
    const bucketName = process.env.AUDIO_BUCKET_NAME || 'amiram-audio-files';
    const bucket = storage.bucket(bucketName);
    
    console.log('📋 Checking bucket existence...');
    const [exists] = await bucket.exists();
    
    if (!exists) {
      console.log('❌ Bucket does not exist - need to create:', bucketName);
      return { ready: false, issue: 'bucket_missing', bucketName };
    }
    
    console.log('✅ Bucket exists:', bucketName);
    
    // Check bucket permissions
    console.log('📋 Checking bucket permissions...');
    try {
      const [metadata] = await bucket.getMetadata();
      console.log('✅ Can access bucket metadata');
      
      // Try to list files (limited)
      const [files] = await bucket.getFiles({ maxResults: 5 });
      console.log(`📊 Found ${files.length} audio files in bucket`);
      
      if (files.length > 0) {
        console.log('📁 Recent files:');
        files.forEach(file => {
          console.log(`   • ${file.name} (${Math.round(file.metadata.size / 1024)}KB)`);
        });
      }
      
      return { 
        ready: true, 
        bucketName, 
        filesCount: files.length,
        hasPermissions: true 
      };
      
    } catch (permError) {
      console.log('❌ Permission error:', permError.message);
      return { 
        ready: false, 
        issue: 'permissions_error', 
        bucketName,
        error: permError.message 
      };
    }
    
  } catch (error) {
    console.log('❌ GCS configuration error:', error.message);
    return { 
      ready: false, 
      issue: 'config_error', 
      error: error.message 
    };
  }
}

if (require.main === module) {
  checkGCSStatus().then((status) => {
    console.log('\n' + '='.repeat(50));
    if (status.ready) {
      console.log('🎉 Google Cloud Storage is ready!');
      console.log(`☁️ Bucket: ${status.bucketName}`);
      console.log(`📊 Audio files: ${status.filesCount}`);
    } else {
      console.log('❌ Google Cloud Storage needs configuration');
      console.log('📋 Issue:', status.issue);
      if (status.error) {
        console.log('🔍 Details:', status.error);
      }
    }
  });
}

module.exports = { checkGCSStatus };
