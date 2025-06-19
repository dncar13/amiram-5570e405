
import { Reporter, TestCase, TestResult, FullResult, TestStatus } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TestMetrics {
  test: string;
  status: TestStatus;
  duration: number;
  error?: string;
  category?: string;
  browser?: string;
}

class AmiramReporter implements Reporter {
  private results: TestMetrics[] = [];
  private startTime: number = Date.now();

  onTestBegin(test: TestCase) {
    console.log(`🏃 Starting: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const category = this.categorizeTest(test.title);
    const browser = test.parent?.project()?.name || 'unknown';
    
    this.results.push({
      test: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
      category,
      browser
    });

    // Real-time logging
    const emoji = result.status === 'passed' ? '✅' : 
                  result.status === 'failed' ? '❌' : 
                  result.status === 'skipped' ? '⏭️' : '⚠️';
    
    console.log(`${emoji} ${test.title} (${result.duration}ms)`);
    
    if (result.error) {
      console.log(`   └─ Error: ${result.error.message.split('\n')[0]}`);
    }
  }

  onEnd(result: FullResult) {
    const totalDuration = Date.now() - this.startTime;
    
    // Generate detailed report
    this.generateConsoleReport(totalDuration);
    this.generateJsonReport();
    this.generateHtmlSummary();
  }

  private categorizeTest(title: string): string {
    if (title.includes('אבטחה') || title.includes('security')) return 'Security';
    if (title.includes('ביצועים') || title.includes('performance')) return 'Performance';
    if (title.includes('visual')) return 'Visual';
    if (title.includes('authentication')) return 'Authentication';
    if (title.includes('סימולציה')) return 'Simulation';
    return 'General';
  }

  private generateConsoleReport(totalDuration: number) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Results Summary');
    console.log('='.repeat(60));
    
    // Overall stats
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const total = this.results.length;
    
    console.log(`\n📈 Overall Statistics:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   ✅ Passed: ${passed} (${((passed/total)*100).toFixed(1)}%)`);
    console.log(`   ❌ Failed: ${failed} (${((failed/total)*100).toFixed(1)}%)`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ⏱️  Duration: ${(totalDuration/1000).toFixed(2)}s`);
    
    // Category breakdown
    console.log(`\n📁 By Category:`);
    const categories = [...new Set(this.results.map(r => r.category))];
    categories.forEach(category => {
      const categoryTests = this.results.filter(r => r.category === category);
      const categoryPassed = categoryTests.filter(r => r.status === 'passed').length;
      console.log(`   ${category}: ${categoryPassed}/${categoryTests.length} passed`);
    });
    
    // Failed tests details
    const failedTests = this.results.filter(r => r.status === 'failed');
    if (failedTests.length > 0) {
      console.log(`\n❌ Failed Tests:`);
      failedTests.forEach(test => {
        console.log(`   • ${test.test}`);
        if (test.error) {
          console.log(`     └─ ${test.error.split('\n')[0]}`);
        }
      });
    }
    
    // Performance insights
    const performanceTests = this.results.filter(r => r.category === 'Performance');
    if (performanceTests.length > 0) {
      console.log(`\n🚀 Performance Insights:`);
      const avgDuration = performanceTests.reduce((sum, t) => sum + t.duration, 0) / performanceTests.length;
      console.log(`   Average test duration: ${avgDuration.toFixed(0)}ms`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  }

  private generateJsonReport() {
    const report = {
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'passed').length,
        failed: this.results.filter(r => r.status === 'failed').length,
        skipped: this.results.filter(r => r.status === 'skipped').length,
        duration: Date.now() - this.startTime
      },
      tests: this.results,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'test-summary.json'),
      JSON.stringify(report, null, 2)
    );
  }

  private generateHtmlSummary() {
    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>Amiram Academy - Test Results</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
    h1 { color: #333; text-align: center; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat { text-align: center; padding: 20px; background: #f0f0f0; border-radius: 5px; }
    .passed { color: #4CAF50; }
    .failed { color: #f44336; }
    .skipped { color: #ff9800; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 10px; border: 1px solid #ddd; text-align: right; }
    th { background: #2196F3; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>תוצאות בדיקות - Amiram Academy</h1>
    <div class="stats">
      <div class="stat">
        <h2>${this.results.length}</h2>
        <p>סה"כ בדיקות</p>
      </div>
      <div class="stat passed">
        <h2>${this.results.filter(r => r.status === 'passed').length}</h2>
        <p>עברו בהצלחה</p>
      </div>
      <div class="stat failed">
        <h2>${this.results.filter(r => r.status === 'failed').length}</h2>
        <p>נכשלו</p>
      </div>
      <div class="stat skipped">
        <h2>${this.results.filter(r => r.status === 'skipped').length}</h2>
        <p>דולגו</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>בדיקה</th>
          <th>קטגוריה</th>
          <th>סטטוס</th>
          <th>זמן (ms)</th>
          <th>דפדפן</th>
        </tr>
      </thead>
      <tbody>
        ${this.results.map(r => `
          <tr>
            <td>${r.test}</td>
            <td>${r.category}</td>
            <td class="${r.status}">${r.status === 'passed' ? '✅' : r.status === 'failed' ? '❌' : '⏭️'}</td>
            <td>${r.duration}</td>
            <td>${r.browser}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
    `;
    
    fs.writeFileSync(
      path.join(process.cwd(), 'test-summary.html'),
      html
    );
  }
}

export default AmiramReporter;
