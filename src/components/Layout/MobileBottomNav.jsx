// src/components/Layout/MobileBottomNav.jsx
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  ShieldCheck,
  Menu,
  Crown,
  PlusCircle,
  Utensils,
  Building,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav({ onOpenSidebar }) {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const isSuperAdmin = user?.role === 'super_admin';
  const isHostelUser = user?.role === 'warden';

  // Role-specific bottom nav items (3 primary routes + 1 drawer menu trigger)
  let items = [];

  if (isSuperAdmin) {
    items = [
      { label: 'Control', to: '/admin-home', icon: Crown },
      { label: 'Mess Ops', to: '/mess-dashboard', icon: FileText },
      { label: 'Hostel Ops', to: '/hostel-dashboard', icon: Building },
    ];
  } else if (isHostelUser) {
    items = [
      { label: 'Dashboard', to: '/hostel-dashboard', icon: LayoutDashboard },
      { label: 'Pass Request', to: '/hostel-gatepass', icon: Ticket },
      { label: 'Review Pass', to: '/gatepass-review', icon: ShieldCheck },
    ];
  } else {
    // Mess staff
    items = [
      { label: 'Dashboard', to: '/mess-dashboard', icon: LayoutDashboard },
      { label: 'Food Entry', to: '/add-entry', icon: PlusCircle },
      { label: 'Mess Menu', to: '/menu', icon: Utensils },
    ];
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
        isSuperAdmin
          ? 'bg-[#120924]/96 backdrop-blur-2xl border-t border-purple-500/30 text-white shadow-[0_-8px_25px_rgba(124,58,237,0.35)]'
          : 'bg-[#0C242C]/95 backdrop-blur-xl border-t border-white/10 text-white shadow-[0_-8px_20px_rgba(0,0,0,0.4)]'
      }`}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 h-full px-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-white font-black'
                  : isSuperAdmin
                  ? 'text-purple-300/70 hover:text-purple-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                  isActive
                    ? isSuperAdmin
                      ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-950/80 ring-1 ring-amber-400/50 scale-105'
                      : 'bg-gradient-to-r from-[#52B74A] to-[#44A03C] text-white shadow-md shadow-emerald-900/40 scale-105'
                    : 'bg-transparent'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive && isSuperAdmin ? 'text-amber-300' : ''} />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? (isSuperAdmin ? 'font-black text-amber-200' : 'font-bold text-white') : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Menu Drawer Toggle Item */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className={`flex flex-col items-center justify-center flex-1 h-full px-1 transition-all cursor-pointer ${
            isSuperAdmin ? 'text-purple-300/70 hover:text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
              isSuperAdmin
                ? 'bg-purple-900/50 text-amber-300 border border-purple-500/30 shadow-xs'
                : 'bg-white/10 text-white'
            }`}
          >
            <Menu size={18} strokeWidth={2} />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-medium ${
              isSuperAdmin ? 'text-purple-200/80' : 'text-slate-300'
            }`}
          >
            More Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
