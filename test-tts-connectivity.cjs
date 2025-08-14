#!/usr/bin/env node
// Test TTS connectivity without credentials - for demonstration
require('dotenv').config({ path: './.env' });

console.log('🔧 TTS Connectivity Test');
console.log('='.repeat(40));

console.log(`Environment:`);
console.log(`  GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || 'NOT SET'}`);
console.log(`  VOICE_NAME: ${process.env.VOICE_NAME || 'DEFAULT'}`);
console.log(`  VOICE_LANG: ${process.env.VOICE_LANG || 'DEFAULT'}`);
console.log(`  AUDIO_BUCKET: ${process.env.AUDIO_BUCKET || 'NOT SET'}`);

// Test if credentials file exists
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const fs = require('fs');
  const exists = fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log(`  Credentials file exists: ${exists ? '✅' : '❌'}`);
} else {
  console.log('  ⚠️ GOOGLE_APPLICATION_CREDENTIALS not set');
}

console.log('\n💡 To proceed with Google Cloud TTS:');
console.log('1. Create service account in Google Cloud Console');
console.log('2. Grant Text-to-Speech User + Storage permissions');
console.log('3. Download JSON key to keys/tts-sa.json');
console.log('4. Export GOOGLE_APPLICATION_CREDENTIALS="$HOME/amiram/keys/tts-sa.json"');
console.log('5. Run regenerate-audio.cjs');

console.log('\n🏃‍♂️ For now, let\'s run in local mode with placeholder files...');