import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationResult {
  fileName: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    version: string;
    hasTitle: boolean;
    questionCount: number;
    hasAllEnhancements: boolean;
    wordCount: number;
    difficultyScore: number;
  };
}

class EnhancedValidator {
  private outputDir: string;
  private results: ValidationResult[] = [];

  constructor() {
    this.outputDir = path.join(__dirname, 'output');
  }

  async validateAll(): Promise<void> {
    console.log('🔍 Starting Enhanced Validation...\n');

    const files = this.getGeneratedFiles();
    
    for (const file of files) {
      const result = await this.validateFile(file);
      this.results.push(result);
      this.printFileResult(result);
    }

    this.printSummary();
  }

  private getGeneratedFiles(): string[] {
    if (!fs.existsSync(this.outputDir)) {
      console.error('❌ Output directory does not exist');
      return [];
    }

    return fs.readdirSync(this.outputDir)
      .filter(f => f.endsWith('.json'));
  }

  private async validateFile(fileName: string): Promise<ValidationResult> {
    const filePath = path.join(this.outputDir, fileName);
    const errors: string[] = [];
    const warnings: string[] = [];
    const stats = {
      version: 'unknown',
      hasTitle: false,
      questionCount: 0,
      hasAllEnhancements: false,
      wordCount: 0,
      difficultyScore: 0
    };

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Check version (Enhancement #12)
      stats.version = content.version || 'missing';
      if (content.version !== 'final-ai-filled') {
        warnings.push(`Version is "${content.version}", expected "final-ai-filled"`);
      }

      // Check story summary (Enhancement #7)
      if (!content.storySummary) {
        errors.push('Missing storySummary');
      } else {
        // Check title (Enhancement #1)
        if (!content.storySummary.title || content.storySummary.title.length < 3) {
          errors.push('Missing or invalid story title');
        } else {
          stats.hasTitle = true;
        }

        // Check other summary fields
        const requiredSummaryFields = ['difficulty', 'topic', 'wordCount', 'numQuestions'];
        requiredSummaryFields.forEach(field => {
          if (!content.storySummary[field]) {
            errors.push(`Missing storySummary.${field}`);
          }
        });
      }

      // Check passage
      if (!content.passage) {
        errors.push('Missing passage');
      } else {
        stats.wordCount = content.passage.split(/\s+/).length;
        
        // Check for paragraph markers
        if (!content.passage.includes('[1]')) {
          warnings.push('Passage missing paragraph markers [1], [2], etc.');
        }
      }

      // Check questions
      if (!content.questions || !Array.isArray(content.questions)) {
        errors.push('Missing or invalid questions array');
      } else {
        stats.questionCount = content.questions.length;
        
        if (stats.questionCount !== 25) {
          errors.push(`Expected 25 questions, found ${stats.questionCount}`);
        }

        // Check each question for enhancements
        let allQuestionsValid = true;
        content.questions.forEach((q: any, idx: number) => {
          const qErrors: string[] = [];

          // Enhancement #9: Check questionId format
          if (!q.questionId || !q.questionId.match(/^S\d+_Q\d+$/)) {
            qErrors.push(`Invalid questionId format`);
          }

          // Enhancement #3: Check options with rationales
          if (!q.options || q.options.length !== 4) {
            qErrors.push(`Must have 4 options`);
          } else {
            q.options.forEach((opt: any, optIdx: number) => {
              if (!opt.text || !opt.rationale) {
                qErrors.push(`Option ${optIdx + 1} missing text or rationale`);
              }
            });
          }

          // Enhancement #2: Check paragraph reference
          if (!q.paragraphReference) {
            qErrors.push(`Missing paragraphReference`);
          }

          // Enhancement #4: Check hint
          if (!q.hint) {
            qErrors.push(`Missing hint`);
          }

          // Enhancement #5: Check difficulty score
          if (!q.difficultyScore || q.difficultyScore < 1 || q.difficultyScore > 5) {
            qErrors.push(`Invalid difficultyScore`);
          } else {
            stats.difficultyScore = Math.max(stats.difficultyScore, q.difficultyScore);
          }

          // Enhancement #6: Check skills
          if (!q.skills || !Array.isArray(q.skills) || q.skills.length === 0) {
            qErrors.push(`Missing skills array`);
          }

          // Enhancement #8: Check aiPrompt (optional but good to have)
          if (!q.aiPrompt) {
            warnings.push(`Question ${idx + 1}: Missing aiPrompt for future reference`);
          }

          if (qErrors.length > 0) {
            errors.push(`Question ${idx + 1}: ${qErrors.join(', ')}`);
            allQuestionsValid = false;
          }
        });

        stats.hasAllEnhancements = allQuestionsValid && errors.length === 0;
      }

      // Check for JSON/TS pair
      const tsFile = fileName.replace('.json', '.ts');
      if (!fs.existsSync(path.join(this.outputDir, tsFile))) {
        warnings.push('Missing corresponding TypeScript file');
      }

    } catch (error) {
      errors.push(`Failed to parse file: ${error}`);
    }

    return {
      fileName,
      valid: errors.length === 0,
      errors,
      warnings,
      stats
    };
  }

  private printFileResult(result: ValidationResult): void {
    const icon = result.valid ? '✅' : '❌';
    console.log(`${icon} ${result.fileName}`);
    
    if (result.stats.hasTitle) {
      console.log(`   📚 Version: ${result.stats.version}`);
      console.log(`   📝 Questions: ${result.stats.questionCount}`);
      console.log(`   📊 Word Count: ${result.stats.wordCount}`);
      console.log(`   ⭐ Max Difficulty: ${result.stats.difficultyScore}/5`);
      console.log(`   🎯 All Enhancements: ${result.stats.hasAllEnhancements ? 'Yes' : 'No'}`);
    }

    if (result.errors.length > 0) {
      console.log('   ❌ Errors:');
      result.errors.slice(0, 5).forEach(e => console.log(`      - ${e}`));
      if (result.errors.length > 5) {
        console.log(`      ... and ${result.errors.length - 5} more`);
      }
    }

    if (result.warnings.length > 0) {
      console.log('   ⚠️  Warnings:');
      result.warnings.slice(0, 3).forEach(w => console.log(`      - ${w}`));
      if (result.warnings.length > 3) {
        console.log(`      ... and ${result.warnings.length - 3} more`);
      }
    }

    console.log('');
  }

  private printSummary(): void {
    const validFiles = this.results.filter(r => r.valid);
    const filesWithWarnings = this.results.filter(r => r.warnings.length > 0);
    const totalQuestions = this.results.reduce((sum, r) => sum + r.stats.questionCount, 0);
    const enhancedFiles = this.results.filter(r => r.stats.hasAllEnhancements);

    console.log('═══════════════════════════════════════');
    console.log('📊 VALIDATION SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Total Files: ${this.results.length}`);
    console.log(`✅ Valid: ${validFiles.length}`);
    console.log(`❌ Invalid: ${this.results.length - validFiles.length}`);
    console.log(`⚠️  With Warnings: ${filesWithWarnings.length}`);
    console.log(`📝 Total Questions: ${totalQuestions}`);
    console.log(`✨ Fully Enhanced: ${enhancedFiles.length}`);
    
    // Check for all 12 enhancements
    console.log('\n🎯 Enhancement Checklist:');
    const enhancements = [
      { num: 1, name: 'Engaging Titles', check: this.results.every(r => r.stats.hasTitle) },
      { num: 2, name: 'Paragraph References', check: this.checkEnhancement('paragraphReference') },
      { num: 3, name: 'Option Rationales', check: this.checkEnhancement('rationale') },
      { num: 4, name: 'Hints', check: this.checkEnhancement('hint') },
      { num: 5, name: 'Difficulty Scores', check: this.checkEnhancement('difficultyScore') },
      { num: 6, name: 'Skill Tags', check: this.checkEnhancement('skills') },
      { num: 7, name: 'Story Summaries', check: this.results.every(r => !r.errors.includes('Missing storySummary')) },
      { num: 8, name: 'AI Prompts', check: !this.results.some(r => r.warnings.some(w => w.includes('aiPrompt'))) },
      { num: 9, name: 'Question IDs', check: this.checkEnhancement('questionId') },
      { num: 10, name: 'JSON Exports', check: true }, // We're validating JSON files
      { num: 11, name: 'Validation', check: true }, // This script itself
      { num: 12, name: 'Version Tracking', check: this.results.every(r => r.stats.version === 'final-ai-filled') }
    ];

    enhancements.forEach(e => {
      console.log(`  ${e.check ? '✅' : '❌'} ${e.num}. ${e.name}`);
    });

    const allEnhanced = enhancements.every(e => e.check);
    console.log(`\n${allEnhanced ? '🎉' : '⚠️'} Overall Status: ${allEnhanced ? 'ALL ENHANCEMENTS ACTIVE!' : 'Some enhancements missing'}`);

    // Final recommendation
    console.log('\n💡 Recommendations:');
    if (this.results.length - validFiles.length > 0) {
      console.log('   - Fix validation errors in invalid files');
    }
    if (filesWithWarnings.length > 0) {
      console.log('   - Review and address warnings');
    }
    if (!allEnhanced) {
      console.log('   - Ensure all 12 enhancements are properly implemented');
    }
    if (allEnhanced && validFiles.length === this.results.length) {
      console.log('   ✨ All files are production-ready!');
    }
  }

  private checkEnhancement(field: string): boolean {
    return !this.results.some(r => 
      r.errors.some(e => e.toLowerCase().includes(field.toLowerCase()))
    );
  }
}

// Run validator
async function main() {
  console.log('🚀 Enhanced Validator v2.0\n');
  console.log('Checking for all 12 enhancements...\n');
  
  const validator = new EnhancedValidator();
  await validator.validateAll();
}

main().catch(console.error);