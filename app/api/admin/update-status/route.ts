import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  verifySessionToken,
  validateCsrfOrigin,
} from '@/lib/security';
import { sanitizeInput } from '@/lib/utils';
import { ComplaintStatus } from '@/lib/types';

// Admin status update endpoint - protected by cryptographically signed server sessions
export async function POST(request: NextRequest) {
  try {
    // 1. CSRF Protection
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden: Invalid request origin' },
        { status: 403 }
      );
    }

    // 2. Session Authentication: Check signed HttpOnly cookie (or Bearer token)
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = sessionCookie || bearerToken;

    const session = verifySessionToken(token);
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Valid administrative session required' },
        { status: 401 }
      );
    }

    // 3. Payload parsing & validation
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const { complaintId, status, note, department } = body;

    if (!complaintId || typeof complaintId !== 'string') {
      return NextResponse.json({ error: 'Valid complaint ID is required' }, { status: 400 });
    }

    const validStatuses: ComplaintStatus[] = ['reported', 'in_progress', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (!note || typeof note !== 'string' || note.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mandatory administrative note is required' },
        { status: 400 }
      );
    }

    if (note.length > 1000) {
      return NextResponse.json(
        { error: 'Note exceeds maximum length of 1000 characters' },
        { status: 400 }
      );
    }

    const sanitizedNote = sanitizeInput(note);
    const sanitizedDept = department ? sanitizeInput(String(department)) : undefined;

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      complaintId: sanitizeInput(complaintId),
      status,
      department: sanitizedDept,
      note: sanitizedNote,
      updatedBy: session.sub,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred' },
      { status: 500 }
    );
  }
}
