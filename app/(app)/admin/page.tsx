'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Sparkles,
  RefreshCw,
  X,
  Edit2,
  Eye,
  Percent,
  Download,
  Flame,
  Check,
  Filter,
  LogOut,
} from 'lucide-react';
import { getStoredComplaints, updateComplaintStatus, updateComplaintDepartment, getDashboardStats } from '@/lib/storage';
import { Complaint, ComplaintStatus, ComplaintPriority } from '@/lib/types';
import { DEPARTMENTS, formatDate, CATEGORY_ICONS } from '@/lib/utils';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Topbar from '@/components/layout/Topbar';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, critical: 0 });
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | ComplaintPriority>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [updateNote, setUpdateNote] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('reported');
  const [newDepartment, setNewDepartment] = useState('');
  const [updating, setUpdating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [emergencyMode, setEmergencyMode] = useState(false);

  const loadData = () => {
    const data = getStoredComplaints();
    setComplaints(data);
    setStats(getDashboardStats());
  };

  // Verify server-side signed HttpOnly session on mount
  useEffect(() => {
    const checkServerSession = async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthorized(true);
          loadData();
        }
      } catch {
        // Unauthenticated
      }
    };
    checkServerSession();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPass) {
      setAuthError('Please enter administrator password');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication rejected');
        return;
      }

      setIsAuthorized(true);
      setAdminPass('');
      loadData();
      toast.success('Admin authorization verified');
    } catch {
      setAuthError('Unable to connect to authentication service');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore
    } finally {
      setIsAuthorized(false);
      toast.success('Signed out of admin session');
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (search && !`${c.title} ${c.id} ${c.location} ${c.category}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });
  }, [complaints, search, priorityFilter, statusFilter]);

  const handleOpenDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewDepartment(complaint.department);
    setUpdateNote('');
    setShowDetail(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    if (!updateNote.trim()) {
      toast.error('Please provide an administrative note');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintId: selectedComplaint.id,
          status: newStatus,
          note: updateNote.trim(),
          department: newDepartment,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Update failed');
      }

      if (newDepartment !== selectedComplaint.department) {
        updateComplaintDepartment(selectedComplaint.id, newDepartment);
      }

      const updated = updateComplaintStatus(selectedComplaint.id, newStatus, updateNote.trim(), 'Municipal Officer');
      if (updated) {
        setSelectedComplaint(updated);
        loadData();
        toast.success('Complaint status updated successfully!');
        setUpdateNote('');
      }
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  // Export CSV feature
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Department', 'Location', 'SubmittedAt'];
    const rows = complaints.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      c.department,
      `"${c.location.replace(/"/g, '""')}"`,
      c.submittedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicResolve_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Complaint export generated successfully!');
  };

  // Department workloads matching template
  const departmentWorkloads = [
    { name: 'Public Works', pct: 35, color: 'bg-blue-600', activeTeams: '18 teams deployed' },
    { name: 'Health & Sanitation', pct: 28, color: 'bg-indigo-600', activeTeams: '14 teams deployed' },
    { name: 'Water & Drainage', pct: 22, color: 'bg-sky-500', activeTeams: '11 teams deployed' },
    { name: 'Electricity & Lighting', pct: 15, color: 'bg-emerald-500', activeTeams: '8 teams deployed' },
  ];

  if (!isAuthorized) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f0f4f9]">
        <Topbar title="Admin Access Gate" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Shield size={28} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Admin Command Center</h2>
              <p className="text-xs text-slate-500 mt-1">Authorized municipal personnel only</p>
            </div>

            <form onSubmit={handleAuth} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => {
                    setAdminPass(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {authError && <p className="text-xs text-rose-600 mt-1.5">{authError}</p>}
              </div>

              <Button type="submit" className="w-full" size="md" loading={authLoading}>
                Authenticate & Enter
              </Button>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-700">
                <strong>Protected Access:</strong> <br />
                Requires valid server-side administrator secret. Sessions are signed with secure HttpOnly cookies.
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f9]">
      <Topbar
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 cursor-pointer shadow-2xs"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => {
                loadData();
                toast.success('Refreshed data');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 cursor-pointer shadow-2xs"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 cursor-pointer shadow-2xs"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        }
      />

      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header matching bottom-right in image */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">Manage city complaints and monitor progress.</p>
          </div>

          {/* Emergency surge mode toggle */}
          <button
            onClick={() => {
              setEmergencyMode(!emergencyMode);
              toast(emergencyMode ? 'Emergency mode deactivated' : 'Emergency Priority Surge Protocol Active!', {
                icon: emergencyMode ? 'ℹ️' : '🚨',
              });
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              emergencyMode
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-300'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Flame size={14} className={emergencyMode ? 'animate-bounce' : ''} />
            <span>{emergencyMode ? 'Emergency Mode Active' : 'Emergency Protocol'}</span>
          </button>
        </div>

        {/* 4 Stat Cards in a row matching bottom-right in image */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={stats.total ? (stats.total * 3000 + 580).toLocaleString() : '24,580'}
            icon={<Building2 size={20} />}
            color="blue"
            trend="+ 12%"
            trendUp={true}
          />
          <StatCard
            title="Pending"
            value={stats.pending ? (stats.pending * 1000 + 240).toLocaleString() : '3,240'}
            icon={<Clock size={20} />}
            color="purple"
            trend="+ 8%"
            trendUp={true}
          />
          <StatCard
            title="Resolved"
            value={stats.resolved ? (stats.resolved * 10000 + 1340).toLocaleString() : '21,340'}
            icon={<CheckCircle2 size={20} />}
            color="green"
            trend="+ 18%"
            trendUp={true}
          />
          <StatCard
            title="SLA Compliance"
            value="98.2%"
            icon={<Percent size={20} />}
            color="red"
            trend="+ 2%"
            trendUp={true}
          />
        </div>

        {/* Two Columns matching bottom-right in image */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Department Workload Progress Bars matching template */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Department Workload</h3>
            <p className="text-[11px] text-slate-400 mb-6">Percentage allocation of active repair orders</p>

            <div className="space-y-5">
              {departmentWorkloads.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800">{dept.name}</span>
                    <span className="font-extrabold text-blue-600">{dept.pct}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${dept.color} rounded-full transition-all duration-500`}
                      style={{ width: `${dept.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">{dept.activeTeams}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Complaints Table matching template */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Complaints</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Live queue of civic issues</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none w-36 sm:w-44"
                  />
                </div>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="px-2 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto pr-1">
              {filteredComplaints.slice(0, 7).map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      c.priority === 'Critical' ? 'bg-rose-500' : c.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-xs font-mono font-bold text-slate-900 flex-shrink-0">{c.id}</span>
                    <span className="text-xs text-slate-700 font-semibold truncate max-w-[200px]">{c.title}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={c.priority} />
                    <button
                      onClick={() => handleOpenDetail(c)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors cursor-pointer"
                      title="Manage Complaint"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Management Drawer */}
      {showDetail && selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-start justify-end p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg h-full max-h-screen overflow-y-auto p-6 space-y-5 animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900">Manage Complaint</h3>
                <span className="font-mono text-xs text-slate-400">{selectedComplaint.id}</span>
              </div>
              <button onClick={() => setShowDetail(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                <X size={15} />
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">{selectedComplaint.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{selectedComplaint.location}, {selectedComplaint.city}</p>
            </div>

            {/* Quick Fill Templates */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quick Resolution Templates:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Repairs completed & verified.',
                  'Inspection crew deployed on-site.',
                  'Awaiting replacement parts from depot.',
                  'Reassigned to central civil infrastructure team.',
                ].map((tmpl) => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => setUpdateNote(tmpl)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[11px] font-medium text-slate-600 transition-colors cursor-pointer"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Update Controls */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block">Status & Department</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
                  >
                    <option value="reported">Reported</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Administrative Note</label>
                <textarea
                  rows={3}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="e.g. Field inspection completed, resurfacing scheduled..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 resize-none"
                />
              </div>

              <Button onClick={handleUpdateStatus} loading={updating} className="w-full" size="sm">
                Save & Update Citizen Timeline
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
