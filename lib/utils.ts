import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ComplaintPriority, ComplaintStatus, ComplaintCategory } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let idSequenceCounter = Math.floor(Math.random() * 80000) + 10000;

export function generateComplaintId(): string {
  const prefix = 'CIV';
  const year = new Date().getFullYear();
  idSequenceCounter = ((idSequenceCounter + 1 - 10000) % 90000) + 10000;
  return `${prefix}-${year}-${idSequenceCounter}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDateShort(dateString);
}

export const PRIORITY_COLORS: Record<ComplaintPriority, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

export const PRIORITY_DOT_COLORS: Record<ComplaintPriority, string> = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  reported: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  reported: 'Reported',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Road Damage': '🛣️',
  'Garbage & Waste': '🗑️',
  'Water & Drainage': '💧',
  'Street Lighting': '💡',
  'Sewage': '🚰',
  'Public Infrastructure': '🏗️',
  'Other': '📋',
};

export const CATEGORIES: ComplaintCategory[] = [
  'Road Damage',
  'Garbage & Waste',
  'Water & Drainage',
  'Street Lighting',
  'Sewage',
  'Public Infrastructure',
  'Other',
];

export const DEPARTMENTS = [
  'Roads and Infrastructure',
  'Sanitation and Waste Management',
  'Water Supply and Drainage',
  'Electricity and Public Lighting',
  'Sewage and Plumbing',
  'Public Works Department',
  'Urban Development',
];

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file || !file.name) {
    return { valid: false, error: 'Invalid file provided.' };
  }

  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(ext) || !allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed. SVGs and executables are rejected.' };
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB.' };
  }
  return { valid: true };
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .trim()
    .slice(0, 2000);
}

export function getPriorityWeight(priority: ComplaintPriority): number {
  const weights: Record<ComplaintPriority, number> = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };
  return weights[priority] || 1;
}
