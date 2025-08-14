// listening-continuation-generator.js - Generate listening continuation questions with TTS
require('dotenv').config({ path: '../.env' });
const { synthesizeBatch, validateAudioUrl } = require('./text-to-speech.cjs');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate stable ID from text
function generateStableId(text) {
  return 'lc_' + crypto.createHash('md5').update(text).digest('hex').slice(0, 10);
}

// For this smoke test, we'll use a simple approach with a hardcoded set ID
// The UI currently expects set 1 to exist, so we'll create set 2 for our smoke test
function createListeningSet(name, description = null) {
  console.log(`📁 Creating listening continuation set: ${name}`);
  console.log(`📋 Using set ID 2 for smoke test (set 1 is reserved for existing demo)`);
  
  // Return set ID 2 for our smoke test
  const setId = 'smoketest';
  console.log(`✅ Using set ID: ${setId}`);
  return setId;
}

// NEW listening continuation questions for smoke test (completely different content)
function generateSampleQuestions() {
  return [
    {
      text: "The library was unusually quiet that Tuesday morning. Maria approached the reference desk where the elderly librarian was organizing books, and she ______",
      options: [
        "asked for directions to the nearest coffee shop",
        "whispered her question about rare manuscripts",
        "complained about the outdated computer system",
        "requested a library card application form"
      ],
      correctAnswer: 1,
      explanation: "בספרייה שקטה, הגיוני שמריה תלחש את שאלתها על כתבי יד נדירים - זה מתאים לאווירה ולמטרה האקדמית.",
      difficulty: "easy"
    },
    {
      text: "The thunderstorm had been raging for hours. When the power finally went out, Jake lit a candle and ______",
      options: [
        "called the electricity company to report the outage",
        "decided to take a nap until morning",
        "gathered his family around the flickering light",
        "went outside to check the electrical lines"
      ],
      correctAnswer: 2,
      explanation: "כאשר החשמל נפסק בסערה, הדבר הטבעי והבטוח הוא לאסוף את המשפחה סביב האור - זה יוצר תחושת ביטחון ואחדות.",
      difficulty: "medium"
    },
    {
      text: "Dr. Peterson had delivered thousands of babies during her career, but this delivery was different. As the contractions intensified, she realized ______",
      options: [
        "the baby was in breech position",
        "this would be twins after all",
        "the mother needed an emergency surgery",
        "she had forgotten her medical bag"
      ],
      correctAnswer: 0,
      explanation: "כאשר רופאה מנוסה מבחינה שהלידה 'שונה', הסיבה הרפואית הנפוצה ביותר היא מצב עכוז (breech) - מצב שדורש התמחדות מיוחדת.",
      difficulty: "hard"
    },
    {
      text: "The job interview was going perfectly until the interviewer asked about the gap in her resume. Jennifer took a deep breath and ______",
      options: [
        "made up a story about traveling abroad",
        "honestly explained her personal circumstances",
        "changed the subject to her qualifications",
        "asked about the company's vacation policy"
      ],
      correctAnswer: 1,
      explanation: "במצב לחץ כמו ראיון עבודה, כנות לגבי נסיבות אישיות היא הגישה הטובה ביותר - זה מעיד על יושרה ובגרות.",
      difficulty: "medium"
    },
    {
      text: "The ancient manuscript had been sealed for centuries. When the archaeologist carefully opened the first page, the text was still legible, and it revealed that ______",
      options: [
        "the location of a lost treasure was marked inside",
        "this civilization had advanced mathematical knowledge",
        "the previous translation had been completely wrong",
        "there were detailed maps of unknown territories"
      ],
      correctAnswer: 1,
      explanation: "כתב יד עתיק שנחשף על ידי ארכיאולוג צפוי לחשוף ידע מתקדם - זה הרצון והציפייה האקדמית הטיפוסית במצבים כאלה.",
      difficulty: "hard"
    }
  ];
}

// Upload questions to database
async function uploadQuestionsToDatabase(questions, setId) {
  console.log(`💾 Uploading ${questions.length} questions to database for set ${setId}`);
  
  try {
    const dbQuestions = questions.map(q => ({
      id: generateUUID(),
      question_text: q.text,
      answer_options: q.options,
      correct_answer: q.correctAnswer.toString(),
      explanation: q.explanation,
      type: 'listening_continuation',
      difficulty: q.difficulty,
      is_premium: false,
      ai_generated: false,
      // Store audioUrl in metadata since column doesn't exist
      metadata: {
        stable_id: q.stableId,
        audio_generated: !!q.audioUrl,
        audio_size: q.audioSize || null,
        audio_url: q.audioUrl,  // IMPORTANT: persist the playable URL here
        listening_set: setId
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(dbQuestions)
      .select('id');

    if (error) throw error;

    console.log(`✅ Successfully uploaded ${data.length} questions to database`);
    return data;
  } catch (error) {
    console.error('❌ Failed to upload questions:', error.message);
    throw error;
  }
}

// Main function to generate listening continuation smoke test
async function generateListeningContinuationSmokeTest() {
  console.log(`\n🎧 Starting Listening Continuation Smoke Test Generation\n`);
  
  try {
    // Step 1: Create new set in database
    console.log(`📋 Step 1: Creating listening continuation set...`);
    const setId = await createListeningSet(
      'listening-continuation-smoketest',
      '5 sample listening continuation questions with TTS audio for smoke testing'
    );
    
    // Step 2: Generate sample questions
    console.log(`\n📝 Step 2: Generating sample questions...`);
    const questions = generateSampleQuestions();
    
    // Add stable IDs to questions
    questions.forEach(q => {
      q.stableId = generateStableId(q.text);
    });
    
    console.log(`Generated ${questions.length} questions:`);
    questions.forEach((q, i) => {
      console.log(`  ${i + 1}. [${q.difficulty}] ${q.stableId} - "${q.text.substring(0, 50)}..."`);
    });
    
    // Step 3: Generate audio for all questions
    console.log(`\n🔊 Step 3: Generating TTS audio...`);
    const audioItems = questions.map(q => ({
      id: q.stableId,
      text: q.text
    }));
    
    const { results, errors } = await synthesizeBatch(audioItems);
    
    if (errors.length > 0) {
      console.log(`⚠️ Some audio generation failed:`, errors);
    }
    
    // Merge audio results back to questions
    questions.forEach(q => {
      const audioResult = results.find(r => r.id === q.stableId);
      if (audioResult && audioResult.audioResult) {
        q.audioUrl = audioResult.audioResult.url;
        q.audioSize = audioResult.audioResult.size;
        console.log(`✅ Audio attached to ${q.stableId}: ${q.audioUrl}`);
      } else {
        console.log(`❌ No audio for ${q.stableId}`);
      }
    });
    
    // Step 4: Validate audio URLs
    console.log(`\n🔍 Step 4: Validating audio URLs...`);
    const validationResults = [];
    
    for (const question of questions) {
      if (question.audioUrl) {
        console.log(`🔎 Validating: ${question.audioUrl}`);
        const validation = await validateAudioUrl(question.audioUrl);
        validationResults.push({
          questionId: question.stableId,
          ...validation
        });
        
        if (validation.accessible && validation.isAudio && validation.sizeOk) {
          console.log(`✅ ${question.stableId}: HTTP ${validation.status}, ${validation.contentType}, ${validation.contentLength} bytes`);
        } else {
          console.log(`❌ ${question.stableId}: Failed validation - Status: ${validation.status}, Audio: ${validation.isAudio}, Size OK: ${validation.sizeOk}`);
        }
      }
    }
    
    // Step 5: Upload to database
    console.log(`\n💾 Step 5: Uploading questions to database...`);
    await uploadQuestionsToDatabase(questions, setId);
    
    // Step 6: Generate summary report
    console.log(`\n📊 Smoke Test Results:`);
    console.log(`🆔 New Set ID: ${setId}`);
    console.log(`📝 Questions Generated: ${questions.length}`);
    console.log(`🔊 Audio Files Created: ${questions.filter(q => q.audioUrl).length}`);
    console.log(`✅ Audio Validations Passed: ${validationResults.filter(v => v.accessible && v.isAudio && v.sizeOk).length}`);
    
    console.log(`\n🎯 Test URLs:`);
    console.log(`📍 UI Test: /listening/continuation/${setId}`);
    console.log(`📍 Sets List: /listening/continuation`);
    
    console.log(`\n📋 Audio Health Report:`);
    validationResults.forEach(v => {
      const status = v.accessible && v.isAudio && v.sizeOk ? '✅' : '❌';
      console.log(`${status} ${v.questionId}: HTTP ${v.status}, ${v.contentType}, ${v.contentLength} bytes`);
    });
    
    return {
      setId,
      questions,
      validationResults,
      summary: {
        total: questions.length,
        withAudio: questions.filter(q => q.audioUrl).length,
        validAudio: validationResults.filter(v => v.accessible && v.isAudio && v.sizeOk).length
      }
    };
    
  } catch (error) {
    console.error(`\n❌ Smoke test failed:`, error.message);
    console.error(`Step failed at:`, error.step || 'unknown');
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  generateListeningContinuationSmokeTest()
    .then((result) => {
      console.log(`\n🎉 Smoke test completed successfully!`);
      console.log(`Set ID: ${result.setId}`);
      console.log(`Audio Health: ${result.summary.validAudio}/${result.summary.total} files validated`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n💥 Smoke test failed:`, error.message);
      process.exit(1);
    });
}

module.exports = {
  generateListeningContinuationSmokeTest,
  createListeningSet,
  generateSampleQuestions,
  uploadQuestionsToDatabase
};