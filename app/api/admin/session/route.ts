import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = verifySessionToken(sessionCookie);

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        role: session.role,
        sub: session.sub,
      },
      expiresAt: new Date(session.exp * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
