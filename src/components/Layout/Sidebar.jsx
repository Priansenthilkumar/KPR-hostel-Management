// src/components/Layout/Sidebar.jsx
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  RotateCw,
  Lightbulb,
  Bell,
  Home,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  PlusCircle,
  FileText,
  FileSpreadsheet,
  GraduationCap,
  CalendarCheck,
  Utensils,
  BarChart3,
  BookOpen,
  UserCheck,
  Building,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';
import toast from 'react-hot-toast';

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  isDark,
  onToggleDark,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion toggle states
  const [openSections, setOpenSections] = useState({
    foodOps: true,
    academics: false,
    booking: false,
    reports: false,
    system: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRefresh = () => {
    toast.success('Refreshing dashboard data...');
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

  // Section categories matched to the institution screenshot style
  const sections = [
    {
      key: 'foodOps',
      title: 'Food Operations',
      icon: Utensils,
      items: [
        { to: '/', label: 'Dashboard Overview', icon: LayoutDashboard },
        { to: '/add-entry', label: '4.0 Daily Meal Entry Log', icon: PlusCircle },
        { to: '/records', label: 'Food Records Database', icon: FileText },
      ],
    },
    {
      key: 'academics',
      title: 'Academics & Mess',
      icon: GraduationCap,
      items: [
        { to: '/records?cat=strength', label: 'Hostel Student Strength', icon: UserCheck },
        { to: '/records?cat=timings', label: 'Mess Operating Timings', icon: BookOpen },
      ],
    },
    {
      key: 'booking',
      title: 'Booking Service',
      icon: CalendarCheck,
      items: [
        { to: '/add-entry', label: 'Special Meal Feast Booking', icon: PlusCircle },
        { to: '/records?cat=raw', label: 'Raw Material Requisition', icon: FileSpreadsheet },
      ],
    },
    {
      key: 'reports',
      title: 'IQAC & Analytics',
      icon: BarChart3,
      items: [
        { to: '/', label: 'Daily Wastage Analytics', icon: BarChart3 },
        { action: handleExport, label: 'Export Monthly Excel Audit', icon: FileSpreadsheet },
      ],
    },
    {
      key: 'system',
      title: 'User Service',
      icon: Building,
      items: [
        { action: onToggleDark, label: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme', icon: Lightbulb },
        { to: '/', label: 'KPR Maintenance Status', icon: ShieldCheck },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full select-none bg-[#164350] text-white border-r border-[#245767] shadow-xl overflow-hidden">
      
      {/* ── Top Circular Buttons Row (Exact match to screenshot top header) ── */}
      <div className="p-3 bg-[#123843] border-b border-[#245767] flex items-center justify-around flex-shrink-0">
        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="w-9 h-9 rounded-full bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center transition-transform active:scale-95 border border-[#2B6F82]"
          title="Refresh Data"
        >
          <RotateCw size={16} strokeWidth={2.2} />
        </button>

        {/* Theme Lightbulb */}
        <button
          onClick={onToggleDark}
          className="w-9 h-9 rounded-full bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center transition-transform active:scale-95 border border-[#2B6F82]"
          title="Toggle Theme"
        >
          <Lightbulb size={16} strokeWidth={2.2} className={isDark ? 'text-[#52B74A]' : 'text-amber-300'} />
        </button>

        {/* Notification Bell with 0 badge */}
        <div className="relative">
          <button
            onClick={() => toast('No new notifications', { icon: '🔔' })}
            className="w-9 h-9 rounded-full bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center transition-transform active:scale-95 border border-[#2B6F82]"
            title="Notifications"
          >
            <Bell size={16} strokeWidth={2.2} />
          </button>
          <span className="absolute -top-1 right-0 w-4 h-4 rounded-full bg-[#52B74A] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs">
            0
          </span>
        </div>

        {/* Home */}
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full bg-[#1C5362] hover:bg-[#256678] text-white flex items-center justify-center transition-transform active:scale-95 border border-[#2B6F82]"
          title="Go to Home"
        >
          <Home size={16} strokeWidth={2.2} />
        </button>

        {/* Green Status Circle Action */}
        <button
          onClick={onToggleCollapse}
          className="w-9 h-9 rounded-full bg-[#52B74A] hover:bg-[#44A03C] text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={17} strokeWidth={2.5} /> : <ShieldCheck size={17} strokeWidth={2.2} />}
        </button>
      </div>

      {/* ── Search Input (Exact match to screenshot search bar) ── */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-3 pr-9 rounded-md bg-[#11323B] border border-[#235868] text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:border-[#52B74A] transition-colors"
            />
            <Search size={15} className="absolute right-2.5 top-2.5 text-slate-300" strokeWidth={2.2} />
          </div>
        </div>
      )}

      {/* ── Accordion Menu Items List ── */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-sidebar-scroll">
        {sections.map((section) => {
          const SectionIcon = section.icon;
          const isOpen = openSections[section.key];
          
          // Filter items by search query if any
          const filteredItems = section.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && filteredItems.length === 0) return null;

          return (
            <div key={section.key} className="mb-1">
              {/* Category Header */}
              {!collapsed ? (
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-[#1C5362]/60 text-white font-bold text-[13.5px] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SectionIcon size={18} strokeWidth={2.2} className="text-white flex-shrink-0" />
                    <span className="truncate tracking-tight">{section.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={15} className="text-slate-300 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={15} className="text-slate-300 flex-shrink-0" />
                  )}
                </button>
              ) : (
                <div className="flex justify-center py-2 text-slate-300" title={section.title}>
                  <SectionIcon size={20} strokeWidth={2} />
                </div>
              )}

              {/* Sub-Items (Shown if expanded or searching) */}
              {(isOpen || searchQuery || collapsed) && (
                <div className={`mt-0.5 space-y-0.5 ${!collapsed ? 'pl-2' : ''}`}>
                  {filteredItems.map((item, idx) => {
                    const ItemIcon = item.icon;

                    if (item.to) {
                      const isActive =
                        location.pathname === item.to ||
                        (item.to !== '/' && location.pathname.startsWith(item.to));

                      return (
                        <NavLink
                          key={idx}
                          to={item.to}
                          onClick={onCloseMobile}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold transition-all duration-150 relative group ${
                            isActive
                              ? 'bg-[#52B74A] text-white shadow-sm font-bold'
                              : 'text-slate-100 hover:bg-[#1D5868] hover:text-white'
                          }`}
                        >
                          <ItemIcon size={16} strokeWidth={2.2} className="flex-shrink-0" />
                          {!collapsed && (
                            <span className="truncate leading-tight text-[12.5px]">{item.label}</span>
                          )}

                          {/* Hover Tooltip matching screenshot black tooltip style */}
                          {collapsed && (
                            <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#2B2B2B] text-white text-[11.5px] font-semibold rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-slate-700">
                              {item.label}
                            </div>
                          )}
                        </NavLink>
                      );
                    } else if (item.action) {
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            item.action();
                            onCloseMobile();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold text-slate-100 hover:bg-[#1D5868] hover:text-white transition-all text-left group relative"
                        >
                          <ItemIcon size={16} strokeWidth={2.2} className="flex-shrink-0 text-[#52B74A]" />
                          {!collapsed && (
                            <span className="truncate leading-tight text-[12.5px]">{item.label}</span>
                          )}
                          {collapsed && (
                            <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#2B2B2B] text-white text-[11.5px] font-semibold rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-slate-700">
                              {item.label}
                            </div>
                          )}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer Info ── */}
      {!collapsed && (
        <div className="p-3 bg-[#11323B] border-t border-[#245767] flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="truncate">KPR Food Maintenance</span>
          <span className="px-1.5 py-0.5 rounded bg-[#52B74A] text-white text-[9.5px] font-bold">
            v4.0
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Width expanded to 285px to fix any size truncation mistakes) */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 h-screen z-30 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-[285px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[285px] max-w-[85vw] h-full shadow-2xl z-10 animate-slide-in-left">
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={onCloseMobile}
                className="p-1 rounded bg-[#123843] text-white"
              >
                <X size={18} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
