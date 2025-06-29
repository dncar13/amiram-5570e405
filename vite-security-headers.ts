import type { Plugin } from 'vite';

interface SecurityHeadersOptions {
  csp?: string;
  frameOptions?: string;
  contentTypeOptions?: boolean;
  permissionsPolicy?: string;
  strictTransportSecurity?: string;
  crossOriginEmbedderPolicy?: string;
  crossOriginOpenerPolicy?: string;
  crossOriginResourcePolicy?: string;
  referrerPolicy?: string;
}

export function securityHeaders(options: SecurityHeadersOptions = {}): Plugin {
  const {
    csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.firebase.com https://*.googleapis.com; img-src 'self' data: https:; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
    frameOptions = 'DENY',
    contentTypeOptions = true,
    permissionsPolicy = 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
    strictTransportSecurity = 'max-age=63072000; includeSubDomains; preload',
    crossOriginEmbedderPolicy = 'require-corp',
    crossOriginOpenerPolicy = 'same-origin',
    crossOriginResourcePolicy = 'same-origin',
    referrerPolicy = 'strict-origin-when-cross-origin'
  } = options;

  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Content Security Policy
        res.setHeader('Content-Security-Policy', csp);
        
        // Clickjacking protection
        res.setHeader('X-Frame-Options', frameOptions);
        
        // MIME type sniffing protection
        if (contentTypeOptions) {
          res.setHeader('X-Content-Type-Options', 'nosniff');
        }
        
        // Permissions Policy (formerly Feature Policy)
        res.setHeader('Permissions-Policy', permissionsPolicy);
        
        // HTTPS enforcement (for production)
        if (process.env.NODE_ENV === 'production') {
          res.setHeader('Strict-Transport-Security', strictTransportSecurity);
        }
        
        // Cross-Origin policies for Spectre protection
        res.setHeader('Cross-Origin-Embedder-Policy', crossOriginEmbedderPolicy);
        res.setHeader('Cross-Origin-Opener-Policy', crossOriginOpenerPolicy);
        res.setHeader('Cross-Origin-Resource-Policy', crossOriginResourcePolicy);
        
        // Referrer policy
        res.setHeader('Referrer-Policy', referrerPolicy);
        
        // XSS protection (legacy but still useful)
        res.setHeader('X-XSS-Protection', '1; mode=block');
        
        // Cache control for static assets
        if (req.url?.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
        
        next();
      });
    },
    configurePreviewServer(server) {
      // Apply same headers to preview server
      server.middlewares.use((req, res, next) => {
        res.setHeader('Content-Security-Policy', csp);
        res.setHeader('X-Frame-Options', frameOptions);
        if (contentTypeOptions) {
          res.setHeader('X-Content-Type-Options', 'nosniff');
        }
        res.setHeader('Permissions-Policy', permissionsPolicy);
        res.setHeader('Strict-Transport-Security', strictTransportSecurity);
        res.setHeader('Cross-Origin-Embedder-Policy', crossOriginEmbedderPolicy);
        res.setHeader('Cross-Origin-Opener-Policy', crossOriginOpenerPolicy);
        res.setHeader('Cross-Origin-Resource-Policy', crossOriginResourcePolicy);
        res.setHeader('Referrer-Policy', referrerPolicy);
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
      });
    }
  };
}