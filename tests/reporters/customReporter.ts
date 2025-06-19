
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class AmiramReporter implements Reporter {
  private results: Array<{
    test: string;
    status: string;
    duration: number;
    error?: string;
  }> = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      test: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message
    });

    // Log failed tests immediately
    if (result.status === 'failed') {
      console.log(`❌ FAILED: ${test.title}`);
      if (result.error) {
        console.log(`   Error: ${result.error.message}`);
      }
    }
  }

  onEnd(result: FullResult) {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`⏱️  Total Duration: ${result.duration}ms`);
    
    // Performance summary
    const performanceTests = this.results.filter(r => 
      r.test.includes('ביצועים') || r.test.includes('performance')
    );
    
    if (performanceTests.length > 0) {
      console.log('\n🚀 Performance Tests:');
      performanceTests.forEach(test => {
        const status = test.status === 'passed' ? '✅' : '❌';
        console.log(`${status} ${test.test} (${test.duration}ms)`);
      });
    }

    // Security summary
    const securityTests = this.results.filter(r => 
      r.test.includes('אבטחה') || r.test.includes('security')
    );
    
    if (securityTests.length > 0) {
      console.log('\n🔒 Security Tests:');
      securityTests.forEach(test => {
        const status = test.status === 'passed' ? '✅' : '❌';
        console.log(`${status} ${test.test}`);
      });
    }

    // Failed tests details
    const failedTests = this.results.filter(r => r.status === 'failed');
    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests Details:');
      failedTests.forEach(test => {
        console.log(`   • ${test.test}`);
        if (test.error) {
          console.log(`     ${test.error}`);
        }
      });
    }

    console.log('\n' + '='.repeat(50));
  }
}

export default AmiramReporter;
