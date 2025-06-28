
export const TestUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'Test@1234!',
    firstName: 'טסט',
    lastName: 'משתמש'
  },
  invalidUser: {
    email: 'wrong@example.com',
    password: 'wrongpassword'
  },
  premiumUser: {
    email: 'premium@example.com',
    password: 'Premium@1234!'
  }
};

export const TestData = {
  urls: {
    home: '/',
    login: '/login',
    register: '/register',
    simulation: '/simulation',
    history: '/simulation-history'
  },
  performance: {
    maxLoadTime: 5000,
    maxLCP: 2500,
    maxFCP: 1800,
    maxCLS: 0.1
  },
  simulation: {
    minQuestions: 5,
    maxTimePerQuestion: 30000
  }
};

export function generateTestUser() {
  const timestamp = Date.now();
  return {
    email: `test${timestamp}@example.com`,
    password: 'Test@1234!',
    firstName: 'טסט',
    lastName: `משתמש${timestamp}`
  };
}
