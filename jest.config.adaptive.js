/**
 * Jest Configuration for Adaptive Question Delivery System Tests
 * 
 * Specialized configuration for comprehensive testing of the adaptive
 * question delivery system with performance benchmarks.
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/services/adaptiveQuestions/__tests__/**/*.test.ts',
    '<rootDir>/src/api/adaptive-questions/**/*.test.ts'
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/services/adaptiveQuestions/__tests__/setup.ts'
  ],
  
  // TypeScript transformation
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  
  // Module resolution
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/services/adaptiveQuestions/**/*.ts',
    'src/api/adaptive-questions/**/*.ts',
    '!src/services/adaptiveQuestions/__tests__/**',
    '!src/services/adaptiveQuestions/index.ts',
    '!**/*.d.ts'
  ],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    },
    'src/services/adaptiveQuestions/questionDeliveryService.ts': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    },
    'src/services/adaptiveQuestions/progressTrackingService.ts': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    },
    'src/services/adaptiveQuestions/simulationService.ts': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  
  // Test timeouts for performance tests
  testTimeout: 30000, // 30 seconds for performance tests
  
  // Global setup and teardown
  globalSetup: '<rootDir>/src/services/adaptiveQuestions/__tests__/globalSetup.ts',
  globalTeardown: '<rootDir>/src/services/adaptiveQuestions/__tests__/globalTeardown.ts',
  
  // Performance testing configuration
  globals: {
    'ts-jest': {
      tsconfig: {
        compilerOptions: {
          // Enable source maps for better error reporting
          sourceMap: true,
          inlineSourceMap: false
        }
      }
    }
  },
  
  // Verbose output for detailed test results
  verbose: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  
  // Memory and performance monitoring
  detectOpenHandles: true,
  forceExit: true,
  
  // Test result formatting
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-reports/adaptive-questions',
      filename: 'test-report.html',
      expand: true,
      hideIcon: false,
      pageTitle: 'Adaptive Questions Test Report'
    }],
    ['jest-junit', {
      outputDirectory: './test-reports/adaptive-questions',
      outputName: 'junit.xml',
      suiteName: 'Adaptive Question Delivery System Tests'
    }]
  ],
  
  // Test categories
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Mock configuration
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/build/'
  ],
  
  // Performance test configuration
  maxWorkers: '50%', // Use half of available CPU cores
  
  // Custom test sequences for different test types
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: [
        '<rootDir>/src/services/adaptiveQuestions/__tests__/*Service.test.ts'
      ],
      testTimeout: 10000
    },
    {
      displayName: 'Integration Tests',
      testMatch: [
        '<rootDir>/src/services/adaptiveQuestions/__tests__/integration.test.ts'
      ],
      testTimeout: 20000
    },
    {
      displayName: 'Performance Tests',
      testMatch: [
        '<rootDir>/src/services/adaptiveQuestions/__tests__/performance.test.ts'
      ],
      testTimeout: 60000,
      maxWorkers: 1 // Run performance tests sequentially
    }
  ]
};