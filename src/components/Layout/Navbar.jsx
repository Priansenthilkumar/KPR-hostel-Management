// src/components/Layout/Navbar.jsx
import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  RotateCw,
  Bell,
  Home,
  BarChart2,
  PlusCircle,
  Download,
  UtensilsCrossed,
  Ticket,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import kprLogo from '../../assets/kprLogo.png';
import toast from 'react-hot-toast';

const messNavLinks = [
  { to: '/', label: 'Home', icon: Home, desc: 'Dashboard Hub' },
  { to: '/overview', label: 'Overview', icon: BarChart2, desc: 'Analytics & Logs' },
  { to: '/menu', label: 'Food Menu', icon: UtensilsCrossed, desc: 'Weekly Mess Schedule' },
  { to: '/tokens', label: 'Mess Token', icon: Ticket, desc: 'Generate & Print PDF' },
  { to: '/add-entry', label: 'Add Entry', icon: PlusCircle, desc: 'Log Daily Meals' },
];

const wardenNavLinks = [
  { to: '/hostel-dashboard', label: 'Home', icon: Home, desc: 'Hostel Dashboard Hub' },
  { to: '/hostel-overview', label: 'Overview', icon: BarChart2, desc: 'Analytics & Duty Logs' },
  { to: '/hostel-pass', label: 'Gate Pass', icon: Ticket, desc: 'Generate Outing Pass PDF' },
  { to: '/hostel-add-entry', label: 'Add Entry', icon: PlusCircle, desc: 'Log Duty / Remarks' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  if (location.pathname === '/login') {
    return null;
  }

  const activeNavLinks = user?.role === 'warden' ? wardenNavLinks : messNavLinks;

  const handleRefresh = () => {
    toast.success('Dashboard data refreshed!');
  };

  const handleExport = () => {
    try {
      const entries = storageService.getEntries();
      if (entries.length === 0) {
        toast.error('No records to export!');
        return;
      }
      exportToExcel(entries);
      toast.success(`Exported ${entries.length} records to Excel!`);
    } catch (err) {
      toast.error(err.message || 'Export failed');
    }
  };

  const closeDrawer = () => setIsMobileDrawerOpen(false);

  return (
    <>
      <nav className="navbar w-full flex flex-col justify-center bg-[#164350] border-b border-[#245767] shadow-md sticky top-0 z-50">
        {/* ── Main Header Bar ── */}
        <div className="max-w-[1280px] w-full mx-auto px-3.5 sm:px-6 min-h-16 sm:h-18 flex items-center justify-between gap-3">
          
          {/* Left: Mobile Hamburger Toggle + Brand Logo & Title */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden w-9.5 h-9.5 rounded-xl bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center border border-[#2B6F82] shadow-xs active:scale-95 transition-all"
              aria-label="Open Mobile Drawer"
            >
              <Menu size={22} strokeWidth={2.2} />
            </button>

            {/* Brand Logo & Title */}
            <div
              className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 select-none group"
              onClick={() => navigate(user?.role === 'warden' ? '/hostel-dashboard' : '/')}
            >
              <img
                src={kprLogo}
                alt="KPR Logo"
                className="h-9 sm:h-10.5 w-auto object-contain flex-shrink-0 bg-white/95 p-1 sm:p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col text-left justify-center">
                <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-white leading-tight tracking-tight whitespace-nowrap">
                  {user ? (user.role === 'warden' ? 'KPR HOSTELS' : 'KPR MESS') : 'KPR HOSTELS & MESS'}
                </h1>
                <span className="text-[10px] font-extrabold text-[#52B74A] leading-none uppercase tracking-wider">
                  {user ? (user.role === 'warden' ? 'Warden Portal' : 'Mess Operations') : 'Management Suite'}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[#123843] border border-[#235868] shadow-inner">
            {activeNavLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/' || to === '/hostel-management'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150 leading-none ${
                    isActive
                      ? 'bg-[#52B74A] text-white shadow-sm font-bold'
                      : 'text-[#B0D0D8] hover:bg-[#1D5060] hover:text-white'
                  }`
                }
              >
                <Icon size={15} strokeWidth={2.2} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleRefresh}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center transition-all border border-[#2B6F82] shadow-xs active:scale-95 flex-shrink-0"
              title="Refresh Data"
              aria-label="Refresh Data"
            >
              <RotateCw size={14} strokeWidth={2.2} />
            </button>

            <div className="relative flex-shrink-0 pr-1 sm:pr-0">
              <button
                onClick={() => toast('No new system notifications', { icon: '🔔' })}
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center transition-all border border-[#2B6F82] shadow-xs active:scale-95"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={14} strokeWidth={2.2} />
              </button>
              <span className="absolute top-0 right-1 sm:right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#52B74A] text-white text-[8px] sm:text-[9px] font-extrabold flex items-center justify-center shadow-xs pointer-events-none ring-1.5 ring-[#164350]">
                0
              </span>
            </div>

            <button
              onClick={handleExport}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#52B74A] hover:bg-[#44A03C] text-white text-[12.5px] font-bold shadow-sm transition-all active:scale-95 leading-none flex-shrink-0"
            >
              <Download size={14} strokeWidth={2.2} />
              <span>Export Excel</span>
            </button>

            {/* Auth User Profile Badge - Desktop Full Pill, Mobile Compact Avatar triggering left slidebar */}
            {user ? (
              <>
                {/* Desktop View */}
                <div className="hidden md:flex items-center gap-1.5 sm:gap-2 bg-[#123843] border border-[#235868] px-2 sm:px-2.5 py-1 rounded-xl text-xs text-white flex-shrink-0 shadow-xs">
                  <div
                    className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center text-[10px] sm:text-[10.5px] font-extrabold text-white flex-shrink-0"
                    style={{ backgroundColor: user.avatarBg }}
                  >
                    {user.role === 'warden' ? 'W' : 'M'}
                  </div>
                  <span className="font-bold text-[11px] sm:text-xs max-w-[140px] truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-[#B0D0D8] hover:text-red-400 transition-colors p-0.5 ml-0.5 flex-shrink-0"
                    title="Sign Out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3DA1D1] hover:bg-[#2C8EB8] text-white text-xs sm:text-[13px] font-bold shadow-sm transition-all active:scale-95 leading-none flex-shrink-0"
              >
                <LogIn size={14} strokeWidth={2.2} />
                <span>Login</span>
              </NavLink>
            )}
          </div>

        </div>
      </nav>

      {/* ── Mobile Side Sliding Drawer ── */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-[#123843] text-white h-full shadow-2xl flex flex-col justify-between z-10 border-r border-[#235868] animate-in slide-in-from-left duration-200">
            <div>
              <div className="p-5 border-b border-[#235868] flex items-center justify-between bg-[#164350]">
                <div className="flex items-center gap-3">
                  <img
                    src={kprLogo}
                    alt="KPR Logo"
                    className="h-11 sm:h-12 w-auto object-contain bg-white p-1 rounded-lg shadow-sm"
                  />
                  <div>
                    <h2 className="text-sm font-extrabold text-white leading-tight">
                      {user?.role === 'warden' ? 'KPR HOSTELS WARDEN' : 'KPR MESS MANAGEMENT'}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X size={18} strokeWidth={2.2} />
                </button>
              </div>

              {/* User Session Profile Box in Left Mobile Drawer */}
              {user ? (
                <div className="m-4 p-3.5 rounded-2xl bg-[#164350] border border-[#245767] flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm"
                      style={{ backgroundColor: user.avatarBg }}
                    >
                      {user.role === 'warden' ? 'W' : 'M'}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold block text-white">{user.name}</span>
                      <span className="text-[10px] font-semibold text-[#52B74A] block">{user.roleTitle}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      closeDrawer();
                      logout();
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-500/30"
                    title="Logout"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="m-4">
                  <NavLink
                    to="/login"
                    onClick={closeDrawer}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#52B74A] hover:bg-[#44A03C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <LogIn size={15} />
                    <span>Sign In to Portal</span>
                  </NavLink>
                </div>
              )}

              {/* Drawer Links */}
              <div className="px-3 py-2 flex flex-col gap-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#B0D0D8]/60 mb-1">
                  Navigation Menu
                </span>
                {activeNavLinks.map(({ to, label, icon: Icon, desc }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/' || to === '/hostel-management'}
                    onClick={closeDrawer}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#52B74A] text-white font-bold shadow-md'
                          : 'text-[#B0D0D8] hover:bg-[#1A4B5B] hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{label}</span>
                        <span className="text-[10px] opacity-75">{desc}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} opacity={0.6} />
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#235868] text-center text-[11px] text-[#B0D0D8]/70">
              KPR Hostel & Mess System v2.0
            </div>
          </div>
        </div>
      )}
    </>
  );
}
