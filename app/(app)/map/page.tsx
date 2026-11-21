'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Filter, ArrowRight, X, Clock, ExternalLink, Search, Layers } from 'lucide-react';
import { getStoredComplaints } from '@/lib/storage';
import { Complaint } from '@/lib/types';
import { timeAgo, CATEGORIES } from '@/lib/utils';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import Topbar from '@/components/layout/Topbar';
import Link from 'next/link';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center">
      <div className="text-slate-400 text-xs font-semibold">Loading interactive city infrastructure map...</div>
    </div>
  ),
});

export default function MapPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'Critical' | 'High' | 'Medium' | 'Low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'reported' | 'in_progress' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Complaint | null>(null);

  useEffect(() => {
    const data = getStoredComplaints();
    setComplaints(data);
    if (data.length > 0) {
      setSelected(data[0]);
    }
  }, []);

  const filtered = complaints.filter((c) => {
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f9]">
      <Topbar title="Issue Map" subtitle="Geospatial city infrastructure overview" />

      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4">
        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 pl-1 pr-2 flex-shrink-0">
            <Layers size={13} /> Categories:
          </span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            All Categories ({complaints.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = complaints.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20 font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* 3-Column Map Layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* 1. Left Filters Sidebar matching template */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-5 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                <Filter size={14} className="text-blue-600" />
                <span>Filters</span>
              </div>

              {/* Priority Filter */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Priority</span>
                {(
                  [
                    { key: 'all', label: 'All Priorities', color: 'bg-slate-400' },
                    { key: 'Critical', label: 'Critical', color: 'bg-rose-500' },
                    { key: 'High', label: 'High', color: 'bg-amber-500' },
                    { key: 'Medium', label: 'Medium', color: 'bg-blue-500' },
                    { key: 'Low', label: 'Low', color: 'bg-emerald-500' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPriorityFilter(item.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      priorityFilter === item.key ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    {priorityFilter === item.key && <span className="text-blue-600 font-bold text-[10px]">●</span>}
                  </button>
                ))}
              </div>

              {/* Status Filter matching template */}
              <div className="space-y-1.5 mt-6 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Status</span>
                {(
                  [
                    { key: 'all', label: 'All Statuses' },
                    { key: 'in_progress', label: 'In Progress' },
                    { key: 'resolved', label: 'Resolved' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatusFilter(item.key)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === item.key ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Center: Large Interactive Map with Floating Card matching template */}
          <div className="lg:col-span-6 relative bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] overflow-hidden h-[540px]">
            <MapComponent
              complaints={filtered}
              onSelect={setSelected}
              selected={selected}
            />

            {/* Floating Card matching bottom-left in image */}
            {selected && (
              <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-4 z-20 animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selected.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80'}
                        alt={selected.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">{selected.category}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          selected.priority === 'Critical' ? 'bg-rose-500' : selected.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <span className="text-[10px] font-bold text-slate-700">{selected.priority} Priority</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Reported: {timeAgo(selected.submittedAt)}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X size={14} />
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{selected.id}</span>
                  <Link
                    href={`/track?id=${selected.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. Right: "Nearby Issues" List matching template */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-5 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900">Nearby Issues</h3>
              <Link href="/admin" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    selected?.id === c.id ? 'border-blue-400 bg-blue-50/60 shadow-xs' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      c.priority === 'Critical' ? 'bg-rose-500' : c.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-[10px] font-mono font-bold text-slate-800">{c.id}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 truncate">{c.title}</h5>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span className="truncate max-w-[130px]">{c.location}</span>
                    <span className={c.priority === 'Critical' ? 'text-rose-600 font-bold' : c.priority === 'High' ? 'text-amber-600 font-bold' : 'text-blue-600 font-bold'}>
                      {c.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
