// src/components/Layout/Header.jsx
// KPRIET Official Colors: --blue: #1B345F | --darkBlue: #112547 | --green: #1B924B
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  PlusCircle,
  Download,
  Sun,
  Moon,
  ChevronRight,
  Activity,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Ticket
} from 'lucide-react';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';

import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import kprLogo from '../../assets/kprLogo.png';
import toast from 'react-hot-toast';
import Button from '../UI/Button';

const BREADCRUMB_MAP = {
  '/': { title: 'Dashboard', page: 'Overview & Statistics' },
  '/admin-home': { title: 'Super Admin Home', page: 'Command Center' },
  '/mess-dashboard': { title: 'Mess Operations', page: 'Daily Meals & Food Stats' },
  '/menu': { title: 'Weekly Mess Menu', page: 'Schedule & Meal Roster' },
  '/add-entry': { title: 'Food Maintenance Entry', page: 'Log Meal Strength' },
  '/overview': { title: 'Mess Logs & Analytics', page: 'Cook & History Records' },
  '/hostel-dashboard': { title: 'Hostel Administration', page: 'Warden Command Center' },
  '/hostel-overview': { title: 'Hostel Logs', page: 'Duty Logs & Student Remarks' },
  '/hostel-add-entry': { title: 'Hostel Duty Entry', page: 'Log Shift / Remark' },
  '/hostel-gatepass': { title: 'Create Gate Pass', page: 'Student Departure Permit' },
  '/gatepass-review': { title: 'Gate Pass Review', page: 'Approve / Reject Permits' },
};

export default function Header({ sidebarVisible, onToggleSidebar, isDark, onToggleDark, onOpenComplaints }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const currentPath = location.pathname;
  const isEdit = currentPath.startsWith('/add-entry/') && currentPath !== '/add-entry';
  const isHostelUser = user?.role === 'warden';
  const isSuperAdmin = user?.role === 'super_admin';

  let breadcrumb = BREADCRUMB_MAP[currentPath];
  if (isEdit) breadcrumb = { title: 'Edit Meal Entry', page: 'Update Food Record' };
  else if (!breadcrumb) breadcrumb = { title: 'KPRIET Portal', page: 'Student Management' };

  useEffect(() => {
    const updateUnread = () => {
      try { setUnreadCount(notificationService.getNotifications().filter((n) => !n.read).length); }
      catch { setUnreadCount(0); }
    };
    updateUnread();
    window.addEventListener('kpr_notification_updated', updateUnread);
    window.addEventListener('storage', updateUnread);
    return () => {
      window.removeEventListener('kpr_notification_updated', updateUnread);
      window.removeEventListener('storage', updateUnread);
    };
  }, []);

  const handleExport = () => {
    try {
      const entries = storageService.getEntries();
      if (entries.length === 0) { toast.error('No records to export!'); return; }
      exportToExcel(entries);
      toast.success(`Exported ${entries.length} records to Excel!`, { icon: '📊' });
    } catch (err) { toast.error(err.message || 'Export failed'); }
  };

  const handleLogout = () => { logout(); toast.success('Logged out successfully'); navigate('/login'); };

  // KPRIET Official header: --blue: #1B345F background
  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center px-3 sm:px-5 justify-between transition-all duration-300"
      style={{
        background: 'linear-gradient(90deg, #1B345F 0%, #243D6E 50%, #1B345F 100%)',
        borderBottom: '3px solid #1B924B',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* ── Left: Toggle + Logo + Breadcrumb ── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-white transition-all active:scale-95 cursor-pointer flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          title={sidebarVisible ? 'Hide Sidebar' : 'Open Sidebar'}
        >
          {sidebarVisible ? <X size={19} strokeWidth={2.5} /> : <Menu size={19} strokeWidth={2.5} />}
        </button>

        {/* Logo + Brand name */}
        <div className="hidden sm:flex items-center gap-2.5 border-r pr-4 flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
          <img src={kprLogo} alt="KPRIET" className="w-7 h-7 object-contain bg-white rounded-lg p-0.5 shadow-xs" />
          <span className="text-xs font-bold tracking-tight text-white uppercase hidden md:inline">
            KPRIET PORTAL
          </span>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs truncate min-w-0">
          <span className="font-semibold flex-shrink-0" style={{ color: '#1B924B' }}>KPRIET</span>
          <ChevronRight size={13} className="text-slate-400 flex-shrink-0" />
          <span className="font-bold text-white text-xs sm:text-sm truncate">{breadcrumb.title}</span>
          <span className="hidden lg:inline-block text-[11px] font-normal text-slate-300 border-l pl-2 ml-1 truncate" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            {breadcrumb.page}
          </span>
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">

        {/* Sync pill */}
        <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium" style={{ background: 'rgba(27,146,75,0.2)', border: '1px solid rgba(27,146,75,0.4)', color: '#4DD47A' }}>
          <Activity size={11} className="animate-pulse" />
          <span>Sync Active</span>
        </div>

        {/* Complaints */}
        <button
          type="button"
          onClick={onOpenComplaints}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-white"
          style={{ background: 'rgba(25,144,155,0.25)', border: '1px solid rgba(25,144,155,0.4)' }}
          title="Complaints Box"
        >
          <MessageSquare size={14} strokeWidth={2} />
          <span className="hidden md:inline">Complaints</span>
        </button>

        {/* Quick Add */}
        {currentPath !== '/add-entry' && currentPath !== '/hostel-gatepass' && (
          <button
            type="button"
            onClick={() => navigate(isHostelUser ? '/hostel-gatepass' : '/add-entry')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-white"
            style={{ background: '#1B924B', border: '1px solid rgba(27,146,75,0.4)', boxShadow: '0 2px 8px rgba(27,146,75,0.3)' }}
          >
            {isHostelUser ? <Ticket size={14} /> : <PlusCircle size={14} />}
            <span className="hidden md:inline">{isHostelUser ? 'Gate Pass' : 'Add Entry'}</span>
          </button>
        )}

        {/* Export */}
        <button
          type="button"
          onClick={handleExport}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          title="Export Records"
        >
          <Download size={14} strokeWidth={2} style={{ color: '#1B924B' }} />
          <span className="hidden lg:inline">Export</span>
        </button>


        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={onToggleDark}
          className="p-2 rounded-lg text-white transition-all cursor-pointer active:scale-95"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? <Sun size={17} className="text-amber-300" /> : <Moon size={17} className="text-sky-300" />}
        </button>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((p) => !p)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg transition-all cursor-pointer active:scale-95"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs" style={{ background: '#1B924B' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'K'}
            </div>
            <span className="hidden xl:inline text-xs font-medium text-white max-w-[90px] truncate pr-1">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border p-2 z-50 animate-fade-in"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              onClick={() => setIsProfileOpen(false)}
            >
              <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-bold truncate">{user?.name || 'KPRIET User'}</p>
                <p className="text-[10px] font-medium uppercase mt-0.5" style={{ color: '#1B924B' }}>
                  {user?.role === 'super_admin' ? 'Super Admin' : isHostelUser ? 'Hostel Warden' : 'Mess Staff'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(isSuperAdmin ? '/admin-home' : isHostelUser ? '/hostel-dashboard' : '/mess-dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <User size={15} style={{ color: '#1B924B' }} />
                <span>My Dashboard</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 transition-colors cursor-pointer mt-1"
                onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
