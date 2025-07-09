/**
 * כלים עזר להעלאת שאלות ל-Supabase
 * Utility functions for uploading questions to Supabase
 */

/**
 * המרת שאלה לפורמט Supabase
 * Convert question to Supabase format
 */
export function convertQuestionToSupabaseFormat(question) {
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
 * Upload questions to table
 */
export async function uploadQuestions(supabase, questions, categoryName) {
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
 * Test connection to table
 */
export async function testConnection(supabase) {
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
 * Check existing questions
 */
export async function checkExistingQuestions(supabase) {
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
 * Filter new questions (that don't exist already)
 */
export function filterNewQuestions(questions, existingIds) {
  return questions.filter(q => !existingIds.includes(q.id) && !existingIds.includes(q.originalId));
}