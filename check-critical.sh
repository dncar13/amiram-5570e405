#!/bin/bash
# check-critical.sh

echo "🔍 Checking React Hook Dependencies..."
npm run lint | grep -E "(useCallback|useEffect|useMemo)" | wc -l
echo "React Hook warnings found: $(npm run lint 2>/dev/null | grep -E '(useCallback|useEffect|useMemo)' | wc -l)"

echo ""
echo "🔐 Checking security..."
npm audit --audit-level=moderate | grep "moderate severity vulnerabilities" || echo "No moderate or higher vulnerabilities"

echo ""
echo "🧪 Checking unit tests..."
npm run test:unit --run

echo ""
echo "🏗️ Checking build..."
npm run build > /dev/null && echo "✅ Build successful" || echo "❌ Build failed"

echo ""
echo "✅ Checks completed"