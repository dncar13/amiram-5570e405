const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'my-amiranet-audio';

async function createBucket() {
  try {
    console.log(`📁 Creating bucket: ${bucketName}`);
    
    // Check if bucket already exists
    const [exists] = await storage.bucket(bucketName).exists();
    if (exists) {
      console.log(`✅ Bucket ${bucketName} already exists`);
      return;
    }
    
    const [bucket] = await storage.createBucket(bucketName, {
      location: 'US',
      storageClass: 'STANDARD',
    });

    console.log(`✅ Bucket ${bucket.name} created successfully`);
    
  } catch (error) {
    console.error('❌ Failed to create bucket:', error.message);
    throw error;
  }
}

createBucket().catch(console.error);