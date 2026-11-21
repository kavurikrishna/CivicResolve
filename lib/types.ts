// Core complaint types for CivicResolve

export type ComplaintStatus = 'reported' | 'in_progress' | 'resolved';
export type ComplaintPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type ComplaintCategory =
  | 'Road Damage'
  | 'Garbage & Waste'
  | 'Water & Drainage'
  | 'Street Lighting'
  | 'Sewage'
  | 'Public Infrastructure'
  | 'Other';

export interface AIAnalysis {
  category: ComplaintCategory | string;
  priority: ComplaintPriority;
  department: string;
  urgency_reason: string;
  public_impact: string;
  recommended_action: string;
  summary: string;
  is_fallback?: boolean;
}

export interface StatusUpdate {
  status: ComplaintStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  category: string;
  imageUrl?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  department: string;
  submittedAt: string;
  updatedAt: string;
  aiAnalysis: AIAnalysis;
  statusHistory: StatusUpdate[];
  submittedBy?: string;
  resolutionNotes?: string;
  isDemo?: boolean;
  lat?: number;
  lng?: number;
}

export interface ComplaintFormData {
  title: string;
  description: string;
  location: string;
  city: string;
  category: string;
  imageFile?: File;
  useAIClassification: boolean;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  critical: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
}
