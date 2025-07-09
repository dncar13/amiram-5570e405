/**
 * סקריפט ראשי להעלאת שאלות הבנת הנקרא ל-Supabase
 * Main script for uploading reading comprehension questions to Supabase
 * 
 * הוראות הפעלה:
 * 1. התקן: npm install @supabase/supabase-js
 * 2. הרץ: node upload-questions-main.js
 */

import { createClient } from '@supabase/supabase-js';
import { gigEconomyQuestions } from './data/gig-economy-questions.js';
import { environmentQuestions } from './data/environment-questions.js';
import { technologyQuestions } from './data/technology-questions.js';
import {
  uploadQuestions,
  testConnection,
  checkExistingQuestions,
  filterNewQuestions
} from './utils/upload-utils.js';

// פרטי החיבור לפרויקט Supabase שלך
const SUPABASE_URL = 'https://llyunioulzfbgqvmeaxq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAxNzQxOSwiZXhwIjoyMDY1NTkzNDE5fQ.vJIwW5tBQws8tA3F2jojd2sROVgZ6Scq605GzeUZ2nc';

// יצירת לקוח Supabase עם הרשאות מלאות
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/**
 * פונקציה ראשית - מנהלת את כל תהליך העלאת השאלות
 * Main function - manages the entire question upload process
 */
async function main() {
  console.log('🎯 מתחיל תהליך העלאת שאלות הבנת הנקרא ל-Supabase');
  console.log('=' .repeat(60));
  
  // בדיקת חיבור
  const connectionOk = await testConnection(supabase);
  if (!connectionOk) {
    console.log('\n❌ החיבור נכשל. אנא בדוק את ההגדרות.');
    return;
  }
  
  // בדיקת שאלות קיימות
  const existingIds = await checkExistingQuestions(supabase);
  
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
    const gigResults = await uploadQuestions(supabase, newGigQuestions, 'Gig Economy');
    totalSuccess += gigResults.successCount;
    totalErrors += gigResults.errorCount;
  }
  
  if (newEnvQuestions.length > 0) {
    const envResults = await uploadQuestions(supabase, newEnvQuestions, 'Environment');
    totalSuccess += envResults.successCount;
    totalErrors += envResults.errorCount;
  }
  
  if (newTechQuestions.length > 0) {
    const techResults = await uploadQuestions(supabase, newTechQuestions, 'Technology');
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
main().catch(console.error);