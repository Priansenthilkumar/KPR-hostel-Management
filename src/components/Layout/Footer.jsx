// src/components/Layout/Footer.jsx
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const location = useLocation();
  const { user } = useAuth();

  if (location.pathname === '/login') {
    return null;
  }

  const isSuperAdmin = user?.role === 'super_admin' || location.pathname.startsWith('/admin');
  const isHostel = user?.role === 'warden' || location.pathname.startsWith('/hostel');

  return (
    <footer className="w-full shrink-0 bg-[#08181E] border-t border-white/10 text-slate-400 py-3 sm:py-4">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
        <div className="font-semibold text-center sm:text-left text-slate-300">
          {isSuperAdmin
            ? 'KPR EXECUTIVE ADMINISTRATION'
            : isHostel
              ? 'KPR HOSTELS MANAGEMENT'
              : 'KPR MESS MANAGEMENT'}
        </div>
        
        <div className="text-center sm:text-right">
          © {new Date().getFullYear()} <strong className="text-white font-bold">KPR Institute of Engineering and Technology</strong>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
