// src/components/Layout/Footer.jsx
// KPRIET Official Colors: --darkBlue: #112547 | --green: #1B924B
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const location = useLocation();
  const { user } = useAuth();

  if (location.pathname === '/login') return null;

  const isSuperAdmin = user?.role === 'super_admin' || location.pathname.startsWith('/admin');
  const isHostel = user?.role === 'warden' || location.pathname.startsWith('/hostel');

  return (
    <footer
      className="w-full shrink-0 py-3 sm:py-4"
      style={{ background: '#112547', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] sm:text-xs">
        <div className="font-semibold text-center sm:text-left uppercase tracking-wider" style={{ color: '#1B924B', fontSize: '10px' }}>
          KPR Institute of Engineering and Technology &nbsp;·&nbsp;
          {isSuperAdmin ? 'Super Admin Command Center' : isHostel ? 'Hostel Management System' : 'Mess Management System'}
        </div>
        <div className="text-center sm:text-right" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()}{' '}
          <strong className="font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>KPRIET</strong>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
