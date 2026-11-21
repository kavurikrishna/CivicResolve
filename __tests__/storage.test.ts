import { getStoredComplaints, saveComplaint, getComplaintById, updateComplaintStatus, getDashboardStats, DEMO_COMPLAINTS } from '../lib/storage';
import { Complaint } from '../lib/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Storage functions', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('initializes with demo complaints', () => {
    const complaints = getStoredComplaints();
    expect(Array.isArray(complaints)).toBe(true);
    expect(complaints.length).toBeGreaterThan(0);
  });

  it('saves and retrieves a complaint', () => {
    const mockComplaint: Complaint = {
      id: 'CIV-2024-99999',
      title: 'Test pothole on main road',
      description: 'A large pothole has appeared on the main road near the school.',
      location: 'Test Street',
      city: 'Test City',
      category: 'Road Damage',
      status: 'reported',
      priority: 'High',
      department: 'Roads and Infrastructure',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiAnalysis: {
        category: 'Road Damage',
        priority: 'High',
        department: 'Roads and Infrastructure',
        urgency_reason: 'Test reason',
        public_impact: 'Test impact',
        recommended_action: 'Test action',
        summary: 'Test summary',
        is_fallback: false,
      },
      statusHistory: [
        {
          status: 'reported',
          timestamp: new Date().toISOString(),
          note: 'Test note',
          updatedBy: 'Test User',
        },
      ],
    };

    saveComplaint(mockComplaint);
    const retrieved = getComplaintById('CIV-2024-99999');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.title).toBe('Test pothole on main road');
  });

  it('returns null for non-existent complaint', () => {
    const result = getComplaintById('CIV-9999-00000');
    expect(result).toBeNull();
  });

  it('updates complaint status correctly', () => {
    const complaints = getStoredComplaints();
    const firstComplaint = complaints[0];
    
    const updated = updateComplaintStatus(firstComplaint.id, 'in_progress', 'Field team dispatched', 'Admin');
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('in_progress');
    expect(updated?.statusHistory.length).toBeGreaterThan(1);
  });

  it('calculates dashboard stats correctly', () => {
    const stats = getDashboardStats();
    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(stats.pending).toBeGreaterThanOrEqual(0);
    expect(stats.resolved).toBeGreaterThanOrEqual(0);
    expect(stats.total).toBeGreaterThanOrEqual(stats.pending + stats.resolved);
  });
});

describe('Demo complaints', () => {
  it('has valid structure', () => {
    DEMO_COMPLAINTS.forEach(complaint => {
      expect(complaint.id).toBeDefined();
      expect(complaint.title).toBeDefined();
      expect(complaint.description).toBeDefined();
      expect(complaint.status).toMatch(/^(reported|in_progress|resolved)$/);
      expect(complaint.priority).toMatch(/^(Critical|High|Medium|Low)$/);
      expect(complaint.aiAnalysis).toBeDefined();
      expect(complaint.statusHistory.length).toBeGreaterThan(0);
      expect(complaint.isDemo ?? true).toBe(true);
    });
  });

  it('has variety of priorities', () => {
    const priorities = new Set(DEMO_COMPLAINTS.map(c => c.priority));
    expect(priorities.size).toBeGreaterThan(1);
  });

  it('has variety of statuses', () => {
    const statuses = new Set(DEMO_COMPLAINTS.map(c => c.status));
    expect(statuses.size).toBeGreaterThan(1);
  });
});
