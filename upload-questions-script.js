/**
 * Script להעלאת שאלות הבנת הנקרא מקבצי TypeScript ל-Supabase
 * 
 * הוראות הפעלה:
 * 1. התקן: npm install @supabase/supabase-js
 * 2. החלף את SERVICE_ROLE_KEY ב-Service Role Key שלך מ-Supabase
 * 3. הרץ: node upload-questions-script.js
 */

const { createClient } = require('@supabase/supabase-js');

// פרטי החיבור לפרויקט Supabase שלך
const SUPABASE_URL = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // 🔥 החלף בקי שלך!

// יצירת לקוח Supabase עם הרשאות מלאות
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// =============================================================================
// נתוני השאלות - מועתקים מקבצי TypeScript
// =============================================================================

// Gig Economy Questions (שאלות 1-10)
const gigEconomyQuestions = [
  {
    id: 1,
    text: "The first paragraph suggests that the traditional employment model has _____ in recent decades",
    type: "reading-comprehension",
    options: [
      "remained completely unchanged",
      "become more popular than ever",
      "undergone significant changes",
      "been completely eliminated"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The text states that the traditional model 'has undergone a dramatic transformation in recent decades.'",
    passageText: "The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the \"gig economy\" has fundamentally altered how millions of people work and earn their living.\n\nThe gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["employment-change", "transformation"],
    originalId: 1
  },
  {
    id: 2,
    text: "Which of the following platforms is mentioned in the text as an example of the gig economy?",
    type: "reading-comprehension",
    options: [
      "Facebook",
      "Amazon", 
      "TaskRabbit",
      "Google"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The text explicitly mentions 'digital platforms such as Uber, Lyft, TaskRabbit, and Upwork.'",
    passageText: "The traditional model of employment, where workers held steady, full-time jobs with a single employer for decades, has undergone a dramatic transformation in recent decades. The emergence of the \"gig economy\" has fundamentally altered how millions of people work and earn their living.\n\nThe gig economy refers to a labor market characterized by short-term contracts, freelance work, and independent contracting rather than permanent employment. This shift has been largely facilitated by digital platforms such as Uber, Lyft, TaskRabbit, and Upwork, which connect workers directly with customers seeking specific services.",
    passageTitle: "The Rise of the Gig Economy", 
    topicId: 3,
    tags: ["platforms", "examples"],
    originalId: 2
  },
  {
    id: 3,
    text: "According to the text, which of the following benefits does the gig economy offer to workers?",
    type: "reading-comprehension",
    options: [
      "Guaranteed health insurance",
      "Fixed and stable salary",
      "Flexibility in scheduling", 
      "Complete job security"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage states that 'the gig economy offers unprecedented flexibility and autonomy' and workers 'can choose their own schedules.'",
    passageText: "For many workers, the gig economy offers unprecedented flexibility and autonomy. Freelancers can choose their own schedules, work on multiple projects in the morning, own a ride-share service in the afternoon, and deliver food in the evening, all while maintaining control over their time and earning potential.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["benefits", "flexibility"],
    originalId: 3
  },
  {
    id: 4,
    text: "What significant cost does the text mention comes with gig economy flexibility?",
    type: "reading-comprehension", 
    options: [
      "Higher taxes for workers",
      "Lack of traditional employee benefits",
      "Mandatory overtime work",
      "Reduced earning potential"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The text clearly states that 'Gig workers typically lack the benefits and protections that traditional employees enjoy.'",
    passageText: "However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["disadvantages", "trade-offs"],
    originalId: 4
  },
  {
    id: 5,
    text: "According to the text, what financial burden do gig workers bear?",
    type: "reading-comprehension",
    options: [
      "Company office rent",
      "Employee training costs", 
      "Equipment and vehicle maintenance",
      "Marketing expenses for employers"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage mentions that gig workers 'bear the financial burden of their own equipment, vehicle maintenance, and business expenses.'",
    passageText: "However, this flexibility comes at a significant cost. Gig workers typically lack the benefits and protections that traditional employees enjoy, such as health insurance, paid vacation, unemployment benefits, and job security. They also bear the financial burden of their own equipment, vehicle maintenance, and business expenses.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["financial-burden", "expenses"],
    originalId: 5
  },
  {
    id: 6,
    text: "What does the text suggest has happened to income inequality as more people become gig workers?",
    type: "reading-comprehension",
    options: [
      "It has decreased significantly",
      "It has remained the same",
      "It has widened",
      "It has been completely eliminated"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The text explicitly states: 'As more people become gig workers, income inequality has widened.'",
    passageText: "The social implications of this economic shift are profound. As more people become gig workers, income inequality has widened. While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["social-impact", "inequality"], 
    originalId: 6
  },
  {
    id: 7,
    text: "According to the passage, what term describes people who are employed but still live in poverty?",
    type: "reading-comprehension",
    options: [
      "Underemployed workers",
      "Working poor",
      "Part-time employees",
      "Temporary workers"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The text introduces the term 'working poor' - people who are employed but still live in poverty.",
    passageText: "While highly skilled freelancers can earn substantial incomes, many gig workers struggle to make ends meet, working multiple jobs without benefits or stable income. This has created a new class of \"working poor\" - people who are employed but still live in poverty.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["vocabulary", "social-class"],
    originalId: 7
  },
  {
    id: 8,
    text: "How are some governments responding to the gig economy according to the text?",
    type: "reading-comprehension",
    options: [
      "By banning all digital platforms",
      "By classifying certain gig workers as employees",
      "By reducing labor protections", 
      "By eliminating independent contracting"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage states that 'Some countries have begun classifying certain gig workers as employees rather than independent contractors.'",
    passageText: "Governments worldwide are grappling with how to regulate this new economic model. Some countries have begun classifying certain gig workers as employees rather than independent contractors, entitling them to basic labor protections.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["government-response", "regulation"],
    originalId: 8
  },
  {
    id: 9,
    text: "What type of benefits are some governments exploring for gig workers?",
    type: "reading-comprehension",
    options: [
      "Fixed salary guarantees",
      "Portable benefits that move from job to job",
      "Company-provided housing",
      "Free transportation services"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The text mentions that governments are 'exploring new forms of portable benefits that could move from job to job.'",
    passageText: "Others are exploring new forms of portable benefits that could move from job to job, rather than being tied to a single employer.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["benefits", "policy-solutions"],
    originalId: 9
  },
  {
    id: 10,
    text: "Which of the following statements best expresses the main idea of the text?",
    type: "reading-comprehension",
    options: [
      "The gig economy is a perfect solution to modern employment problems",
      "Traditional employment is superior to the gig economy in all cases",
      "The gig economy offers flexibility but also creates new challenges requiring balanced solutions",
      "Digital platforms are the only reason for changes in the job market"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The text presents a balanced view, discussing both benefits (flexibility) and challenges (lack of security), concluding that balance is needed.",
    passageText: "The future of work will likely involve finding a balance between the flexibility that both workers and businesses desire and the security and stability that workers need to thrive. As technology continues to evolve, society must adapt its economic and social structures to ensure that the benefits of this new economy are shared more equitably among all participants.",
    passageTitle: "The Rise of the Gig Economy",
    topicId: 3,
    tags: ["main-idea", "synthesis"],
    originalId: 10
  }
];

// Environment Questions (שאלות 28-41, מחוץ לקיימות)
const environmentQuestions = [
  {
    id: 28,
    text: "What criticism is mentioned regarding the ecosystem services framework?",
    type: "reading-comprehension",
    options: [
      "It doesn't work effectively in developing countries",
      "It places monetary values on nature, potentially commodifying essential natural processes",
      "It requires too much government oversight to implement successfully",
      "It benefits wealthy landowners disproportionately"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    explanation: "The passage explicitly states that 'Critics argue that placing monetary values on nature risks commodifying essential processes that should be protected regardless of economic benefit.' This represents the main criticism mentioned of the ecosystem services approach.",
    passageText: "Despite these successes, challenges remain in quantifying the precise value of ecosystem services and creating equitable compensation systems. Critics argue that placing monetary values on nature risks commodifying essential processes that should be protected regardless of economic benefit.",
    passageTitle: "Environment Reading",
    topicId: 7,
    tags: ["medium-level", "detail", "environment"],
    originalId: 28
  },
  {
    id: 29,
    text: "What does the Costa Rica example demonstrate about ecosystem services?",
    type: "reading-comprehension",
    options: [
      "That market-based approaches can effectively address environmental challenges",
      "That government regulation is more effective than economic incentives",
      "That ecosystem services are more valuable in tropical countries",
      "That deforestation is inevitable in developing economies"
    ],
    correctAnswer: 0,
    difficulty: "medium", 
    explanation: "Costa Rica's PES program is described as a 'market-based approach' that successfully reversed deforestation. This example demonstrates that creating economic incentives (compensating landowners) can be an effective way to protect ecosystem services, showing how market mechanisms can be harnessed for environmental protection.",
    passageText: "The PES program fundamentally altered this trajectory by compensating landowners for preserving forests rather than converting them to farmland. Landowners receive payments for carbon sequestration, biodiversity protection, watershed maintenance, and landscape beauty preservation. This market-based approach has helped Costa Rica become the only tropical country to reverse deforestation.",
    passageTitle: "Environment Reading",
    topicId: 7,
    tags: ["medium-level", "detail", "environment"],
    originalId: 29
  }
  // הוסף עוד שאלות Environment כאן...
];

// Technology Questions (שאלות 1005-1020, מחוץ לקיימות)
const technologyQuestions = [
  {
    id: 1005,
    text: "What do emerging technologies like quantum computing and biotechnology promise, as suggested by the passage?",
    type: "reading-comprehension",
    options: [
      "To replace all existing technologies",
      "To increase the challenges humanity faces",
      "To address some of humanity's most pressing challenges while creating new opportunities",
      "To slow down the pace of technological development"
    ],
    correctAnswer: 2,
    difficulty: "medium",
    explanation: "The passage concludes by stating that 'Emerging technologies like quantum computing, biotechnology, and renewable energy systems promise to address some of humanity's most pressing challenges while creating new opportunities for innovation and growth.'",
    passageText: "Despite these challenges, the trajectory of technological development shows no signs of slowing. Emerging technologies like quantum computing, biotechnology, and renewable energy systems promise to address some of humanity's most pressing challenges while creating new opportunities for innovation and growth.",
    passageTitle: "Technology Reading",
    topicId: 2,
    tags: ["medium-level", "detail", "technology"],
    originalId: 1005
  }
  // הוסף עוד שאלות Technology כאן...
];

// =============================================================================
// פונקציות עזר
// =============================================================================

/**
 * המרת שאלה לפורמט Supabase
 */
function convertQuestionToSupabaseFormat(question) {
  return {
    text: question.text,
    type: question.type,
    options: JSON.stringify(question.options),
    correct_answer: question.correctAnswer,
    difficulty: question.difficulty,
    explanation: question.explanation,
    passage_text: question.passageText,
    passage_title: question.passageTitle,
    topic_id: question.topicId,
    tags: JSON.stringify(question.tags || []),
    original_id: question.originalId || question.id
  };
}

/**
 * העלאת שאלות לטבלה
 */
async function uploadQuestions(questions, categoryName) {
  console.log(`\n🚀 מתחיל להעלות ${questions.length} שאלות מקטגוריה: ${categoryName}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const question of questions) {
    try {
      const supabaseQuestion = convertQuestionToSupabaseFormat(question);
      
      const { data, error } = await supabase
        .from('questions')
        .insert([supabaseQuestion]);
      
      if (error) {
        console.error(`❌ שגיאה בשאלה ${question.id}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ נוספה שאלה ${question.id}: ${question.text.substring(0, 50)}...`);
        successCount++;
      }
      
      // השהייה קצרה למניעת העמסה על השרת
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      console.error(`💥 שגיאה כללית בשאלה ${question.id}:`, err.message);
      errorCount++;
    }
  }
  
  console.log(`\n📊 סיכום ${categoryName}: ${successCount} הצליחו, ${errorCount} נכשלו`);
  return { successCount, errorCount };
}

/**
 * בדיקת חיבור לטבלה
 */
async function testConnection() {
  try {
    console.log('🔍 בודק חיבור ל-Supabase...');
    
    const { data, error } = await supabase
      .from('questions')
      .select('id')
      .limit(1);
    
    if (error) {
      throw new Error(`שגיאת חיבור: ${error.message}`);
    }
    
    console.log('✅ חיבור ל-Supabase תקין!');
    return true;
  } catch (err) {
    console.error('❌ שגיאת חיבור:', err.message);
    console.error('🔧 בדוק את ה-Service Role Key שלך');
    return false;
  }
}

/**
 * בדיקת שאלות קיימות
 */
async function checkExistingQuestions() {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('original_id, type')
      .eq('type', 'reading-comprehension');
    
    if (error) {
      console.error('שגיאה בבדיקת שאלות קיימות:', error);
      return [];
    }
    
    const existingIds = data.map(q => q.original_id).filter(id => id);
    console.log(`📋 נמצאו ${existingIds.length} שאלות הבנת הנקרא קיימות: ${existingIds.join(', ')}`);
    
    return existingIds;
  } catch (err) {
    console.error('שגיאה בבדיקת שאלות קיימות:', err);
    return [];
  }
}

/**
 * סינון שאלות חדשות (שלא קיימות כבר)
 */
function filterNewQuestions(questions, existingIds) {
  return questions.filter(q => !existingIds.includes(q.id) && !existingIds.includes(q.originalId));
}

// =============================================================================
// פונקציה ראשית
// =============================================================================

async function main() {
  console.log('🎯 מתחיל תהליך העלאת שאלות הבנת הנקרא ל-Supabase');
  console.log('=' .repeat(60));
  
  // בדיקת חיבור
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ החיבור נכשל. אנא בדוק את ההגדרות.');
    return;
  }
  
  // בדיקת שאלות קיימות
  const existingIds = await checkExistingQuestions();
  
  // הכנת רשימות שאלות חדשות
  const newGigQuestions = filterNewQuestions(gigEconomyQuestions, existingIds);
  const newEnvQuestions = filterNewQuestions(environmentQuestions, existingIds);
  const newTechQuestions = filterNewQuestions(technologyQuestions, existingIds);
  
  console.log(`\n📊 סיכום שאלות להעלאה:`);
  console.log(`- Gig Economy: ${newGigQuestions.length} שאלות חדשות`);
  console.log(`- Environment: ${newEnvQuestions.length} שאלות חדשות`);
  console.log(`- Technology: ${newTechQuestions.length} שאלות חדשות`);
  console.log(`- סה"כ: ${newGigQuestions.length + newEnvQuestions.length + newTechQuestions.length} שאלות חדשות`);
  
  if (newGigQuestions.length === 0 && newEnvQuestions.length === 0 && newTechQuestions.length === 0) {
    console.log('\n✅ כל השאלות כבר קיימות במסד הנתונים!');
    return;
  }
  
  // העלאת השאלות
  let totalSuccess = 0;
  let totalErrors = 0;
  
  if (newGigQuestions.length > 0) {
    const gigResults = await uploadQuestions(newGigQuestions, 'Gig Economy');
    totalSuccess += gigResults.successCount;
    totalErrors += gigResults.errorCount;
  }
  
  if (newEnvQuestions.length > 0) {
    const envResults = await uploadQuestions(newEnvQuestions, 'Environment');
    totalSuccess += envResults.successCount;
    totalErrors += envResults.errorCount;
  }
  
  if (newTechQuestions.length > 0) {
    const techResults = await uploadQuestions(newTechQuestions, 'Technology');
    totalSuccess += techResults.successCount;
    totalErrors += techResults.errorCount;
  }
  
  // סיכום סופי
  console.log('\n' + '='.repeat(60));
  console.log('🎉 סיכום סופי:');
  console.log(`✅ הועלו בהצלחה: ${totalSuccess} שאלות`);
  console.log(`❌ שגיאות: ${totalErrors} שאלות`);
  console.log(`📈 אחוז הצלחה: ${Math.round((totalSuccess / (totalSuccess + totalErrors)) * 100)}%`);
  
  if (totalSuccess > 0) {
    console.log('\n🚀 השאלות הועלו בהצלחה! המערכת תציג עכשיו מספר שאלות מעודכן.');
  }
}

// הפעלת הסקריפט
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  uploadQuestions,
  gigEconomyQuestions,
  environmentQuestions,
  technologyQuestions
};