#!/usr/bin/env node
// Local TTS service for when GCS credentials are not available
require('dotenv').config({ path: './.env' });
const fs = require('fs').promises;
const path = require('path');

/**
 * Local TTS synthesis (creates placeholder or real audio files)
 */
async function synthesizeToLocal(audioId, inputText, options = {}) {
  const {
    subfolder = 'tests',
    pauseMs = 0,
    voice = 'en-US-Wavenet-F',
    lang = 'en-US'
  } = options;

  console.log(`🎵 Synthesizing ${audioId} (${subfolder})`);
  console.log(`📝 Text: "${inputText.substring(0, 80)}${inputText.length > 80 ? '...' : ''}"`);
  
  try {
    // Create directory
    const audioDir = path.join(__dirname, '../public/audioFiles', subfolder);
    await fs.mkdir(audioDir, { recursive: true });
    
    const audioFile = path.join(audioDir, `${audioId}.mp3`);
    
    // For now, create placeholder MP3 files by copying existing ones
    const placeholderSources = [
      path.join(__dirname, '../audioFiles/tests/firstQ.mp3'),
      path.join(__dirname, '../audioFiles/tests/secentQ.mp3'),
      path.join(__dirname, '../audioFiles/tests/thitdQ.mp3'),
      path.join(__dirname, '../audioFiles/tests/fourthQ.mp3')
    ];
    
    // Pick a placeholder based on audioId hash
    const hash = audioId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const sourceIndex = hash % placeholderSources.length;
    const sourcePath = placeholderSources[sourceIndex];
    
    try {
      await fs.copyFile(sourcePath, audioFile);
      console.log(`✅ Audio created: ${audioId}.mp3 (placeholder)`);
    } catch (copyError) {
      // If source doesn't exist, create a text file
      await fs.writeFile(audioFile.replace('.mp3', '.txt'), 
        `Audio placeholder for: ${inputText}\n\nGenerated: ${new Date().toISOString()}\nID: ${audioId}`);
      console.log(`✅ Text placeholder created: ${audioId}.txt`);
    }
    
    const url = `/audioFiles/${subfolder}/${audioId}.mp3`;
    const size = 1024; // Placeholder size
    
    return {
      url,
      size,
      fileName: `${audioId}.mp3`,
      audioId,
      success: true,
      placeholder: true
    };
    
  } catch (error) {
    console.error(`❌ Failed to create audio for ${audioId}:`, error.message);
    throw error;
  }
}

/**
 * Wrapper to match the existing synthesizeToUrl interface
 */
async function synthesizeToUrl(filePath, text, options = {}) {
  const [subfolder, audioId] = filePath.split('/');
  
  return await synthesizeToLocal(audioId, text, {
    ...options,
    subfolder
  });
}

module.exports = {
  synthesizeToLocal,
  synthesizeToUrl
};