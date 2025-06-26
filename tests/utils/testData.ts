
export const TestUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'Test@1234!',
    name: 'Test User'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'Admin@1234!',
    name: 'Admin User'
  }
};

export const TestData = {
  urls: {
    home: '/',
    login: '/login',
    simulationsEntry: '/simulations-entry',
    history: '/simulation-history'
  },
  performance: {
    maxLoadTime: 5000,
    maxNavigationTime: 3000
  },
  simulation: {
    maxQuestions: 50,
    timeoutPerQuestion: 120000
  }
};

export const generateTestUser = () => {
  const timestamp = Date.now();
  return {
    email: `test${timestamp}@example.com`,
    password: 'Test@1234!',
    name: `Test User ${timestamp}`,
    firstName: 'Test',
    lastName: `User${timestamp}`
  };
};
