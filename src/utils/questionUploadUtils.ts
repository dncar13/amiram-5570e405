import { QuestionsUploadService, QuestionBatch, UploadResult } from "@/services/questionsUploadService";

// Test question batch from user
export const testQuestionBatch: QuestionBatch = {
  "metadata": {
    "description": "Test Sample - 6 Premium Questions",
    "created": "2025-07-18",
    "purpose": "Quality verification before full batch"
  },
  "questions": [
    {
      "id": "rst_prem_test_easy",
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
        "premium"
      ]
    },
    {
      "id": "rst_prem_test_medium",
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
        "basic",
        "premium"
      ]
    },
    {
      "id": "rst_prem_test_hard",
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
        "premium"
      ]
    },
    {
      "id": "sc_prem_test_easy",
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
        "premium"
      ]
    },
    {
      "id": "sc_prem_test_medium",
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
        "basic",
        "premium"
      ]
    },
    {
      "id": "sc_prem_test_hard",
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
        "premium"
      ]
    }
  ]
};

export const uploadTestQuestions = async (): Promise<UploadResult> => {
  console.log('🚀 Starting test question upload...');
  
  // Validate the batch first
  const validation = await QuestionsUploadService.validateQuestionBatch(testQuestionBatch);
  if (!validation.valid) {
    console.error('❌ Validation failed:', validation.errors);
    return {
      success: false,
      uploadedCount: 0,
      errors: validation.errors
    };
  }

  console.log('✅ Validation passed, proceeding with upload...');
  
  // Upload the questions
  const result = await QuestionsUploadService.uploadQuestionBatch(testQuestionBatch);
  
  if (result.success) {
    console.log(`🎉 Successfully uploaded ${result.uploadedCount} questions!`);
    console.log(`📋 Batch ID: ${result.batchId}`);
  } else {
    console.error('❌ Upload failed:', result.errors);
  }
  
  return result;
};

export { QuestionsUploadService };