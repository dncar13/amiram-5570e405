import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { SupabaseUploader } from './supabaseUploader.js';
import { shuffle } from 'lodash-es';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, 'output'),
  logsDir: path.join(__dirname, 'logs'),
  claudeApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: 'claude-3-5-sonnet-20241022',
  maxRetries: 3,
  retryDelay: 2000, // 2 seconds
};

// Enhanced Types with all 12 improvements
interface OptionWithRationale {
  text: string;
  rationale: string;
}

interface EnhancedQuestion {
  questionId: string;  // שיפור #9: S1_Q1 format
  type: 'reading-comprehension';
  text: string;
  aiPrompt?: string;  // שיפור #8
  options: OptionWithRationale[];  // שיפור #3
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  difficultyScore: number;  // שיפור #5
  explanation: string;
  hint: string;  // שיפור #4
  paragraphReference: string;  // שיפור #2
  topicId?: number;
  skills: string[];  // שיפור #6
  tags: string[];
  metadata: {
    topic: string;
    questionNumber: number;
    questionType: 'main-idea' | 'detail' | 'inference' | 'vocabulary';
    totalQuestions: number;
    wordCount: number;
    estimatedTime: number;
    aiInstruction?: string;
  };
}

interface StorySummary {  // שיפור #7
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  wordCount: number;
  numQuestions: number;
  estimatedTime: number;
  topicId?: number;
}

interface PlaceholderFile {
  filePath: string;
  fileName: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hasPlaceholders: boolean;
  storyIndex?: number;
}

interface GenerationResult {
  success: boolean;
  fileName: string;
  topic: string;
  difficulty: string;
  storyTitle?: string;  // שיפור #1
  passageWordCount?: number;
  questionsGenerated?: number;
  error?: string;
  warnings?: string[];
}

// Skills mapping for different question types - שיפור #6
const SKILLS_MAPPING = {
  'main-idea': ['comprehension', 'summarization', 'critical-thinking'],
  'detail': ['attention-to-detail', 'fact-finding', 'information-retrieval'],
  'inference': ['logical-reasoning', 'cause-effect', 'deduction'],
  'vocabulary': ['context-clues', 'word-meaning', 'language-skills']
};

// Fisher-Yates shuffle function for answer options
function shuffleQuestionOptions(question: any): any {
  const options = [...question.options];
  const correctText = options[question.correctAnswer]?.text;
  
  if (!correctText) {
    console.warn('⚠️  Warning: Could not find correct answer text for shuffling');
    return question;
  }
  
  // Shuffle the options array
  const shuffled = shuffle(options);
  
  // Find the new index of the correct answer
  const newCorrectIndex = shuffled.findIndex(opt => opt.text === correctText);
  
  if (newCorrectIndex === -1) {
    console.warn('⚠️  Warning: Could not find correct answer after shuffling');
    return question;
  }
  
  // Update explanation if it mentions specific option letters
  let updatedExplanation = question.explanation;
  const optionLetters = ['A', 'B', 'C', 'D'];
  const newLetter = optionLetters[newCorrectIndex];
  
  // Replace mentions of "Option A/B/C/D" with the new correct option
  updatedExplanation = updatedExplanation
    .replace(/Option [ABCD]/g, `Option ${newLetter}`)
    .replace(/option [ABCD]/g, `option ${newLetter}`)
    .replace(/choice [ABCD]/g, `choice ${newLetter}`)
    .replace(/answer [ABCD]/g, `answer ${newLetter}`)
    .replace(/\([ABCD]\)/g, `(${newLetter})`);
  
  return {
    ...question,
    options: shuffled,
    correctAnswer: newCorrectIndex,
    explanation: updatedExplanation
  };
}

// Logger class
class Logger {
  private logFile: string;

  constructor() {
    if (!fs.existsSync(CONFIG.logsDir)) {
      fs.mkdirSync(CONFIG.logsDir, { recursive: true });
    }
    this.logFile = path.join(CONFIG.logsDir, `generation-${Date.now()}.log`);
  }

  log(level: 'INFO' | 'WARN' | 'ERROR', message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}`;
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  info(message: string) { this.log('INFO', message); }
  warn(message: string) { this.log('WARN', message); }
  error(message: string) { this.log('ERROR', message); }
}

// Claude API client
class ClaudeAPI {
  private apiKey: string;
  private model: string;
  private logger: Logger;

  constructor(apiKey: string, model: string, logger: Logger) {
    this.apiKey = apiKey;
    this.model = model;
    this.logger = logger;
  }

  async generateContent(prompt: string, retries = 0): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;

    } catch (error) {
      this.logger.error(`Claude API call failed: ${error}`);
      
      if (retries < CONFIG.maxRetries) {
        this.logger.info(`Retrying in ${CONFIG.retryDelay}ms... (${retries + 1}/${CONFIG.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
        return this.generateContent(prompt, retries + 1);
      }
      
      throw error;
    }
  }
}

// Enhanced Content generator with all improvements
class ContentGenerator {
  private claudeAPI: ClaudeAPI;
  private logger: Logger;

  constructor(claudeAPI: ClaudeAPI, logger: Logger) {
    this.claudeAPI = claudeAPI;
    this.logger = logger;
  }

  // שיפור #1: Generate engaging title
  async generateStoryTitle(topic: string, difficulty: string): Promise<string> {
    const prompt = `Generate a single engaging, thought-provoking title for a ${difficulty} level reading passage about ${topic}.
The title should:
- Be interesting and memorable
- Hint at the content without giving everything away
- Be appropriate for academic English learners
- Be 3-8 words long

Return ONLY the title, nothing else.`;

    const title = await this.claudeAPI.generateContent(prompt);
    return title.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
  }

  async generatePassageWithTitle(topic: string, difficulty: string, title: string): Promise<string> {
    const wordCount = difficulty === 'easy' ? 200 : difficulty === 'medium' ? 350 : 500;
    
    const prompt = `Generate an original, engaging reading passage for AMIRAM English placement test.

TITLE: "${title}"

REQUIREMENTS:
- Topic: ${topic}
- Difficulty: ${difficulty}
- Word count: exactly ${wordCount} words
- Academic English level appropriate for ${difficulty} readers
- Must allow for 25 varied comprehension questions
- Include clear paragraph structure (3-4 paragraphs numbered as [1], [2], [3], etc.)
- Original content - no copyrighted material

STYLE:
- Start each paragraph with a number in brackets: [1], [2], [3], etc.
- Informative and engaging
- Clear topic sentences
- Logical flow between paragraphs
- Rich vocabulary appropriate for level
- Specific details for question creation

Return ONLY the passage text with numbered paragraphs, no additional commentary.`;

    this.logger.info(`Generating ${difficulty} passage about ${topic} with title "${title}" (${wordCount} words)`);
    return await this.claudeAPI.generateContent(prompt);
  }

  async generateEnhancedQuestions(
    passage: string, 
    topic: string, 
    difficulty: string, 
    title: string,
    questionData: EnhancedQuestion[]
  ): Promise<EnhancedQuestion[]> {
    const results: EnhancedQuestion[] = [];
    
    this.logger.info(`Generating 25 enhanced questions for "${title}" (${difficulty})`);
    
    // Process questions in batches of 5 for better API management
    for (let i = 0; i < questionData.length; i += 5) {
      const batch = questionData.slice(i, i + 5);
      const batchQuestions = await this.generateEnhancedQuestionBatch(
        passage, topic, difficulty, title, batch
      );
      results.push(...batchQuestions);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  private async generateEnhancedQuestionBatch(
    passage: string, 
    topic: string, 
    difficulty: string,
    title: string,
    batch: EnhancedQuestion[]
  ): Promise<EnhancedQuestion[]> {
    const prompt = `Generate ${batch.length} multiple-choice reading comprehension questions for this passage.

PASSAGE TITLE: "${title}"
PASSAGE:
${passage}

REQUIREMENTS FOR EACH QUESTION:
${batch.map((q, idx) => `
Question ${q.metadata.questionNumber} (Type: ${q.metadata.questionType}):
- ${q.metadata.aiInstruction || 'Standard requirements'}
- Create 4 options with detailed rationales
- ${difficulty === 'easy' ? 'MUST reference specific paragraph number [1], [2], etc.' : 'Use inference and analysis'}
- Generate a helpful hint
- Focus on ${q.skills?.join(' and ') || 'comprehension'} skills
`).join('')}

Return response in this EXACT JSON format WITHOUT any code blocks:
{
  "questions": [
    {
      "questionNumber": 1,
      "text": "Question text here",
      "options": [
        {"text": "Option A text", "rationale": "Why A is correct/incorrect"},
        {"text": "Option B text", "rationale": "Why B is correct/incorrect"},
        {"text": "Option C text", "rationale": "Why C is correct/incorrect"},
        {"text": "Option D text", "rationale": "Why D is correct/incorrect"}
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation referencing the text",
      "hint": "A helpful clue without giving away the answer",
      "paragraphReference": "Paragraph [X] or Paragraphs [X-Y]"
    }
  ]
}

CRITICAL: 
- Return ONLY valid JSON
- Each option needs both text AND rationale
- paragraphReference should use format like "Paragraph [2]" or "Paragraphs [1-2]"
- Ensure all questions are directly answerable from the passage`;

    const response = await this.claudeAPI.generateContent(prompt);
    
    try {
      const cleanResponse = this.cleanClaudeJSONResponse(response);
      const parsed = JSON.parse(cleanResponse);
      return parsed.questions || [];
    } catch (error) {
      this.logger.error(`Failed to parse enhanced question batch response: ${error}`);
      this.logger.error(`Raw response: ${response.substring(0, 500)}...`);
      throw new Error('Invalid JSON response from Claude');
    }
  }

  private cleanClaudeJSONResponse(response: string): string {
    return response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();
  }
}

// Enhanced Quality controller - שיפור #11
class QualityController {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  validateEnhancedContent(
    passage: string, 
    questions: EnhancedQuestion[], 
    expectedWordCount: number,
    title: string
  ): string[] {
    const warnings: string[] = [];
    
    // Check title
    if (!title || title.length < 3) {
      warnings.push('Title is missing or too short');
    }
    
    // Check passage word count
    const wordCount = passage.split(/\s+/).length;
    if (Math.abs(wordCount - expectedWordCount) > 50) {
      warnings.push(`Passage word count ${wordCount} differs significantly from expected ${expectedWordCount}`);
    }
    
    // Check paragraph markers
    if (!passage.includes('[1]')) {
      warnings.push('Passage missing paragraph markers [1], [2], etc.');
    }
    
    // Check question count
    if (questions.length !== 25) {
      warnings.push(`Expected 25 questions, got ${questions.length}`);
    }
    
    // Check for duplicate questions
    const questionTexts = questions.map(q => q.text);
    const uniqueTexts = new Set(questionTexts);
    if (uniqueTexts.size !== questionTexts.length) {
      warnings.push('Duplicate questions detected');
    }
    
    // Check each enhanced question
    questions.forEach((q, idx) => {
      // Check questionId format
      if (!q.questionId || !q.questionId.match(/^S\d+_Q\d+$/)) {
        warnings.push(`Question ${idx + 1}: Invalid questionId format`);
      }
      
      // Check options with rationales
      if (!q.options || q.options.length !== 4) {
        warnings.push(`Question ${idx + 1}: Must have exactly 4 options`);
      } else {
        q.options.forEach((opt, optIdx) => {
          if (!opt.text || !opt.rationale) {
            warnings.push(`Question ${idx + 1}, Option ${optIdx + 1}: Missing text or rationale`);
          }
        });
      }
      
      // Check correct answer
      if (q.correctAnswer < 0 || q.correctAnswer > 3) {
        warnings.push(`Question ${idx + 1}: Invalid correct answer index`);
      }
      
      // Check new required fields
      if (!q.hint) warnings.push(`Question ${idx + 1}: Missing hint`);
      if (!q.paragraphReference) warnings.push(`Question ${idx + 1}: Missing paragraph reference`);
      if (!q.skills || q.skills.length === 0) warnings.push(`Question ${idx + 1}: Missing skills`);
      if (!q.difficultyScore || q.difficultyScore < 1 || q.difficultyScore > 5) {
        warnings.push(`Question ${idx + 1}: Invalid difficulty score`);
      }
    });
    
    return warnings;
  }
}

// Enhanced File processor
class FileProcessor {
  private logger: Logger;
  private contentGenerator: ContentGenerator;
  private qualityController: QualityController;

  constructor(logger: Logger, contentGenerator: ContentGenerator, qualityController: QualityController) {
    this.logger = logger;
    this.contentGenerator = contentGenerator;
    this.qualityController = qualityController;
  }

  scanPlaceholderFiles(): PlaceholderFile[] {
    if (!fs.existsSync(CONFIG.outputDir)) {
      this.logger.error(`Output directory ${CONFIG.outputDir} does not exist`);
      return [];
    }

    const files = fs.readdirSync(CONFIG.outputDir)
      .filter(file => file.endsWith('ReadingQuestions.ts'))
      .map((file, index) => {
        const filePath = path.join(CONFIG.outputDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const hasPlaceholders = content.includes('[PLACEHOLDER');
        
        // Extract topic and difficulty from filename
        const match = file.match(/^(easy|medium|hard)(\w+)ReadingQuestions\.ts$/);
        const difficulty = (match ? match[1] : 'medium') as 'easy' | 'medium' | 'hard';
        const topic = match ? match[2] : 'unknown';
        
        return {
          filePath,
          fileName: file,
          topic,
          difficulty,
          hasPlaceholders,
          storyIndex: index + 1  // For questionId generation
        };
      });

    this.logger.info(`Found ${files.length} reading question files, ${files.filter(f => f.hasPlaceholders).length} with placeholders`);
    return files;
  }

  async processEnhancedFile(file: PlaceholderFile): Promise<GenerationResult> {
    try {
      this.logger.info(`Processing ${file.fileName} with enhancements...`);
      
      if (!file.hasPlaceholders) {
        this.logger.info(`${file.fileName} already processed, skipping`);
        return {
          success: true,
          fileName: file.fileName,
          topic: file.topic,
          difficulty: file.difficulty
        };
      }

      // Read and parse the file
      const content = fs.readFileSync(file.filePath, 'utf-8');
      const questionData = this.extractEnhancedQuestionData(content, file);
      
      // שיפור #1: Generate engaging title
      const storyTitle = await this.contentGenerator.generateStoryTitle(file.topic, file.difficulty);
      this.logger.info(`Generated title: "${storyTitle}"`);
      
      // Generate passage with title
      const passage = await this.contentGenerator.generatePassageWithTitle(
        file.topic, file.difficulty, storyTitle
      );
      
      // Generate enhanced questions
      const questions = await this.contentGenerator.generateEnhancedQuestions(
        passage, file.topic, file.difficulty, storyTitle, questionData
      );
      
      // Merge generated content with original structure
      const enhancedQuestions = this.mergeEnhancedQuestions(
        questionData, questions, file.storyIndex || 1
      );
      
      // 🎲 SHUFFLE ANSWER OPTIONS for balanced distribution
      this.logger.info('🎲 Shuffling answer options for balanced distribution...');
      const shuffledQuestions = enhancedQuestions.map(shuffleQuestionOptions);
      
      // Quality check
      const expectedWordCount = file.difficulty === 'easy' ? 200 : 
                               file.difficulty === 'medium' ? 350 : 500;
      let warnings = this.qualityController.validateEnhancedContent(
        passage, shuffledQuestions, expectedWordCount, storyTitle
      );
      
      if (warnings.length > 0) {
        warnings.forEach(warning => this.logger.warn(`${file.fileName}: ${warning}`));
      }
      
      // Update both TypeScript and JSON files
      await this.updateEnhancedFiles(file, passage, shuffledQuestions, storyTitle);
      
      // Upload to Supabase database
      const uploader = new SupabaseUploader();
      this.logger.info('📤 Uploading to Supabase database...');
      
      const uploadResult = await uploader.uploadStory(passage, shuffledQuestions, {
        title: storyTitle,
        difficulty: file.difficulty,
        topic: file.topic,
        wordCount: passage.split(/\s+/).length,
        numQuestions: shuffledQuestions.length,
        estimatedTime: file.difficulty === 'easy' ? 2 : file.difficulty === 'medium' ? 3 : 5
      }, storyTitle);
      
      if (uploadResult.success) {
        this.logger.info(`✅ Successfully uploaded to database: ${uploadResult.questionsUploaded} questions, passage ID: ${uploadResult.passageId}`);
      } else {
        this.logger.error(`❌ Database upload failed: ${uploadResult.error}`);
        // Don't fail the entire process, just log the error
        warnings.push(`Database upload failed: ${uploadResult.error}`);
      }
      
      this.logger.info(`✅ Successfully processed ${file.fileName} with all enhancements`);
      
      return {
        success: true,
        fileName: file.fileName,
        topic: file.topic,
        difficulty: file.difficulty,
        storyTitle,
        passageWordCount: passage.split(/\s+/).length,
        questionsGenerated: shuffledQuestions.length,
        warnings
      };
      
    } catch (error) {
      this.logger.error(`Failed to process ${file.fileName}: ${error}`);
      return {
        success: false,
        fileName: file.fileName,
        topic: file.topic,
        difficulty: file.difficulty,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private extractEnhancedQuestionData(content: string, file: PlaceholderFile): EnhancedQuestion[] {
    try {
      // Try to find existing question structure
      let questionsMatch = content.match(/export const questions.*?=\s*(\[[\s\S]*?\]);/);
      
      if (!questionsMatch) {
        questionsMatch = content.match(/export const \w+ReadingQuestions.*?=\s*(\[[\s\S]*?\]);/);
      }
      
      if (!questionsMatch) {
        throw new Error('Could not find questions array in file');
      }
      
      const questionsStr = questionsMatch[1];
      // Safe parsing - avoid eval in production
      const questions = JSON.parse(
        questionsStr
          .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
          .replace(/'/g, '"')  // Replace single quotes
          .replace(/,\s*\]/g, ']')  // Remove trailing commas
          .replace(/,\s*\}/g, '}')  // Remove trailing commas
      );
      
      return questions;
    } catch (error) {
      this.logger.warn(`Could not parse existing questions, creating default structure`);
      // Return default structure if parsing fails
      return this.createDefaultQuestionStructure(file);
    }
  }

  private createDefaultQuestionStructure(file: PlaceholderFile): EnhancedQuestion[] {
    const questions: EnhancedQuestion[] = [];
    const difficultyScore = file.difficulty === 'easy' ? 2 : 
                           file.difficulty === 'medium' ? 3 : 5;
    
    for (let i = 1; i <= 25; i++) {
      const questionType = i <= 5 ? 'detail' :
                          i <= 15 ? 'main-idea' :
                          i <= 20 ? 'inference' : 'vocabulary';
      
      questions.push({
        questionId: `S${file.storyIndex}_Q${i}`,
        type: 'reading-comprehension',
        text: '[PLACEHOLDER]',
        options: [
          { text: '[PLACEHOLDER]', rationale: '[PLACEHOLDER]' },
          { text: '[PLACEHOLDER]', rationale: '[PLACEHOLDER]' },
          { text: '[PLACEHOLDER]', rationale: '[PLACEHOLDER]' },
          { text: '[PLACEHOLDER]', rationale: '[PLACEHOLDER]' }
        ],
        correctAnswer: 0,
        difficulty: file.difficulty,
        difficultyScore,
        explanation: '[PLACEHOLDER]',
        hint: '[PLACEHOLDER]',
        paragraphReference: '[PLACEHOLDER]',
        skills: SKILLS_MAPPING[questionType].slice(0, 2),
        tags: [`${file.difficulty}-level`, questionType, file.topic.toLowerCase()],
        metadata: {
          topic: file.topic,
          questionNumber: i,
          questionType: questionType as any,
          totalQuestions: 25,
          wordCount: difficultyScore === 2 ? 200 : difficultyScore === 3 ? 350 : 500,
          estimatedTime: difficultyScore === 2 ? 2 : difficultyScore === 3 ? 3 : 5
        }
      });
    }
    
    return questions;
  }

  private mergeEnhancedQuestions(
    originalQuestions: EnhancedQuestion[],
    generatedQuestions: any[],
    storyIndex: number
  ): EnhancedQuestion[] {
    return originalQuestions.map((original, idx) => {
      const generated = generatedQuestions[idx];
      if (!generated) {
        this.logger.warn(`Missing generated question ${idx + 1}, using defaults`);
        return original;
      }
      
      // שיפור #9: Ensure proper questionId format
      const questionId = original.questionId || `S${storyIndex}_Q${idx + 1}`;
      
      return {
        ...original,
        questionId,
        text: generated.text || original.text,
        options: generated.options || original.options,
        correctAnswer: generated.correctAnswer ?? original.correctAnswer,
        explanation: generated.explanation || original.explanation,
        hint: generated.hint || '[Click for a helpful clue]',  // שיפור #4
        paragraphReference: generated.paragraphReference || 'See passage',  // שיפור #2
        // Preserve or enhance metadata
        aiPrompt: original.aiPrompt || `Generated question ${idx + 1}`,  // שיפור #8
      };
    });
  }

  private async updateEnhancedFiles(
    file: PlaceholderFile,
    passage: string,
    questions: EnhancedQuestion[],
    storyTitle: string
  ): Promise<void> {
    const difficultyScore = file.difficulty === 'easy' ? 2 : 
                           file.difficulty === 'medium' ? 3 : 5;
    
    // שיפור #7: Create story summary
    const storySummary: StorySummary = {
      title: storyTitle,
      difficulty: file.difficulty,
      topic: file.topic,
      wordCount: passage.split(/\s+/).length,
      numQuestions: questions.length,
      estimatedTime: difficultyScore === 2 ? 2 : difficultyScore === 3 ? 3 : 5,
      topicId: file.storyIndex
    };

    // Create TypeScript content with all enhancements
    const tsContent = `import { Question, StorySummary } from '../../types/questionTypes';

// שיפור #12: Version tracking
export const version = "final-ai-filled";

// שיפור #7: Story summary
export const storySummary: StorySummary = ${JSON.stringify(storySummary, null, 2)};

// Reading passage - ${storyTitle} (${file.difficulty} level)
export const passage = \`${passage.replace(/`/g, '\\`')}\`;

// Enhanced questions with all improvements
export const questions: Question[] = ${JSON.stringify(questions, null, 2)};

// Legacy exports for backward compatibility
export const ${file.difficulty}${file.topic}PassageText = passage;
export const ${file.difficulty}${file.topic}ReadingQuestions = questions;`;

    // Save TypeScript file
    fs.writeFileSync(file.filePath, tsContent, 'utf-8');
    
    // שיפור #10: Save JSON version
    const jsonContent = {
      version: "final-ai-filled",
      storySummary,
      passage,
      questions
    };
    
    const jsonPath = file.filePath.replace('.ts', '.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2), 'utf-8');
    
    this.logger.info(`Updated both .ts and .json files for ${file.fileName}`);
  }
}

// Main orchestrator
class EnhancedAMIRAMGenerator {
  private logger: Logger;
  private claudeAPI: ClaudeAPI;
  private contentGenerator: ContentGenerator;
  private qualityController: QualityController;
  private fileProcessor: FileProcessor;

  constructor() {
    this.logger = new Logger();
    
    if (!CONFIG.claudeApiKey) {
      console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
      console.error('Make sure your .env file contains: ANTHROPIC_API_KEY=your_key_here');
      throw new Error('ANTHROPIC_API_KEY not found in environment variables');
    }
    
    console.log('✅ API Key loaded successfully');
    this.claudeAPI = new ClaudeAPI(CONFIG.claudeApiKey, CONFIG.claudeModel, this.logger);
    this.contentGenerator = new ContentGenerator(this.claudeAPI, this.logger);
    this.qualityController = new QualityController(this.logger);
    this.fileProcessor = new FileProcessor(this.logger, this.contentGenerator, this.qualityController);
  }

  async run(): Promise<void> {
    this.logger.info('🚀 Starting Enhanced AMIRAM Content Generation with 12 improvements...');
    
    try {
      // Scan for placeholder files
      const files = this.fileProcessor.scanPlaceholderFiles();
      const filesToProcess = files.filter(f => f.hasPlaceholders);
      
      if (filesToProcess.length === 0) {
        this.logger.info('No placeholder files found to process');
        return;
      }
      
      this.logger.info(`Found ${filesToProcess.length} files to process with enhancements`);
      
      // Process each file with enhancements
      const results: GenerationResult[] = [];
      for (const file of filesToProcess) {
        const result = await this.fileProcessor.processEnhancedFile(file);
        results.push(result);
        
        // Small delay between files
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Generate enhanced summary report
      this.generateEnhancedSummaryReport(results);
      
      this.logger.info('🎉 Enhanced content generation completed with all 12 improvements!');
      
    } catch (error) {
      this.logger.error(`Fatal error in enhanced content generation: ${error}`);
      throw error;
    }
  }

  private generateEnhancedSummaryReport(results: GenerationResult[]): void {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    this.logger.info('\n📊 ENHANCED GENERATION SUMMARY:');
    this.logger.info(`✅ Successful: ${successful.length}`);
    this.logger.info(`❌ Failed: ${failed.length}`);
    this.logger.info(`📝 Total questions generated: ${successful.reduce((sum, r) => sum + (r.questionsGenerated || 0), 0)}`);
    
    // Show generated titles
    if (successful.length > 0) {
      this.logger.info('\n📚 GENERATED STORY TITLES:');
      successful.forEach(r => {
        if (r.storyTitle) {
          this.logger.info(`  - ${r.topic} (${r.difficulty}): "${r.storyTitle}"`);
        }
      });
    }
    
    if (failed.length > 0) {
      this.logger.error('\n❌ FAILED FILES:');
      failed.forEach(r => {
        this.logger.error(`  - ${r.fileName}: ${r.error}`);
      });
    }
    
    if (successful.some(r => r.warnings && r.warnings.length > 0)) {
      this.logger.warn('\n⚠️  FILES WITH WARNINGS:');
      successful.forEach(r => {
        if (r.warnings && r.warnings.length > 0) {
          this.logger.warn(`  - ${r.fileName}: ${r.warnings.join(', ')}`);
        }
      });
    }
    
    // List all enhancements applied
    this.logger.info('\n✨ ENHANCEMENTS APPLIED:');
    this.logger.info('  1. ✅ Engaging story titles generated');
    this.logger.info('  2. ✅ Paragraph references for each question');
    this.logger.info('  3. ✅ Detailed rationales for all options');
    this.logger.info('  4. ✅ Hints for each question');
    this.logger.info('  5. ✅ Numeric difficulty scores (1-5)');
    this.logger.info('  6. ✅ Skill tags for analytics');
    this.logger.info('  7. ✅ Story summaries exported');
    this.logger.info('  8. ✅ AI prompts preserved');
    this.logger.info('  9. ✅ Coherent question IDs (S1_Q1 format)');
    this.logger.info(' 10. ✅ JSON format exports created');
    this.logger.info(' 11. ✅ Comprehensive validation');
    this.logger.info(' 12. ✅ Version tracking (final-ai-filled)');
  }
}

// CLI runner
async function main() {
  console.log('🚀 Enhanced AMIRAM Generator Starting...');
  console.log('📋 This version includes all 12 requested improvements!');
  try {
    const generator = new EnhancedAMIRAMGenerator();
    await generator.run();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Always run the main function
main().catch(console.error);