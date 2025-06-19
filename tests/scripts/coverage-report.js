
const fs = require('fs');
const path = require('path');

console.log('📊 Test Coverage Report');
console.log('=====================');

// Count files
const specsDir = path.join(__dirname, '../specs');
const pagesDir = path.join(__dirname, '../pages');

const specs = fs.readdirSync(specsDir).filter(f => f.endsWith('.spec.ts'));
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.ts'));

console.log(`Spec files: ${specs.length}`);
console.log(`Page objects: ${pages.length}`);

// List all test files
console.log('\n📁 Test Files:');
specs.forEach(spec => {
  const filePath = path.join(specsDir, spec);
  const content = fs.readFileSync(filePath, 'utf8');
  const testCount = (content.match(/test\(/g) || []).length;
  console.log(`   ${spec}: ${testCount} tests`);
});

console.log('\n🎭 Page Objects:');
pages.forEach(page => {
  console.log(`   ${page}`);
});

// Check if results exist
const resultsPath = path.join(__dirname, '../test-summary.json');
if (fs.existsSync(resultsPath)) {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  console.log('\n📈 Last Test Run:');
  console.log(`   Total: ${results.summary.total}`);
  console.log(`   Passed: ${results.summary.passed}`);
  console.log(`   Failed: ${results.summary.failed}`);
  console.log(`   Duration: ${(results.summary.duration / 1000).toFixed(2)}s`);
} else {
  console.log('\n⚠️  No test results found. Run tests first.');
}

console.log('\n✨ Coverage complete!');
