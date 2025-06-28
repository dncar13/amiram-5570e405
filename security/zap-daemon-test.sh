
#!/bin/bash

# ZAP Daemon Mode Testing Script
# This script runs ZAP in daemon mode for more advanced testing

set -e

TARGET_URL="${1:-http://localhost:8080}"
ZAP_PORT="${2:-8090}"
REPORT_DIR="./security/reports"

echo "🔒 Starting ZAP in Daemon Mode"
echo "Target: $TARGET_URL"
echo "ZAP API Port: $ZAP_PORT"

# Start ZAP daemon using docker-compose
echo "Starting ZAP daemon..."
docker-compose -f security/docker-compose.zap.yml up -d zap

# Wait for ZAP to be ready
echo "Waiting for ZAP to be ready..."
sleep 15

# Check if ZAP API is accessible
if ! curl -s "http://localhost:$ZAP_PORT/JSON/core/view/version/" > /dev/null; then
    echo "❌ ZAP API is not accessible"
    docker-compose -f security/docker-compose.zap.yml logs zap
    exit 1
fi

echo "✅ ZAP daemon is ready"

# Create new session
SESSION_NAME="amiram-academy-$(date +%Y%m%d_%H%M%S)"
curl -s "http://localhost:$ZAP_PORT/JSON/core/action/newSession/?name=$SESSION_NAME" > /dev/null

# Set up context
echo "Setting up security context..."
curl -s "http://localhost:$ZAP_PORT/JSON/context/action/newContext/?contextName=amiram-academy" > /dev/null
curl -s "http://localhost:$ZAP_PORT/JSON/context/action/includeInContext/?contextName=amiram-academy&regex=$TARGET_URL.*" > /dev/null

# Start spider
echo "Starting spider scan..."
SPIDER_ID=$(curl -s "http://localhost:$ZAP_PORT/JSON/spider/action/scan/?url=$TARGET_URL" | jq -r '.scan')

# Monitor spider progress
while true; do
    SPIDER_STATUS=$(curl -s "http://localhost:$ZAP_PORT/JSON/spider/view/status/?scanId=$SPIDER_ID" | jq -r '.status')
    if [ "$SPIDER_STATUS" = "100" ]; then
        break
    fi
    echo "Spider progress: $SPIDER_STATUS%"
    sleep 5
done

echo "✅ Spider scan completed"

# Start active scan
echo "Starting active security scan..."
SCAN_ID=$(curl -s "http://localhost:$ZAP_PORT/JSON/ascan/action/scan/?url=$TARGET_URL" | jq -r '.scan')

# Monitor active scan progress
while true; do
    SCAN_STATUS=$(curl -s "http://localhost:$ZAP_PORT/JSON/ascan/view/status/?scanId=$SCAN_ID" | jq -r '.status')
    if [ "$SCAN_STATUS" = "100" ]; then
        break
    fi
    echo "Active scan progress: $SCAN_STATUS%"
    sleep 10
done

echo "✅ Active scan completed"

# Generate reports
mkdir -p "$REPORT_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "Generating reports..."

# HTML Report
curl -s "http://localhost:$ZAP_PORT/OTHER/core/other/htmlreport/" > "$REPORT_DIR/zap_daemon_report_$TIMESTAMP.html"

# XML Report
curl -s "http://localhost:$ZAP_PORT/OTHER/core/other/xmlreport/" > "$REPORT_DIR/zap_daemon_report_$TIMESTAMP.xml"

# JSON Report
curl -s "http://localhost:$ZAP_PORT/JSON/core/view/alerts/" > "$REPORT_DIR/zap_daemon_report_$TIMESTAMP.json"

echo "✅ Reports generated in $REPORT_DIR"

# Display summary
echo "📊 Security Scan Summary:"
TOTAL_ALERTS=$(curl -s "http://localhost:$ZAP_PORT/JSON/core/view/numberOfAlerts/" | jq -r '.numberOfAlerts')
HIGH_ALERTS=$(curl -s "http://localhost:$ZAP_PORT/JSON/core/view/alertsSummary/" | jq -r '.alertsSummary.High // 0')
MEDIUM_ALERTS=$(curl -s "http://localhost:$ZAP_PORT/JSON/core/view/alertsSummary/" | jq -r '.alertsSummary.Medium // 0')
LOW_ALERTS=$(curl -s "http://localhost:$ZAP_PORT/JSON/core/view/alertsSummary/" | jq -r '.alertsSummary.Low // 0')

echo "🔴 High Risk: $HIGH_ALERTS"
echo "🟡 Medium Risk: $MEDIUM_ALERTS"
echo "🟢 Low Risk: $LOW_ALERTS"
echo "📊 Total Alerts: $TOTAL_ALERTS"

# Cleanup
echo "Cleaning up..."
docker-compose -f security/docker-compose.zap.yml down

echo "🎉 ZAP daemon testing completed!"
echo "Check reports in: $REPORT_DIR"
