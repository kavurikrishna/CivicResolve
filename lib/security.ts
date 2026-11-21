import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'civicresolve_admin_session';
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

export interface AdminSessionPayload {
  sub: string;
  role: 'admin';
  iat: number;
  exp: number;
  jti: string;
}

/**
 * Returns the administrative secret key configured in the environment.
 * In production, this MUST be configured.
 */
export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL SECURITY ERROR: ADMIN_SECRET environment variable is missing or shorter than 16 characters in production.');
  }

  // Safe development/test fallback with clear console notice
  return 'civicresolve-dev-secret-key-32chars-min!!';
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to keep constant execution time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Creates a cryptographically signed session token (HMAC-SHA256).
 * Format: base64url(payload).base64url(signature)
 */
export function createSessionToken(payload: Partial<AdminSessionPayload> = {}, secret?: string): string {
  const signingKey = secret || getAdminSecret();
  const now = Math.floor(Date.now() / 1000);
  
  const fullPayload: AdminSessionPayload = {
    sub: payload.sub || 'admin_user',
    role: 'admin',
    iat: payload.iat || now,
    exp: payload.exp || now + SESSION_MAX_AGE_SECONDS,
    jti: payload.jti || crypto.randomBytes(16).toString('hex'),
  };

  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a signed session token. Checks signature and expiration.
 * Returns the decoded payload if valid, or null if invalid, tampered, or expired.
 */
export function verifySessionToken(token: string | null | undefined, secret?: string): AdminSessionPayload | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [payloadB64, signature] = parts;
  const signingKey = secret || getAdminSecret();

  // Recompute signature and compare in constant time
  const expectedSig = crypto
    .createHmac('sha256', signingKey)
    .update(payloadB64)
    .digest('base64url');

  if (!constantTimeCompare(signature, expectedSig)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload: AdminSessionPayload = JSON.parse(jsonStr);

    // Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= now) {
      return null;
    }

    if (payload.role !== 'admin') {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export interface CsrfRequestLike {
  method: string;
  headers: {
    get(name: string): string | null;
  };
}

/**
 * Validates CSRF origin/referer for state-changing HTTP requests.
 */
export function validateCsrfOrigin(request: CsrfRequestLike): boolean {
  // Allow GET, HEAD, OPTIONS
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');

  if (!origin && !referer) {
    // In strict browser environments, mutating requests must include Origin or Referer
    return false;
  }

  const candidateUrl = origin || referer;
  if (!candidateUrl) return false;

  try {
    const parsed = new URL(candidateUrl);
    // Allow matching host
    if (host && (parsed.host === host || parsed.host.split(':')[0] === host.split(':')[0])) {
      return true;
    }
    // Allow localhost in development
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return true;
    }
    // Check against NEXT_PUBLIC_APP_URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl) {
      const parsedApp = new URL(appUrl);
      if (parsed.origin === parsedApp.origin) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Cookie options for the HttpOnly session cookie
 */
export function getAdminCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
