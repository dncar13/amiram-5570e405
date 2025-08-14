// tts-helper.cjs
// Turns a text (or SSML) into an MP3 Buffer using Google Cloud TTS.

const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const tts = new TextToSpeechClient();

const VOICE  = process.env.VOICE_NAME || 'en-US-Wavenet-F';
const LANG   = process.env.VOICE_LANG || 'en-US';

/**
 * Build TTS input. If pauseMs > 0, convert ______ to <break time="pauseMs"/>.
 */
function buildInput(text, pauseMs = 0) {
  if (!pauseMs) return { text: String(text) };
  const ssml = `<speak>${String(text).replace(/_+/g, `<break time="${pauseMs}ms"/>`)}</speak>`;
  return { ssml };
}

/**
 * Synthesize to MP3 Buffer.
 * @param {string} text - Plain text of the script (or with '______' blanks)
 * @param {object} opts - { pauseMs?: number } -> if >0, blank -> SSML break
 * @returns {Promise<{ buffer: Buffer, size: number }>}
 */
async function synthesizeMp3(text, { pauseMs = 0 } = {}) {
  const input = buildInput(text, pauseMs);
  
  console.log(`🎵 TTS Request - Voice: ${VOICE}, Lang: ${LANG}`);
  console.log(`📝 Input: ${input.ssml ? 'SSML' : 'Text'} - "${String(text).substring(0, 80)}${String(text).length > 80 ? '...' : ''}"`);
  if (pauseMs > 0) {
    console.log(`⏸️ Pause for blanks: ${pauseMs}ms`);
  }

  const [resp] = await tts.synthesizeSpeech({
    input,
    voice: { languageCode: LANG, name: VOICE },
    audioConfig: { audioEncoding: 'MP3' }
  });

  const buffer = Buffer.from(resp.audioContent);
  console.log(`✅ TTS Success - ${buffer.length} bytes`);
  return { buffer, size: buffer.length };
}

module.exports = { synthesizeMp3, buildInput };