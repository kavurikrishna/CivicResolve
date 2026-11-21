'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({ children, className, hover, padding = 'md', onClick }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] transition-all duration-200',
        paddings[padding],
        hover && 'hover:shadow-[0_12px_30px_-5px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'red';
}

const colorMap = {
  blue: {
    bg: 'bg-white',
    iconBg: 'bg-blue-50 text-blue-600',
    trendBg: 'bg-blue-50 text-blue-600 border-blue-200/60',
  },
  purple: {
    bg: 'bg-white',
    iconBg: 'bg-indigo-50 text-indigo-600',
    trendBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
  },
  green: {
    bg: 'bg-white',
    iconBg: 'bg-emerald-50 text-emerald-600',
    trendBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  },
  red: {
    bg: 'bg-white',
    iconBg: 'bg-rose-50 text-rose-600',
    trendBg: 'bg-rose-50 text-rose-600 border-rose-200/60',
  },
};

export function StatCard({ title, value, icon, trend, trendUp = true, color = 'blue' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_30px_-5px_rgba(15,23,42,0.08)] transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center font-semibold', c.iconBg)}>
          {icon}
        </div>
        {trend && (
          <span className={cn('inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold border', c.trendBg)}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
