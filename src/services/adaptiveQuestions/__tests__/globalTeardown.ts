/**
 * Global Test Teardown
 * 
 * Cleans up and generates final reports for adaptive question delivery system tests.
 */

import * as fs from 'fs';
import * as path from 'path';

export default async function globalTeardown() {
  console.log('🧹 Cleaning up Adaptive Questions Test Environment...');

  const reportsDir = path.join(process.cwd(), 'test-reports', 'adaptive-questions');

  // Generate final performance report
  const finalMemory = process.memoryUsage();
  console.log('💾 Final Memory Usage:', {
    rss: `${Math.round(finalMemory.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(finalMemory.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(finalMemory.heapUsed / 1024 / 1024)}MB`
  });

  // Read baseline and compare
  const baselinePath = path.join(reportsDir, 'performance-baseline.json');
  if (fs.existsSync(baselinePath)) {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    
    const memoryDelta = {
      rss: finalMemory.rss - baseline.memoryUsage.rss,
      heapTotal: finalMemory.heapTotal - baseline.memoryUsage.heapTotal,
      heapUsed: finalMemory.heapUsed - baseline.memoryUsage.heapUsed
    };

    const performanceReport = {
      testRun: {
        startTime: baseline.timestamp,
        endTime: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform
      },
      memoryAnalysis: {
        initial: baseline.memoryUsage,
        final: finalMemory,
        delta: memoryDelta,
        deltaFormatted: {
          rss: `${memoryDelta.rss > 0 ? '+' : ''}${Math.round(memoryDelta.rss / 1024 / 1024)}MB`,
          heapTotal: `${memoryDelta.heapTotal > 0 ? '+' : ''}${Math.round(memoryDelta.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${memoryDelta.heapUsed > 0 ? '+' : ''}${Math.round(memoryDelta.heapUsed / 1024 / 1024)}MB`
        }
      },
      recommendations: generatePerformanceRecommendations(memoryDelta)
    };

    fs.writeFileSync(
      path.join(reportsDir, 'performance-report.json'),
      JSON.stringify(performanceReport, null, 2)
    );

    console.log('📊 Memory Delta:', performanceReport.memoryAnalysis.deltaFormatted);
  }

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
    console.log('♻️  Final garbage collection completed');
  }

  // Generate test summary
  const testSummary = {
    completedAt: new Date().toISOString(),
    environment: 'test',
    reports: {
      performanceBaseline: 'performance-baseline.json',
      performanceReport: 'performance-report.json',
      htmlReport: 'test-report.html',
      junitReport: 'junit.xml'
    }
  };

  fs.writeFileSync(
    path.join(reportsDir, 'test-summary.json'),
    JSON.stringify(testSummary, null, 2)
  );

  console.log('✅ Test environment cleanup complete');
  console.log(`📁 Reports saved to: ${reportsDir}`);
}

function generatePerformanceRecommendations(memoryDelta: any): string[] {
  const recommendations = [];

  if (memoryDelta.heapUsed > 50 * 1024 * 1024) { // 50MB increase
    recommendations.push('Consider investigating potential memory leaks in services');
  }

  if (memoryDelta.rss > 100 * 1024 * 1024) { // 100MB increase
    recommendations.push('High RSS memory increase detected - review large object allocations');
  }

  if (memoryDelta.heapTotal > memoryDelta.heapUsed * 2) {
    recommendations.push('Heap fragmentation detected - consider object pooling');
  }

  if (recommendations.length === 0) {
    recommendations.push('Memory usage is within acceptable bounds');
  }

  return recommendations;
}