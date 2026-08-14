// src/components/Layout/Header.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  PlusCircle,
  Download,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  Activity,
  Bell,
  MessageSquare,
  Search,
} from 'lucide-react';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';
import NotificationCenter from '../Notification/NotificationCenter';
import { notificationService } from '../../services/notificationService';
import toast from 'react-hot-toast';

const BREADCRUMB_MAP = {
  '/': { title: 'Dashboard', page: 'Overview & Statistics' },
  '/admin-home': { title: 'Super Admin Home', page: 'Command Center' },
  '/mess-dashboard': { title: 'Mess Hub', page: 'Mess Operations' },
  '/menu': { title: 'Mess Menu', page: 'Weekly Food Schedule' },
  '/add-entry': { title: 'Add Entry', page: 'Food Maintenance Log' },
  '/overview': { title: 'Mess Logs', page: 'Food Analytics & History' },
  '/hostel-dashboard': { title: 'Hostel Hub', page: 'Warden Overview' },
  '/hostel-overview': { title: 'Hostel Logs', page: 'Duty Logs & Remarks' },
  '/hostel-add-entry': { title: 'Hostel Entry', page: 'Log Duty / Remarks' },
};

export default function Header({
  collapsed,
  onOpenMobile,
  isDark,
  onToggleDark,
  onOpenComplaints,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const currentPath = location.pathname;
  const isEdit = currentPath.startsWith('/add-entry/') && currentPath !== '/add-entry';

  let breadcrumb = BREADCRUMB_MAP[currentPath];
  if (isEdit) {
    breadcrumb = { title: 'Edit Entry', page: 'Update Record' };
  } else if (!breadcrumb) {
    breadcrumb = { title: 'Dashboard', page: 'System Overview' };
  }

  useEffect(() => {
    const updateUnread = () => {
      try {
        setUnreadCount(
          notificationService.getNotifications().filter((n) => !n.read).length
        );
      } catch {
        setUnreadCount(0);
      }
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
      if (entries.length === 0) {
        toast.error('No records to export!');
        return;
      }
      exportToExcel(entries);
      toast.success(`Exported ${entries.length} records to Excel!`, { icon: '📊' });
    } catch (err) {
      toast.error(err.message || 'Export failed');
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 h-16 bg-gradient-to-r from-[#0C242C]/95 via-[#123843]/95 to-[#0C242C]/95 border-b border-white/10 backdrop-blur-xl transition-all duration-300 flex items-center px-4 sm:px-6 justify-between shadow-md ${
        collapsed ? 'lg:pl-[88px]' : 'lg:pl-[266px]'
      }`}
    >
      {/* Left section: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/20 transition-colors shadow-xs active:scale-95"
          aria-label="Open sidebar"
        >
          <Menu size={18} strokeWidth={2.2} />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-extrabold text-[#52B74A]">
            <Sparkles size={13} />
            <span>KPR Hostel</span>
          </span>
          <ChevronRight size={13} className="text-slate-400" />
          <span className="font-extrabold text-white text-xs sm:text-sm">{breadcrumb.title}</span>
          <span className="hidden sm:inline-block text-[11px] text-slate-300 border-l border-white/15 pl-2 ml-1">
            {breadcrumb.page}
          </span>
        </div>
      </div>

      {/* Right section: Actions, Notifications & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status pill */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-[11px] font-extrabold">
          <Activity size={12} className="animate-pulse" />
          <span>Sync Active</span>
        </div>

        {/* Complaints Modal Trigger */}
        <button
          type="button"
          onClick={onOpenComplaints}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 text-xs font-bold transition-all"
          title="Open Complaints Box"
        >
          <MessageSquare size={14} strokeWidth={2} />
          <span className="hidden lg:inline">Complaints</span>
        </button>

        {/* Quick Add Entry Button */}
        {currentPath !== '/add-entry' && (
          <button
            type="button"
            onClick={() => navigate('/add-entry')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#52B74A] to-[#44A03C] hover:from-[#44A03C] hover:to-[#388E32] text-white text-xs font-bold shadow-md transition-all duration-150 active:scale-[0.98] border border-emerald-400/30"
          >
            <PlusCircle size={14} strokeWidth={2} />
            <span>Add Entry</span>
          </button>
        )}

        {/* Export Excel Button */}
        <button
          type="button"
          onClick={handleExport}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all duration-150 shadow-xs"
          title="Export Records to Excel"
        >
          <Download size={14} strokeWidth={2} className="text-[#52B74A]" />
          <span className="hidden lg:inline">Export</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all shadow-xs"
            title="Notifications"
          >
            <Bell size={17} strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#52B74A] text-white text-[9.5px] font-black flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationCenter onClose={() => setIsNotifOpen(false)} />
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={onToggleDark}
          aria-label="Toggle dark theme"
          className="p-2 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all shadow-xs"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun size={17} className="text-[#52B74A]" />
          ) : (
            <Moon size={17} className="text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
}
