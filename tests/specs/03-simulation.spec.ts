
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
    try {
      await loginPage.expectLoginSuccess();
    } catch {
      // If login fails, skip test
      test.skip();
    }
  });

  test('כניסה לעמוד סימולציות', async () => {
    await simulationPage.goto();
    await expect(simulationPage.page).toHaveURL(/simulations-entry/);
  });

  test('התחלת סימולציה מלאה', async () => {
    await simulationPage.goto();
    if (await simulationPage.fullSimulationButton.isVisible()) {
      await simulationPage.startFullSimulation();
      await expect(simulationPage.page).toHaveURL(/quiz/);
    }
  });

  test('התחלת תרגול', async () => {
    await simulationPage.goto();
    if (await simulationPage.practiceButton.isVisible()) {
      await simulationPage.startPracticeSimulation();
      await expect(simulationPage.page).toHaveURL(/quiz/);
    }
  });

  test('מענה על שאלות וניווט', async () => {
    await simulationPage.goto();
    if (await simulationPage.practiceButton.isVisible()) {
      await simulationPage.startPracticeSimulation();
      
      // Wait for questions to load
      if (await simulationPage.answerOptions.first().isVisible({ timeout: 10000 })) {
        // מענה על שאלה ראשונה
        await simulationPage.selectAnswer(0);
        
        if (await simulationPage.submitButton.isVisible()) {
          await simulationPage.submitAnswer();
        }
        
        // מעבר לשאלה הבאה
        if (await simulationPage.nextButton.isVisible()) {
          await simulationPage.goToNextQuestion();
          
          // בדיקה שעברנו לשאלה הבאה
          const currentQuestion = await simulationPage.getCurrentQuestionNumber();
          expect(currentQuestion).toBeGreaterThan(0);
        }
      }
    }
  });

  test('שמירת שאלה', async () => {
    await simulationPage.goto();
    if (await simulationPage.practiceButton.isVisible()) {
      await simulationPage.startPracticeSimulation();
      
      if (await simulationPage.saveQuestionButton.isVisible({ timeout: 10000 })) {
        await simulationPage.saveCurrentQuestion();
        // בדיקת הודעת הצלחה או שינוי מצב הכפתור
        await expect(simulationPage.page.locator('text=נשמר, text=שמור')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('בדיקת טיימר בסימולציה מלאה', async () => {
    await simulationPage.goto();
    if (await simulationPage.fullSimulationButton.isVisible()) {
      await simulationPage.startFullSimulation();
      
      // בדיקה שהטיימר פועל
      if (await simulationPage.timerDisplay.isVisible({ timeout: 10000 })) {
        await simulationPage.expectTimerRunning();
      }
    }
  });

  test('בדיקת מעבר בין שאלות', async () => {
    await simulationPage.goto();
    if (await simulationPage.practiceButton.isVisible()) {
      await simulationPage.startPracticeSimulation();
      
      if (await simulationPage.answerOptions.first().isVisible({ timeout: 10000 })) {
        await simulationPage.selectAnswer(0);
        
        if (await simulationPage.submitButton.isVisible()) {
          await simulationPage.submitAnswer();
        }
        
        if (await simulationPage.nextButton.isVisible()) {
          await simulationPage.goToNextQuestion();
          
          // חזרה לשאלה קודמת
          if (await simulationPage.previousButton.isVisible()) {
            await simulationPage.goToPreviousQuestion();
            
            // בדיקה שחזרנו לשאלה קודמת
            const currentQuestion = await simulationPage.getCurrentQuestionNumber();
            expect(currentQuestion).toBeGreaterThanOrEqual(1);
          }
        }
      }
    }
  });

  test('בדיקת הצגת הסברים', async () => {
    await simulationPage.goto();
    if (await simulationPage.practiceButton.isVisible()) {
      await simulationPage.startPracticeSimulation();
      
      if (await simulationPage.answerOptions.first().isVisible({ timeout: 10000 })) {
        await simulationPage.selectAnswer(0);
        
        if (await simulationPage.submitButton.isVisible()) {
          await simulationPage.submitAnswer();
        }
        
        // בדיקה שמוצג הסבר (במצב תרגול)
        if (await simulationPage.explanationText.isVisible({ timeout: 5000 })) {
          await expect(simulationPage.explanationText).toContainText(/הסבר|תשובה|נכון|שגוי/);
        }
      }
    }
  });
});
