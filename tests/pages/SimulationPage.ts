
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SimulationPage extends BasePage {
  readonly url = '/simulations-entry';

  // Simulation selection
  get practiceButton() { return this.page.locator('[data-testid="practice-button"]'); }
  get fullSimulationButton() { return this.page.locator('[data-testid="full-simulation-button"]'); }
  get readingComprehensionButton() { return this.page.locator('[data-testid="reading-button"]'); }

  // Question elements
  get questionContainer() { return this.page.locator('[data-testid="question-container"]'); }
  get questionText() { return this.page.locator('[data-testid="question-text"]'); }
  get questionNumber() { return this.page.locator('[data-testid="question-number"]'); }
  get answerOptions() { return this.page.locator('[data-testid="answer-option"]'); }
  get explanationText() { return this.page.locator('[data-testid="explanation"]'); }

  // Navigation buttons
  get nextButton() { return this.page.locator('[data-testid="next-button"]'); }
  get previousButton() { return this.page.locator('[data-testid="previous-button"]'); }
  get submitButton() { return this.page.locator('[data-testid="submit-button"]'); }
  get finishButton() { return this.page.locator('[data-testid="finish-button"]'); }

  // Progress indicators
  get progressBar() { return this.page.locator('[data-testid="progress-bar"]'); }
  get timerDisplay() { return this.page.locator('[data-testid="timer"]'); }
  get scoreDisplay() { return this.page.locator('[data-testid="score"]'); }

  // Save buttons
  get saveQuestionButton() { return this.page.locator('[data-testid="save-question"]'); }
  get flagQuestionButton() { return this.page.locator('[data-testid="flag-question"]'); }

  async goto() {
    await this.navigateTo(this.url);
  }

  async startFullSimulation() {
    await this.fullSimulationButton.click();
    await this.page.waitForURL('**/quiz/**');
  }

  async startPracticeSimulation() {
    await this.page.waitForLoadState('networkidle');
    await this.practiceButton.click();
    await this.page.waitForURL('**/quiz/**');
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
