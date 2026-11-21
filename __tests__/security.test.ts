import {
  constantTimeCompare,
  createSessionToken,
  verifySessionToken,
  validateCsrfOrigin,
  getAdminSecret,
} from '../lib/security';
import { checkRateLimit, resetRateLimit } from '../lib/rateLimit';
import { sanitizeInput, validateFileUpload } from '../lib/utils';

describe('Security: Constant-Time String Comparison', () => {
  it('returns true for identical secrets', () => {
    expect(constantTimeCompare('secret-key-12345', 'secret-key-12345')).toBe(true);
  });

  it('returns false for mismatched secrets of equal length', () => {
    expect(constantTimeCompare('secret-key-12345', 'secret-key-12349')).toBe(false);
  });

  it('returns false for mismatched secrets of different lengths', () => {
    expect(constantTimeCompare('secret-key-12345', 'secret')).toBe(false);
  });

  it('returns false for empty or non-string inputs', () => {
    expect(constantTimeCompare('', 'secret')).toBe(false);
    expect(constantTimeCompare('secret', '')).toBe(false);
  });
});

describe('Security: Cryptographically Signed Session Tokens', () => {
  const testSecret = 'test-secret-key-at-least-32-chars-long!!';

  it('creates and verifies a valid signed session', () => {
    const token = createSessionToken({ sub: 'admin_test' }, testSecret);
    expect(typeof token).toBe('string');
    expect(token).toContain('.');

    const payload = verifySessionToken(token, testSecret);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('admin_test');
    expect(payload?.role).toBe('admin');
    expect(payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('rejects tampered token payloads', () => {
    const token = createSessionToken({ sub: 'admin_test' }, testSecret);
    const [payloadB64, signature] = token.split('.');
    
    // Tamper with payload
    const tamperedPayload = Buffer.from(JSON.stringify({ sub: 'hacker', role: 'admin', exp: 9999999999 })).toString('base64url');
    const tamperedToken = `${tamperedPayload}.${signature}`;

    const verified = verifySessionToken(tamperedToken, testSecret);
    expect(verified).toBeNull();
  });

  it('rejects tampered token signatures', () => {
    const token = createSessionToken({ sub: 'admin_test' }, testSecret);
    const [payloadB64] = token.split('.');
    const fakeSignature = 'invalidSignature1234567890';
    const tamperedToken = `${payloadB64}.${fakeSignature}`;

    const verified = verifySessionToken(tamperedToken, testSecret);
    expect(verified).toBeNull();
  });

  it('rejects tokens signed with a different secret', () => {
    const token = createSessionToken({ sub: 'admin_test' }, 'attacker-secret-key-1234567890123');
    const verified = verifySessionToken(token, testSecret);
    expect(verified).toBeNull();
  });

  it('rejects expired session tokens', () => {
    const expiredTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const expiredToken = createSessionToken({ sub: 'admin_test', exp: expiredTimestamp }, testSecret);

    const verified = verifySessionToken(expiredToken, testSecret);
    expect(verified).toBeNull();
  });

  it('rejects malformed or empty token strings', () => {
    expect(verifySessionToken('', testSecret)).toBeNull();
    expect(verifySessionToken('not-a-token', testSecret)).toBeNull();
    expect(verifySessionToken('a.b.c', testSecret)).toBeNull();
    expect(verifySessionToken(null, testSecret)).toBeNull();
  });
});

describe('Security: CSRF Origin Verification', () => {
  const mockReq = (method: string, headers: Record<string, string> = {}) => ({
    method,
    headers: {
      get: (headerName: string) => headers[headerName.toLowerCase()] || headers[headerName] || null,
    },
  });

  it('allows safe methods (GET, HEAD, OPTIONS)', () => {
    const req = mockReq('GET');
    expect(validateCsrfOrigin(req)).toBe(true);
  });

  it('allows mutating requests from matching host', () => {
    const req = mockReq('POST', {
      host: 'localhost:3000',
      origin: 'http://localhost:3000',
    });
    expect(validateCsrfOrigin(req)).toBe(true);
  });

  it('rejects mutating requests from untrusted external origins', () => {
    const req = mockReq('POST', {
      host: 'civicresolve.city.gov',
      origin: 'https://malicious-site.com',
    });
    expect(validateCsrfOrigin(req)).toBe(false);
  });

  it('rejects mutating requests with no origin or referer in strict environments', () => {
    const req = mockReq('POST', {
      host: 'civicresolve.city.gov',
    });
    expect(validateCsrfOrigin(req)).toBe(false);
  });
});

describe('Security: Rate Limiting', () => {
  const ipKey = 'test_ip_127_0_0_1';

  beforeEach(() => {
    resetRateLimit(ipKey);
  });

  it('allows requests within limit threshold', () => {
    const res1 = checkRateLimit(ipKey, 3, 60);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(ipKey, 3, 60);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(ipKey, 3, 60);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('blocks requests exceeding limit threshold', () => {
    checkRateLimit(ipKey, 2, 60);
    checkRateLimit(ipKey, 2, 60);

    const blocked = checkRateLimit(ipKey, 2, 60);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.reset).toBeGreaterThan(0);
  });
});

describe('Security: Input Sanitization & File Uploads', () => {
  it('strips XSS tags and malicious javascript schemes', () => {
    expect(sanitizeInput('<script>evil()</script>')).toBe('scriptevil()/script');
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
    expect(sanitizeInput('data:text/html;base64,evil')).toBe(';base64,evil');
  });

  it('rejects executable scripts or disguised SVG files', () => {
    const svgFile = new File(['<svg onload="alert(1)"></svg>'], 'image.svg', { type: 'image/svg+xml' });
    Object.defineProperty(svgFile, 'size', { value: 1000 });
    expect(validateFileUpload(svgFile).valid).toBe(false);

    const exeFile = new File(['binary'], 'photo.exe', { type: 'application/x-msdownload' });
    Object.defineProperty(exeFile, 'size', { value: 1000 });
    expect(validateFileUpload(exeFile).valid).toBe(false);
  });

  it('accepts legitimate JPEG and PNG images', () => {
    const jpg = new File(['content'], 'pothole.jpg', { type: 'image/jpeg' });
    Object.defineProperty(jpg, 'size', { value: 2 * 1024 * 1024 });
    expect(validateFileUpload(jpg).valid).toBe(true);

    const png = new File(['content'], 'leakage.png', { type: 'image/png' });
    Object.defineProperty(png, 'size', { value: 1 * 1024 * 1024 });
    expect(validateFileUpload(png).valid).toBe(true);
  });
});
