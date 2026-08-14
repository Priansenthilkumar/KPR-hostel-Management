import { useState, useEffect } from 'react';
import { ShieldCheck, Mail, MapPin, Sparkles, Heart, Award } from 'lucide-react';
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
    <footer className="w-full bg-gradient-to-r from-[#0C242C] via-[#123843] to-[#0C242C] border-t border-white/10 text-white py-8 mt-auto shadow-2xl relative overflow-hidden">
      {/* Top Glowing Gradient Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#1C5362] via-[#52B74A] to-[#3DA1D1] absolute top-0 left-0 right-0" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#52B74A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#3DA1D1]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5 relative z-10">
        
        {/* Main Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 pb-5 border-b border-white/10 text-center lg:text-left">
          {/* Logo & Dynamic Title */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#52B74A] to-[#3DA1D1] rounded-xl blur-xs opacity-40 group-hover:opacity-80 transition duration-300"></div>
              <img
                src={kprLogo}
                alt="KPR Logo"
                className="relative h-10 sm:h-11 w-auto object-contain bg-white/95 p-1.5 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight tracking-tight flex items-center justify-center lg:justify-start gap-2 font-epic-pro">
                <span>
                  {isSuperAdmin
                    ? 'KPR EXECUTIVE ADMINISTRATION'
                    : isHostel
                      ? 'KPR HOSTELS MANAGEMENT'
                      : 'KPR MESS MANAGEMENT'}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#52B74A]/20 text-[#52B74A] border border-[#52B74A]/30 text-[10px] uppercase font-extrabold tracking-wider">
                  <Sparkles size={10} /> Live Platform
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

          {/* Quick Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-[#B0D0D8]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-xs">
              <MapPin size={14} className="text-[#52B74A]" />
              <span className="font-semibold text-white">Arasur, Coimbatore</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shadow-xs">
              <Mail size={14} className="text-[#3DA1D1]" />
              <span className="font-semibold text-white">{footerEmail}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-black shadow-xs">
              <ShieldCheck size={14} />
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

        {/* Gold Accent Footer Box & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-center sm:text-left">
          {/* Gold Accent Badge Box */}
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 shadow-xs flex items-center gap-2">
            <Award size={14} className="text-amber-400" />
            <p className="text-[11px] font-black text-amber-300 tracking-wide uppercase">
              {isSuperAdmin
                ? 'Created for Executive Admin by Super Admin Team'
                : isHostel
                  ? 'Created for KPR Hostels by Hostel Committee'
                  : 'Created for Hostel Mess by Hostel Committee'}
            </p>
          </div>

          <p className="text-[11.5px] text-[#8BB2BC] font-medium flex items-center gap-1.5">
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

