'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  Activity,
  ArrowRight,
  ExternalLink,
  Shield,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import { getStoredComplaints, getDashboardStats, resetDemoData } from '@/lib/storage';
import { Complaint, ComplaintPriority } from '@/lib/types';
import { CATEGORY_ICONS, timeAgo } from '@/lib/utils';
import { StatCard } from '@/components/ui/Card';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import Topbar from '@/components/layout/Topbar';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, critical: 0 });
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activityFilter, setActivityFilter] = useState<'all' | 'resolved' | 'in_progress'>('all');

  const loadData = () => {
    const data = getStoredComplaints();
    setComplaints(data);
    setStats(getDashboardStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReset = () => {
    resetDemoData();
    loadData();
    toast.success('Demo data refreshed successfully!');
  };

  // Dynamic trend data based on selected time range
  const trendDataMap = {
    '7d': [
      { date: 'Mon', count: 420 },
      { date: 'Tue', count: 680 },
      { date: 'Wed', count: 850 },
      { date: 'Thu', count: 790 },
      { date: 'Fri', count: 910 },
      { date: 'Sat', count: 640 },
      { date: 'Sun', count: 520 },
    ],
    '30d': [
      { date: 'Jun 1', count: 1800 },
      { date: 'Jun 8', count: 2400 },
      { date: 'Jun 15', count: 3240 },
      { date: 'Jun 22', count: 2890 },
      { date: 'Jun 30', count: 3450 },
    ],
    '90d': [
      { date: 'Apr', count: 6200 },
      { date: 'May', count: 8900 },
      { date: 'Jun', count: 11400 },
    ],
  };

  const trendData = trendDataMap[timeRange];

  // Priority Distribution Donut data
  const priorityData = [
    { name: 'Critical', value: complaints.filter(c => c.priority === 'Critical').length || 2, color: '#ef4444', pct: '25%' },
    { name: 'High', value: complaints.filter(c => c.priority === 'High').length || 3, color: '#f59e0b', pct: '35%' },
    { name: 'Medium', value: complaints.filter(c => c.priority === 'Medium').length || 2, color: '#3b82f6', pct: '25%' },
    { name: 'Low', value: complaints.filter(c => c.priority === 'Low').length || 1, color: '#10b981', pct: '15%' },
  ];

  const filteredRecentComplaints = complaints
    .filter((c) => (activityFilter === 'all' ? true : c.status === activityFilter))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f9]">
      <Topbar
        actions={
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
            title="Reset demo data"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        }
      />

      <div className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Welcome Greeting Header matching top-right in image */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome to your Civic Dashboard 👋
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
              <span>Here&apos;s what&apos;s happening in your city today.</span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                14 Municipal Teams Deployed
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-102"
            >
              <PlusCircle size={15} />
              <span>Report Issue</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards in a row matching template */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={stats.total ? (stats.total * 3000 + 580).toLocaleString() : '24,580'}
            icon={<FileText size={20} />}
            color="blue"
            trend="+ 12%"
            trendUp={true}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress ? (stats.inProgress * 2800 + 20).toLocaleString() : '8,420'}
            icon={<Activity size={20} />}
            color="purple"
            trend="+ 8%"
            trendUp={true}
          />
          <StatCard
            title="Resolved"
            value={stats.resolved ? (stats.resolved * 7500 + 120).toLocaleString() : '15,120'}
            icon={<CheckCircle2 size={20} />}
            color="green"
            trend="+ 18%"
            trendUp={true}
          />
          <StatCard
            title="Critical"
            value={stats.critical ? (stats.critical * 160).toLocaleString() : '320'}
            icon={<AlertTriangle size={20} />}
            color="red"
            trend="+ 5%"
            trendUp={false}
          />
        </div>

        {/* Charts Row matching template */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Complaint Trends Line/Area Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Complaint Trends</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Monthly volume & resolution trajectory</p>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200/80 rounded-xl">
                {[
                  { key: '7d', label: '7D' },
                  { key: '30d', label: '30D' },
                  { key: '90d', label: '90D' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTimeRange(t.key as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      timeRange === t.key ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Complaints"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#trendGradient)"
                  dot={{ r: 4, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Distribution Donut Chart matching template */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Priority Distribution</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Active issues by urgency rating</p>
            </div>

            <div className="relative py-2">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-slate-900">{stats.total}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {priorityData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-600 font-medium">{p.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{p.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities Section matching template */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Activities</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Live civic updates from city municipal departments</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px]">
                <button
                  onClick={() => setActivityFilter('all')}
                  className={`px-2.5 py-0.5 rounded-lg font-bold transition-all ${
                    activityFilter === 'all' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActivityFilter('resolved')}
                  className={`px-2.5 py-0.5 rounded-lg font-bold transition-all ${
                    activityFilter === 'resolved' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Resolved
                </button>
                <button
                  onClick={() => setActivityFilter('in_progress')}
                  className={`px-2.5 py-0.5 rounded-lg font-bold transition-all ${
                    activityFilter === 'in_progress' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  In Progress
                </button>
              </div>

              <Link href="/admin" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-2">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredRecentComplaints.map((c) => (
              <div key={c.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 rounded-xl px-2 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    c.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                    c.status === 'in_progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {c.status === 'resolved' ? <CheckCircle2 size={18} /> : <Activity size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900">{c.id}</span>
                      <span className="text-xs text-slate-500 font-medium truncate">
                        {c.status === 'resolved' ? 'Marked as Resolved' : c.status === 'in_progress' ? 'Work In Progress' : 'New Report Logged'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold truncate mt-0.5">{c.title}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.location}, {c.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <PriorityBadge priority={c.priority} />
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">{timeAgo(c.submittedAt)}</span>
                  <Link
                    href={`/track?id=${c.id}`}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors"
                    title="Track Complaint"
                  >
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
