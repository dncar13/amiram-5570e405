
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SimulationPage } from '../pages/SimulationPage';
import { ResultsPage } from '../pages/ResultsPage';
import { HomePage } from '../pages/HomePage';
import { TestUsers } from '../utils/testData';

test.describe('מערכת סימולציה', () => {
  let loginPage: LoginPage;
  let simulationPage: SimulationPage;
  let resultsPage: ResultsPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    simulationPage = new SimulationPage(page);
    resultsPage = new ResultsPage(page);
    homePage = new HomePage(page);
    
    // התחברות לפני כל בדיקה
    await loginPage.goto();
    await loginPage.login(TestUsers.validUser.email, TestUsers.validUser.password);
    await loginPage.expectLoginSuccess();
  });

  test('כניסה לעמוד סימולציות', async () => {
    await simulationPage.goto();
    await expect(simulationPage.page).toHaveURL(/.*simulation/);
  });

  test('התחלת סימולציה מלאה', async () => {
    await simulationPage.goto();
    await simulationPage.startFullSimulation();
    await simulationPage.expectQuestionVisible();
  });

  test('התחלת תרגול', async () => {
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    await simulationPage.expectQuestionVisible();
  });

  test('מענה על שאלות וניווט', async () => {
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    
    // מענה על שאלה ראשונה
    await simulationPage.selectAnswer(0);
    await simulationPage.submitAnswer();
    
    // מעבר לשאלה הבאה
    if (await simulationPage.nextButton.isVisible()) {
      await simulationPage.goToNextQuestion();
      
      // בדיקה שעברנו לשאלה הבאה
      const currentQuestion = await simulationPage.getCurrentQuestionNumber();
      expect(currentQuestion).toBeGreaterThan(1);
    }
  });

  test('שמירת שאלה', async () => {
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    
    if (await simulationPage.saveQuestionButton.isVisible()) {
      await simulationPage.saveCurrentQuestion();
      // בדיקת הודעת הצלחה או שינוי מצב הכפתור
      await expect(simulationPage.page.locator('text=נשמר, text=שמור')).toBeVisible();
    }
  });

  test('סיום תרגול וקבלת תוצאות', async () => {
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    
    // מענה על מספר שאלות
    for (let i = 0; i < 3; i++) {
      await simulationPage.selectAnswer(0);
      await simulationPage.submitAnswer();
      
      if (await simulationPage.nextButton.isVisible()) {
        await simulationPage.goToNextQuestion();
      } else if (await simulationPage.finishButton.isVisible()) {
        await simulationPage.finishSimulation();
        break;
      }
    }
    
    // בדיקת עמוד תוצאות
    await resultsPage.expectResultsVisible();
    const score = await resultsPage.getScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('בדיקת טיימר בסימולציה מלאה', async () => {
    await simulationPage.goto();
    await simulationPage.startFullSimulation();
    
    // בדיקה שהטיימר פועל
    if (await simulationPage.timerDisplay.isVisible()) {
      await simulationPage.expectTimerRunning();
    }
  });

  test('בדיקת מעבר בין שאלות', async () => {
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    
    await simulationPage.selectAnswer(0);
    await simulationPage.submitAnswer();
    
    if (await simulationPage.nextButton.isVisible()) {
      await simulationPage.goToNextQuestion();
      
      // חזרה לשאלה קודמת
      if (await simulationPage.previousButton.isVisible()) {
        await simulationPage.goToPreviousQuestion();
        
        // בדיקה שחזרנו לשאלה הראשונה
        const currentQuestion = await simulationPage.getCurrentQuestionNumber();
        expect(currentQuestion).toBe(1);
      }
    }
  });

  test('בדיקת הצגת הסברים', async () => {
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    
    await simulationPage.selectAnswer(0);
    await simulationPage.submitAnswer();
    
    // בדיקה שמוצג הסבר (במצב תרגול)
    if (await simulationPage.explanationText.isVisible()) {
      await expect(simulationPage.explanationText).toContainText(/הסבר|תשובה|נכון|שגוי/);
    }
  });
});
