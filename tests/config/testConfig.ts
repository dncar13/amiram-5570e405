
export const TestConfig = {
  // Test users for different scenarios
  TEST_USERS: {
    VALID: {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'Test@1234!'
    },
    PREMIUM: {
      email: process.env.PREMIUM_USER_EMAIL || 'premium@example.com',
      password: process.env.PREMIUM_USER_PASSWORD || 'Premium@1234!'
    },
    ADMIN: {
      email: process.env.ADMIN_USER_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_USER_PASSWORD || 'Admin@1234!'
    }
  },

  // Environment settings
  BASE_URL: process.env.BASE_URL || 'http://localhost:5173',
  
  // Test timeouts (in milliseconds)
  TIMEOUTS: {
    DEFAULT: 30000,
    NAVIGATION: 15000,
    API_RESPONSE: 10000,
    ELEMENT_VISIBLE: 5000
  },

  // Performance thresholds
  PERFORMANCE: {
    PAGE_LOAD_TIME: 5000,
    LCP_THRESHOLD: 2500,
    FCP_THRESHOLD: 1800,
    CLS_THRESHOLD: 0.1,
    MEMORY_LEAK_THRESHOLD: 50 * 1024 * 1024 // 50MB
  },

  // Visual regression settings
  VISUAL: {
    MAX_DIFF_PIXELS: 100,
    THRESHOLD: 0.2,
    FULL_PAGE_DELAY: 1000
  }
};
