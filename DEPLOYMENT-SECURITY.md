# Production Deployment Security Guide

## Pre-Deployment Security Checklist

### 1. Environment Configuration
- [ ] **Environment Variables**: All sensitive data moved to environment variables
- [ ] **Supabase Keys**: Production keys configured in deployment environment
- [ ] **CSP Policy**: Production CSP is stricter (no 'unsafe-inline', 'unsafe-eval')
- [ ] **HTTPS Enforcement**: SSL/TLS certificates properly configured
- [ ] **Domain Whitelisting**: CSP and CORS configured for production domains

### 2. Build Security
- [ ] **Source Maps**: Disabled in production build
- [ ] **Debug Info**: All console.log and debug statements removed
- [ ] **Minification**: Code properly minified and obfuscated
- [ ] **Bundle Analysis**: No sensitive information exposed in client bundle

### 3. Server Configuration

#### Required Security Headers (Production)
```bash
# Strict CSP for production
Content-Security-Policy: default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://your-project.supabase.co wss://your-project.supabase.co; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests

# Security Headers
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Referrer-Policy: strict-origin-when-cross-origin
X-XSS-Protection: 1; mode=block
```

#### Nginx Configuration Example
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security Headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://your-project.supabase.co wss://your-project.supabase.co; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Deployment Platforms

### Vercel Deployment
Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://your-project.supabase.co wss://your-project.supabase.co; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Netlify Deployment
Create `_headers` file in public directory:
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://your-project.supabase.co wss://your-project.supabase.co; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

## Security Monitoring

### 1. Automated Security Scanning
- **GitHub Actions**: Automated ZAP scans on every deployment
- **Dependency Scanning**: Weekly vulnerability checks
- **Security Headers**: Automated verification

### 2. Runtime Monitoring
- **CSP Reports**: Configure CSP reporting endpoint
- **Error Tracking**: Monitor for security-related errors
- **Access Logs**: Regular review of access patterns

### 3. Regular Security Audits
- **Monthly ZAP Scans**: Full application security testing
- **Dependency Updates**: Keep all packages updated
- **Security Headers Review**: Quarterly header policy review

## Emergency Response

### Security Incident Response
1. **Immediate Actions**:
   - Disable affected functionality
   - Rotate compromised credentials
   - Review access logs

2. **Investigation**:
   - Identify attack vector
   - Assess data exposure
   - Document timeline

3. **Recovery**:
   - Apply security patches
   - Update security policies
   - Restore services

### Contact Information
- **Security Team**: security@yourdomain.com
- **Emergency Contact**: +1-XXX-XXX-XXXX
- **Incident Tracking**: Use GitHub Issues with 'security' label

## Compliance

### GDPR Compliance
- Data processing transparency
- User consent management
- Right to erasure implementation
- Data breach notification procedures

### Security Standards
- OWASP Top 10 compliance
- CIS Controls implementation
- Regular security assessments
- Staff security training

---

**Last Updated**: $(date +%Y-%m-%d)  
**Review Schedule**: Quarterly  
**Next Review**: $(date -d '+3 months' +%Y-%m-%d)