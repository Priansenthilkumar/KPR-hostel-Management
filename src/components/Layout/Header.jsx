// src/components/Layout/Header.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, PlusCircle, Download, Sun, Moon, ChevronRight, Search, Activity } from 'lucide-react';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';
import toast from 'react-hot-toast';

const BREADCRUMB_MAP = {
  '/': { title: 'Dashboard', page: 'Overview & Statistics' },
  '/add-entry': { title: 'Add Entry', page: 'Food Maintenance Log' },
  '/records': { title: 'Food Records', page: 'All Database Entries' },
};

export default function Header({
  collapsed,
  onOpenMobile,
  isDark,
  onToggleDark,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const isEdit = currentPath.startsWith('/add-entry/') && currentPath !== '/add-entry';
  
  let breadcrumb = BREADCRUMB_MAP[currentPath];
  if (isEdit) {
    breadcrumb = { title: 'Edit Entry', page: 'Update Record' };
  } else if (!breadcrumb) {
    breadcrumb = { title: 'Dashboard', page: 'Overview' };
  }

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

  return (
    <header
      className={`sticky top-0 z-20 h-16 bg-[var(--bg-header)] border-b border-[var(--border)] backdrop-blur-md transition-all duration-300 flex items-center px-4 sm:px-6 justify-between ${
        collapsed ? 'lg:pl-[88px]' : 'lg:pl-[301px]'
      }`}
    >
      {/* Left section: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors shadow-xs"
          aria-label="Open sidebar"
        >
          <Menu size={18} strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#52B74A]">KPR Hostel</span>
          <ChevronRight size={13} className="text-[var(--text-muted)]" />
          <span className="font-bold text-[var(--text-primary)]">{breadcrumb.title}</span>
          <span className="hidden sm:inline-block text-[11px] text-[var(--text-muted)] border-l border-[var(--border)] pl-2 ml-1">
            {breadcrumb.page}
          </span>
        </div>
      </div>

      {/* Right section: Actions & Status */}
      <div className="flex items-center gap-2.5">
        {/* Status pill */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
          <Activity size={12} className="animate-pulse" />
          <span>Sync Active</span>
        </div>

        {/* Quick Add Entry Button */}
        {currentPath !== '/add-entry' && (
          <button
            onClick={() => navigate('/add-entry')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#52B74A] hover:bg-[#44A03C] text-white text-xs font-semibold shadow-sm transition-all duration-150 active:scale-[0.98]"
          >
            <PlusCircle size={14} strokeWidth={2} />
            <span>Add Entry</span>
          </button>
        )}

        {/* Export Excel Button */}
        <button
          onClick={handleExport}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] text-xs font-semibold transition-all duration-150 shadow-xs"
        >
          <Download size={14} strokeWidth={2} className="text-[#52B74A]" />
          <span className="hidden lg:inline">Export</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark theme"
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all shadow-xs"
        >
          {isDark ? <Sun size={17} className="text-[#52B74A]" /> : <Moon size={17} className="text-amber-500" />}
        </button>
      </div>
    </header>
  );
}
