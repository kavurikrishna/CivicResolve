'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  MapPin,
  ChevronRight,
  Compass,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Zap,
  Activity,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const [selectedDemo, setSelectedDemo] = useState(0);

  const interactiveSimulations = [
    {
      title: 'Water Pipe Burst on Velachery Road',
      category: 'Water & Drainage',
      priority: 'Critical',
      dept: 'Water Supply and Drainage',
      action: 'Emergency valve closure dispatched. Water tankers mobilized within 30 mins.',
      urgency: 'Immediate flood & water loss hazard affecting 200+ households.',
      color: 'text-rose-600 bg-rose-50 border-rose-200/60',
    },
    {
      title: 'Deep Pothole at Hospital Junction',
      category: 'Road Damage',
      priority: 'High',
      dept: 'Roads & Infrastructure',
      action: 'Temporary barricades installed. Road milling & asphalt patch scheduled for tomorrow morning.',
      urgency: 'Two-wheeler accident hazard especially during nighttime rain.',
      color: 'text-amber-600 bg-amber-50 border-amber-200/60',
    },
    {
      title: 'Dark Streetlights near T. Nagar Bus Terminus',
      category: 'Street Lighting',
      priority: 'High',
      dept: 'Electricity & Public Lighting',
      action: 'Emergency electrician team dispatched to replace circuit breaker and install solar LED backup.',
      urgency: 'Public safety hazard in high-traffic pedestrian walkway.',
      color: 'text-blue-600 bg-blue-50 border-blue-200/60',
    },
  ];

  const currentSim = interactiveSimulations[selectedDemo];

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-800">
      {/* 1. Header Navigation matching template */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-3.5 flex items-center justify-between transition-all">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/25">
            <Building2 size={22} className="text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">CivicResolve</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <Link href="/" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
            Home
          </Link>
          <a href="#interactive-demo" className="hover:text-slate-900 transition-colors">
            AI Simulator
          </a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
            How It Works
          </a>
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/map" className="hover:text-slate-900 transition-colors">
            Issue Map
          </Link>
        </nav>

        {/* Action Button: "Login ->" */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover:scale-102"
          >
            <span>Login</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-10 pb-20 px-6 lg:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col items-center text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-tr from-blue-200/40 via-sky-100/30 to-teal-100/30 blur-3xl rounded-full pointer-events-none -z-10" />

        {/* "Powered by Google Gemini AI" pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-6 hover:shadow-sm transition-all">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span className="text-xs font-bold text-slate-700 tracking-tight">
            Powered by <span className="text-blue-600 font-extrabold">Google Gemini AI</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-4xl">
          A Smarter City, <br />
          A Better <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">Tomorrow</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Report civic issues, track progress, and help build a cleaner, safer and more responsive city.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/report"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 transition-all hover:scale-102 cursor-pointer"
          >
            <span>Report an Issue</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all hover:scale-102 cursor-pointer"
          >
            <Compass size={17} className="text-blue-600" />
            <span>Explore Dashboard</span>
          </Link>
        </div>

        {/* Futuristic City Banner Illustration Card matching reference */}
        <div className="mt-12 w-full max-w-5xl rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl relative h-64 sm:h-80 md:h-96 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
            alt="Futuristic Smart City"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-left text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-[11px] font-bold w-fit mb-2">
              <Sparkles size={12} /> Next-Gen Civic Intelligence
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">Connected Municipal Response Network</h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              Real-time synchronization between citizens, Gemini AI classification, and field repair departments.
            </p>
          </div>
        </div>

        {/* 3. Floating Glassmorphic Stats Bar (matching template from picture) */}
        <div className="mt-8 w-full max-w-4xl rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 p-5 shadow-xl shadow-slate-900/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-900 leading-tight">12,480</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Issues Reported</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-900 leading-tight">11,920</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Resolved Today</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-900 leading-tight">2.3h</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Avg Resolution</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Target size={20} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-900 leading-tight">98.5%</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">AI Accuracy</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live City Infrastructure Network
            </span>
            <span className="text-blue-600 font-bold">Smart Governance. Powered by AI.</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-10 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <span>↓ Scroll to explore</span>
        </div>
      </section>

      {/* 4. Live Interactive AI Simulator Section */}
      <section id="interactive-demo" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 lg:p-12 shadow-xl shadow-slate-900/5">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
              <Sparkles size={14} /> Interactive Gemini AI Simulator
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Test How Gemini AI Analyzes Complaints in Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Click a sample civic problem below to simulate how the AI detects risk to human safety, scores urgency, and recommends departments.
            </p>
          </div>

          {/* Sample Buttons */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {interactiveSimulations.map((sim, idx) => (
              <button
                key={sim.title}
                onClick={() => setSelectedDemo(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDemo === idx
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                {sim.title}
              </button>
            ))}
          </div>

          {/* AI Analysis Result Card */}
          <div className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-6 lg:p-8 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <BrainCircuit size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gemini 1.5 Flash Triage Result</span>
                  <h4 className="text-base font-extrabold text-slate-900">{currentSim.title}</h4>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentSim.color}`}>
                {currentSim.priority} Priority
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Detected Category</span>
                <p className="text-sm font-extrabold text-slate-900">{currentSim.category}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Assigned Department</span>
                <p className="text-sm font-extrabold text-blue-600">{currentSim.dept}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Safety & Urgency Reason</span>
                <p className="text-xs text-slate-600 leading-relaxed">{currentSim.urgency}</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700">
              <strong className="text-slate-900">Recommended Action: </strong>
              {currentSim.action}
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">How CivicResolve Works</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">From Report to Resolution in Minutes</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Citizens report issues, Google Gemini AI classifies urgency, and departments resolve them transparently.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Submit Issue', desc: 'Snap a photo, describe the issue, or let GPS auto-locate.', icon: FileText, color: 'text-blue-600 bg-blue-50' },
            { step: '02', title: 'AI Categorization', desc: 'Gemini analyzes urgency, impact, and safety risks.', icon: BrainCircuit, color: 'text-indigo-600 bg-indigo-50' },
            { step: '03', title: 'Smart Dispatch', desc: 'Auto-routed to the specific municipal department team.', icon: Zap, color: 'text-amber-600 bg-amber-50' },
            { step: '04', title: 'Resolved & Verified', desc: 'Track updates in real-time until work is completed.', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <span className="text-2xl font-black text-slate-200">{item.step}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto bg-white border-t border-slate-100 py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              CR
            </div>
            <span className="text-sm font-bold text-slate-800">CivicResolve Platform</span>
            <span className="text-xs text-slate-400">© 2026 All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
              Citizen Dashboard
            </Link>
            <Link href="/report" className="hover:text-blue-600 transition-colors">
              Report Issue
            </Link>
            <Link href="/track" className="hover:text-blue-600 transition-colors">
              Track Status
            </Link>
            <Link href="/map" className="hover:text-blue-600 transition-colors">
              Issue Map
            </Link>
            <Link href="/admin" className="hover:text-blue-600 transition-colors">
              Admin Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
