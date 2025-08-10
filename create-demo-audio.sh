#!/bin/bash

# Create demo audio files for listening comprehension questions
# Using simple text-to-speech if available, or create silent MP3s

AUDIO_DIR="public/audioFiles/listening-comprehension"

# Create directory if it doesn't exist
mkdir -p "$AUDIO_DIR"

echo "🎵 Creating demo audio files..."

# Check if espeak is available (text-to-speech)
if command -v espeak >/dev/null 2>&1; then
    echo "📢 Using espeak for text-to-speech"
    
    # Demo question 1
    espeak -s 150 -v en+f3 -w "${AUDIO_DIR}/demo_lc_01.wav" "Sarah and Mike are discussing their weekend plans. Sarah mentions she's thinking about going to the farmers market on Saturday morning because she needs fresh vegetables for a dinner party she's hosting. Mike suggests they could go together since he's been wanting to try the new coffee stand there. They agree to meet at 9 AM at the market entrance."
    
    # Demo question 2  
    espeak -s 150 -v en+f3 -w "${AUDIO_DIR}/demo_lc_02.wav" "Good morning, class. Today we'll discuss the importance of sleep for academic performance. Recent studies show that students who get at least eight hours of sleep perform significantly better on exams than those who sleep less. The brain uses sleep time to consolidate memories and process information from the day. During deep sleep, neural connections are strengthened, making it easier to recall information later."
    
    echo "✅ Created WAV files with espeak"
    
    # Convert to MP3 if ffmpeg is available
    if command -v ffmpeg >/dev/null 2>&1; then
        echo "🔄 Converting to MP3..."
        ffmpeg -i "${AUDIO_DIR}/demo_lc_01.wav" -acodec mp3 "${AUDIO_DIR}/demo_lc_01.mp3" -y
        ffmpeg -i "${AUDIO_DIR}/demo_lc_02.wav" -acodec mp3 "${AUDIO_DIR}/demo_lc_02.mp3" -y
        rm "${AUDIO_DIR}"/demo_lc_*.wav
        echo "✅ Converted to MP3"
    fi
else
    echo "⚠️  espeak not found. Creating silent placeholder MP3s..."
    
    # Create silent MP3 files (3 seconds each) if sox is available
    if command -v sox >/dev/null 2>&1; then
        sox -n -r 44100 -c 2 "${AUDIO_DIR}/demo_lc_01.mp3" trim 0.0 3.0
        sox -n -r 44100 -c 2 "${AUDIO_DIR}/demo_lc_02.mp3" trim 0.0 3.0
        echo "✅ Created silent MP3 placeholders"
    else
        echo "❌ Neither espeak nor sox found. Creating text placeholders..."
        echo "Audio placeholder for demo_lc_01" > "${AUDIO_DIR}/demo_lc_01.txt"
        echo "Audio placeholder for demo_lc_02" > "${AUDIO_DIR}/demo_lc_02.txt"
    fi
fi

echo ""
echo "🎯 Audio files created in: $AUDIO_DIR"
ls -la "$AUDIO_DIR"/demo_lc_*
echo ""
echo "📋 Next steps:"
echo "1. Test audio playback in the application"
echo "2. Set up Google Cloud TTS for production-quality audio"
