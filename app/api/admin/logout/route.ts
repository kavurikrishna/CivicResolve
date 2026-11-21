import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, validateCsrfOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Session terminated successfully',
    });

    // Clear session cookie immediately
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to process logout' }, { status: 500 });
  }
}
