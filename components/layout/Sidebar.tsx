'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  MapPin,
  Shield,
  Menu,
  X,
  Sparkles,
  Building2,
  TreePine,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/report', label: 'Report Issue', icon: PlusCircle },
  { href: '/track', label: 'Track Complaint', icon: Search },
  { href: '/map', label: 'Issue Map', icon: MapPin },
  { href: '/admin', label: 'Admin Panel', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        )}
      >
        <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
        <span>{label}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 p-4">
      {/* Brand Header */}
      <div className="px-3 py-4 mb-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/25">
            <Building2 size={22} className="text-white" />
          </div>
          <div>
            <div className="text-slate-900 font-extrabold text-xl tracking-tight leading-tight">CivicResolve</div>
            <div className="text-blue-600 text-xs font-semibold flex items-center gap-1">
              <Sparkles size={11} /> Smart City AI
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1.5 px-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      {/* Bottom Illustration Card: "A Greener & Cleaner City" */}
      <div className="mt-auto px-1 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100/70 p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
            <TreePine size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-800">A Greener & Cleaner City</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Report issues and watch our AI resolve them in real time.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-blue-200/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-slate-700">Demo Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-200"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} className="text-slate-700" /> : <Menu size={20} className="text-slate-700" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'lg:hidden fixed left-0 top-0 h-full w-64 z-40 transform transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
