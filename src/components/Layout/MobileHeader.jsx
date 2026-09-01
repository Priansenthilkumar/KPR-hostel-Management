// src/components/Layout/MobileHeader.jsx
import { Sparkles, Menu, Sun, Moon, Crown } from 'lucide-react';
import kprLogo from '../../assets/kprLogo.png';
import { useAuth } from '../../context/AuthContext';

export default function MobileHeader({ onOpenSidebar, isDark, onToggleDark }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const portalSubtitle = isSuperAdmin
    ? 'Executive Super Admin'
    : user?.role === 'warden'
    ? 'Hostel Warden'
    : 'Mess Operations';

  return (
    <header
      className={`sticky top-0 z-30 w-full backdrop-blur-xl px-3 py-2.5 flex items-center justify-between transition-all duration-300 md:hidden ${
        isSuperAdmin
          ? 'bg-gradient-to-r from-[#180B2B]/98 via-[#2B1050]/98 to-[#130826]/98 border-b border-purple-500/30 shadow-[0_4px_20px_rgba(124,58,237,0.3)] text-white'
          : 'bg-[#0C242C]/95 border-b border-white/10 text-white shadow-md'
      }`}
    >
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-8.5 h-8.5 rounded-xl p-1 shadow-md flex items-center justify-center flex-shrink-0 transition-all ${
            isSuperAdmin
              ? 'bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 border border-amber-200/80 shadow-amber-900/40'
              : 'bg-white border border-white/20'
          }`}
        >
          <img src={kprLogo} alt="KPR Logo" className="w-full h-full object-contain" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black text-white leading-tight tracking-tight truncate flex items-center gap-1.5">
            <span>KPR HOSTELS & MESS</span>
            {isSuperAdmin && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs flex items-center gap-0.5">
                <Crown size={9} strokeWidth={3} />
                PRO
              </span>
            )}
          </span>
          <span
            className={`text-[9.5px] font-extrabold uppercase tracking-wider truncate flex items-center gap-1 ${
              isSuperAdmin ? 'text-amber-300' : 'text-white'
            }`}
          >
            {isSuperAdmin ? <Crown size={10} className="text-amber-400 animate-pulse" /> : <Sparkles size={9} />}
            <span>{portalSubtitle}</span>
          </span>
        </div>
      </div>

      {/* Right: Quick Actions (Theme Toggle & Sidebar Trigger) */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {onToggleDark && (
          <button
            type="button"
            onClick={onToggleDark}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
              isSuperAdmin
                ? 'bg-purple-950/60 hover:bg-purple-900/80 text-amber-300 border-purple-500/40'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={15} className="text-amber-300" /> : <Moon size={15} className="text-purple-200" />}
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSidebar}
          className={`w-8 h-8 rounded-lg text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            isSuperAdmin
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-md shadow-purple-900/50'
              : 'bg-[#52B74A] hover:bg-[#44A03C] shadow-xs'
          }`}
          title="Open Menu"
        >
          <Menu size={16} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
