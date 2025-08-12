// text-to-speech.cjs - Complete TTS Module with Google Cloud TTS & Supabase Storage
require('dotenv').config({ path: './.env' });
const textToSpeech = require('@google-cloud/text-to-speech');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

// ============================================
// Environment Validation
// ============================================
function validateTTSEnvironment() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_SERVICE_ROLE_KEY',
    'GOOGLE_APPLICATION_CREDENTIALS', // Path to Google Cloud service account JSON
    'SUPABASE_STORAGE_BUCKET'         // Name of your Supabase storage bucket
  ];
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`⚠️ Missing TTS environment variables: ${missing.join(', ')}`);
    console.warn(`   Some TTS features may not work properly.`);
  }
}

validateTTSEnvironment();

// ============================================
// Initialize Clients
// ============================================
const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Default TTS settings
const DEFAULT_VOICE = process.env.VOICE_NAME || 'en-US-Wavenet-F';
const DEFAULT_LANG = process.env.VOICE_LANG || 'en-US';
const DEFAULT_SPEAKING_RATE = parseFloat(process.env.SPEAKING_RATE || '1.0');
const DEFAULT_PITCH = parseFloat(process.env.PITCH || '0.0');
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'audio-files';

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a unique filename for audio
 */
function generateAudioFilename(id, type = 'general') {
  const timestamp = Date.now();
  const hash = crypto.createHash('md5').update(`${id}_${timestamp}`).digest('hex').slice(0, 8);
  return `${type}/${id}_${hash}.mp3`;
}

/**
 * Process text for TTS (handle special markers, pauses, etc.)
 */
function processTextForTTS(text, options = {}) {
  let processed = text;
  
  // Replace underscores with pauses (for fill-in-the-blank questions)
  if (options.pauseForUnderscoreMs > 0) {
    // Add SSML break time for underscores
    processed = processed.replace(/______/g, '<break time="1s"/>');
  }
  
  // Clean up any problematic characters
  processed = processed
    .replace(/[\u2018\u2019]/g, "'")  // Smart quotes to simple
    .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes
    .replace(/\u2026/g, '...')        // Ellipsis
    .replace(/\u2014/g, '--')         // Em dash
    .replace(/\u2013/g, '-');         // En dash
  
  return processed;
}

/**
 * Create SSML markup for advanced speech control
 */
function createSSML(text, options = {}) {
  const {
    speakingRate = DEFAULT_SPEAKING_RATE,
    pitch = DEFAULT_PITCH,
    pauseForUnderscoreMs = 0,
    emphasis = []
  } = options;
  
  let ssml = `<speak>`;
  
  // Add prosody for rate and pitch
  if (speakingRate !== 1.0 || pitch !== 0.0) {
    ssml += `<prosody rate="${speakingRate}" pitch="${pitch}st">`;
  }
  
  // Process the text
  let processedText = text;
  
  // Handle underscores as pauses
  if (pauseForUnderscoreMs > 0) {
    processedText = processedText.replace(
      /______/g, 
      `<break time="${pauseForUnderscoreMs}ms"/>`
    );
  }
  
  // Add emphasis to specific words if provided
  emphasis.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    processedText = processedText.replace(
      regex,
      `<emphasis level="moderate">${word}</emphasis>`
    );
  });
  
  ssml += processedText;
  
  // Close prosody tag if opened
  if (speakingRate !== 1.0 || pitch !== 0.0) {
    ssml += `</prosody>`;
  }
  
  ssml += `</speak>`;
  
  return ssml;
}

// ============================================
// Main TTS Functions
// ============================================

/**
 * Synthesize text to audio and upload to Supabase Storage
 * @param {string} id - Unique identifier for the audio
 * @param {string} text - Text to synthesize
 * @param {string|object} typeOrOptions - Type string or options object
 * @returns {Promise<{url: string, size: number, filename: string, publicUrl: string}>}
 */
async function synthesizeToUrl(id, text, typeOrOptions = 'general') {
  try {
    // Handle both string type and options object
    const options = typeof typeOrOptions === 'string' 
      ? { type: typeOrOptions }
      : typeOrOptions;
    
    const {
      type = 'general',
      voice = DEFAULT_VOICE,
      languageCode = DEFAULT_LANG,
      speakingRate = DEFAULT_SPEAKING_RATE,
      pitch = DEFAULT_PITCH,
      audioEncoding = 'MP3',
      useSSML = false,
      pauseForUnderscoreMs = 0,
      emphasis = []
    } = options;
    
    // Prepare the input
    let input;
    if (useSSML || pauseForUnderscoreMs > 0 || emphasis.length > 0) {
      input = {
        ssml: createSSML(text, {
          speakingRate,
          pitch,
          pauseForUnderscoreMs,
          emphasis
        })
      };
    } else {
      input = {
        text: processTextForTTS(text, { pauseForUnderscoreMs })
      };
    }
    
    // Prepare TTS request
    const request = {
      input,
      voice: {
        languageCode,
        name: voice
      },
      audioConfig: {
        audioEncoding,
        speakingRate: useSSML ? 1.0 : speakingRate, // Rate in SSML overrides this
        pitch: useSSML ? 0.0 : pitch,               // Pitch in SSML overrides this
        volumeGainDb: 0.0
      }
    };
    
    console.log(`🎵 Synthesizing audio for: ${id} (${text.slice(0, 50)}...)`);
    
    // Call Google Cloud TTS
    const [response] = await ttsClient.synthesizeSpeech(request);
    
    if (!response.audioContent) {
      throw new Error('No audio content received from TTS service');
    }
    
    // Generate filename
    const filename = generateAudioFilename(id, type);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, response.audioContent, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
        upsert: true // Overwrite if exists
      });
    
    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);
    
    const result = {
      url: publicUrl,
      size: response.audioContent.length,
      filename: filename,
      publicUrl: publicUrl,
      duration: estimateDuration(text, speakingRate),
      metadata: {
        voice,
        languageCode,
        speakingRate,
        pitch,
        type,
        synthesizedAt: new Date().toISOString()
      }
    };
    
    console.log(`✅ Audio uploaded: ${publicUrl} (${result.size} bytes)`);
    
    return result;
    
  } catch (error) {
    console.error(`❌ TTS Error for ${id}:`, error.message);
    throw error;
  }
}

/**
 * Batch synthesize multiple texts
 * @param {Array} items - Array of {id, text} objects
 * @param {number} concurrency - Number of parallel requests
 * @returns {Promise<{results: Array, success: number, failed: number}>}
 */
async function synthesizeBatch(items, concurrency = 3) {
  console.log(`🎬 Starting batch synthesis for ${items.length} items...`);
  
  const results = [];
  let successCount = 0;
  let failedCount = 0;
  
  // Process in chunks for rate limiting
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    
    console.log(`📦 Processing batch ${Math.floor(i/concurrency) + 1}/${Math.ceil(items.length/concurrency)}`);
    
    const promises = batch.map(item => 
      synthesizeToUrl(item.id, item.text, item.type || 'batch')
        .then(audioResult => {
          successCount++;
          return {
            id: item.id,
            success: true,
            audioResult
          };
        })
        .catch(error => {
          failedCount++;
          console.error(`❌ Failed ${item.id}: ${error.message}`);
          return {
            id: item.id,
            success: false,
            error: error.message
          };
        })
    );
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Small delay between batches to respect rate limits
    if (i + concurrency < items.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`✅ Batch complete: ${successCount} success, ${failedCount} failed`);
  
  return {
    results,
    success: successCount,
    failed: failedCount
  };
}

/**
 * Validate that an audio URL is accessible
 * @param {string} url - URL to validate
 * @returns {Promise<object>} Validation result
 */
async function validateAudioUrl(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      timeout: 5000
    });
    
    const contentType = response.headers.get('content-type') || '';
    const contentLength = parseInt(response.headers.get('content-length') || '0');
    
    return {
      accessible: response.ok,
      status: response.status,
      contentType,
      contentLength,
      isAudio: /audio/i.test(contentType),
      sizeOk: contentLength > 1000, // At least 1KB
      validFormat: /audio\/(mpeg|mp3|wav|ogg)/i.test(contentType),
      error: response.ok ? null : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      accessible: false,
      status: 0,
      isAudio: false,
      sizeOk: false,
      validFormat: false,
      error: error.message
    };
  }
}

/**
 * Delete audio file from storage
 * @param {string} filename - Filename to delete
 */
async function deleteAudioFile(filename) {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filename]);
    
    if (error) throw error;
    
    console.log(`🗑️ Deleted audio file: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to delete ${filename}:`, error.message);
    return false;
  }
}

/**
 * List all audio files in storage
 * @param {string} folder - Folder to list (optional)
 */
async function listAudioFiles(folder = '') {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder, {
        limit: 1000,
        offset: 0
      });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`❌ Failed to list files:`, error.message);
    return [];
  }
}

/**
 * Estimate audio duration based on text length and speaking rate
 * @param {string} text - Text to estimate
 * @param {number} rate - Speaking rate
 * @returns {number} Estimated duration in seconds
 */
function estimateDuration(text, rate = 1.0) {
  // Average speaking rate is ~150 words per minute
  const words = text.split(/\s+/).length;
  const baseSeconds = (words / 150) * 60;
  return Math.round(baseSeconds / rate);
}

/**
 * Clean up old/unused audio files
 * @param {number} daysOld - Delete files older than this many days
 */
async function cleanupOldAudio(daysOld = 30) {
  try {
    console.log(`🧹 Cleaning up audio files older than ${daysOld} days...`);
    
    const files = await listAudioFiles();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    let deletedCount = 0;
    
    for (const file of files) {
      const fileDate = new Date(file.created_at);
      if (fileDate < cutoffDate) {
        await deleteAudioFile(file.name);
        deletedCount++;
      }
    }
    
    console.log(`✅ Cleanup complete: ${deletedCount} files deleted`);
    return deletedCount;
    
  } catch (error) {
    console.error(`❌ Cleanup failed:`, error.message);
    return 0;
  }
}

// ============================================
// Test Function
// ============================================
async function testTTS() {
  console.log('🧪 Testing TTS functionality...');
  
  try {
    // Test basic synthesis
    const result = await synthesizeToUrl(
      'test_' + Date.now(),
      'Hello, this is a test of the text to speech system.',
      {
        type: 'test',
        voice: 'en-US-Wavenet-F',
        speakingRate: 1.0
      }
    );
    
    console.log('✅ Test successful:', result);
    
    // Validate the URL
    const validation = await validateAudioUrl(result.url);
    console.log('🔍 Validation:', validation);
    
    // Clean up test file
    await deleteAudioFile(result.filename);
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// ============================================
// Exports
// ============================================
module.exports = {
  // Main functions
  synthesizeToUrl,
  synthesizeBatch,
  validateAudioUrl,
  
  // Storage management
  deleteAudioFile,
  listAudioFiles,
  cleanupOldAudio,
  
  // Utilities
  processTextForTTS,
  createSSML,
  estimateDuration,
  generateAudioFilename,
  
  // Test
  testTTS
};

// Run test if this file is executed directly
if (require.main === module) {
  testTTS().then(success => {
    process.exit(success ? 0 : 1);
  });
}