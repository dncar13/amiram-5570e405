import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Topic mappings with their IDs and names
const TOPICS = [
  { id: 1, name: 'ReadingBasic', display: 'Reading Comprehension - Basic Texts', difficulty: 'easy' },
  { id: 2, name: 'ReadingIntermediate', display: 'Reading Comprehension - Intermediate Texts', difficulty: 'medium' },
  { id: 3, name: 'GrammarVerbs', display: 'Grammar - Verb Tenses', difficulty: 'medium' },
  { id: 4, name: 'GrammarStructure', display: 'Grammar - Sentence Structure', difficulty: 'easy' },
  { id: 5, name: 'GrammarModals', display: 'Grammar - Modal Verbs & Conditionals', difficulty: 'hard' },
  { id: 6, name: 'VocabularyCommon', display: 'Vocabulary - Common Words', difficulty: 'easy' },
  { id: 7, name: 'VocabularyAcademic', display: 'Vocabulary - Academic Words', difficulty: 'hard' },
  { id: 8, name: 'VocabularyCollocations', display: 'Vocabulary - Collocations & Phrases', difficulty: 'medium' },
  { id: 9, name: 'MixedPractice', display: 'Mixed Practice - Reading & Grammar', difficulty: 'medium' },
  { id: 10, name: 'ComprehensiveTest', display: 'Comprehensive Amiram Test - All Skills', difficulty: 'hard' }
];

function createPlaceholderFile(topic: typeof TOPICS[0]): string {
  return `import { Question } from '../../data/types/questionTypes';

// ${topic.display} - ${topic.difficulty} level
// Placeholder file for AI story generation - Topic ID: ${topic.id}

export const passage = \`[PLACEHOLDER - Story will be generated here]\`;

// Enhanced questions with all 12 improvements
export const questions: Question[] = [
  ${Array.from({ length: 25 }, (_, i) => `  {
    questionId: 'S${topic.id}_Q${i + 1}',
    id: 'S${topic.id}_Q${i + 1}',
    text: '[PLACEHOLDER]',
    options: [
      { text: '[PLACEHOLDER]', rationale: '[PLACEHOLDER]' },
      { text: '[PLACEHOLDER]', rationale: '[PLACEHOLDER]' },
      { text: '[PLACEHOLDER]', rationale: '[PLACEHOLDER]' },
      { text: '[PLACEHOLDER]', rationale: '[PLACEHOLDER]' }
    ],
    correctAnswer: 0,
    difficulty: '${topic.difficulty}' as 'easy' | 'medium' | 'hard',
    type: 'reading-comprehension' as const,
    explanation: '[PLACEHOLDER]',
    hint: '[PLACEHOLDER]',
    paragraphReference: '[PLACEHOLDER]',
    topicId: ${topic.id},
    passageText: '[PLACEHOLDER]',
    passageTitle: '[PLACEHOLDER]',
    skills: ['comprehension', 'analysis'],
    tags: ['${topic.difficulty}-level', '${topic.name.toLowerCase()}'],
    difficultyScore: ${topic.difficulty === 'easy' ? 2 : topic.difficulty === 'medium' ? 3 : 5},
    metadata: {
      topic: '${topic.name}',
      questionNumber: ${i + 1},
      questionType: '${i < 5 ? 'detail' : i < 15 ? 'main-idea' : i < 20 ? 'inference' : 'vocabulary'}' as 'main-idea' | 'detail' | 'inference' | 'vocabulary',
      totalQuestions: 25,
      wordCount: ${topic.difficulty === 'easy' ? 200 : topic.difficulty === 'medium' ? 350 : 500},
      estimatedTime: ${topic.difficulty === 'easy' ? 2 : topic.difficulty === 'medium' ? 3 : 5},
      aiInstruction: '${i < 5 ? 'Create a detail-oriented question about specific information in the passage' : 
                        i < 15 ? 'Create a main idea question about the central theme or purpose' :
                        i < 20 ? 'Create an inference question requiring logical deduction' :
                        'Create a vocabulary question about word meaning in context'}'
    }
  }`).join(',\n')}
];

// Legacy exports for backward compatibility
export const ${topic.difficulty}${topic.name}PassageText = passage;
export const ${topic.difficulty}${topic.name}ReadingQuestions = questions;

// Story summary for analytics
export const storySummary = {
  title: '[PLACEHOLDER]',
  difficulty: '${topic.difficulty}' as const,
  topic: '${topic.name}',
  wordCount: ${topic.difficulty === 'easy' ? 200 : topic.difficulty === 'medium' ? 350 : 500},
  numQuestions: 25,
  estimatedTime: ${topic.difficulty === 'easy' ? 2 : topic.difficulty === 'medium' ? 3 : 5},
  topicId: ${topic.id}
};`;
}

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎯 Creating placeholder files for all 10 topics...');

// Create files for all topics
let filesCreated = 0;
for (const topic of TOPICS) {
  const fileName = `${topic.difficulty}${topic.name}ReadingQuestions.ts`;
  const filePath = path.join(outputDir, fileName);
  
  // Only create if doesn't exist or contains placeholders
  let shouldCreate = true;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('[PLACEHOLDER')) {
      console.log(`⏭️  ${fileName} already complete, skipping...`);
      shouldCreate = false;
    }
  }
  
  if (shouldCreate) {
    const content = createPlaceholderFile(topic);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Created: ${fileName}`);
    filesCreated++;
  }
}

console.log(`\n🎉 Created ${filesCreated} placeholder files!`);
console.log('📚 Topics covered:');
TOPICS.forEach(topic => {
  console.log(`  - ${topic.display} (${topic.difficulty})`);
});

console.log('\n🚀 Ready to run: npm start');
console.log('This will generate AI stories for all topics and upload them to the database!');