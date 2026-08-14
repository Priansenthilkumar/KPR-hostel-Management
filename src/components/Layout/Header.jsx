// src/components/Layout/Header.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, PlusCircle, Download, Sun, Moon, ChevronRight, Search, Activity, Sparkles } from 'lucide-react';
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
      toast.success(`Exported ${entries.length} records to Excel!`, { icon: '📊' });
    } catch (err) {
      toast.error(err.message || 'Export failed');
    }
  };

  return (
    <header
      className={`sticky top-0 z-20 h-16 bg-gradient-to-r from-[#0C242C]/90 via-[#123843]/90 to-[#0C242C]/90 border-b border-white/10 backdrop-blur-xl transition-all duration-300 flex items-center px-4 sm:px-6 justify-between shadow-md ${
        collapsed ? 'lg:pl-[88px]' : 'lg:pl-[301px]'
      }`}
    >
      {/* Left section: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/20 transition-colors shadow-xs"
          aria-label="Open sidebar"
        >
          <Menu size={18} strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-bold text-[#52B74A]">
            <Sparkles size={12} />
            <span>KPR Hostel</span>
          </span>
          <ChevronRight size={13} className="text-slate-400" />
          <span className="font-extrabold text-white">{breadcrumb.title}</span>
          <span className="hidden sm:inline-block text-[11px] text-slate-300 border-l border-white/15 pl-2 ml-1">
            {breadcrumb.page}
          </span>
        </div>
      </div>

      {/* Right section: Actions & Status */}
      <div className="flex items-center gap-2.5">
        {/* Status pill */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-[11px] font-extrabold">
          <Activity size={12} className="animate-pulse" />
          <span>Sync Active</span>
        </div>

        {/* Quick Add Entry Button */}
        {currentPath !== '/add-entry' && (
          <button
            onClick={() => navigate('/add-entry')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#52B74A] to-[#44A03C] hover:from-[#44A03C] hover:to-[#388E32] text-white text-xs font-bold shadow-md transition-all duration-150 active:scale-[0.98] border border-emerald-400/30"
          >
            <PlusCircle size={14} strokeWidth={2} />
            <span>Add Entry</span>
          </button>
        )}

        {/* Export Excel Button */}
        <button
          onClick={handleExport}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all duration-150 shadow-xs"
        >
          <Download size={14} strokeWidth={2} className="text-[#52B74A]" />
          <span className="hidden lg:inline">Export</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark theme"
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all shadow-xs"
        >
          {isDark ? <Sun size={17} className="text-[#52B74A]" /> : <Moon size={17} className="text-amber-400" />}
        </button>
      </div>
    </header>
  );
}

