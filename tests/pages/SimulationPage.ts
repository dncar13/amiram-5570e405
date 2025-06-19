
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SimulationPage extends BasePage {
  readonly url = '/simulation';

  // Simulation selection
  get simulationTypes() { return this.page.locator('[data-testid="simulation-type"], button:has-text("סימולציה")'); }
  get fullSimulationButton() { return this.page.locator('button:has-text("מלאה"), a[href*="full"]'); }
  get practiceSimulationButton() { return this.page.locator('button:has-text("תרגול"), a[href*="practice"]'); }
  get readingComprehensionButton() { return this.page.locator('button:has-text("הבנת הנקרא"), a[href*="reading"]'); }

  // Question elements
  get questionContainer() { return this.page.locator('[data-testid="question-container"], [class*="question"]'); }
  get questionText() { return this.page.locator('[data-testid="question-text"], .question-text'); }
  get questionNumber() { return this.page.locator('[data-testid="question-number"], .question-number'); }
  get answerOptions() { return this.page.locator('[data-testid="answer-option"], .answer-option, input[type="radio"]'); }
  get explanationText() { return this.page.locator('[data-testid="explanation"], .explanation'); }

  // Navigation buttons
  get nextButton() { return this.page.locator('button:has-text("הבא"), button:has-text("המשך")'); }
  get previousButton() { return this.page.locator('button:has-text("קודם"), button:has-text("חזור")'); }
  get submitButton() { return this.page.locator('button:has-text("שלח"), button:has-text("אישור")'); }
  get finishButton() { return this.page.locator('button:has-text("סיים"), button:has-text("סיום")'); }

  // Progress indicators
  get progressBar() { return this.page.locator('[data-testid="progress-bar"], .progress'); }
  get timerDisplay() { return this.page.locator('[data-testid="timer"], .timer'); }
  get scoreDisplay() { return this.page.locator('[data-testid="score"], .score'); }

  // Save/bookmark buttons
  get saveQuestionButton() { return this.page.locator('button:has-text("שמור"), [data-testid="save-question"]'); }
  get flagQuestionButton() { return this.page.locator('button:has-text("סמן"), [data-testid="flag-question"]'); }

  async goto() {
    await this.navigateTo(this.url);
  }

  async startFullSimulation() {
    await this.fullSimulationButton.click();
    await this.page.waitForURL('**/simulation/**');
  }

  async startPracticeSimulation() {
    await this.practiceSimulationButton.click();
    await this.page.waitForURL('**/simulation/**');
  }

  async selectAnswer(answerIndex: number) {
    const answers = this.answerOptions;
    await answers.nth(answerIndex).click();
  }

  async submitAnswer() {
    await this.submitButton.click();
  }

  async goToNextQuestion() {
    await this.nextButton.click();
  }

  async goToPreviousQuestion() {
    await this.previousButton.click();
  }

  async saveCurrentQuestion() {
    await this.saveQuestionButton.click();
  }

  async flagCurrentQuestion() {
    await this.flagQuestionButton.click();
  }

  async finishSimulation() {
    await this.finishButton.click();
  }

  async answerQuestionAndProceed(answerIndex: number) {
    await this.selectAnswer(answerIndex);
    await this.submitAnswer();
    
    // Wait for next question or results
    try {
      await this.nextButton.click();
    } catch {
      // Might be on results page
    }
  }

  async getCurrentQuestionNumber(): Promise<number> {
    const questionText = await this.questionNumber.textContent();
    const match = questionText?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async expectQuestionVisible() {
    await expect(this.questionContainer).toBeVisible();
    await expect(this.questionText).toBeVisible();
    await expect(this.answerOptions.first()).toBeVisible();
  }

  async expectTimerRunning() {
    await expect(this.timerDisplay).toBeVisible();
  }
}
