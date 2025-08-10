// text-to-speech.cjs - Advanced Google Cloud TTS with Storage integration
require('dotenv').config();
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');

// Initialize clients
const tts = new TextToSpeechClient();
const storage = new Storage();

// Configuration
const BUCKET = process.env.AUDIO_BUCKET || 'amiram-audio-files';
const PREFIX = process.env.AUDIO_PREFIX || 'listening/';
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'https://storage.googleapis.com';
const MAX_CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || '8');

const VOICE_CONFIG = {
  name: process.env.VOICE_NAME || 'en-US-Wavenet-F',
  languageCode: process.env.VOICE_LANG || 'en-US',
  ssmlGender: 'FEMALE'
};

const AUDIO_CONFIG = {
  audioEncoding: 'MP3',
  speakingRate: parseFloat(process.env.SPEAKING_RATE || '1.0'),
  pitch: parseFloat(process.env.PITCH || '0.0'),
  sampleRateHertz: 24000
};

// Convert text to SSML with natural pauses
function toSSML(text) {
  if (!text) return '<speak></speak>';
  
  // Add natural pauses
  let ssml = String(text)
    .replace(/\.\s+/g, '. <break time="500ms"/>')  // After sentences
    .replace(/,\s+/g, ', <break time="300ms"/>')   // After commas
    .replace(/_+/g, '<break time="1s"/>')          // Explicit pauses
    .replace(/\?\s+/g, '? <break time="600ms"/>')  // After questions
    .replace(/!\s+/g, '! <break time="600ms"/>');  // After exclamations
  
  return `<speak>${ssml}</speak>`;
}

// Generate stable ID for consistent naming
function generateStableId(text, prefix = 'audio') {
  const hash = crypto.createHash('md5').update(text).digest('hex').slice(0, 10);
  return `${prefix}_${hash}`;
}

// Create bucket if it doesn't exist
async function ensureBucketExists() {
  try {
    const bucket = storage.bucket(BUCKET);
    const [exists] = await bucket.exists();
    
    if (!exists) {
      console.log(`🪣 Creating bucket: ${BUCKET}`);
      await storage.createBucket(BUCKET, {
        location: 'US',
        storageClass: 'STANDARD',
        iamConfiguration: {
          uniformBucketLevelAccess: {
            enabled: true
          }
        }
      });
      
      // Make bucket publicly readable
      await bucket.iam.setPolicy({
        bindings: [
          {
            role: 'roles/storage.objectViewer',
            members: ['allUsers']
          }
        ]
      });
      
      console.log(`✅ Bucket ${BUCKET} created and configured`);
    }
    
    return bucket;
  } catch (error) {
    console.error(`❌ Bucket setup failed:`, error.message);
    throw new Error(`Failed to setup bucket: ${error.message}`);
  }
}

// Synthesize speech and upload to GCS
async function synthesizeToGCS(id, text, metadata = {}, retries = 3) {
  if (!id || !text) {
    throw new Error('Missing required parameters: id and text');
  }

  console.log(`🎵 Synthesizing audio for ID: ${id}`);
  
  const bucket = await ensureBucketExists();
  const fileName = `${PREFIX}${id}.mp3`;
  const file = bucket.file(fileName);
  
  // Check if file already exists
  const [exists] = await file.exists();
  if (exists) {
    console.log(`📁 Audio already exists: ${fileName}`);
    const publicUrl = `${PUBLIC_BASE_URL}/${BUCKET}/${fileName}`;
    return {
      objectPath: fileName,
      url: publicUrl,
      public: true,
      size: 0,
      cached: true
    };
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Prepare TTS request
      const ssml = toSSML(text);
      const request = {
        input: { ssml },
        voice: {
          ...VOICE_CONFIG,
          ...metadata.voice // Allow override
        },
        audioConfig: {
          ...AUDIO_CONFIG,
          ...metadata.audioConfig // Allow override
        }
      };

      console.log(`🔊 TTS Request (attempt ${attempt + 1}/${retries}):`, {
        textLength: text.length,
        voice: request.voice.name,
        rate: request.audioConfig.speakingRate
      });

      // Synthesize speech
      const [response] = await tts.synthesizeSpeech(request);
      
      if (!response.audioContent || response.audioContent.length === 0) {
        throw new Error('No audio content returned from TTS');
      }

      console.log(`✅ TTS synthesis successful: ${response.audioContent.length} bytes`);

      // Upload to GCS
      const stream = file.createWriteStream({
        metadata: {
          contentType: 'audio/mpeg',
          cacheControl: 'public, max-age=31536000', // 1 year
          metadata: {
            questionId: id,
            textLength: text.length.toString(),
            synthesizedAt: new Date().toISOString(),
            ...metadata
          }
        }
      });

      await new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', resolve);
        stream.end(response.audioContent);
      });

      // Make file publicly accessible
      await file.makePublic();

      const publicUrl = `${PUBLIC_BASE_URL}/${BUCKET}/${fileName}`;
      console.log(`🔗 Audio uploaded: ${publicUrl}`);

      return {
        objectPath: fileName,
        url: publicUrl,
        public: true,
        size: response.audioContent.length,
        cached: false
      };

    } catch (error) {
      const isRetryable = error.code === 429 || error.code >= 500 || 
                         error.message.includes('timeout') ||
                         error.message.includes('network');
      
      if (attempt < retries - 1 && isRetryable) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.log(`⚠️ Attempt ${attempt + 1} failed (${error.message}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error(`❌ Failed to synthesize/upload ${id}:`, error.message);
        throw error;
      }
    }
  }
}

// Process multiple texts with intelligent batching
async function synthesizeBatch(textItems, maxConcurrency = MAX_CONCURRENCY) {
  console.log(`🚀 Starting batch synthesis: ${textItems.length} items (max concurrency: ${maxConcurrency})`);
  
  const results = [];
  const errors = [];
  
  // Process in controlled batches
  for (let i = 0; i < textItems.length; i += maxConcurrency) {
    const batch = textItems.slice(i, i + maxConcurrency);
    const batchNum = Math.floor(i / maxConcurrency) + 1;
    const totalBatches = Math.ceil(textItems.length / maxConcurrency);
    
    console.log(`📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} items)`);
    
    const batchPromises = batch.map(async (item) => {
      try {
        const id = item.id || generateStableId(item.text);
        const result = await synthesizeToGCS(id, item.text, item.metadata || {});
        return { ...item, id, audioResult: result };
      } catch (error) {
        console.error(`❌ Item failed:`, { id: item.id, error: error.message });
        errors.push({ item, error: error.message });
        return { ...item, audioResult: null, error: error.message };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Rate limiting between batches
    if (i + maxConcurrency < textItems.length) {
      console.log(`⏳ Pausing 2s between batches...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const successCount = results.filter(r => r.audioResult && !r.error).length;
  console.log(`✅ Batch synthesis complete: ${successCount}/${textItems.length} successful`);
  
  if (errors.length > 0) {
    console.log(`⚠️ Errors encountered:`, errors.length);
    errors.forEach(err => console.log(`   - ${err.item.id}: ${err.error}`));
  }
  
  return { results, errors, summary: { total: textItems.length, successful: successCount, failed: errors.length } };
}

// Validate audio URL accessibility
async function validateAudioUrl(url) {
  try {
    const fetch = require('node-fetch');
    const response = await fetch(url, { 
      method: 'HEAD',
      timeout: 10000 // 10 second timeout
    });
    
    const contentType = response.headers.get('content-type') || '';
    const contentLength = parseInt(response.headers.get('content-length')) || 0;
    
    return {
      url,
      status: response.status,
      contentType,
      contentLength,
      accessible: response.status === 200,
      isAudio: contentType.includes('audio') || contentType.includes('mpeg'),
      sizeOk: contentLength > 1024, // At least 1KB
      public: true
    };
  } catch (error) {
    return {
      url,
      status: 0,
      contentType: null,
      contentLength: 0,
      accessible: false,
      isAudio: false,
      sizeOk: false,
      public: false,
      error: error.message
    };
  }
}

// Clean up old audio files (optional maintenance)
async function cleanupOldAudio(olderThanDays = 30) {
  try {
    const bucket = storage.bucket(BUCKET);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const [files] = await bucket.getFiles({ prefix: PREFIX });
    const oldFiles = files.filter(file => {
      const created = new Date(file.metadata.timeCreated);
      return created < cutoffDate;
    });
    
    console.log(`🧹 Found ${oldFiles.length} old audio files to clean up`);
    
    for (const file of oldFiles) {
      await file.delete();
      console.log(`🗑️ Deleted: ${file.name}`);
    }
    
    return { deleted: oldFiles.length };
  } catch (error) {
    console.error(`❌ Cleanup failed:`, error.message);
    throw error;
  }
}

module.exports = {
  synthesizeToGCS,
  synthesizeBatch,
  validateAudioUrl,
  toSSML,
  generateStableId,
  ensureBucketExists,
  cleanupOldAudio,
  
  // Legacy compatibility
  synthesizeSpeech: synthesizeToGCS,
  stableIdFromText: generateStableId
};
