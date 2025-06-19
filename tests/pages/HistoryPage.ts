
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HistoryPage extends BasePage {
  readonly url = '/simulation-history';

  // Statistics cards
  get averageScoreCard() { return this.page.locator('[data-testid="average-score"], :has-text("ציון ממוצע")'); }
  get completedSimulationsCard() { return this.page.locator('[data-testid="completed-simulations"], :has-text("סימולציות הושלמו")'); }
  get savedQuestionsCard() { return this.page.locator('[data-testid="saved-questions"], :has-text("שאלות שמורות")'); }
  get studyTimeCard() { return this.page.locator('[data-testid="study-time"], :has-text("זמן לימוד")'); }

  // Tabs
  get simulationsTab() { return this.page.locator('[data-testid="simulations-tab"], button:has-text("היסטוריית סימולציות")'); }
  get savedQuestionsTab() { return this.page.locator('[data-testid="saved-questions-tab"], button:has-text("שאלות שמורות")'); }

  // Simulations list
  get simulationCards() { return this.page.locator('[data-testid="simulation-card"], .simulation-item'); }
  get viewResultsButtons() { return this.page.locator('button:has-text("צפה בתוצאות")'); }
  get retakeButtons() { return this.page.locator('button:has-text("חזור על הסימולציה")'); }

  // Saved questions list
  get savedQuestionCards() { return this.page.locator('[data-testid="saved-question-card"], .saved-question'); }
  get practiceAgainButtons() { return this.page.locator('button:has-text("תרגל שוב")'); }
  get removeQuestionButtons() { return this.page.locator('button:has-text("הסר")'); }

  async goto() {
    await this.navigateTo(this.url);
  }

  async expectPageLoaded() {
    await expect(this.page.locator('h1:has-text("היסטוריה")')).toBeVisible();
    await expect(this.averageScoreCard).toBeVisible();
  }

  async switchToSavedQuestionsTab() {
    await this.savedQuestionsTab.click();
  }

  async switchToSimulationsTab() {
    await this.simulationsTab.click();
  }

  async getSimulationsCount(): Promise<number> {
    return await this.simulationCards.count();
  }

  async getSavedQuestionsCount(): Promise<number> {
    await this.switchToSavedQuestionsTab();
    return await this.savedQuestionCards.count();
  }

  async viewFirstSimulationResults() {
    await this.viewResultsButtons.first().click();
  }

  async retakeFirstSimulation() {
    await this.retakeButtons.first().click();
  }

  async practiceFirstSavedQuestion() {
    await this.switchToSavedQuestionsTab();
    await this.practiceAgainButtons.first().click();
  }

  async removeFirstSavedQuestion() {
    await this.switchToSavedQuestionsTab();
    await this.removeQuestionButtons.first().click();
  }
}
