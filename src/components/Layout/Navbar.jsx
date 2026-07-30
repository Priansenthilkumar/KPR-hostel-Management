// src/components/Layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  RotateCw,
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
  Crown,
  Bug,
  Bell,
  BellRing,
  ChevronDown,
  UserCheck,
  Activity,
  Sliders,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import ComplaintBox from '../Dashboard/ComplaintBox';
import NotificationCenter from '../Notification/NotificationCenter';
import { notificationService } from '../../services/notificationService';
import kprLogo from '../../assets/kprLogo.png';
import toast from 'react-hot-toast';

const messNavLinks = [
  { to: '/', label: 'Home', icon: Home, desc: 'Dashboard Hub' },
  { to: '/overview', label: 'Overview', icon: BarChart2, desc: 'Analytics & Logs' },
  { to: '/menu', label: 'Food Menu', icon: UtensilsCrossed, desc: 'Weekly Mess Schedule' },
  { to: '/add-entry', label: 'Add Entry', icon: PlusCircle, desc: 'Log Daily Meals' },
];

const wardenNavLinks = [
  { to: '/hostel-dashboard', label: 'Home', icon: Home, desc: 'Hostel Dashboard Hub' },
  { to: '/hostel-overview', label: 'Overview', icon: BarChart2, desc: 'Analytics & Duty Logs' },
  { to: '/hostel-add-entry', label: 'Add Entry', icon: PlusCircle, desc: 'Log Duty / Remarks' },
];

const superAdminNavLinks = [
  { to: '/admin-home', label: 'Home', icon: Crown, desc: 'Common Admin Command Center' },
  { to: '/mess-dashboard', label: 'Mess Hub', icon: Home, desc: 'Mess Management Dashboard' },
  { to: '/hostel-dashboard', label: 'Hostel Hub', icon: ShieldCheck, desc: 'Hostel Warden Dashboard' },
  { to: '/overview', label: 'Mess Logs', icon: BarChart2, desc: 'Mess Analytics & Entries' },
  { to: '/hostel-overview', label: 'Hostel Logs', icon: BarChart2, desc: 'Duty Logs & Student Remarks' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Close profile dropdown on route change
  useEffect(() => {
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(() => {
    try {
      return notificationService.getNotifications().filter((n) => !n.read).length;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const updateUnread = () => {
      try {
        setUnreadNotifCount(notificationService.getNotifications().filter((n) => !n.read).length);
      } catch {
        setUnreadNotifCount(0);
      }
    };
    window.addEventListener('kpr_notification_updated', updateUnread);
    window.addEventListener('storage', updateUnread);
    return () => {
      window.removeEventListener('kpr_notification_updated', updateUnread);
      window.removeEventListener('storage', updateUnread);
    };
  }, []);

  if (location.pathname === '/login') {
    return null;
  }

  const activeNavLinks =
    user?.role === 'super_admin'
      ? superAdminNavLinks
      : user?.role === 'warden'
      ? wardenNavLinks
      : messNavLinks;

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
        <div className="max-w-[1400px] w-full mx-auto px-2 sm:px-4 lg:px-6 min-h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Left: Mobile Hamburger Toggle + Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center border border-[#2B6F82] shadow-xs active:scale-95 transition-all"
              aria-label="Open Mobile Drawer"
            >
              <Menu size={20} strokeWidth={2.2} />
            </button>

            {/* Brand Logo & Title */}
            <div
              className="flex items-center gap-2 cursor-pointer flex-shrink-0 select-none group mr-1 lg:mr-2"
              onClick={() => navigate(user?.role === 'super_admin' ? '/admin-home' : user?.role === 'warden' ? '/hostel-dashboard' : '/')}
            >
              <img
                src={kprLogo}
                alt="KPR Logo"
                className="h-8 sm:h-9 w-auto object-contain flex-shrink-0 bg-white/95 p-1 rounded-lg shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col text-left justify-center min-w-0">
                <h1 className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight whitespace-nowrap">
                  KPR HOSTELS & MESS
                </h1>
                <span className="text-[9px] sm:text-[9.5px] font-extrabold text-[#52B74A] leading-none uppercase tracking-wider hidden sm:block">
                  {user ? (user.role === 'super_admin' ? 'Super Admin Portal' : user.role === 'warden' ? 'Hostel Warden Portal' : 'Mess Operations') : 'Management Suite'}
                </span>
              </div>
            </div>
          </div>
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 p-0.5 sm:p-1 rounded-xl bg-[#123843] border border-[#235868] shadow-inner flex-shrink min-w-0">
            {activeNavLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/' || to === '/hostel-management' || to === '/admin-home'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] lg:text-[12px] xl:text-[12.5px] font-semibold transition-all duration-150 leading-none whitespace-nowrap ${
                    isActive
                      ? 'bg-[#52B74A] text-white shadow-sm font-bold'
                      : 'text-[#B0D0D8] hover:bg-[#1D5060] hover:text-white'
                  }`
                }
              >
                <Icon size={13} strokeWidth={2.2} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <button
              onClick={handleRefresh}
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center transition-all border border-[#2B6F82] shadow-xs active:scale-95 flex-shrink-0"
              title="Refresh Data"
              aria-label="Refresh Data"
            >
              <RotateCw size={12.5} strokeWidth={2.2} />
            </button>

            {/* Notification Bell — Super Admin Only */}
            {user?.role === 'super_admin' && (
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(true)}
                  className="p-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/35 transition-all shadow-xs"
                  title="Super Admin Notifications"
                >
                  {unreadNotifCount > 0 ? (
                    <BellRing size={14} className="text-amber-400 animate-bounce" />
                  ) : (
                    <Bell size={14} />
                  )}
                </button>
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center shadow-md pointer-events-none ring-1.5 ring-[#123843]">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={handleExport}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#52B74A] hover:bg-[#44A03C] text-white text-[11.5px] font-bold shadow-sm transition-all active:scale-95 leading-none flex-shrink-0"
            >
              <Download size={13} strokeWidth={2.2} />
              <span>Export Excel</span>
            </button>

            {/* SaaS Dashboard User Profile Card & Dropdown */}
            {user ? (
              <div className="relative hidden md:block flex-shrink-0">
                {/* Rectangular User Card */}
                <div
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="bg-[#123843]/90 hover:bg-[#184856] border border-[#235868]/80 hover:border-[#3A7E91] px-2.5 py-1.5 rounded-[15px] shadow-md hover:shadow-emerald-500/10 transition-all duration-200 hover:scale-[1.02] cursor-pointer flex items-center gap-2 select-none"
                  title="Account Settings & Options"
                >
                  {/* Left Minimalist Geometric Avatar Tile */}
                  <div className="relative w-7 h-7 rounded-xl bg-gradient-to-br from-[#52B74A]/25 via-emerald-600/30 to-teal-700/30 text-[#52B74A] border border-[#52B74A]/40 flex items-center justify-center flex-shrink-0 shadow-xs">
                    {user.role === 'super_admin' ? (
                      <Crown size={15} className="text-purple-300" />
                    ) : user.role === 'warden' ? (
                      <ShieldCheck size={15} className="text-sky-300" />
                    ) : (
                      <UtensilsCrossed size={14} className="text-[#52B74A]" />
                    )}
                    {/* Green Online Status Indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#123843] animate-pulse" />
                  </div>

                  {/* Name & Role Badge */}
                  <div className="flex flex-col text-left justify-center min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-[11.5px] lg:text-xs text-white truncate max-w-[70px] lg:max-w-[100px] xl:max-w-[125px] leading-tight">
                        {user.name}
                      </span>
                      {user.role === 'super_admin' ? (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40 whitespace-nowrap flex-shrink-0">
                          Super Admin
                        </span>
                      ) : user.role === 'warden' ? (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-sky-500/25 text-sky-300 border border-sky-500/40 whitespace-nowrap flex-shrink-0">
                          Warden
                        </span>
                      ) : (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 whitespace-nowrap flex-shrink-0">
                          Mess Staff
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subtle Dropdown Chevron Arrow */}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 flex-shrink-0 ${
                      isProfileDropdownOpen ? 'rotate-180 text-[#52B74A]' : 'text-[#B0D0D8]'
                    }`}
                  />
                </div>

                {/* Dropdown Menu Popover */}
                {isProfileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--bg-card)] text-[var(--text-primary)] rounded-2xl shadow-2xl border border-[var(--border)] p-2 z-50 animate-slide-up select-none">
                      
                      {/* Header User Card inside Dropdown */}
                      <div className="p-3 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border)] mb-1.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#52B74A]/20 to-purple-600/20 text-[#52B74A] border border-[#52B74A]/30 flex items-center justify-center flex-shrink-0">
                          {user.role === 'super_admin' ? (
                            <Crown size={18} className="text-purple-400" />
                          ) : (
                            <UserCheck size={18} className="text-[#52B74A]" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-xs text-[var(--text-primary)] truncate">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                            {user.email || (user.role === 'super_admin' ? 'admin@kpriet.ac.in' : `${user.role}@kpriet.ac.in`)}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9.5px] text-emerald-500 font-extrabold uppercase tracking-wider">
                              Active Online
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Actions List */}
                      <div className="flex flex-col gap-0.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            toast.success(`Active Session: ${user.name} (${user.role})`, { icon: '👤' });
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-left text-[var(--text-primary)]"
                        >
                          <User size={15} className="text-emerald-500" />
                          <span>Profile & Account Info</span>
                        </button>

                        {user?.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsNotifOpen(true);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-left text-[var(--text-primary)]"
                          >
                            <div className="flex items-center gap-2.5">
                              <Bell size={15} className="text-purple-400" />
                              <span>Live Notifications</span>
                            </div>
                            {unreadNotifCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black">
                                {unreadNotifCount}
                              </span>
                            )}
                          </button>
                        )}

                        {user?.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsComplaintOpen(true);
                            }}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-left text-red-400 hover:bg-red-500/10"
                          >
                            <Bug size={15} />
                            <span>App Complaints Desk</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate(user.role === 'super_admin' ? '/admin-home' : user.role === 'warden' ? '/hostel-overview' : '/overview');
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-left text-[var(--text-primary)]"
                        >
                          <Activity size={15} className="text-sky-400" />
                          <span>System Activity Log</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            toast.success('App Theme & Preferences Active', { icon: '⚙️' });
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-left text-[var(--text-primary)]"
                        >
                          <Sliders size={15} className="text-amber-400" />
                          <span>Preferences & Settings</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate('/login');
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-left text-sky-400 hover:bg-sky-500/10"
                        >
                          <ArrowRightLeft size={15} />
                          <span>Switch Role / Portal</span>
                        </button>

                        <div className="my-1 border-t border-[var(--border)]" />

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-left font-bold"
                        >
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
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
                      KPR HOSTELS & MESS
                    </h2>
                    <span className="text-[10px] font-extrabold text-[#52B74A] leading-none uppercase tracking-wider block mt-0.5">
                      {user?.role === 'super_admin'
                        ? 'Super Admin Portal'
                        : user?.role === 'warden'
                        ? 'Hostel Warden Portal'
                        : 'Mess Operations'}
                    </span>
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
                <div className="m-4 p-3 rounded-[15px] bg-[#164350] border border-[#245767] flex items-center justify-between gap-2 shadow-md">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#52B74A]/25 via-emerald-600/30 to-teal-700/30 text-[#52B74A] border border-[#52B74A]/40 flex items-center justify-center flex-shrink-0 shadow-xs">
                      {user.role === 'super_admin' ? (
                        <Crown size={18} className="text-purple-300" />
                      ) : user.role === 'warden' ? (
                        <ShieldCheck size={18} className="text-sky-300" />
                      ) : (
                        <UtensilsCrossed size={17} className="text-[#52B74A]" />
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#164350] animate-pulse" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-white truncate">{user.name}</span>
                        {user.role === 'super_admin' ? (
                          <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-500/40">
                            Admin
                          </span>
                        ) : user.role === 'warden' ? (
                          <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-sky-500/25 text-sky-300 border border-sky-500/40">
                            Warden
                          </span>
                        ) : (
                          <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                            Mess
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#B0D0D8] truncate font-medium mt-0.5">
                        {user.role === 'super_admin' ? 'Super Admin' : user.role === 'warden' ? 'Hostel Warden' : 'Mess Operations'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      closeDrawer();
                      logout();
                    }}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors flex-shrink-0"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
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

              {/* Super Admin Quick Switcher Bar in Mobile Drawer */}
              {user?.role === 'super_admin' && (
                <div className="mx-4 mb-3 p-1.5 rounded-2xl bg-purple-950/90 border border-purple-500/40 flex items-center justify-between gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      navigate('/admin-home');
                    }}
                    className={`flex-1 py-2 px-1 rounded-xl font-extrabold text-center transition-all ${
                      location.pathname === '/admin-home'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    Master Home
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      navigate('/mess-dashboard');
                    }}
                    className={`flex-1 py-2 px-1 rounded-xl font-extrabold text-center transition-all ${
                      location.pathname === '/mess-dashboard' || location.pathname.startsWith('/menu') || location.pathname.startsWith('/add-entry')
                        ? 'bg-[#52B74A] text-white shadow-xs'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    Mess Hub
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      navigate('/hostel-dashboard');
                    }}
                    className={`flex-1 py-2 px-1 rounded-xl font-extrabold text-center transition-all ${
                      location.pathname.startsWith('/hostel')
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    Hostel Hub
                  </button>
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

                {/* App Complaints & Bug Desk Drawer Button — Super Admin Only */}
                {user?.role === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      setIsComplaintOpen(true);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl transition-all text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 w-full mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                        <Bug size={18} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-extrabold text-white">App Complaints Desk</span>
                        <span className="text-[10px] text-red-300 opacity-90">View & Resolve User Reported Bugs</span>
                      </div>
                    </div>
                    <ChevronRight size={16} opacity={0.6} />
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#235868] text-center text-[11px] text-[#B0D0D8]/70">
              KPR Hostel & Mess System v2.0
            </div>
          </div>
        </div>
      )}

      {/* ── App Fault & Bug Resolution Desk Modal ── */}
      <ComplaintBox
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
      />

      {/* ── Super Admin Notification Center Drawer ── */}
      <NotificationCenter
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </>
  );
}
