import { useState, useEffect } from 'react';
import { ShieldCheck, Mail, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import kprLogo from '../../assets/kprLogo.png';

export default function Footer() {
  const location = useLocation();
  const { user } = useAuth();

  if (location.pathname === '/login') {
    return null;
  }

  const isHostel = user?.role === 'warden' || location.pathname.startsWith('/hostel');

  return (
    <footer className="w-full bg-[#164350] border-t border-[#245767] text-white py-5 mt-auto shadow-inner">
      <div className="max-w-[1280px] w-full mx-auto px-6 flex flex-col gap-4">
        
        {/* Main Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 border-b border-white/10 text-center md:text-left">
          {/* Logo & Dynamic Title */}
          <div className="flex items-center gap-3">
            <img
              src={kprLogo}
              alt="KPR Logo"
              className="h-9 w-auto object-contain bg-white p-1 rounded-lg shadow-xs flex-shrink-0"
            />
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                {isHostel ? 'KPR HOSTELS MANAGEMENT' : 'KPR MESS MANAGEMENT'}
              </h2>
              <p className="text-[11px] text-[#B0D0D8]">
                {isHostel
                  ? 'Hostel Block Administration & Warden Operations Portal'
                  : 'Hostel Mess Operations & Maintenance Portal'}
              </p>
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#B0D0D8]">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#52B74A]" />
              <span>Arasur, Coimbatore</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={13} className="text-[#52B74A]" />
              <span>{isHostel ? 'hostel.committee@kpr.edu' : 'mess.committee@kpr.edu'}</span>
            </span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#52B74A]/15 border border-[#52B74A]/30 text-[10.5px] font-bold text-[#52B74A]">
              <ShieldCheck size={12} />
              <span>{isHostel ? 'Hostel Warden Verified' : 'Hostel Mess Verified'}</span>
            </span>
          </div>
        </div>

        {/* Gold Accent Footer Box & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-center sm:text-left">
          {/* Gold Accent Badge Box */}
          <div className="px-3 py-1 rounded-xl bg-[#0F2D36] border border-amber-400/35 shadow-xs">
            <p className="text-[11px] font-bold text-amber-300 tracking-wide uppercase">
              {isHostel
                ? 'Created for KPR Hostels by Hostel Committee'
                : 'Created for Hostel Mess by Hostel Committee'}
            </p>
          </div>

          <p className="text-[11px] text-[#8BB2BC] font-medium">
            © {new Date().getFullYear()} {isHostel ? 'KPR HOSTELS' : 'KPR MESS'}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
