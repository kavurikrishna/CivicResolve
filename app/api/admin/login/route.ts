import { NextRequest, NextResponse } from 'next/server';
import {
  constantTimeCompare,
  createSessionToken,
  getAdminCookieOptions,
  getAdminSecret,
  validateCsrfOrigin,
} from '@/lib/security';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF Origin Verification
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden: Invalid request origin' },
        { status: 403 }
      );
    }

    // 2. Rate Limiting on Login (5 attempts per 15 minutes per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`admin_login:${clientIp}`, 5, 15 * 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account temporarily locked. Retry in ${rateLimit.reset} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.reset),
          },
        }
      );
    }

    // 3. Payload validation
    let body: { password?: unknown };
    try {
      body = (await request.json()) as { password?: unknown };
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const { password } = body || {};
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // 4. Retrieve configured admin secret (fail-secure if missing in production)
    let secret: string;
    try {
      secret = getAdminSecret();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('CRITICAL SERVER AUTH ERROR:', errMsg);
      return NextResponse.json(
        { error: 'Authentication service configuration failure' },
        { status: 500 }
      );
    }

    // 5. Constant-time password verification
    const isValid = constantTimeCompare(password, secret);

    if (!isValid) {
      // Small artificial delay to mitigate timing analysis
      await new Promise((resolve) => setTimeout(resolve, 250));
      return NextResponse.json(
        { error: 'Invalid administrative credentials' },
        { status: 401 }
      );
    }

    // 6. Generate cryptographically signed session token
    const sessionToken = createSessionToken({ sub: 'admin', role: 'admin' }, secret);
    const cookieOptions = getAdminCookieOptions();

    // 7. Response with HttpOnly, Secure, SameSite=Lax cookie
    const response = NextResponse.json({
      success: true,
      message: 'Administrative session established',
      user: { role: 'admin' },
    });

    response.cookies.set({
      name: cookieOptions.name,
      value: sessionToken,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Authentication service encountered an unexpected error' },
      { status: 500 }
    );
  }
}
