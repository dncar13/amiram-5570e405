
export const TestUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'Test@1234!',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    name: 'Invalid User',
    firstName: 'Invalid',
    lastName: 'User'
  }
};

export const TestData = {
  urls: {
    home: '/',
    login: '/login',
    signup: '/signup',
    simulations: '/simulations-entry',
    readingComprehension: '/reading-comprehension',
    about: '/about',
    history: '/simulation-history'
  },
  performance: {
    maxLoadTime: 5000 // 5 seconds
  },
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000
  }
};

export function generateTestUser() {
  const timestamp = Date.now();
  return {
    email: `test${timestamp}@example.com`,
    password: 'Test@1234!',
    name: `Test User ${timestamp}`,
    firstName: 'Test',
    lastName: `User${timestamp}`
  };
}

export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
