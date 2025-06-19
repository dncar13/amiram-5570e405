
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HistoryPage } from '../pages/HistoryPage';
import { TestUsers } from '../utils/testData';

test.describe('עמוד היסטוריה וביצועים', () => {
  let loginPage: LoginPage;
  let historyPage: HistoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    historyPage = new HistoryPage(page);
    
    // התחברות לפני כל בדיקה
    await loginPage.goto();
    await loginPage.login(TestUsers.validUser.email, TestUsers.validUser.password);
    await loginPage.expectLoginSuccess();
  });

  test('טעינת עמוד היסטוריה', async () => {
    await historyPage.goto();
    await historyPage.expectPageLoaded();
  });

  test('בדיקת סטטיסטיקות כלליות', async () => {
    await historyPage.goto();
    
    // בדיקה שכל הכרטיסים מוצגים
    await expect(historyPage.averageScoreCard).toBeVisible();
    await expect(historyPage.completedSimulationsCard).toBeVisible();
    await expect(historyPage.savedQuestionsCard).toBeVisible();
    await expect(historyPage.studyTimeCard).toBeVisible();
  });

  test('מעבר בין טאבים', async () => {
    await historyPage.goto();
    
    // מעבר לטאב שאלות שמורות
    await historyPage.switchToSavedQuestionsTab();
    await expect(historyPage.savedQuestionCards.or(historyPage.page.locator('text=אין שאלות שמורות'))).toBeVisible();
    
    // חזרה לטאב סימולציות
    await historyPage.switchToSimulationsTab();
    await expect(historyPage.simulationCards.or(historyPage.page.locator('text=טרם בוצעו סימולציות'))).toBeVisible();
  });

  test('בדיקת רשימת סימולציות', async () => {
    await historyPage.goto();
    
    const simulationsCount = await historyPage.getSimulationsCount();
    
    if (simulationsCount > 0) {
      // בדיקה שמוצגים פרטי הסימולציה
      const firstCard = historyPage.simulationCards.first();
      await expect(firstCard).toBeVisible();
      
      // בדיקת כפתורי פעולה
      await expect(historyPage.viewResultsButtons.first()).toBeVisible();
      await expect(historyPage.retakeButtons.first()).toBeVisible();
    } else {
      // בדיקת מסך ריק
      await expect(historyPage.page.locator('text=טרם בוצעו סימולציות')).toBeVisible();
    }
  });

  test('בדיקת שאלות שמורות', async () => {
    await historyPage.goto();
    await historyPage.switchToSavedQuestionsTab();
    
    const savedQuestionsCount = await historyPage.getSavedQuestionsCount();
    
    if (savedQuestionsCount > 0) {
      // בדיקה שמוצגים פרטי השאלה
      const firstCard = historyPage.savedQuestionCards.first();
      await expect(firstCard).toBeVisible();
      
      // בדיקת כפתורי פעולה
      await expect(historyPage.practiceAgainButtons.first()).toBeVisible();
      await expect(historyPage.removeQuestionButtons.first()).toBeVisible();
    } else {
      // בדיקת מסך ריק
      await expect(historyPage.page.locator('text=אין שאלות שמורות')).toBeVisible();
    }
  });

  test('צפיה בתוצאות סימולציה קודמת', async () => {
    await historyPage.goto();
    
    const simulationsCount = await historyPage.getSimulationsCount();
    
    if (simulationsCount > 0) {
      await historyPage.viewFirstSimulationResults();
      // בדיקה שעבר לעמוד תוצאות או פתח דיאלוג
      await expect(historyPage.page.locator('text=תוצאות, text=ציון, [data-testid="results"]')).toBeVisible();
    }
  });

  test('חזרה על סימולציה', async () => {
    await historyPage.goto();
    
    const simulationsCount = await historyPage.getSimulationsCount();
    
    if (simulationsCount > 0) {
      await historyPage.retakeFirstSimulation();
      // בדיקה שעבר לעמוד סימולציה
      await expect(historyPage.page).toHaveURL(/.*simulation/);
    }
  });

  test('תרגול שאלה שמורה', async () => {
    await historyPage.goto();
    await historyPage.switchToSavedQuestionsTab();
    
    const savedQuestionsCount = await historyPage.getSavedQuestionsCount();
    
    if (savedQuestionsCount > 0) {
      await historyPage.practiceFirstSavedQuestion();
      // בדיקה שעבר למצב תרגול
      await expect(historyPage.page.locator('[data-testid="question-text"], .question-text')).toBeVisible();
    }
  });

  test('הסרת שאלה שמורה', async () => {
    await historyPage.goto();
    await historyPage.switchToSavedQuestionsTab();
    
    const initialCount = await historyPage.getSavedQuestionsCount();
    
    if (initialCount > 0) {
      await historyPage.removeFirstSavedQuestion();
      
      // אישור הסרה אם יש דיאלוג
      if (await historyPage.page.locator('button:has-text("אישור"), button:has-text("כן")').isVisible()) {
        await historyPage.page.locator('button:has-text("אישור"), button:has-text("כן")').click();
      }
      
      // בדיקה שהמספר ירד
      const newCount = await historyPage.getSavedQuestionsCount();
      expect(newCount).toBe(initialCount - 1);
    }
  });
});
