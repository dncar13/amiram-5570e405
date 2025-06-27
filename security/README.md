
# ZAP Security Testing Setup

This directory contains scripts and configuration for OWASP ZAP security testing.

## Prerequisites

1. **Docker** - Make sure Docker is installed and running
2. **jq** (optional) - For JSON parsing in summary reports
   ```bash
   sudo apt-get install jq  # Ubuntu/Debian
   ```

## Quick Start

1. **Start your application:**
   ```bash
   npm run dev  # Make sure app runs on http://localhost:8080
   ```

2. **Run basic security scan:**
   ```bash
   chmod +x security/zap-local-test.sh
   ./security/zap-local-test.sh
   ```

## Available Test Types

### 1. Baseline Scan (Quick - 2-5 minutes)
```bash
./security/zap-local-test.sh http://localhost:8080 baseline
```
- Fast passive scan
- Identifies common vulnerabilities
- Good for development testing

### 2. Full Scan (Comprehensive - 15-30 minutes)
```bash
./security/zap-local-test.sh http://localhost:8080 full
```
- Active vulnerability testing
- Includes automated attacks
- Recommended before deployment

### 3. API Scan (For REST APIs)
```bash
# First, create API definition file
./security/zap-local-test.sh http://localhost:8080 api
```
- Requires OpenAPI/Swagger definition
- Tests API-specific vulnerabilities

### 4. Daemon Mode (Advanced)
```bash
chmod +x security/zap-daemon-test.sh
./security/zap-daemon-test.sh http://localhost:8080
```
- More control over testing process
- Custom context and authentication
- Detailed progress monitoring

## Configuration

### Custom Rules
Edit `security/zap-config.yaml` to:
- Add authentication details
- Configure scan policies
- Set include/exclude patterns
- Define technology stack

### Docker Compose
Use `security/docker-compose.zap.yml` for:
- Isolated testing environment
- Daemon mode operation
- Network isolation

## Reports

Reports are generated in `security/reports/` directory:
- **HTML Report** - Visual report for review
- **XML Report** - Machine readable format
- **JSON Report** - For integration with other tools

## Common Vulnerabilities Checked

1. **SQL Injection**
2. **Cross-Site Scripting (XSS)**
3. **Cross-Site Request Forgery (CSRF)**
4. **Insecure HTTP Methods**
5. **Missing Security Headers**
6. **Information Disclosure**
7. **Authentication Bypass**
8. **Session Management Issues**

## Integration with Development Workflow

### Pre-commit Hook
```bash
# Add to .git/hooks/pre-commit
./security/zap-local-test.sh http://localhost:8080 baseline
```

### CI/CD Integration
The scripts are ready for GitHub Actions integration:
- Exit codes indicate pass/fail
- JSON reports for automated parsing
- Configurable thresholds

## Troubleshooting

### Common Issues

1. **Target not accessible**
   - Make sure your app is running
   - Check the URL and port

2. **Docker permission issues**
   ```bash
   sudo usermod -aG docker $USER
   # Then logout and login again
   ```

3. **Reports not generated**
   - Check Docker logs: `docker logs <container-id>`
   - Ensure write permissions in security/ directory

### Debug Mode
```bash
# Run with verbose output
docker run -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:8080 -d
```

## Next Steps

1. **Review Reports** - Check HTML reports for detailed findings
2. **Fix Vulnerabilities** - Address high and medium risk issues
3. **Custom Rules** - Configure specific rules for your application
4. **Automate** - Integrate with CI/CD pipeline
5. **Monitor** - Set up regular security scans

## Security Best Practices

- Run security scans regularly
- Address high/medium risk vulnerabilities immediately
- Keep ZAP and rules updated
- Use authentication in scans
- Test in staging environment first
