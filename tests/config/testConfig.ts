
export const TestConfig = {
  // Timeouts
  DEFAULT_TIMEOUT: 30000,
  NETWORK_TIMEOUT: 15000,
  ELEMENT_TIMEOUT: 10000,
  
  // Performance thresholds
  PERFORMANCE: {
    MAX_LOAD_TIME: 5000,
    MAX_LCP: 4000,
    MAX_FCP: 3000,
    MAX_MEMORY_INCREASE: 50 * 1024 * 1024, // 50MB
    MAX_TRANSITION_TIME: 500,
  },
  
  // Visual regression
  VISUAL: {
    MAX_DIFF_PIXELS: 100,
    THRESHOLD: 0.2,
  },
  
  // Test data
  TEST_USERS: {
    VALID: {
      email: 'test@example.com',
      password: 'Test@1234!'
    },
    PREMIUM: {
      email: 'premium@example.com',
      password: 'Premium@1234!'
    },
    ADMIN: {
      email: 'admin@example.com',
      password: 'Admin@1234!'
    }
  },
  
  // URLs
  BASE_URL: process.env.BASE_URL || 'http://localhost:5173',
  
  // Retry configuration
  RETRY: {
    MAX_RETRIES: 3,
    DELAY: 1000
  },
  
  // Security test payloads
  SECURITY: {
    XSS_PAYLOADS: [
      '<script>alert("XSS")</script>',
      '<img src=x onerror="alert(1)">',
      'javascript:alert(1)',
      '<svg onload=alert(1)>',
      '"><script>alert(1)</script>'
    ],
    SQL_PAYLOADS: [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "admin'--"
    ]
  },
  
  // Browser configurations
  BROWSERS: {
    CHROMIUM: { name: 'chromium' },
    FIREFOX: { name: 'firefox' },
    WEBKIT: { name: 'webkit' }
  },
  
  // Viewport sizes
  VIEWPORTS: {
    MOBILE: { width: 375, height: 667 },
    TABLET: { width: 768, height: 1024 },
    DESKTOP: { width: 1920, height: 1080 }
  }
};
