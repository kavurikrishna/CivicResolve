import {
  getStoredComplaints,
  saveComplaint,
  getComplaintById,
  updateComplaintStatus,
  updateComplaintDepartment,
  findSimilarComplaints,
  resetDemoData,
  getDashboardStats,
} from '../lib/storage';
import { Complaint } from '../lib/types';
import {
  formatDateShort,
  timeAgo,
  getPriorityWeight,
  generateComplaintId,
  sanitizeInput,
  validateFileUpload,
} from '../lib/utils';

// Mock localStorage for Jest environment
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => localStorageStore[key] || null,
  setItem: (key: string, value: string) => {
    localStorageStore[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageStore[key];
  },
  clear: () => {
    Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
  },
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('CivicResolve Complete Workflow & Problem Alignment Suite', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('handles end-to-end lifecycle: submission -> investigation -> resolution', () => {
    const id = generateComplaintId();
    const newComplaint: Complaint = {
      id,
      title: 'Water pipe leak near community center',
      description: 'Clean drinking water leaking on road for 2 days continuously.',
      location: '12th Cross Road, Ward 4',
      city: 'Chennai',
      category: 'Water & Drainage',
      status: 'reported',
      priority: 'High',
      department: 'Water Supply and Drainage',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiAnalysis: {
        category: 'Water & Drainage',
        priority: 'High',
        department: 'Water Supply and Drainage',
        urgency_reason: 'Continuous drinking water loss poses resource waste and road erosion risk.',
        public_impact: 'Affects water pressure in nearby houses and pedestrian access.',
        recommended_action: 'Dispatch leak repair crew within 24 hours.',
        summary: 'Drinking water pipeline leak on road requiring pipe sealing.',
        is_fallback: true,
      },
      statusHistory: [
        {
          status: 'reported',
          timestamp: new Date().toISOString(),
          note: 'Complaint registered by citizen.',
          updatedBy: 'Citizen',
        },
      ],
      isDemo: false,
    };

    // 1. Citizen submits
    saveComplaint(newComplaint);
    const stored = getComplaintById(id);
    expect(stored).not.toBeNull();
    expect(stored?.status).toBe('reported');

    // 2. Department officer reassigns department if misrouted
    updateComplaintDepartment(id, 'Metro Water Authority');
    const reassigned = getComplaintById(id);
    expect(reassigned?.department).toBe('Metro Water Authority');

    // 3. Officer moves to in_progress with dispatch note
    const inProgress = updateComplaintStatus(
      id,
      'in_progress',
      'Field crew dispatched with excavation equipment.',
      'Officer R. Sharma'
    );
    expect(inProgress?.status).toBe('in_progress');
    expect(inProgress?.statusHistory.length).toBe(2);

    // 4. Officer resolves with audit note
    const resolved = updateComplaintStatus(
      id,
      'resolved',
      'Leak sealed, valve replaced and road resurfaced.',
      'Officer R. Sharma'
    );
    expect(resolved?.status).toBe('resolved');
    expect(resolved?.resolutionNotes).toBe('Leak sealed, valve replaced and road resurfaced.');
    expect(resolved?.statusHistory.length).toBe(3);

    // 5. Verify stats reflect resolved complaint
    const stats = getDashboardStats();
    expect(stats.resolved).toBeGreaterThanOrEqual(1);
  });

  it('updates complaint department and persists changes', () => {
    const complaints = getStoredComplaints();
    const target = complaints[0];
    const newDept = 'Special Civic Taskforce';
    updateComplaintDepartment(target.id, newDept);

    const updated = getComplaintById(target.id);
    expect(updated?.department).toBe(newDept);
  });

  it('detects similar complaints to avoid duplicate reports', () => {
    getStoredComplaints(); // Initializes demo data
    const similar = findSimilarComplaints(
      'Deep pothole on hospital road',
      'Vehicle damage near hospital junction'
    );
    expect(Array.isArray(similar)).toBe(true);
  });

  it('resets demo complaints cleanly', () => {
    resetDemoData();
    const complaints = getStoredComplaints();
    expect(complaints.length).toBeGreaterThan(0);
  });

  it('calculates relative time correctly for all timeframes', () => {
    const now = new Date();
    expect(timeAgo(now.toISOString())).toBe('Just now');

    const tenMins = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    expect(timeAgo(tenMins)).toBe('10m ago');

    const fourHours = new Date(now.getTime() - 4 * 3600 * 1000).toISOString();
    expect(timeAgo(fourHours)).toBe('4h ago');

    const threeDays = new Date(now.getTime() - 3 * 86400 * 1000).toISOString();
    expect(timeAgo(threeDays)).toBe('3d ago');

    const twoWeeks = new Date(now.getTime() - 14 * 86400 * 1000).toISOString();
    expect(timeAgo(twoWeeks)).toContain('202');
  });

  it('formats short dates properly', () => {
    const formatted = formatDateShort('2026-05-10T12:00:00Z');
    expect(formatted).toContain('2026');
  });

  it('maps priority weights accurately for queue scheduling', () => {
    expect(getPriorityWeight('Critical')).toBe(4);
    expect(getPriorityWeight('High')).toBe(3);
    expect(getPriorityWeight('Medium')).toBe(2);
    expect(getPriorityWeight('Low')).toBe(1);
  });

  it('sanitizes harmful XSS payloads and script injection', () => {
    const malicious = '<script>document.cookie="stolen"</script>Hello';
    expect(sanitizeInput(malicious)).not.toContain('<script>');
    expect(sanitizeInput('javascript:void(0)')).not.toContain('javascript:');
  });

  it('enforces file upload security boundaries', () => {
    const invalidFile = new File(['payload'], 'malicious.svg', { type: 'image/svg+xml' });
    const validation = validateFileUpload(invalidFile);
    expect(validation.valid).toBe(false);
  });
});
