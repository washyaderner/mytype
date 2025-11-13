import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Security Headers
 *
 * SECURITY: Applies security headers to all responses
 * Implements OWASP recommended headers for web application security
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // SECURITY: Strict-Transport-Security (HSTS)
  // Forces HTTPS connections for 1 year including subdomains
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // SECURITY: X-Frame-Options
  // Prevents clickjacking attacks by disabling iframe embedding
  response.headers.set('X-Frame-Options', 'DENY');

  // SECURITY: X-Content-Type-Options
  // Prevents MIME sniffing which can lead to XSS
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // SECURITY: Referrer-Policy
  // Controls how much referrer information is shared
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // SECURITY: Permissions-Policy
  // Disables unnecessary browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // SECURITY: Content-Security-Policy
  // Prevents XSS, clickjacking, and other code injection attacks
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Note: unsafe-inline needed for Next.js
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  response.headers.set('Content-Security-Policy', cspHeader);

  // SECURITY: X-XSS-Protection (legacy, but still useful for older browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
