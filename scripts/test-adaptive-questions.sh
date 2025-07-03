#!/bin/bash

# Test Execution Script for Adaptive Question Delivery System
# Runs comprehensive tests with performance monitoring and reporting

set -e

echo "🧪 Starting Adaptive Question Delivery System Tests"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
TEST_ENV=${TEST_ENV:-"test"}
COVERAGE_THRESHOLD=${COVERAGE_THRESHOLD:-85}
PERFORMANCE_THRESHOLD=${PERFORMANCE_THRESHOLD:-500}
MEMORY_THRESHOLD=${MEMORY_THRESHOLD:-100}

echo -e "${BLUE}Test Environment: ${TEST_ENV}${NC}"
echo -e "${BLUE}Coverage Threshold: ${COVERAGE_THRESHOLD}%${NC}"
echo -e "${BLUE}Performance Threshold: ${PERFORMANCE_THRESHOLD}ms${NC}"
echo -e "${BLUE}Memory Threshold: ${MEMORY_THRESHOLD}MB${NC}"
echo ""

# Create reports directory
mkdir -p test-reports/adaptive-questions

# Function to run test category
run_test_category() {
    local category=$1
    local pattern=$2
    local timeout=$3
    
    echo -e "${YELLOW}Running ${category} Tests...${NC}"
    
    if NODE_ENV=$TEST_ENV npx jest \
        --config=jest.config.adaptive.js \
        --testNamePattern="$pattern" \
        --testTimeout="$timeout" \
        --verbose \
        --detectOpenHandles \
        --forceExit; then
        echo -e "${GREEN}✅ ${category} tests passed${NC}"
        return 0
    else
        echo -e "${RED}❌ ${category} tests failed${NC}"
        return 1
    fi
}

# Function to run performance tests with memory monitoring
run_performance_tests() {
    echo -e "${YELLOW}Running Performance Tests with Memory Monitoring...${NC}"
    
    # Enable garbage collection for memory tests
    if NODE_ENV=$TEST_ENV node --expose-gc $(npm bin)/jest \
        --config=jest.config.adaptive.js \
        --testPathPattern="performance.test.ts" \
        --testTimeout=60000 \
        --verbose \
        --maxWorkers=1 \
        --detectOpenHandles \
        --forceExit; then
        echo -e "${GREEN}✅ Performance tests passed${NC}"
        return 0
    else
        echo -e "${RED}❌ Performance tests failed${NC}"
        return 1
    fi
}

# Function to generate coverage report
generate_coverage() {
    echo -e "${YELLOW}Generating Coverage Report...${NC}"
    
    if NODE_ENV=$TEST_ENV npx jest \
        --config=jest.config.adaptive.js \
        --coverage \
        --coverageDirectory=test-reports/adaptive-questions/coverage \
        --detectOpenHandles \
        --forceExit; then
        echo -e "${GREEN}✅ Coverage report generated${NC}"
        
        # Check coverage thresholds
        if [ -f "test-reports/adaptive-questions/coverage/coverage-summary.json" ]; then
            echo -e "${BLUE}Coverage Summary:${NC}"
            cat test-reports/adaptive-questions/coverage/coverage-summary.json | jq '.total'
        fi
        
        return 0
    else
        echo -e "${RED}❌ Coverage generation failed${NC}"
        return 1
    fi
}

# Function to validate system requirements
validate_requirements() {
    echo -e "${YELLOW}Validating System Requirements...${NC}"
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_NODE="18.0.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE" ]; then
        echo -e "${GREEN}✅ Node.js version $NODE_VERSION is compatible${NC}"
    else
        echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Required: $REQUIRED_NODE+${NC}"
        exit 1
    fi
    
    # Check available memory
    if command -v free &> /dev/null; then
        AVAILABLE_MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $7}')
        if [ "$AVAILABLE_MEMORY" -gt 1000 ]; then
            echo -e "${GREEN}✅ Sufficient memory available: ${AVAILABLE_MEMORY}MB${NC}"
        else
            echo -e "${YELLOW}⚠️  Low memory available: ${AVAILABLE_MEMORY}MB${NC}"
        fi
    fi
    
    # Check disk space
    AVAILABLE_DISK=$(df . | awk 'NR==2 {print $4}')
    if [ "$AVAILABLE_DISK" -gt 1000000 ]; then # 1GB in KB
        echo -e "${GREEN}✅ Sufficient disk space available${NC}"
    else
        echo -e "${YELLOW}⚠️  Low disk space available${NC}"
    fi
}

# Function to analyze test results
analyze_results() {
    echo -e "${YELLOW}Analyzing Test Results...${NC}"
    
    local reports_dir="test-reports/adaptive-questions"
    
    # Check if performance report exists
    if [ -f "$reports_dir/performance-report.json" ]; then
        echo -e "${BLUE}Performance Analysis:${NC}"
        cat "$reports_dir/performance-report.json" | jq '.memoryAnalysis.deltaFormatted'
        
        echo -e "${BLUE}Recommendations:${NC}"
        cat "$reports_dir/performance-report.json" | jq -r '.recommendations[]' | while read rec; do
            echo "  • $rec"
        done
    fi
    
    # Check if JUnit report exists
    if [ -f "$reports_dir/junit.xml" ]; then
        local total_tests=$(grep -o 'tests="[0-9]*"' "$reports_dir/junit.xml" | cut -d'"' -f2)
        local failed_tests=$(grep -o 'failures="[0-9]*"' "$reports_dir/junit.xml" | cut -d'"' -f2)
        local error_tests=$(grep -o 'errors="[0-9]*"' "$reports_dir/junit.xml" | cut -d'"' -f2)
        
        local passed_tests=$((total_tests - failed_tests - error_tests))
        
        echo -e "${BLUE}Test Summary:${NC}"
        echo "  Total: $total_tests"
        echo "  Passed: $passed_tests"
        echo "  Failed: $failed_tests"
        echo "  Errors: $error_tests"
        
        if [ "$failed_tests" -eq 0 ] && [ "$error_tests" -eq 0 ]; then
            echo -e "${GREEN}✅ All tests passed successfully!${NC}"
        else
            echo -e "${RED}❌ Some tests failed${NC}"
        fi
    fi
}

# Function to run all tests
run_all_tests() {
    local exit_code=0
    
    # Run unit tests
    if ! run_test_category "Unit" "questionDeliveryService|progressTrackingService|simulationService|userPreferencesService" "10000"; then
        exit_code=1
    fi
    
    echo ""
    
    # Run integration tests
    if ! run_test_category "Integration" "Integration Tests" "20000"; then
        exit_code=1
    fi
    
    echo ""
    
    # Run performance tests
    if ! run_performance_tests; then
        exit_code=1
    fi
    
    echo ""
    
    # Generate coverage report
    if ! generate_coverage; then
        exit_code=1
    fi
    
    return $exit_code
}

# Main execution
main() {
    echo -e "${BLUE}$(date): Starting test execution${NC}"
    
    # Validate system requirements
    validate_requirements
    echo ""
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        npm install
        echo ""
    fi
    
    # Run tests based on arguments
    case "${1:-all}" in
        "unit")
            run_test_category "Unit" "questionDeliveryService|progressTrackingService|simulationService|userPreferencesService" "10000"
            ;;
        "integration")
            run_test_category "Integration" "Integration Tests" "20000"
            ;;
        "performance")
            run_performance_tests
            ;;
        "coverage")
            generate_coverage
            ;;
        "all"|*)
            run_all_tests
            ;;
    esac
    
    local exit_code=$?
    
    echo ""
    echo "=================================================="
    
    # Analyze results
    analyze_results
    
    echo ""
    echo -e "${BLUE}Test execution completed at $(date)${NC}"
    echo -e "${BLUE}Reports available in: test-reports/adaptive-questions/${NC}"
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
    else
        echo -e "${RED}💥 Some tests failed. Check the reports for details.${NC}"
    fi
    
    exit $exit_code
}

# Handle script arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [test-type]"
    echo ""
    echo "Test types:"
    echo "  unit        - Run only unit tests"
    echo "  integration - Run only integration tests"  
    echo "  performance - Run only performance tests"
    echo "  coverage    - Generate coverage report"
    echo "  all         - Run all tests (default)"
    echo ""
    echo "Environment variables:"
    echo "  TEST_ENV              - Test environment (default: test)"
    echo "  COVERAGE_THRESHOLD    - Coverage threshold % (default: 85)"
    echo "  PERFORMANCE_THRESHOLD - Performance threshold ms (default: 500)"
    echo "  MEMORY_THRESHOLD      - Memory threshold MB (default: 100)"
    exit 0
fi

# Execute main function
main "$@"