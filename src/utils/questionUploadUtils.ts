import { QuestionsUploadService, QuestionBatch, UploadResult } from "@/services/questionsUploadService";

// Premium Set 1 Questions - organized by type and difficulty
export const premiumSet1Questions: QuestionBatch = {
  "metadata": {
    "description": "Set 1 Premium - 6 Premium Questions (Restatement + Sentence Completion)",
    "created": "2025-01-20", 
    "purpose": "First premium question set for each difficulty level"
  },
  "questions": [
    // Restatement Questions - Set 1 Premium
    {
      "id": "rst_set1_prem_easy_001",
      "type": "restatement",
      "text": "Original: 'She walks to school every morning.'",
      "options": [
        "She drives to school every morning.",
        "She goes to school on foot every morning.",
        "She runs to school every morning.",
        "She takes the bus to school every morning."
      ],
      "correctAnswer": 1,
      "explanation": "התשובה הנכונה היא 'She goes to school on foot every morning' כי המשמעות זהה למשפט המקורי. הביטוי 'on foot' הוא מילה נרדפת לפועל 'walks' ושניהם מתארים הליכה ברגל.",
      "difficulty": "easy",
      "tags": [
        "grammar",
        "basic",
        "premium",
        "set1"
      ],
      "setId": "restatement_set1_premium_easy",
      "setNumber": 1,
      "setOrder": 1
    },
    {
      "id": "rst_set1_prem_medium_001",
      "type": "restatement",
      "text": "Original: 'The company's innovative approach has revolutionized the industry, setting new standards that competitors struggle to match.'",
      "options": [
        "The company's traditional methods have helped it keep up with industry standards.",
        "Competitors easily match the company's outdated approach to business practices.",
        "The company's groundbreaking strategy has transformed the field, establishing benchmarks that rivals find difficult to achieve.",
        "The industry has revolutionized the company's approach, making it hard for others to compete."
      ],
      "correctAnswer": 2,
      "explanation": "התשובה הנכונה היא האפשרות השלישית כי היא משמרת את המשמעות המקורית במלואה. 'groundbreaking strategy' = 'innovative approach', 'transformed' = 'revolutionized', ו'establishing benchmarks that rivals find difficult to achieve' = 'setting new standards that competitors struggle to match'.",
      "difficulty": "medium",
      "tags": [
        "grammar",
        "intermediate",
        "premium",
        "set1"
      ],
      "setId": "restatement_set1_premium_medium",
      "setNumber": 1,
      "setOrder": 1
    },
    {
      "id": "rst_set1_prem_hard_001",
      "type": "restatement",
      "text": "Original: 'The protagonist's inexorable descent into moral turpitude was precipitated by his unwavering adherence to a misguided ideological paradigm.'",
      "options": [
        "The main character's gradual improvement was caused by his flexible moral principles.",
        "The hero's inevitable fall into depravity was triggered by his rigid commitment to a flawed belief system.",
        "The protagonist's moral awakening resulted from abandoning his previous convictions.",
        "The character's ethical development was hindered by his refusal to embrace new ideas."
      ],
      "correctAnswer": 1,
      "explanation": "התשובה הנכונה היא האפשרות השנייה. 'inexorable descent' = 'inevitable fall', 'moral turpitude' = 'depravity', 'precipitated' = 'triggered', 'unwavering adherence' = 'rigid commitment', ו-'misguided ideological paradigm' = 'flawed belief system'. כל האפשרויות האחרות הופכות את המשמעות המקורית.",
      "difficulty": "hard",
      "tags": [
        "grammar",
        "advanced",
        "premium",
        "set1"
      ],
      "setId": "restatement_set1_premium_hard",
      "setNumber": 1,
      "setOrder": 1
    },
    // Sentence Completion Questions - Set 1 Premium
    {
      "id": "sc_set1_prem_easy_001",
      "type": "sentence-completion",
      "text": "She ______ to school by bus every morning.",
      "options": [
        "went",
        "goes",
        "going",
        "go"
      ],
      "correctAnswer": 1,
      "explanation": "התשובה הנכונה היא 'goes' כי המשפט מתאר פעולה שחוזרת על עצמה בהווה, כפי שמעיד הביטוי 'every morning'. בגוף שלישי יחיד בהווה פשוט מוסיפים 's' לפועל.",
      "difficulty": "easy",
      "tags": [
        "grammar",
        "basic",
        "premium",
        "set1"
      ],
      "setId": "sentence_completion_set1_premium_easy",
      "setNumber": 1,
      "setOrder": 1
    },
    {
      "id": "sc_set1_prem_medium_001",
      "type": "sentence-completion",
      "text": "The research team has been ______ the data for months, but they still haven't reached any definitive conclusions.",
      "options": [
        "analyzing",
        "analyzed",
        "to analyze",
        "analysis"
      ],
      "correctAnswer": 0,
      "explanation": "התשובה הנכונה היא 'analyzing' כי המשפט משתמש בזמן Present Perfect Continuous ('has been + V-ing') המתאר פעולה שהחלה בעבר וממשיכה עד עכשיו. המילה 'for months' מחזקת את השימוש בזמן זה.",
      "difficulty": "medium",
      "tags": [
        "grammar",
        "intermediate",
        "premium",
        "set1"
      ],
      "setId": "sentence_completion_set1_premium_medium",
      "setNumber": 1,
      "setOrder": 1
    },
    {
      "id": "sc_set1_prem_hard_001",
      "type": "sentence-completion",
      "text": "The archaeologist's meticulous documentation of the artifacts would have been ______ had the funding committee not recognized the expedition's potential to revolutionize our understanding of ancient civilizations.",
      "options": [
        "superfluous",
        "perfunctory",
        "futile",
        "redundant"
      ],
      "correctAnswer": 2,
      "explanation": "התשובה הנכונה היא 'futile' (חסר תועלת). המשפט מתאר מצב היפותטי שבו ללא מימון, העבודה המדוקדקת הייתה חסרת תועלת. 'Superfluous' ו-'redundant' מתייחסים לעודף, ו-'perfunctory' לעבודה שטחית, לא למצב של חוסר תועלת עקב נסיבות חיצוניות.",
      "difficulty": "hard",
      "tags": [
        "grammar",
        "advanced",
        "premium",
        "set1"
      ],
      "setId": "sentence_completion_set1_premium_hard",
      "setNumber": 1,
      "setOrder": 1
    }
  ]
};

export const uploadPremiumSet1Questions = async (): Promise<UploadResult> => {
  console.log('🚀 Starting Premium Set 1 question upload...');
  
  // Validate the batch first
  const validation = await QuestionsUploadService.validateQuestionBatch(premiumSet1Questions);
  if (!validation.valid) {
    console.error('❌ Validation failed:', validation.errors);
    return {
      success: false,
      uploadedCount: 0,
      errors: validation.errors
    };
  }

  console.log('✅ Validation passed, proceeding with Premium Set 1 upload...');
  
  // Upload the questions
  const result = await QuestionsUploadService.uploadQuestionBatch(premiumSet1Questions);
  
  if (result.success) {
    console.log(`🎉 Successfully uploaded ${result.uploadedCount} Premium Set 1 questions!`);
    console.log(`📋 Batch ID: ${result.batchId}`);
  } else {
    console.error('❌ Upload failed:', result.errors);
  }
  
  return result;
};

// Keep the old function for backward compatibility
export const uploadTestQuestions = uploadPremiumSet1Questions;

export { QuestionsUploadService };
