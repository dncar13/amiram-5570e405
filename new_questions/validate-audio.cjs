const fetch = require('node-fetch');

const audioUrls = [
  'http://localhost:8081/audioFiles/listening-continuation/lc_1c82ea60b5.mp3',
  'http://localhost:8081/audioFiles/listening-continuation/lc_3905178c50.mp3',
  'http://localhost:8081/audioFiles/listening-continuation/lc_6077dd6b76.mp3',
  'http://localhost:8081/audioFiles/listening-continuation/lc_8d2b586b80.mp3',
  'http://localhost:8081/audioFiles/listening-continuation/lc_aa36c65b9a.mp3'
];

async function validateAudioUrls() {
  console.log('🔍 Validating audio files via HTTP...\n');
  
  const results = [];
  
  for (const url of audioUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, { method: 'HEAD' });
      
      const result = {
        url,
        status: response.status,
        contentType: response.headers.get('content-type'),
        contentLength: parseInt(response.headers.get('content-length')) || 0,
        accessible: response.status === 200,
        isAudio: response.headers.get('content-type')?.includes('audio'),
        sizeOk: (parseInt(response.headers.get('content-length')) || 0) > 1024
      };
      
      results.push(result);
      
      if (result.accessible && result.isAudio && result.sizeOk) {
        console.log(`✅ HTTP ${result.status}, ${result.contentType}, ${result.contentLength} bytes`);
      } else {
        console.log(`❌ Status: ${result.status}, Audio: ${result.isAudio}, Size OK: ${result.sizeOk}`);
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      results.push({
        url,
        status: 0,
        contentType: null,
        contentLength: 0,
        accessible: false,
        isAudio: false,
        sizeOk: false,
        error: error.message
      });
    }
    
    console.log('');
  }
  
  const successful = results.filter(r => r.accessible && r.isAudio && r.sizeOk).length;
  console.log(`📊 Summary: ${successful}/${results.length} audio files validated successfully`);
  
  return results;
}

validateAudioUrls().catch(console.error);