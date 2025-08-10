const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Demo questions from our show-questions.cjs output
const demoQuestions = [
  // Word Formation Questions
  {
    question_text: "The company's ______ to expand internationally was met with enthusiasm from investors.",
    answer_options: ["decision", "decide", "decisively", "decisive"],
    correct_answer: "0", // Convert to string and 0-indexed
    explanation: "נדרש שם עצם אחרי 's possessive. 'decision' היא צורת שם העצם של 'decide'.",
    difficulty: "easy",
    topic_id: 21, // Listening Comprehension mapped to word formation
    type: "word_formation",
    ai_generated: true,
    stable_id: "demo_wf_01"
  },
  {
    question_text: "The scientist made a ______ discovery that changed our understanding of genetics.",
    answer_options: ["revolutionary", "revolution", "revolutionize", "revolutionarily"],
    correct_answer: "0",
    explanation: "נדרש שם תואר לתאר את 'discovery'. 'revolutionary' פירושו מהפכני.",
    difficulty: "medium",
    topic_id: 21,
    type: "word_formation",
    ai_generated: true,
    stable_id: "demo_wf_02"
  },
  {
    question_text: "The team worked ______ to meet the deadline.",
    answer_options: ["tire", "tirelessly", "tiring", "tireless"],
    correct_answer: "1",
    explanation: "נדרש תואר הפועל לתאר איך הם עבדו. 'tirelessly' = ללא לאות.",
    difficulty: "easy",
    topic_id: 21,
    type: "word_formation",
    ai_generated: true,
    stable_id: "demo_wf_03"
  },
  
  // Grammar in Context Questions
  {
    question_text: "If I ______ you, I would accept the job offer.",
    answer_options: ["was", "were", "am", "will be"],
    correct_answer: "1",
    explanation: "במשפט תנאי מסוג שני, משתמשים ב-'were' לכל הגופים אחרי If.",
    difficulty: "medium",
    topic_id: 22, // Listening Continuation mapped to grammar
    type: "grammar_in_context",
    ai_generated: true,
    stable_id: "demo_gc_01"
  },
  {
    question_text: "The report ______ by the end of next week.",
    answer_options: ["will have completed", "will be completed", "will complete", "completes"],
    correct_answer: "1",
    explanation: "הדוח יושלם (סביל) - משתמשים ב-Future Passive כי הדוח מקבל את הפעולה.",
    difficulty: "medium",
    topic_id: 22,
    type: "grammar_in_context",
    ai_generated: true,
    stable_id: "demo_gc_02"
  },
  {
    question_text: "She insisted that he ______ the meeting on time.",
    answer_options: ["attends", "attend", "attended", "will attend"],
    correct_answer: "1",
    explanation: "אחרי פעלים של דרישה/המלצה משתמשים ב-Subjunctive: base form של הפועל.",
    difficulty: "hard",
    topic_id: 22,
    type: "grammar_in_context",
    ai_generated: true,
    stable_id: "demo_gc_03"
  },
  
  // Listening Comprehension Questions (without audio)
  {
    question_text: "What is the main reason Sarah wants to go to the farmers market?",
    answer_options: ["To meet Mike for breakfast", "To buy vegetables for a dinner party", "To sell her own produce", "To try the new coffee stand"],
    correct_answer: "1",
    explanation: "שרה מזכירה במפורש שהיא צריכה ירקות טריים למסיבת ארוחת ערב שהיא מארחת.",
    difficulty: "easy",
    topic_id: 23, // Audio Analysis mapped to listening comprehension
    type: "listening_comprehension",
    ai_generated: true,
    stable_id: "demo_lc_01",
    metadata: {
      audio_script: "Sarah and Mike are discussing their weekend plans. Sarah mentions she's thinking about going to the farmers market on Saturday morning because she needs fresh vegetables for a dinner party she's hosting. Mike suggests they could go together since he's been wanting to try the new coffee stand there. They agree to meet at 9 AM at the market entrance."
    }
  },
  {
    question_text: "According to the speaker, what happens during deep sleep?",
    answer_options: ["Students dream about their studies", "Neural connections are strengthened", "The body produces more energy", "The brain creates new memories"],
    correct_answer: "1",
    explanation: "הדובר מציין שבמהלך שינה עמוקה, הקשרים העצביים מתחזקים, מה שמקל על היזכרות במידע.",
    difficulty: "medium",
    topic_id: 23,
    type: "listening_comprehension",
    ai_generated: true,
    stable_id: "demo_lc_02",
    metadata: {
      audio_script: "Good morning, class. Today we'll discuss the importance of sleep for academic performance. Recent studies show that students who get at least eight hours of sleep perform significantly better on exams than those who sleep less. The brain uses sleep time to consolidate memories and process information from the day. During deep sleep, neural connections are strengthened, making it easier to recall information later."
    }
  },
  
  // Listening Continuation Questions (without audio)
  {
    question_text: "The museum announced a new exhibition opening next month, and to celebrate ______",
    answer_options: ["the building will be demolished immediately", "they will offer free admission for the first week", "all museums worldwide will close permanently", "visitors must pay triple the normal price"],
    correct_answer: "1",
    explanation: "כאשר מוזיאון חוגג פתיחת תערוכה חדשה, הגיוני שיציעו כניסה חינם כדי למשוך מבקרים.",
    difficulty: "easy",
    topic_id: 24, // Sound Recognition mapped to listening continuation
    type: "listening_continuation",
    ai_generated: true,
    stable_id: "demo_cont_01"
  },
  {
    question_text: "After months of negotiations, the two companies finally reached an agreement, but before signing the contract ______",
    answer_options: ["both companies declared bankruptcy", "all employees were sent to Antarctica", "they decided to start a cooking show together", "they scheduled a final review with their legal teams"],
    correct_answer: "3",
    explanation: "לפני חתימה על חוזה עסקי חשוב, סביר שהחברות ירצו סקירה משפטית אחרונה.",
    difficulty: "medium",
    topic_id: 24,
    type: "listening_continuation",
    ai_generated: true,
    stable_id: "demo_cont_02"
  }
];

async function uploadDemoQuestions() {
  console.log('🚀 Uploading demo questions to database...');
  
  try {
    // First check if stable_id column exists
    const { data: columns, error: schemaError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT column_name FROM information_schema.columns 
              WHERE table_name = 'questions' AND column_name = 'stable_id';` 
      });
      
    if (schemaError && !schemaError.message.includes('exec_sql')) {
      console.log('⚠️ Could not check schema, proceeding with upload...');
    }
    
    for (const question of demoQuestions) {
      console.log(`📝 Uploading: ${question.stable_id} (${question.question_type})`);
      
      const { data, error } = await supabase
        .from('questions')
        .insert([question])
        .select();
        
      if (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️ Question ${question.stable_id} already exists, skipping...`);
        } else {
          console.error(`❌ Failed to upload ${question.stable_id}:`, error.message);
        }
      } else {
        console.log(`✅ Successfully uploaded: ${question.stable_id}`);
      }
    }
    
    console.log('\n🎉 Demo questions upload completed!');
    console.log('\n📊 Summary:');
    console.log(`   • Word Formation: 3 questions`);
    console.log(`   • Grammar in Context: 3 questions`);
    console.log(`   • Listening Comprehension: 2 questions (with audio scripts)`);
    console.log(`   • Listening Continuation: 2 questions`);
    console.log(`   • Total: ${demoQuestions.length} questions`);
    
    // Verify upload
    const { data: uploaded, error: countError } = await supabase
      .from('questions')
      .select('stable_id, question_type, topic_id')
      .like('stable_id', 'demo_%');
      
    if (!countError && uploaded) {
      console.log(`\n✅ Verification: ${uploaded.length} demo questions found in database`);
      uploaded.forEach(q => {
        console.log(`   • ${q.stable_id} (${q.question_type}) - Topic: ${q.topic_id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error uploading demo questions:', error);
  }
}

uploadDemoQuestions();
