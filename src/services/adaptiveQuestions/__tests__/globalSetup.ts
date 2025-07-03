/**
 * Global Test Setup
 * 
 * Configures the test environment for adaptive question delivery system tests.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export default async function globalSetup() {
  console.log('🚀 Setting up Adaptive Questions Test Environment...');

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

  // Create test reports directory
  const reportsDir = path.join(process.cwd(), 'test-reports', 'adaptive-questions');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    console.log('📁 Created test reports directory');
  }

  // Initialize performance monitoring
  if (typeof global.gc === 'undefined') {
    console.log('⚠️  Garbage collection not available. Run with --expose-gc for memory tests.');
  } else {
    console.log('♻️  Garbage collection available for memory testing');
  }

  // Log system information
  const totalMemory = process.memoryUsage();
  console.log('💾 Initial Memory Usage:', {
    rss: `${Math.round(totalMemory.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(totalMemory.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(totalMemory.heapUsed / 1024 / 1024)}MB`
  });

  // Create performance baseline
  const performanceBaseline = {
    timestamp: new Date().toISOString(),
    memoryUsage: totalMemory,
    nodeVersion: process.version,
    platform: process.platform
  };

  fs.writeFileSync(
    path.join(reportsDir, 'performance-baseline.json'),
    JSON.stringify(performanceBaseline, null, 2)
  );

  console.log('✅ Test environment setup complete');
}