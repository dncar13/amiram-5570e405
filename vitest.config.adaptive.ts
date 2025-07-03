/**
 * Vitest Configuration for Adaptive Question Delivery System Tests
 * 
 * Specialized configuration for comprehensive testing of the adaptive
 * question delivery system with performance benchmarks.
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',
    
    // Test file patterns
    include: [
      'src/services/adaptiveQuestions/__tests__/**/*.test.ts',
      'src/api/adaptive-questions/**/*.test.ts'
    ],
    
    // Setup files
    setupFiles: [
      'src/services/adaptiveQuestions/__tests__/setup.ts'
    ],
    
    // Global setup and teardown
    globalSetup: [
      'src/services/adaptiveQuestions/__tests__/globalSetup.ts'
    ],
    globalTeardown: [
      'src/services/adaptiveQuestions/__tests__/globalTeardown.ts'
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      include: [
        'src/services/adaptiveQuestions/**/*.ts',
        'src/api/adaptive-questions/**/*.ts'
      ],
      exclude: [
        'src/services/adaptiveQuestions/__tests__/**',
        'src/services/adaptiveQuestions/index.ts',
        '**/*.d.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 85,
          statements: 85
        }
      },
      reporter: ['text', 'json-summary']
    },
    
    // Test timeouts for performance tests
    testTimeout: 30000, // 30 seconds for performance tests
    
    // Performance testing configuration
    globals: true,
    
    // Clear mocks between tests
    clearMocks: true,
    restoreMocks: true,
    
    // Output configuration
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './test-reports/adaptive-questions/test-results.json'
    },
    
    // Pool configuration for performance tests
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 4,
        minThreads: 1
      }
    },
    
    // Sequence configuration
    sequence: {
      concurrent: false, // Run performance tests sequentially
      shuffle: false
    }
  },
  
  // Module resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  // Define for environment variables
  define: {
    'process.env.NODE_ENV': '"test"',
    'process.env.NEXT_PUBLIC_SUPABASE_URL': '"https://test.supabase.co"',
    'process.env.SUPABASE_SERVICE_ROLE_KEY': '"test-service-role-key"'
  }
});