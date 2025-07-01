
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SimulationPage } from '../pages/SimulationPage';
import { TestConfig } from '../config/testConfig';
import { TestHelpers } from '../helpers/testHelpers';
import { Page } from '@playwright/test';

// Extend base test with custom fixtures
export const test = base.extend<{
  authenticatedPage: Page;
  simulationInProgress: Page;
  premiumUser: Page;
  cleanBrowser: Page;
}>({
  // Auto-login fixture
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TestConfig.TEST_USERS.VALID.email, TestConfig.TEST_USERS.VALID.password);
    await loginPage.expectLoginSuccess();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },

  // Simulation in progress fixture
  simulationInProgress: async ({ authenticatedPage }, use) => {
    const simulationPage = new SimulationPage(authenticatedPage);
    await simulationPage.goto();
    await simulationPage.startPracticeSimulation();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(authenticatedPage);
  },

  // Premium user fixture
  premiumUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TestConfig.TEST_USERS.PREMIUM.email, TestConfig.TEST_USERS.PREMIUM.password);
    await loginPage.expectLoginSuccess();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },

  // Clean browser fixture
  cleanBrowser: async ({ page }, use) => {
    await TestHelpers.clearBrowserData(page);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  }
});

export { expect } from '@playwright/test';
