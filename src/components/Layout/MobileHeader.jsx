// src/components/Layout/MobileHeader.jsx
// KPRIET Official Colors: --blue: #1B345F | --green: #1B924B
import { Menu, Sun, Moon, Crown } from 'lucide-react';
import kprLogo from '../../assets/kprLogo.png';
import { useAuth } from '../../context/AuthContext';

export default function MobileHeader({ onOpenSidebar, isDark, onToggleDark }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const portalSubtitle = isSuperAdmin
    ? 'Super Admin Center'
    : user?.role === 'warden'
    ? 'Hostel Warden Hub'
    : 'Mess Operations';

  return (
    <header
      className="sticky top-0 z-30 w-full px-3.5 py-2.5 flex items-center justify-between transition-all duration-300 md:hidden"
      style={{
        background: '#1B345F',
        borderBottom: '3px solid #1B924B',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}
    >
      {/* Left: KPRIET Brand */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg p-1 bg-white shadow-xs flex items-center justify-center flex-shrink-0">
          <img src={kprLogo} alt="KPRIET" className="w-full h-full object-contain" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-white leading-tight truncate flex items-center gap-1.5">
            <span>KPRIET PORTAL</span>
            {isSuperAdmin && (
              <span className="text-[9px] font-bold px-1.5 rounded flex items-center gap-0.5" style={{ background: '#F59E0B', color: '#1B1B1B' }}>
                <Crown size={9} strokeWidth={3} />
                ADMIN
              </span>
            )}
          </span>
          <span className="text-[9.5px] font-medium uppercase tracking-wider truncate" style={{ color: '#1B924B' }}>
            {portalSubtitle}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {onToggleDark && (
          <button
            type="button"
            onClick={onToggleDark}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun size={15} className="text-amber-300" /> : <Moon size={15} className="text-sky-300" />}
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSidebar}
          className="w-8 h-8 rounded-lg text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs"
          style={{ background: '#1B924B' }}
          title="Open Menu"
        >
          <Menu size={16} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}
