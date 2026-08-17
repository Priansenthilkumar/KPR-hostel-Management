// src/components/Layout/MobileHeader.jsx
import { Sparkles, Menu, Sun, Moon } from 'lucide-react';
import kprLogo from '../../assets/kprLogo.png';
import { useAuth } from '../../context/AuthContext';

export default function MobileHeader({ onOpenSidebar, isDark, onToggleDark }) {
  const { user } = useAuth();

  const portalSubtitle =
    user?.role === 'super_admin'
      ? 'Executive Admin'
      : user?.role === 'warden'
      ? 'Hostel Warden'
      : 'Mess Operations';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0C242C]/95 backdrop-blur-xl border-b border-white/10 text-white px-3 py-2.5 flex items-center justify-between shadow-md md:hidden">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center flex-shrink-0 border border-white/20">
          <img src={kprLogo} alt="KPR Logo" className="w-full h-full object-contain" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black text-white leading-tight tracking-tight truncate">
            KPR HOSTELS & MESS
          </span>
          <span className="text-[9.5px] font-extrabold text-white uppercase tracking-wider truncate flex items-center gap-1">
            <Sparkles size={9} />
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
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition-all cursor-pointer active:scale-95"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={15} className="text-amber-300" /> : <Moon size={15} className="text-sky-200" />}
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSidebar}
          className="w-8 h-8 rounded-lg bg-[#52B74A] hover:bg-[#44A03C] text-white flex items-center justify-center shadow-xs transition-all cursor-pointer active:scale-95"
          title="Open Menu"
        >
          <Menu size={16} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
