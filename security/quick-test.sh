
#!/bin/bash

# Quick ZAP Security Test for Amiram Academy
# This script will run a fast baseline scan to verify everything works

set -e

echo "🔒 ZAP Quick Security Test for Amiram Academy"
echo "============================================="

# Configuration
TARGET_URL="http://localhost:8080"
REPORT_DIR="./security/reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Create reports directory
mkdir -p "$REPORT_DIR"

# Check if target is running
echo -e "${YELLOW}🔍 Checking if application is running...${NC}"
if ! curl -s --max-time 5 "$TARGET_URL" > /dev/null; then
    echo -e "${RED}❌ Application not running at $TARGET_URL${NC}"
    echo "Please run: npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ Application is running${NC}"

# Pull ZAP Docker image
echo -e "${YELLOW}📥 Pulling OWASP ZAP Docker image...${NC}"
docker pull owasp/zap2docker-stable

# Run baseline scan
echo -e "${YELLOW}🛡️ Running ZAP Baseline Security Scan...${NC}"
echo "This will take 2-3 minutes..."

docker run -v $(pwd)/security:/zap/wrk/:rw \
    -t owasp/zap2docker-stable \
    zap-baseline.py \
    -t $TARGET_URL \
    -g gen.conf \
    -r "quick_test_${TIMESTAMP}.html" \
    -x "quick_test_${TIMESTAMP}.xml" \
    -J "quick_test_${TIMESTAMP}.json" \
    || echo "Scan completed with findings (exit code > 0 is normal)"

# Move reports
echo -e "${YELLOW}📋 Moving reports...${NC}"
mv quick_test_*.html $REPORT_DIR/ 2>/dev/null || true
mv quick_test_*.xml $REPORT_DIR/ 2>/dev/null || true
mv quick_test_*.json $REPORT_DIR/ 2>/dev/null || true

# Show results
echo -e "${GREEN}🎉 Quick security scan completed!${NC}"
echo "Reports saved to: $REPORT_DIR"

# Try to open HTML report
HTML_REPORT=$(ls $REPORT_DIR/quick_test_*.html 2>/dev/null | head -1)
if [ -f "$HTML_REPORT" ]; then
    echo -e "${GREEN}📊 Opening HTML report...${NC}"
    
    if command -v xdg-open > /dev/null; then
        xdg-open "$HTML_REPORT"
    elif command -v firefox > /dev/null; then
        firefox "$HTML_REPORT" &
    else
        echo -e "${YELLOW}Please open: file://$(pwd)/$HTML_REPORT${NC}"
    fi
fi

# Basic summary
JSON_REPORT=$(ls $REPORT_DIR/quick_test_*.json 2>/dev/null | head -1)
if [ -f "$JSON_REPORT" ] && command -v jq > /dev/null; then
    echo -e "${GREEN}📈 Quick Summary:${NC}"
    
    HIGH_COUNT=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("High"))' "$JSON_REPORT" 2>/dev/null | wc -l)
    MEDIUM_COUNT=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("Medium"))' "$JSON_REPORT" 2>/dev/null | wc -l)
    LOW_COUNT=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("Low"))' "$JSON_REPORT" 2>/dev/null | wc -l)
    
    echo -e "🔴 High Risk: $HIGH_COUNT"
    echo -e "🟡 Medium Risk: $MEDIUM_COUNT" 
    echo -e "🟢 Low Risk: $LOW_COUNT"
    
    if [ "$HIGH_COUNT" -eq 0 ] && [ "$MEDIUM_COUNT" -eq 0 ]; then
        echo -e "${GREEN}✨ Great! No high or medium risk vulnerabilities found!${NC}"
    else
        echo -e "${YELLOW}⚠️ Found some security issues - check the HTML report for details${NC}"
    fi
fi

echo -e "\n${GREEN}Next steps:${NC}"
echo "1. Review the HTML report for detailed findings"
echo "2. Run full scan: ./security/zap-local-test.sh $TARGET_URL full"
echo "3. Configure custom rules in security/zap-config.yaml"

