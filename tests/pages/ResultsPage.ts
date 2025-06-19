
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ResultsPage extends BasePage {
  // Results elements
  get scoreDisplay() { return this.page.locator('[data-testid="final-score"], .score, h1:has-text("ציון")'); }
  get correctAnswersCount() { return this.page.locator('[data-testid="correct-answers"], .correct-count'); }
  get totalQuestionsCount() { return this.page.locator('[data-testid="total-questions"], .total-count'); }
  get percentageScore() { return this.page.locator('[data-testid="percentage"], .percentage'); }
  get timeSpent() { return this.page.locator('[data-testid="time-spent"], .time'); }

  // Action buttons
  get retryButton() { return this.page.locator('button:has-text("שוב"), button:has-text("חזור")'); }
  get homeButton() { return this.page.locator('button:has-text("בית"), a[href="/"]'); }
  get historyButton() { return this.page.locator('button:has-text("היסטוריה"), a[href*="history"]'); }
  get reviewButton() { return this.page.locator('button:has-text("סקירה"), button:has-text("בדיקה")'); }

  // Results breakdown
  get resultsByTopic() { return this.page.locator('[data-testid="topic-results"], .topic-breakdown'); }
  get mistakesSection() { return this.page.locator('[data-testid="mistakes"], .mistakes'); }

  async expectResultsVisible() {
    await expect(this.scoreDisplay).toBeVisible();
    await expect(this.correctAnswersCount).toBeVisible();
  }

  async getScore(): Promise<number> {
    const scoreText = await this.scoreDisplay.textContent();
    const match = scoreText?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getCorrectAnswersCount(): Promise<number> {
    const text = await this.correctAnswersCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async retrySimulation() {
    await this.retryButton.click();
  }

  async goToHistory() {
    await this.historyButton.click();
  }

  async goHome() {
    await this.homeButton.click();
  }
}
