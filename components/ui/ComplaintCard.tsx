'use client';

import { Complaint } from '@/lib/types';
import { formatDateShort, timeAgo, CATEGORY_ICONS, cn } from '@/lib/utils';
import { PriorityBadge, StatusBadge } from './Badge';
import { MapPin, Calendar, Building2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ComplaintCardProps {
  complaint: Complaint;
  compact?: boolean;
  showActions?: boolean;
}

export default function ComplaintCard({ complaint, compact, showActions }: ComplaintCardProps) {
  const categoryIcon = CATEGORY_ICONS[complaint.category] || '📋';

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
        <div className="text-xl">{categoryIcon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{complaint.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={complaint.status} />
            <span className="text-[11px] text-slate-400">{timeAgo(complaint.submittedAt)}</span>
          </div>
        </div>
        <PriorityBadge priority={complaint.priority} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] p-5 hover:shadow-[0_12px_30px_-5px_rgba(15,23,42,0.08)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{categoryIcon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">{complaint.id}</span>
              {complaint.isDemo && (
                <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200/60 px-2 py-0.5 rounded-full font-bold">Demo</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1 leading-tight">{complaint.title}</h3>
          </div>
        </div>
        <PriorityBadge priority={complaint.priority} />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{complaint.description}</p>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin size={12} className="text-slate-400" />
          <span className="truncate">{complaint.location}, {complaint.city}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Building2 size={12} className="text-slate-400" />
          <span className="truncate">{complaint.department}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-slate-400" />
          <span>{formatDateShort(complaint.submittedAt)}</span>
        </div>
        <div>
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* AI Summary */}
      {complaint.aiAnalysis?.summary && (
        <div className={cn(
          'rounded-xl p-3 mb-4 border text-xs',
          complaint.aiAnalysis.is_fallback
            ? 'bg-amber-50/60 border-amber-200/60 text-amber-800'
            : 'bg-blue-50/60 border-blue-200/60 text-blue-900'
        )}>
          <div className="flex items-center gap-1.5 mb-1 font-bold">
            <span>{complaint.aiAnalysis.is_fallback ? '⚠️ Auto-classified' : '✨ Gemini Analysis'}</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">{complaint.aiAnalysis.summary}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-blue-600">
          <Link href={`/track?id=${complaint.id}`} className="hover:text-blue-700 flex items-center gap-1">
            <ExternalLink size={12} />
            <span>Track Progress</span>
          </Link>
        </div>
      )}
    </div>
  );
}
