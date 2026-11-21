import { NextRequest, NextResponse } from 'next/server';
import { Complaint } from '@/lib/types';

// Admin status update endpoint - server-side authorization check
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { complaintId, status, note, adminToken } = body;

    // Authorization check - verify admin token
    const validAdminToken = process.env.ADMIN_SECRET || 'civicresolve-admin-2024';
    if (!adminToken || adminToken !== validAdminToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Validate inputs
    if (!complaintId || !status || !note) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validStatuses = ['reported', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    if (note.length > 1000) {
      return NextResponse.json(
        { error: 'Note exceeds maximum length of 1000 characters' },
        { status: 400 }
      );
    }

    // In a production system, this would update Firestore/database
    // For demo mode, we return success and let the client handle storage
    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      complaintId,
      status,
      updatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
