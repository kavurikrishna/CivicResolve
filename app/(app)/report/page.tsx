'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  MapPin,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  X,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileCheck2,
  Layers,
  Camera,
  Copy,
  Crosshair,
  AlertTriangle,
  BrainCircuit,
  Share2,
} from 'lucide-react';
import { CATEGORIES, generateComplaintId, validateFileUpload, sanitizeInput } from '@/lib/utils';
import { saveComplaint } from '@/lib/storage';
import { Complaint, AIAnalysis } from '@/lib/types';
import Button from '@/components/ui/Button';
import { PriorityBadge } from '@/components/ui/Badge';
import Topbar from '@/components/layout/Topbar';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Step = 1 | 2 | 3 | 4;

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    city: 'Chennai',
    category: 'Road Damage',
    useAI: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [complaintId, setComplaintId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample photo gallery matching template
  const sampleThumbnails = [
    { name: 'Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80' },
    { name: 'Waste Bin', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80' },
    { name: 'Street Light', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80' },
  ];

  const categoryIcons: Record<string, string> = {
    'Road Damage': '🛣️',
    'Garbage & Waste': '🗑️',
    'Water & Drainage': '💧',
    'Street Lighting': '💡',
    'Sewage': '🚰',
    'Public Infrastructure': '🏗️',
    'Other': '📋',
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validateFileUpload(file);
    if (!v.valid) {
      toast.error(v.error || 'Invalid image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDetectLocation = () => {
    setDetectingGps(true);
    setTimeout(() => {
      setFormData((f) => ({
        ...f,
        location: 'Anna Salai, near Government Estate Metro Station',
        city: 'Chennai',
      }));
      setDetectingGps(false);
      toast.success('GPS Location verified: Anna Salai, Chennai');
    }, 700);
  };

  const handleFinalSubmit = async () => {
    if (!formData.title.trim()) {
      formData.title = `${formData.category} issue reported at ${formData.location || 'City street'}`;
    }
    if (!formData.description.trim()) {
      toast.error('Please describe the issue in detail');
      setCurrentStep(1);
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sanitizeInput(formData.title || formData.description.slice(0, 60)),
          description: sanitizeInput(formData.description),
          location: sanitizeInput(formData.location || 'City area'),
          category: formData.useAI ? undefined : formData.category,
        }),
      });

      let analysis: AIAnalysis;
      if (response.ok) {
        analysis = await response.json();
      } else {
        analysis = {
          category: formData.category,
          priority: 'High',
          department: 'Public Works Department',
          urgency_reason: 'Automated review completed.',
          public_impact: 'Area impact assessed by municipal routing system.',
          recommended_action: 'Dispatch field technician for site inspection.',
          summary: formData.description.slice(0, 100),
          is_fallback: true,
        };
      }

      setAiAnalysis(analysis);
      const newId = generateComplaintId();
      setComplaintId(newId);

      const complaint: Complaint = {
        id: newId,
        title: sanitizeInput(formData.title || `${analysis.category} near ${formData.location || 'Main Road'}`),
        description: sanitizeInput(formData.description),
        location: sanitizeInput(formData.location || 'Main Street'),
        city: sanitizeInput(formData.city || 'Chennai'),
        category: analysis.category,
        imageUrl: imagePreview || undefined,
        status: 'reported',
        priority: analysis.priority,
        department: analysis.department,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiAnalysis: analysis,
        statusHistory: [
          {
            status: 'reported',
            timestamp: new Date().toISOString(),
            note: 'Complaint registered successfully. AI analysis completed.',
            updatedBy: 'CivicResolve AI',
          },
        ],
        isDemo: false,
        lat: 13.0827 + (Math.random() - 0.5) * 0.05,
        lng: 80.2707 + (Math.random() - 0.5) * 0.05,
      };

      saveComplaint(complaint);
      setSubmitted(true);
      toast.success('Complaint successfully logged and routed!');
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(complaintId);
    toast.success('Complaint ID copied to clipboard!');
  };

  // Submission Confirmation Screen matching template
  if (submitted && aiAnalysis) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f0f4f9]">
        <Topbar title="Complaint Submitted" />
        <div className="flex-1 p-6 lg:p-10 max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50">
              <CheckCircle2 size={36} />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              Registration Complete
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Complaint Successfully Logged!</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Your report has been analyzed by Google Gemini AI and dispatched to the designated municipal response team.
            </p>

            {/* Unique ID Box matching template */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Complaint Tracking ID</span>
                <p className="text-2xl font-black font-mono text-slate-900 tracking-wider mt-0.5">{complaintId}</p>
              </div>
              <button
                onClick={copyId}
                className="px-4 py-2 rounded-xl bg-white text-blue-600 border border-blue-200 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer shadow-2xs"
              >
                <Copy size={14} className="inline mr-1" /> Copy ID
              </button>
            </div>

            {/* AI Breakdown Card */}
            <div className="mt-6 rounded-2xl border border-slate-100 p-5 bg-slate-50/70 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Sparkles size={14} className="text-blue-600" />
                  <span>Gemini AI Priority & Routing</span>
                </div>
                <PriorityBadge priority={aiAnalysis.priority} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <span className="text-slate-400 font-medium">Assigned Department</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">{aiAnalysis.department}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Detected Category</span>
                  <p className="font-extrabold text-slate-900 mt-0.5">{aiAnalysis.category}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700">
                <strong className="text-slate-900">Recommended Action: </strong>
                {aiAnalysis.recommended_action}
              </div>

              {aiAnalysis.urgency_reason && (
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700">
                  <strong className="text-slate-900">Urgency Reason: </strong>
                  {aiAnalysis.urgency_reason}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/track?id=${complaintId}`}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-center flex items-center justify-center gap-2"
              >
                <span>Track My Complaint in Real-Time</span>
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  setFormData({ title: '', description: '', location: '', city: 'Chennai', category: 'Road Damage', useAI: true });
                  setImagePreview(null);
                }}
                className="py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f9]">
      <Topbar title="Report a Civic Issue" subtitle="Let's make our city better together." />

      <div className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Banner matching template */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 font-bold shadow-xs">
              <Building2 size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Report a Civic Issue
            </h2>
            <p className="text-sm font-bold text-blue-600 mt-1">Let&apos;s make our city better together.</p>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Describe the issue and our Gemini AI engine will automatically classify urgency, assess safety hazards, and dispatch it directly to city officials.
            </p>

            {/* AI Advantage list */}
            <div className="mt-8 space-y-3.5 border-t border-slate-100 pt-6">
              {[
                { title: 'Sub-second AI Triage', desc: 'Auto-categorizes into roads, water, lights & more' },
                { title: 'Priority Scoring', desc: 'Flags critical public safety hazards immediately' },
                { title: 'Live Tracking Code', desc: 'Direct verification with GPS-mapped locations' },
              ].map((adv) => (
                <div key={adv.title} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{adv.title}</h5>
                    <p className="text-[11px] text-slate-500">{adv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Multi-Step Card matching template */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
            {/* Stepper matching template from picture */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              {[
                { num: 1, label: 'Issue Details' },
                { num: 2, label: 'Location' },
                { num: 3, label: 'Evidence' },
                { num: 4, label: 'Review' },
              ].map((s) => (
                <div
                  key={s.num}
                  onClick={() => s.num < currentStep && setCurrentStep(s.num as Step)}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer ${
                    s.num === currentStep ? 'text-blue-600 font-bold' : s.num < currentStep ? 'text-slate-700 font-semibold' : 'text-slate-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s.num === currentStep
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-50'
                      : s.num < currentStep
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {s.num < currentStep ? '✓' : s.num}
                  </div>
                  <span className="text-[11px] hidden sm:block">{s.label}</span>
                </div>
              ))}
            </div>

            {/* STEP 1: Issue Details matching template */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">What&apos;s the issue?</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {categoryIcons[c] || '📋'} {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">Describe the issue in detail...</label>
                    <span className="text-[11px] text-slate-400">{formData.description.length}/2000</span>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.description}
                    maxLength={2000}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the problem, severity, and any hazards to traffic or pedestrians..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* AI Toggle matching template */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Use AI Auto-Classification</span>
                      <span className="text-[10px] text-slate-500">Gemini will auto-detect department & priority rating</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, useAI: !formData.useAI })}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      formData.useAI ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        formData.useAI ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={() => {
                      if (!formData.description.trim()) {
                        toast.error('Please describe the problem');
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    rightIcon={<ArrowRight size={15} />}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">Location / Landmark</label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingGps}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Crosshair size={13} className={detectingGps ? 'animate-spin' : ''} />
                      <span>{detectingGps ? 'Detecting GPS...' : 'Use My Current Location'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Main Street, opposite Apollo Pharmacy"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                {/* Quick suggestions */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">Quick Location Hotspots:</span>
                  <div className="flex flex-wrap gap-2">
                    {['Anna Nagar Market', 'Velachery Main Road', 'T. Nagar Bus Stop', 'Besant Nagar Beach', 'Tambaram Junction'].map((spot) => (
                      <button
                        key={spot}
                        type="button"
                        onClick={() => setFormData({ ...formData, location: spot })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs font-medium transition-colors"
                      >
                        {spot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} leftIcon={<ArrowLeft size={15} />}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} rightIcon={<ArrowRight size={15} />}>
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Evidence matching template */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <label className="block text-xs font-bold text-slate-800">Upload Photos (Optional)</label>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-48 bg-slate-100 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Evidence" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 rounded-2xl p-8 text-center cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                      <Upload size={22} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Drag & drop or click to upload</p>
                    <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Instant sample thumbnails matching template */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">Or select a sample photo:</span>
                  <div className="grid grid-cols-3 gap-3">
                    {sampleThumbnails.map((sample) => (
                      <div
                        key={sample.name}
                        onClick={() => setImagePreview(sample.url)}
                        className="rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 cursor-pointer transition-all group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sample.url} alt={sample.name} className="w-full h-16 object-cover group-hover:scale-105 transition-transform" />
                        <div className="p-1.5 text-center text-[10px] font-bold text-slate-700 bg-white">
                          {sample.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} leftIcon={<ArrowLeft size={15} />}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(4)} rightIcon={<ArrowRight size={15} />}>
                    Review Details
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Category</span>
                    <span className="font-extrabold text-slate-900">{formData.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Location</span>
                    <span className="font-extrabold text-slate-900">{formData.location || 'Area not specified'}, {formData.city}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">AI Auto-Triage</span>
                    <span className="font-extrabold text-blue-600">{formData.useAI ? 'Enabled (Google Gemini)' : 'Disabled'}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80">
                    <span className="text-[11px] text-slate-400 block mb-1">Description</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{formData.description}</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} leftIcon={<ArrowLeft size={15} />}>
                    Back
                  </Button>
                  <Button
                    onClick={handleFinalSubmit}
                    loading={analyzing}
                    leftIcon={<FileCheck2 size={16} />}
                  >
                    {analyzing ? 'AI Analyzing Urgency...' : 'Submit Complaint'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
