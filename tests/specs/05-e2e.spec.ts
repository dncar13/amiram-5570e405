
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignupPage } from '../pages/SignupPage';
import { LoginPage } from '../pages/LoginPage';
import { SimulationPage } from '../pages/SimulationPage';
import { ResultsPage } from '../pages/ResultsPage';
import { HistoryPage } from '../pages/HistoryPage';
import { generateTestUser } from '../utils/testData';

test.describe('בדיקות End-to-End מלאות', () => {
  test('Flow מלא: הרשמה → התחברות → סימולציה → היסטוריה → התנתקות', async ({ page }) => {
    const homePage = new HomePage(page);
    const signupPage = new SignupPage(page);
    const loginPage = new LoginPage(page);
    const simulationPage = new SimulationPage(page);
    const resultsPage = new ResultsPage(page);
    const historyPage = new HistoryPage(page);
    
    const newUser = generateTestUser();
    
    console.log('🚀 מתחיל Flow מלא...');
    
    // שלב 1: הרשמה
    console.log('📝 שלב הרשמה...');
    await homePage.goto();
    await homePage.loginButton.click();
    
    if (await signupPage.page.locator('a:has-text("הרשמה"), text=הרשמה').isVisible()) {
      await signupPage.page.locator('a:has-text("הרשמה"), text=הרשמה').first().click();
    }
    
    await signupPage.signup({
      email: newUser.email,
      password: newUser.password,
      confirmPassword: newUser.password,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    });
    
    // שלב 2: התחברות (אם נדרשת)
    console.log('🔐 שלב התחברות...');
    if (await loginPage.page.locator('input[name="email"]').isVisible()) {
      await loginPage.login(newUser.email, newUser.password);
    }
    
    // בדיקה שמחובר
    await homePage.goto();
    expect(await homePage.isLoggedIn()).toBeTruthy();
    
    // שלב 3: סימולציה
    console.log('🎯 שלב סימולציה...');
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    
    // מענה על 3 שאלות לפחות
    for (let i = 0; i < 3; i++) {
      await simulationPage.expectQuestionVisible();
      await simulationPage.selectAnswer(0);
      await simulationPage.submitAnswer();
      
      if (await simulationPage.nextButton.isVisible()) {
        await simulationPage.goToNextQuestion();
      } else if (await simulationPage.finishButton.isVisible()) {
        await simulationPage.finishSimulation();
        break;
      } else {
        break;
      }
    }
    
    // בדיקת תוצאות
    console.log('📊 בדיקת תוצאות...');
    if (await resultsPage.scoreDisplay.isVisible()) {
      await resultsPage.expectResultsVisible();
      const score = await resultsPage.getScore();
      expect(score).toBeGreaterThanOrEqual(0);
    }
    
    // שלב 4: היסטוריה
    console.log('📈 בדיקת היסטוריה...');
    await historyPage.goto();
    await historyPage.expectPageLoaded();
    
    // בדיקה שהסימולציה נשמרה
    const simulationsCount = await historyPage.getSimulationsCount();
    expect(simulationsCount).toBeGreaterThan(0);
    
    // שלב 5: התנתקות
    console.log('👋 התנתקות...');
    await homePage.logout();
    expect(await homePage.isLoggedIn()).toBeFalsy();
    
    console.log('✅ Flow מלא הושלם בהצלחה!');
  });

  test('Flow סימולציה מלאה עם שמירת שאלות', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const simulationPage = new SimulationPage(page);
    const historyPage = new HistoryPage(page);
    
    // התחברות עם משתמש קיים
    await loginPage.goto();
    await loginPage.login('test@example.com', 'Test@1234!');
    
    // התחלת סימולציה
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    
    // שמירת שאלה ראשונה
    if (await simulationPage.saveQuestionButton.isVisible()) {
      await simulationPage.saveCurrentQuestion();
    }
    
    // מעבר לשאלה הבאה ושמירתה
    await simulationPage.selectAnswer(1);
    await simulationPage.submitAnswer();
    
    if (await simulationPage.nextButton.isVisible()) {
      await simulationPage.goToNextQuestion();
      
      if (await simulationPage.saveQuestionButton.isVisible()) {
        await simulationPage.saveCurrentQuestion();
      }
    }
    
    // סיום סימולציה
    if (await simulationPage.finishButton.isVisible()) {
      await simulationPage.finishSimulation();
    }
    
    // בדיקה בהיסטוריה שהשאלות נשמרו
    await historyPage.goto();
    await historyPage.switchToSavedQuestionsTab();
    
    const savedQuestionsCount = await historyPage.getSavedQuestionsCount();
    expect(savedQuestionsCount).toBeGreaterThan(0);
  });

  test('Flow התאוששות מסימולציה שנשמרה', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const simulationPage = new SimulationPage(page);
    
    // התחברות
    await loginPage.goto();
    await loginPage.login('test@example.com', 'Test@1234!');
    
    // התחלת סימולציה
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    
    // מענה על שאלה אחת
    await simulationPage.selectAnswer(0);
    await simulationPage.submitAnswer();
    
    // יציאה מהסימולציה (סגירת הדף)
    await page.goto('/');
    
    // חזרה לסימולציה - אמור להציע המשך
    await simulationPage.goto();
    
    // בדיקה שיש אפשרות להמשיך או שחוזר למקום שעצר
    const continueOption = page.locator('text=המשך, text=התקדמות, button:has-text("המשך")');
    if (await continueOption.isVisible()) {
      await continueOption.click();
      
      // בדיקה שחזר למקום הנכון
      const currentQuestion = await simulationPage.getCurrentQuestionNumber();
      expect(currentQuestion).toBeGreaterThan(1);
    }
  });
});
