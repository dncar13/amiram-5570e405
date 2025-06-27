
#!/bin/bash

# ZAP Local Security Testing Script
# Usage: ./zap-local-test.sh [target-url] [test-type]

set -e

# Configuration
ZAP_VERSION="stable"
TARGET_URL="${1:-http://localhost:8080}"
TEST_TYPE="${2:-baseline}"
REPORT_DIR="./security/reports"
CONFIG_DIR="./security/config"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔒 Starting ZAP Security Testing${NC}"
echo -e "Target URL: ${YELLOW}$TARGET_URL${NC}"
echo -e "Test Type: ${YELLOW}$TEST_TYPE${NC}"

# Create directories
mkdir -p "$REPORT_DIR"
mkdir -p "$CONFIG_DIR"

# Check if target is accessible
echo -e "${YELLOW}Checking if target is accessible...${NC}"
if ! curl -s --max-time 10 "$TARGET_URL" > /dev/null; then
    echo -e "${RED}❌ Target URL is not accessible: $TARGET_URL${NC}"
    echo "Please make sure your application is running locally"
    exit 1
fi

echo -e "${GREEN}✅ Target is accessible${NC}"

# Pull latest ZAP Docker image
echo -e "${YELLOW}Pulling ZAP Docker image...${NC}"
docker pull owasp/zap2docker-$ZAP_VERSION

# Generate timestamp for reports
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_NAME="zap_report_${TIMESTAMP}"

case $TEST_TYPE in
    "baseline")
        echo -e "${YELLOW}Running ZAP Baseline Scan...${NC}"
        docker run -v $(pwd):/zap/wrk/:rw \
            -t owasp/zap2docker-$ZAP_VERSION \
            zap-baseline.py \
            -t $TARGET_URL \
            -g gen.conf \
            -r "${REPORT_NAME}_baseline.html" \
            -x "${REPORT_NAME}_baseline.xml" \
            -J "${REPORT_NAME}_baseline.json" \
            || true
        ;;
    
    "full")
        echo -e "${YELLOW}Running ZAP Full Scan (may take 15-30 minutes)...${NC}"
        docker run -v $(pwd):/zap/wrk/:rw \
            -t owasp/zap2docker-$ZAP_VERSION \
            zap-full-scan.py \
            -t $TARGET_URL \
            -g gen.conf \
            -r "${REPORT_NAME}_full.html" \
            -x "${REPORT_NAME}_full.xml" \
            -J "${REPORT_NAME}_full.json" \
            || true
        ;;
    
    "api")
        echo -e "${YELLOW}Running ZAP API Scan...${NC}"
        if [ ! -f "$CONFIG_DIR/api-definition.json" ]; then
            echo -e "${RED}❌ API definition file not found at $CONFIG_DIR/api-definition.json${NC}"
            exit 1
        fi
        docker run -v $(pwd):/zap/wrk/:rw \
            -t owasp/zap2docker-$ZAP_VERSION \
            zap-api-scan.py \
            -t $TARGET_URL \
            -f openapi \
            -d $CONFIG_DIR/api-definition.json \
            -r "${REPORT_NAME}_api.html" \
            -x "${REPORT_NAME}_api.xml" \
            -J "${REPORT_NAME}_api.json" \
            || true
        ;;
    
    *)
        echo -e "${RED}❌ Unknown test type: $TEST_TYPE${NC}"
        echo "Available types: baseline, full, api"
        exit 1
        ;;
esac

# Move reports to reports directory
echo -e "${YELLOW}Moving reports to $REPORT_DIR...${NC}"
mv ${REPORT_NAME}_*.html $REPORT_DIR/ 2>/dev/null || true
mv ${REPORT_NAME}_*.xml $REPORT_DIR/ 2>/dev/null || true
mv ${REPORT_NAME}_*.json $REPORT_DIR/ 2>/dev/null || true

echo -e "${GREEN}🎉 ZAP Security Testing Completed!${NC}"
echo -e "Reports available in: ${YELLOW}$REPORT_DIR${NC}"

# Display summary if HTML report exists
HTML_REPORT=$(ls $REPORT_DIR/${REPORT_NAME}_*.html 2>/dev/null | head -1)
if [ -f "$HTML_REPORT" ]; then
    echo -e "${GREEN}📊 Opening HTML report...${NC}"
    
    # Try to open in browser (works on most Linux distros)
    if command -v xdg-open > /dev/null; then
        xdg-open "$HTML_REPORT"
    elif command -v firefox > /dev/null; then
        firefox "$HTML_REPORT" &
    elif command -v google-chrome > /dev/null; then
        google-chrome "$HTML_REPORT" &
    else
        echo -e "${YELLOW}Please open this file in your browser:${NC}"
        echo "file://$(pwd)/$HTML_REPORT"
    fi
fi

# Parse and display basic summary
JSON_REPORT=$(ls $REPORT_DIR/${REPORT_NAME}_*.json 2>/dev/null | head -1)
if [ -f "$JSON_REPORT" ]; then
    echo -e "${GREEN}📈 Security Scan Summary:${NC}"
    
    # Extract basic stats using jq if available
    if command -v jq > /dev/null; then
        HIGH_ALERTS=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("High"))' "$JSON_REPORT" 2>/dev/null | wc -l)
        MEDIUM_ALERTS=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("Medium"))' "$JSON_REPORT" 2>/dev/null | wc -l)
        LOW_ALERTS=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("Low"))' "$JSON_REPORT" 2>/dev/null | wc -l)
        
        echo -e "🔴 High Risk: ${RED}$HIGH_ALERTS${NC}"
        echo -e "🟡 Medium Risk: ${YELLOW}$MEDIUM_ALERTS${NC}"
        echo -e "🟢 Low Risk: $LOW_ALERTS"
        
        if [ "$HIGH_ALERTS" -gt 0 ]; then
            echo -e "${RED}⚠️  High risk vulnerabilities found! Please review the report.${NC}"
        elif [ "$MEDIUM_ALERTS" -gt 0 ]; then
            echo -e "${YELLOW}⚠️  Medium risk vulnerabilities found. Consider reviewing.${NC}"
        else
            echo -e "${GREEN}✅ No high or medium risk vulnerabilities found!${NC}"
        fi
    else
        echo -e "${YELLOW}Install 'jq' for detailed summary parsing${NC}"
    fi
fi

echo -e "\n${GREEN}Next steps:${NC}"
echo "1. Review the HTML report for detailed findings"
echo "2. Address any high/medium risk vulnerabilities"
echo "3. Run './security/zap-local-test.sh $TARGET_URL full' for comprehensive testing"
echo "4. Configure custom rules in ./security/config/"
