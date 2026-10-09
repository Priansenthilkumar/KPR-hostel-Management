// src/components/Layout/MobileBottomNav.jsx
// KPRIET Official Colors: --blue: #1B345F | --darkBlue: #112547 | --green: #1B924B
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, ShieldCheck, Menu, Crown, PlusCircle, Utensils, Building, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav({ onOpenSidebar }) {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const isSuperAdmin = user?.role === 'super_admin';
  const isHostelUser = user?.role === 'warden';

  let items = [];
  if (isSuperAdmin) {
    items = [
      { label: 'Control', to: '/admin-home', icon: Crown },
      { label: 'Mess Hub', to: '/mess-dashboard', icon: FileText },
      { label: 'Hostel Hub', to: '/hostel-dashboard', icon: Building },
    ];
  } else if (isHostelUser) {
    items = [
      { label: 'Dashboard', to: '/hostel-dashboard', icon: LayoutDashboard },
      { label: 'Gate Pass', to: '/hostel-gatepass', icon: Ticket },
      { label: 'Review', to: '/gatepass-review', icon: ShieldCheck },
    ];
  } else {
    items = [
      { label: 'Dashboard', to: '/mess-dashboard', icon: LayoutDashboard },
      { label: 'Add Entry', to: '/add-entry', icon: PlusCircle },
      { label: 'Menu', to: '/menu', icon: Utensils },
    ];
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden text-white"
      style={{
        background: '#1B345F',
        borderTop: '2px solid #1B924B',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.2)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center flex-1 h-full px-1 gap-0.5 transition-all duration-200 cursor-pointer"
              style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
            >
              <div
                className="flex items-center justify-center w-10 h-7 rounded-lg transition-all duration-200"
                style={isActive ? { background: '#1B924B', boxShadow: '0 2px 8px rgba(27,146,75,0.4)' } : {}}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] leading-none tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}
                style={{ color: isActive ? '#1B924B' : 'rgba(255,255,255,0.5)' }}>
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* More Menu */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center flex-1 h-full px-1 gap-0.5 transition-all cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <div className="flex items-center justify-center w-10 h-7 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <Menu size={18} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </div>
    </nav>
  );
}
