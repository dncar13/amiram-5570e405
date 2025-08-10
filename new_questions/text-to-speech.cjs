// text-to-speech.js - Google Cloud TTS integration for AMIRAM
require('dotenv').config({ path: '../.env' });
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');

const tts = new TextToSpeechClient();
const storage = new Storage();

const BUCKET = process.env.AUDIO_BUCKET;
const PREFIX = process.env.AUDIO_PREFIX || 'audio/';
const VOICE = {
  name: process.env.VOICE_NAME || 'en-US-Wavenet-F',
  languageCode: process.env.VOICE_LANG || 'en-US'
};
const PUBLIC = String(process.env.PUBLIC_FILES || 'true').toLowerCase() === 'true';
const MAX_CONCURRENCY = parseInt(process.env.MAX_CONCURRENCY || '8');

// Convert text to SSML format, replacing underscores with pauses
function toSSML(text) {
  const withBreaks = String(text || '').replace(/_+/g, '<break time="1s"/>');
  return `<speak>${withBreaks}</speak>`;
}

// Generate stable ID from text for consistent file naming
function stableIdFromText(text) {
  return 'lc_' + crypto.createHash('md5').update(text).digest('hex').slice(0, 10);
}

// Synthesize speech and upload to GCS with retry and backoff
async function synthesizeToGCS(id, text, retries = 3) {
  if (!BUCKET) throw new Error('Missing AUDIO_BUCKET environment variable');
  if (!id) throw new Error('Missing question id');
  if (!text) throw new Error('Missing text to synthesize');

  console.log(`🎵 Synthesizing audio for ID: ${id}`);
  console.log(`📝 Text: "${text}"`);

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Generate SSML and synthesize
      const ssml = toSSML(text);
      console.log(`🔊 SSML: ${ssml}`);

      const [response] = await tts.synthesizeSpeech({
        input: { ssml },
        voice: VOICE,
        audioConfig: { audioEncoding: 'MP3' }
      });

      if (!response.audioContent) {
        throw new Error('No audio content returned from TTS');
      }

      console.log(`✅ TTS synthesis successful, audio size: ${response.audioContent.length} bytes`);

      // Create bucket if it doesn't exist
      try {
        await storage.bucket(BUCKET).get();
        console.log(`📦 Using existing bucket: ${BUCKET}`);
      } catch (error) {
        if (error.code === 404) {
          console.log(`📦 Creating bucket: ${BUCKET}`);
          await storage.createBucket(BUCKET, {
            location: 'US',
            storageClass: 'STANDARD'
          });
        } else {
          throw error;
        }
      }

      const fileName = `${PREFIX}${id}.mp3`;
      const file = storage.bucket(BUCKET).file(fileName);
      
      // Upload audio file to GCS
      await file.save(response.audioContent, {
        metadata: {
          contentType: 'audio/mpeg',
          cacheControl: 'public, max-age=31536000' // 1 year cache
        }
      });

      // Make file publicly accessible if required
      if (PUBLIC) {
        await file.makePublic();
      }

      console.log(`☁️ Uploaded to GCS: gs://${BUCKET}/${fileName}`);

      // Generate public URL
      const url = `https://storage.googleapis.com/${BUCKET}/${fileName}`;
      console.log(`🔗 Public URL: ${url}`);

      return { 
        objectPath: `gs://${BUCKET}/${fileName}`, 
        url, 
        public: PUBLIC,
        size: response.audioContent.length,
        bucket: BUCKET,
        fileName
      };

    } catch (error) {
      const isRetryable = error.code === 429 || error.code >= 500;
      
      if (attempt < retries - 1 && isRetryable) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`⚠️ Attempt ${attempt + 1} failed (${error.message}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error(`❌ Failed to synthesize audio for ${id} after ${retries} attempts:`, error.message);
        throw error;
      }
    }
  }
}

// Process multiple texts with concurrency control
async function synthesizeBatch(textItems, maxConcurrency = MAX_CONCURRENCY) {
  console.log(`🚀 Starting batch synthesis of ${textItems.length} items with max concurrency ${maxConcurrency}`);
  
  const results = [];
  const errors = [];
  
  // Process in batches to control concurrency
  for (let i = 0; i < textItems.length; i += maxConcurrency) {
    const batch = textItems.slice(i, i + maxConcurrency);
    console.log(`📦 Processing batch ${Math.floor(i / maxConcurrency) + 1} (${batch.length} items)`);
    
    const batchPromises = batch.map(async (item) => {
      try {
        const id = item.id || stableIdFromText(item.text);
        const result = await synthesizeToGCS(id, item.text);
        return { ...item, id, audioResult: result };
      } catch (error) {
        console.error(`❌ Batch item failed:`, error);
        errors.push({ item, error: error.message });
        return { ...item, audioResult: null, error: error.message };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Brief pause between batches to be respectful to the API
    if (i + maxConcurrency < textItems.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`✅ Batch synthesis complete. ${results.filter(r => r.audioResult).length}/${textItems.length} successful`);
  
  if (errors.length > 0) {
    console.log(`⚠️ Errors encountered:`, errors);
  }
  
  return { results, errors };
}

// Validate audio URL is accessible
async function validateAudioUrl(url) {
  try {
    const fetch = require('node-fetch');
    const response = await fetch(url, { method: 'HEAD' });
    
    return {
      url,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: parseInt(response.headers.get('content-length')) || 0,
      accessible: response.status === 200,
      isAudio: response.headers.get('content-type')?.includes('audio'),
      sizeOk: (parseInt(response.headers.get('content-length')) || 0) > 1024
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
      error: error.message
    };
  }
}

module.exports = { 
  synthesizeToGCS, 
  synthesizeBatch,
  toSSML, 
  stableIdFromText,
  validateAudioUrl
};