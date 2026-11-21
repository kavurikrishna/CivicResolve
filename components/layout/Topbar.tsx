'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Plus, X, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    if (q.toUpperCase().startsWith('CIV-')) {
      router.push(`/track?id=${q.toUpperCase()}`);
    } else {
      router.push(`/dashboard`);
    }
    setSearchOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100/80 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 transition-all">
      {/* Title or Global Search */}
      <div className="flex items-center gap-4 pl-12 lg:pl-0 flex-1">
        {title ? (
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs font-medium text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        ) : (
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full hidden sm:block">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              aria-label="Search complaints, IDs, areas"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(Boolean(e.target.value));
              }}
              onFocus={() => setSearchOpen(Boolean(searchQuery))}
              placeholder="Search complaints, IDs, areas... (Press '/' to focus)"
              className="w-full pl-9 pr-12 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-2xs"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              /
            </kbd>

            {/* Quick search popup */}
            {searchOpen && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-slide-up">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Quick Actions
                </div>
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/track?id=${searchQuery.toUpperCase()}`);
                    setSearchOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between text-slate-700 transition-colors"
                >
                  <span>Track ID: <strong>{searchQuery.toUpperCase()}</strong></span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {actions}

        {/* Live City Status Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-semibold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>City Grid: Normal</span>
        </div>

        {/* Time filter pill matching image */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs">
          <span>Last 30 days</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Report Button */}
        <Link
          href="/report"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/20 transition-all hover:scale-102"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Report Issue</span>
        </Link>

        {/* Notification Bell */}
        <div
          role="button"
          tabIndex={0}
          aria-label="View notifications"
          className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center cursor-pointer transition-colors"
        >
          <Bell size={16} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </div>

        {/* User Avatar / CivicResolve Citizen (CR) */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
          <div
            role="button"
            tabIndex={0}
            aria-label="CivicResolve citizen profile"
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
            title="CivicResolve Citizen"
          >
            CR
          </div>
        </div>
      </div>
    </header>
  );
}
