const fs = require('fs');

// Read the current file
const data = JSON.parse(fs.readFileSync('vocab_mcq_120.json', 'utf8'));

// Convert to simulation format
const simulation = {
  id: "vocab_mcq_120",
  title: "סימולציית אוצר מילים מלאה",
  description: "120 שאלות אוצר מילים ברמות קושי שונות - מילים חיוניות למבחן האמיר\"ם",
  type: "vocabulary",
  difficulty: "mixed",
  timeLimit: 60,
  totalQuestions: 120,
  passingScore: 70,
  categories: ["vocabulary"],
  tags: ["אוצר מילים", "vocabulary", "אמיר\"ם", "אמירנט"],
  questions: []
};

// Convert each question
data.questions.forEach((q, index) => {
  // Extract word from headword or question
  const word = q.headword || '';
  
  const convertedQuestion = {
    id: index + 1,
    type: "multiple_choice",
    difficulty: q.difficulty || "medium",
    question: q.prompt || q.question || `What is the best translation of '${word}'?`,
    options: q.choices || q.options || [],
    correct: q.correctIndex !== undefined ? q.correctIndex : (q.correct || 0),
    explanation: `The word '${word}' is an important vocabulary term for academic English. Mastering these vocabulary words is essential for success in the AMIRAM exam.`,
    category: "vocabulary",
    word: word,
    tags: [q.difficulty || "medium", "vocabulary", "amiram"]
  };
  
  simulation.questions.push(convertedQuestion);
});

// Write the converted file
fs.writeFileSync('vocab-simulation-120.json', JSON.stringify(simulation, null, 2));
console.log(`✅ Converted ${simulation.questions.length} questions to simulation format`);
console.log(`📁 File saved as: vocab-simulation-120.json`);
console.log(`📊 Difficulty distribution:`);

// Count by difficulty
const difficultyCount = simulation.questions.reduce((acc, q) => {
  acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
  return acc;
}, {});

Object.entries(difficultyCount).forEach(([diff, count]) => {
  console.log(`   ${diff}: ${count} questions`);
});
