
#!/bin/bash
# Initial setup script for Amiram Academy E2E Tests

echo "🚀 Setting up Amiram Academy E2E Tests..."

# Check if we're in the tests directory
if [ ! -f "package.json" ]; then
  echo "❌ Please run this script from the tests directory"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install browsers
echo "🌐 Installing browsers..."
npx playwright install --with-deps

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p screenshots
mkdir -p test-results
mkdir -p coverage

# Check if the main app is running
echo "🔍 Checking if the app is running on localhost:5173..."
if curl -s http://localhost:5173 > /dev/null; then
  echo "✅ App is running, proceeding with tests..."
else
  echo "⚠️  App is not running on localhost:5173"
  echo "   Please start the app with 'npm run dev' in the main directory"
  echo "   Then run this setup script again"
  exit 1
fi

# Run smoke tests
echo "🔥 Running smoke tests..."
npm run test:smoke

if [ $? -eq 0 ]; then
  echo "✅ Smoke tests passed!"
else
  echo "⚠️  Some smoke tests failed, but continuing setup..."
fi

# Generate initial screenshots for visual regression
echo "📸 Generating baseline screenshots..."
npm run test:visual -- --update-snapshots

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Available commands:"
echo "   npm test                    # Run all tests"
echo "   npm run test:smoke         # Run smoke tests"
echo "   npm run test:security      # Run security tests"
echo "   npm run test:performance   # Run performance tests"
echo "   npm run test:visual        # Run visual regression tests"
echo "   npm run test:headed        # Run tests with browser GUI"
echo "   npm run test:debug         # Run tests in debug mode"
echo "   npm run report             # Show test report"
echo ""
echo "📊 Reports will be generated:"
echo "   - test-summary.html        # Visual report in Hebrew"
echo "   - test-summary.json        # Data for analysis"
echo "   - playwright-report/       # Detailed Playwright report"
echo ""
echo "Happy testing! 🎉"
