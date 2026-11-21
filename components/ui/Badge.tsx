'use client';

import { ComplaintPriority, ComplaintStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border tracking-wide', className)}>
      {children}
    </span>
  );
}

export function PriorityBadge({ priority, showDot = true }: { priority: ComplaintPriority; showDot?: boolean }) {
  const styles: Record<ComplaintPriority, { badge: string; dot: string }> = {
    Critical: { badge: 'bg-rose-50 text-rose-600 border-rose-200/60', dot: 'bg-rose-500' },
    High: { badge: 'bg-amber-50 text-amber-600 border-amber-200/60', dot: 'bg-amber-500' },
    Medium: { badge: 'bg-blue-50 text-blue-600 border-blue-200/60', dot: 'bg-blue-500' },
    Low: { badge: 'bg-emerald-50 text-emerald-600 border-emerald-200/60', dot: 'bg-emerald-500' },
  };

  const current = styles[priority] || styles.Medium;

  return (
    <Badge className={current.badge}>
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', current.dot)} />}
      {priority}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const styles: Record<ComplaintStatus, { badge: string; label: string; dot: string }> = {
    reported: { badge: 'bg-blue-50 text-blue-600 border-blue-200/60', label: 'Reported', dot: 'bg-blue-500' },
    in_progress: { badge: 'bg-indigo-50 text-indigo-600 border-indigo-200/60', label: 'In Progress', dot: 'bg-indigo-500' },
    resolved: { badge: 'bg-emerald-50 text-emerald-600 border-emerald-200/60', label: 'Resolved', dot: 'bg-emerald-500' },
  };

  const current = styles[status] || styles.reported;

  return (
    <Badge className={current.badge}>
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', current.dot)} />
      {current.label}
    </Badge>
  );
}
