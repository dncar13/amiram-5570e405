# Audio Pause Feature for Fill-in-the-Blank Questions

## Overview
The audio generation system now automatically detects underscores (`______`) in question text and inserts a 1-second pause in the spoken output.

## How it Works

### Automatic Detection
- Questions are scanned for 5 or more consecutive underscores
- When detected, SSML markup is used with `<break time="1000ms"/>`
- The pause replaces the underscore pattern in the audio

### Example

**Input Text:**
```
"She insisted that he ______ the meeting on time."
```

**Generated SSML:**
```xml
<speak>
<prosody rate="1.0" pitch="0st">
She insisted that he <break time="1000ms"/> the meeting on time.
</prosody>
</speak>
```

**Result:** 
- Speaker says "She insisted that he" 
- 1-second silence
- Speaker continues "the meeting on time"

## Supported Question Types
- ✅ Word Formation (`word_formation`)
- ✅ Grammar in Context (`grammar_in_context`) 
- ✅ Listening Continuation (`listening_continuation`)
- ✅ Any custom question with underscores

## Technical Implementation

### In Generator (`multi-question-generator.cjs`):
```javascript
// Auto-detects underscores and creates TTS options
const ttsOptions = createTTSOptions(question.text, 'grammar-in-context');
const audioResult = await synthesizeToUrl(question.id, question.text, ttsOptions);
```

### In TTS Module (`tts-module.js`):
```javascript
// Replaces ______ with SSML break tags
if (pauseForUnderscoreMs > 0) {
  processedText = processedText.replace(/______/g, `<break time="${pauseForUnderscoreMs}ms"/>`);
}
```

## Configuration
- **Pause Duration:** 1000ms (1 second) - configurable
- **Detection Pattern:** 5+ consecutive underscores
- **Audio Format:** Uses Google Cloud TTS with SSML

## Benefits
- More natural listening experience for fill-in-the-blank questions
- Students get time to think about the missing word
- Consistent with exam conditions where pauses are expected
- Automatic - no manual configuration needed