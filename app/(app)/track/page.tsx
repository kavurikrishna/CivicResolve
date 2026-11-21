'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Star,
  UserCheck,
  PhoneCall,
  Printer,
  Copy,
} from 'lucide-react';
import { getComplaintById, DEMO_COMPLAINTS } from '@/lib/storage';
import { Complaint } from '@/lib/types';
import { formatDate, CATEGORY_ICONS } from '@/lib/utils';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import Topbar from '@/components/layout/Topbar';
import toast from 'react-hot-toast';

function TrackContent() {
  const searchParams = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get('id') || 'CIV-2024-10001');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState<number>(5);

  const handleSearch = useCallback((idToSearch?: string) => {
    const target = (idToSearch || searchId).trim().toUpperCase();
    if (!target) return;
    setSearchId(target);
    const found = getComplaintById(target);
    if (found) {
      setComplaint(found);
      setNotFound(false);
    } else {
      setComplaint(null);
      setNotFound(true);
    }
  }, [searchId]);

  useEffect(() => {
    const id = searchParams.get('id') || 'CIV-2024-10001';
    handleSearch(id);
  }, [searchParams, handleSearch]);

  const getStepStatus = (stepName: 'reported' | 'in_progress' | 'resolved') => {
    if (!complaint) return false;
    if (stepName === 'reported') return true;
    if (stepName === 'in_progress') return complaint.status === 'in_progress' || complaint.status === 'resolved';
    if (stepName === 'resolved') return complaint.status === 'resolved';
    return false;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Dark Navy Search Card matching template */}
        <div className="lg:col-span-4 bg-[#0f172a] text-white rounded-3xl p-6 lg:p-8 shadow-xl">
          <h2 className="text-2xl font-extrabold tracking-tight">Track Your Complaint</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Enter your unique complaint ID to view real-time updates and departmental resolution progress.
          </p>

          {/* Search Box */}
          <div className="mt-6 flex flex-col gap-2.5">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Complaint ID..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>Track</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Demo IDs matching template */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">Try these demo IDs:</span>
            <div className="flex flex-col gap-2">
              {['CIV-2024-10001', 'CIV-2024-10002', 'CIV-2024-10003'].map((demoId) => (
                <button
                  key={demoId}
                  onClick={() => handleSearch(demoId)}
                  className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-between cursor-pointer ${
                    searchId === demoId ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>{demoId}</span>
                  <span className="text-[10px] text-slate-400 font-sans font-medium">
                    {demoId === 'CIV-2024-10001' ? 'In Progress' : demoId === 'CIV-2024-10003' ? 'Resolved' : 'Reported'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Resolution Details matching template */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
          {notFound ? (
            <div className="text-center py-12">
              <AlertCircle size={40} className="mx-auto text-amber-500 mb-3" />
              <h3 className="text-base font-bold text-slate-800">Complaint Not Found</h3>
              <p className="text-xs text-slate-500 mt-1">Please verify the ID format: CIV-YYYY-XXXXX</p>
            </div>
          ) : complaint ? (
            <div className="space-y-6 animate-fade-in">
              {/* Top ID and Status Header matching template */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    complaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/60' : 'bg-blue-50 text-blue-600 ring-4 ring-blue-50/60'
                  }`}>
                    {complaint.status === 'resolved' ? <CheckCircle2 size={26} /> : <Clock size={26} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-mono tracking-tight text-slate-900">{complaint.id}</h2>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-md">{complaint.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Print Receipt"
                    aria-label="Print complaint receipt"
                  >
                    <Printer size={15} />
                  </button>
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              {/* 3-Stage Progress Timeline matching template */}
              <div className="py-4">
                <div className="relative flex justify-between items-center">
                  {/* Connecting bar */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: complaint.status === 'resolved' ? '100%' : complaint.status === 'in_progress' ? '50%' : '0%',
                      }}
                    />
                  </div>

                  {/* Step 1: Reported */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      ✓
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-2">Reported</span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(complaint.submittedAt).split(',')[0]}
                    </span>
                  </div>

                  {/* Step 2: In Progress */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      getStepStatus('in_progress')
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}>
                      {getStepStatus('in_progress') ? '✓' : '2'}
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-2">In Progress</span>
                    <span className="text-[10px] text-slate-400">
                      {getStepStatus('in_progress') ? 'Dispatched' : 'Pending'}
                    </span>
                  </div>

                  {/* Step 3: Resolved */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      getStepStatus('resolved')
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}>
                      {getStepStatus('resolved') ? '✓' : '3'}
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-2">Resolved</span>
                    <span className="text-[10px] text-slate-400">
                      {getStepStatus('resolved') ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Issue Details Box matching template */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Issue Details</h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin size={12} /> {complaint.location}, {complaint.city}
                  </span>
                </div>

                <div className="grid md:grid-cols-12 gap-4 items-center">
                  {/* Photo thumbnail */}
                  <div className="md:col-span-4 rounded-xl overflow-hidden h-28 bg-slate-200 border border-slate-200 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={complaint.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80'}
                      alt="Complaint"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Metadata & Department */}
                  <div className="md:col-span-8 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Category: </span>
                      <strong className="text-slate-900">{complaint.category}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Department: </span>
                      <strong className="text-blue-600">{complaint.department}</strong>
                    </div>

                    {/* Resolution Notes */}
                    <div className="p-3 rounded-xl bg-white border border-slate-100 text-xs shadow-2xs">
                      <span className="text-slate-500 font-bold block mb-1">Resolution Notes:</span>
                      <p className="text-slate-700 leading-relaxed">
                        {complaint.resolutionNotes || complaint.aiAnalysis?.recommended_action || 'Field inspection team dispatched. Repairs underway.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Municipal Officer Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Engineer</span>
                    <strong className="text-xs text-slate-800">Officer R. Sharma · Senior Municipal Infrastructure</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toast.success('Officer contacted. Expect callback within 15 mins.')}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    aria-label="Contact assigned municipal officer"
                  >
                    <PhoneCall size={12} /> Contact
                  </button>
                </div>
              </div>

              {/* Citizen Satisfaction Feedback */}
              {complaint.status === 'resolved' && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900">Are you satisfied with this resolution?</h5>
                    <p className="text-[11px] text-emerald-700">Help us maintain high civic SLA standards in your ward.</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        aria-label={`Rate resolution ${star} of 5 stars`}
                        onClick={() => {
                          setRating(star);
                          toast.success(`Thank you for rating ${star} stars!`);
                        }}
                        className={`p-1 cursor-pointer transition-transform hover:scale-110 ${
                          star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      >
                        <Star size={16} fill={star <= rating ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f9]">
      <Topbar title="Track Complaint" subtitle="Real-time transparency on civic resolution" />
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading tracker...</div>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
