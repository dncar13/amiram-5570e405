const fs = require('fs');
const path = require('path');

// קרא את קובץ הפלאש קארד
const flashcardData = JSON.parse(fs.readFileSync('./vocab_mcq_120.json', 'utf8'));

// המרה לפורמט סימולציה
const simulationData = {
  id: "vocab_flashcard_120",
  title: "סימולציית פלאש קארד - אוצר מילים",
  description: "120 שאלות פלאש קארד לאוצר מילים באנגלית - תרגום מעברית לאנגלית",
  type: "flashcard",
  difficulty: "mixed",
  timeLimit: 45,
  totalQuestions: 120,
  passingScore: 70,
  categories: ["vocabulary", "flashcard"],
  tags: ["אוצר מילים", "פלאש קארד", "vocabulary", "flashcard"],
  questions: []
};

// המר את השאלות
flashcardData.questions.forEach((q, index) => {
  let question, options, correctAnswer, explanation, difficulty;
  
  // טיפול בפורמט הישן (3 שאלות ראשונות)
  if (q.id <= 3) {
    question = q.question;
    options = q.options;
    correctAnswer = q.correct;
    explanation = q.explanation;
    difficulty = q.difficulty;
  } 
  // טיפול בפורמט החדש (שאר השאלות)
  else {
    question = q.prompt;
    options = q.choices;
    correctAnswer = q.correctIndex;
    explanation = `התרגום הנכון של '${q.headword}' הוא ${options[correctAnswer]}`;
    difficulty = q.difficulty;
  }
  
  const convertedQuestion = {
    id: index + 1,
    type: "flashcard",
    difficulty: difficulty,
    question: question,
    options: options,
    correct: correctAnswer,
    explanation: explanation,
    category: "vocabulary",
    word: q.headword || q.id,
    tags: [difficulty, "vocabulary", "flashcard"]
  };
  
  simulationData.questions.push(convertedQuestion);
});

// הוסף סטטיסטיקות
const difficultyCount = {
  easy: simulationData.questions.filter(q => q.difficulty === 'easy').length,
  medium: simulationData.questions.filter(q => q.difficulty === 'medium').length,
  hard: simulationData.questions.filter(q => q.difficulty === 'hard').length
};

simulationData.difficultyDistribution = difficultyCount;

// שמור את הקובץ החדש
fs.writeFileSync('./src/data/vocab-flashcard-120.json', JSON.stringify(simulationData, null, 2));

console.log('✅ המרה הושלמה בהצלחה!');
console.log(`📁 הקובץ נשמר כ: vocab-flashcard-120.json`);
console.log(`📊 סטטיסטיקות:`);
console.log(`   📚 סה"כ שאלות: ${simulationData.totalQuestions}`);
console.log(`   🟢 קל: ${difficultyCount.easy} שאלות`);
console.log(`   🟡 בינוני: ${difficultyCount.medium} שאלות`);
console.log(`   🔴 קשה: ${difficultyCount.hard} שאלות`);
