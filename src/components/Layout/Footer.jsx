// src/components/Layout/Footer.jsx
import { ShieldCheck, Mail, MapPin, Sparkles, Award } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import kprLogo from '../../assets/kprLogo.png';

export default function Footer() {
  const location = useLocation();
  const { user } = useAuth();

  if (location.pathname === '/login') {
    return null;
  }

  const isSuperAdmin = user?.role === 'super_admin' || location.pathname.startsWith('/admin');
  const isHostel = user?.role === 'warden' || location.pathname.startsWith('/hostel');

  const footerEmail = isSuperAdmin
    ? 'superadmin@kpriet.ac.in'
    : isHostel
      ? 'hostel.committee@kpr.edu'
      : 'mess.committee@kpr.edu';

  return (
    <footer className="w-full shrink-0 bg-gradient-to-r from-[#0C242C] via-[#123843] to-[#0C242C] border-t border-white/10 text-white py-6 shadow-2xl relative overflow-hidden">
      {/* Top Glowing Gradient Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#1C5362] via-[#52B74A] to-[#3DA1D1] absolute top-0 left-0 right-0" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#52B74A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#3DA1D1]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1550px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 relative z-10">
        
        {/* ── Top Row ── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10 text-center lg:text-left">
          
          {/* Left: KPR logo + "KPR EXECUTIVE ADMINISTRATION" + subtitle */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#52B74A] to-[#3DA1D1] rounded-xl blur-xs opacity-40 group-hover:opacity-80 transition duration-300" />
              <img
                src={kprLogo}
                alt="KPR Logo"
                className="relative h-10 sm:h-11 w-auto object-contain bg-white/95 p-1.5 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col text-center sm:text-left">
              <h2 className="text-sm sm:text-base font-black text-white leading-tight tracking-tight flex items-center justify-center sm:justify-start gap-2">
                <span>
                  {isSuperAdmin
                    ? 'KPR EXECUTIVE ADMINISTRATION'
                    : isHostel
                      ? 'KPR HOSTELS MANAGEMENT'
                      : 'KPR MESS MANAGEMENT'}
                </span>
              </h2>
              <p className="text-[11.5px] text-[#B0D0D8] font-medium mt-0.5">
                {isSuperAdmin
                  ? 'Super Admin Master Control & Executive Operations Suite'
                  : isHostel
                    ? 'Hostel Block Administration & Warden Operations Suite'
                    : 'Hostel Mess Operations & Maintenance Platform'}
              </p>
            </div>
          </div>

          {/* Center: LIVE PLATFORM badge */}
          <div className="flex items-center justify-center flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52B74A]/20 text-[#52B74A] border border-[#52B74A]/30 text-[11px] uppercase font-black tracking-wider shadow-xs">
              <Sparkles size={12} className="animate-pulse" />
              <span>LIVE PLATFORM</span>
            </span>
          </div>

          {/* Right: Location, email, and Super Admin Verified badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 text-xs text-[#B0D0D8]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-xs">
              <MapPin size={13} className="text-[#52B74A]" />
              <span className="font-semibold text-white">Arasur, Coimbatore</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-xs">
              <Mail size={13} className="text-[#3DA1D1]" />
              <span className="font-semibold text-white">{footerEmail}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-black shadow-xs">
              <ShieldCheck size={13} />
              <span>
                {isSuperAdmin
                  ? 'Super Admin Verified'
                  : isHostel
                    ? 'Hostel Warden Verified'
                    : 'Hostel Mess Verified'}
              </span>
            </div>
          </div>

        </div>

        {/* ── Bottom Row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-center sm:text-left">
          {/* Left: Gold Accent Badge Box */}
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 shadow-xs flex items-center gap-2">
            <Award size={14} className="text-amber-400 flex-shrink-0" />
            <p className="text-[11px] font-black text-amber-300 tracking-wide uppercase">
              {isSuperAdmin
                ? 'CREATED FOR EXECUTIVE ADMIN BY SUPER ADMIN TEAM'
                : isHostel
                  ? 'CREATED FOR KPR HOSTELS BY HOSTEL COMMITTEE'
                  : 'CREATED FOR HOSTEL MESS BY HOSTEL COMMITTEE'}
            </p>
          </div>

          {/* Right: Copyright */}
          <p className="text-[11.5px] text-[#8BB2BC] font-medium flex items-center justify-center sm:justify-end gap-1.5">
            <span>© {new Date().getFullYear()}</span>
            <strong className="text-white font-extrabold">
              {isSuperAdmin ? 'KPR SUPER ADMIN' : isHostel ? 'KPR HOSTELS' : 'KPR MESS'}
            </strong>
            <span>— All rights reserved.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
