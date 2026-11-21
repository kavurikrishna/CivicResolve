import { generateComplaintId, sanitizeInput, validateFileUpload, formatDate, timeAgo, PRIORITY_COLORS, STATUS_COLORS, STATUS_LABELS } from '../lib/utils';

describe('generateComplaintId', () => {
  it('generates an ID with correct format', () => {
    const id = generateComplaintId();
    expect(id).toMatch(/^CIV-\d{4}-\d{5}$/);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, generateComplaintId));
    expect(ids.size).toBe(100);
  });
});

describe('sanitizeInput', () => {
  it('removes HTML angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
  });

  it('limits length to 2000 characters', () => {
    const longInput = 'a'.repeat(3000);
    expect(sanitizeInput(longInput).length).toBe(2000);
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('validateFileUpload', () => {
  const createMockFile = (name: string, type: string, size: number): File => {
    const file = new File(['content'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  it('accepts valid JPEG files', () => {
    const file = createMockFile('test.jpg', 'image/jpeg', 1024 * 1024);
    expect(validateFileUpload(file).valid).toBe(true);
  });

  it('accepts valid PNG files', () => {
    const file = createMockFile('test.png', 'image/png', 500 * 1024);
    expect(validateFileUpload(file).valid).toBe(true);
  });

  it('rejects files over 5MB', () => {
    const file = createMockFile('big.jpg', 'image/jpeg', 6 * 1024 * 1024);
    const result = validateFileUpload(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('5MB');
  });

  it('rejects non-image files', () => {
    const file = createMockFile('test.pdf', 'application/pdf', 1024);
    const result = validateFileUpload(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('JPEG');
  });

  it('rejects executable files', () => {
    const file = createMockFile('malware.exe', 'application/x-executable', 1024);
    expect(validateFileUpload(file).valid).toBe(false);
  });
});

describe('Priority Colors', () => {
  it('has colors for all priority levels', () => {
    const priorities = ['Critical', 'High', 'Medium', 'Low'] as const;
    priorities.forEach(p => {
      expect(PRIORITY_COLORS[p]).toBeDefined();
      expect(PRIORITY_COLORS[p].length).toBeGreaterThan(0);
    });
  });
});

describe('Status Labels', () => {
  it('has labels for all statuses', () => {
    const statuses = ['reported', 'in_progress', 'resolved'] as const;
    statuses.forEach(s => {
      expect(STATUS_LABELS[s]).toBeDefined();
    });
  });

  it('shows correct labels', () => {
    expect(STATUS_LABELS.reported).toBe('Reported');
    expect(STATUS_LABELS.in_progress).toBe('In Progress');
    expect(STATUS_LABELS.resolved).toBe('Resolved');
  });
});

describe('formatDate', () => {
  it('formats a valid date string', () => {
    const dateStr = '2024-01-15T10:30:00Z';
    const formatted = formatDate(dateStr);
    expect(formatted).toContain('2024');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });
});
