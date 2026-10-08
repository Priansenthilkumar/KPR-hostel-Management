// src/components/Layout/Sidebar.jsx
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  Utensils,
  FileText,
  Building,
  ShieldCheck,
  Activity,
  FileSpreadsheet,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  Crown,
  ChefHat,
  Ticket,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';
import kprLogo from '../../assets/kprLogo.png';
import toast from 'react-hot-toast';
import Button from '../UI/Button';

export default function Sidebar({
  sidebarVisible = false,
  onClose,
  onHideSidebar,
  mobileOpen,
  onCloseMobile,
  onOpenComplaints,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Accordion state for expandable submenus
  const [openSubmenus, setOpenSubmenus] = useState({
    hostel_mgmt: false,
    hostel_schedule: false,
    hostel_records: false,
    mess_mgmt: false,
    cook_mgmt: false,
    mess_schedule: false,
    mess_records: false,
  });

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCloseDrawer = () => {
    if (onClose) onClose();
    if (onHideSidebar) onHideSidebar();
    if (onCloseMobile) onCloseMobile();
  };

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

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isHostelUser = user?.role === 'warden';
  const isMessUser = user?.role === 'mess_staff';
  const isSuperAdmin = user?.role === 'super_admin';

  // Role-based Navigation Structure
  const navSections = [
    // Super Admin Control Center Section
    ...(isSuperAdmin
      ? [
          {
            id: 'admin',
            type: 'item',
            label: 'Admin Control Center',
            icon: Crown,
            to: '/admin-home',
          },
        ]
      : []),

    // HOSTEL SECTION
    ...(!isMessUser
      ? [
          { id: 'hostel_header', type: 'label', label: 'HOSTEL' },
          { id: 'hostel_dashboard', type: 'item', label: 'Hostel Dashboard', icon: LayoutDashboard, to: '/hostel-dashboard' },
          {
            id: 'hostel_mgmt',
            type: 'group',
            label: 'Hostel Management',
            icon: Building,
            items: [
              { label: 'Create Gate Pass', to: '/hostel-gatepass', icon: Ticket },
              { label: 'Gate Pass Review', to: '/gatepass-review', icon: ShieldCheck },
            ],
          },
          {
            id: 'hostel_schedule',
            type: 'group',
            label: 'Hostel Schedule',
            icon: UserCheck,
            items: [
              { label: 'Log Shift / Remark', to: '/hostel-add-entry', icon: UserCheck },
            ],
          },
          {
            id: 'hostel_records',
            type: 'group',
            label: 'Hostel Records',
            icon: FileText,
            items: [
              { label: 'Hostel Logs', to: '/hostel-overview', icon: Activity },
            ],
          },
        ]
      : []),

    // MESS SECTION
    ...(!isHostelUser
      ? [
          { id: 'mess_header', type: 'label', label: 'MESS' },
          { id: 'mess_dashboard', type: 'item', label: 'Mess Dashboard', icon: LayoutDashboard, to: '/mess-dashboard' },
          {
            id: 'mess_mgmt',
            type: 'group',
            label: 'Food/Mess Management',
            icon: UtensilsCrossed,
            items: [
              { label: 'Food Maintenance', to: '/add-entry', icon: PlusCircle },
            ],
          },
          {
            id: 'cook_mgmt',
            type: 'group',
            label: 'Cook Management',
            icon: ChefHat,
            items: [
              { label: 'Cook Details', to: '/overview', icon: Users },
            ],
          },
          {
            id: 'mess_schedule',
            type: 'group',
            label: 'Mess Schedule',
            icon: Utensils,
            items: [
              { label: 'Mess Menu', to: '/menu', icon: Utensils },
            ],
          },
          {
            id: 'mess_records',
            type: 'group',
            label: 'Mess Records',
            icon: FileText,
            items: [
              { label: 'Mess Logs', to: '/overview', icon: BarChart2 },
            ],
          },
        ]
      : []),

    { id: 'actions_header', type: 'label', label: 'ACTIONS' },
    {
      id: 'complaints',
      type: 'action',
      label: 'Complaints',
      icon: MessageSquare,
      onClick: () => {
        if (onOpenComplaints) onOpenComplaints();
        else toast('Complaints channel open', { icon: '💬' });
      },
    },
    {
      id: 'reports',
      type: 'action',
      label: 'Reports',
      icon: FileSpreadsheet,
      onClick: handleExport,
    },
    {
      id: 'profile',
      type: 'action',
      label: 'My Profile',
      icon: User,
      onClick: () => {
        const targetPath = isSuperAdmin
          ? '/admin-home'
          : isHostelUser
          ? '/hostel-dashboard'
          : '/mess-dashboard';
        navigate(targetPath);
      },
      subtitle: user?.name
        ? `${user.name} (${isSuperAdmin ? 'Super Admin' : isHostelUser ? 'Hostel Warden' : 'Mess Staff'})`
        : 'User Profile Details',
    },
    {
      id: 'logout',
      type: 'action',
      label: 'Logout',
      icon: LogOut,
      isDanger: true,
      onClick: handleLogout,
      subtitle: 'Sign out of portal session',
    },
  ];

  const brandTitle = isHostelUser
    ? 'KPR Hostels'
    : isMessUser
    ? 'KPR Mess'
    : 'KPR Hostel & Mess';

  const brandSubtitle = isHostelUser
    ? 'HOSTEL WARDEN SYSTEM'
    : isMessUser
    ? 'MESS STAFF SYSTEM'
    : 'ADMIN SYSTEM';

  const sidebarContent = (
    <div
      className={`flex flex-col h-full select-none text-white border-r shadow-[20px_0_40px_rgba(0,0,0,0.5)] overflow-hidden w-[260px] transition-all duration-300 relative ${
        isSuperAdmin
          ? 'bg-[#040D12] border-teal-900/50'
          : 'bg-[#060D14] border-white/5'
      }`}
    >
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#52B74A]/15 blur-[70px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-600/10 blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 -left-10 w-32 h-32 bg-sky-500/10 blur-[50px] pointer-events-none rounded-full" />

      {/* ── Top KPR Logo & Branding + Hide Sidebar Toggle Button ── */}
      <div
        className={`h-20 px-4 flex items-center justify-between gap-2 border-b flex-shrink-0 relative z-10 ${
          isSuperAdmin ? 'bg-transparent border-teal-900/40' : 'bg-transparent border-white/10'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl p-1.5 shadow-lg flex items-center justify-center flex-shrink-0 border transition-all ${
              isSuperAdmin
                ? 'bg-gradient-to-br from-[#1c5362] to-[#0a232b] border-[#52B74A]/40 shadow-[#1c5362]/50'
                : 'bg-white/5 border-white/10 backdrop-blur-sm'
            }`}
          >
            <img src={kprLogo} alt="KPR Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-white leading-tight tracking-tight truncate flex items-center gap-1">
              <span>{brandTitle}</span>
              {isSuperAdmin && <Crown size={12} className="text-amber-400" />}
            </span>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-widest truncate flex items-center gap-1 mt-0.5 ${
                isSuperAdmin ? 'text-[#52B74A]' : 'text-slate-400'
              }`}
            >
              <Sparkles size={11} className={isSuperAdmin ? 'text-[#52B74A]' : 'text-slate-400'} />
              <span>{brandSubtitle}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCloseDrawer}
          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all active:scale-95 flex-shrink-0 cursor-pointer ${
            isSuperAdmin
              ? 'bg-teal-900/30 hover:bg-teal-800/60 text-[#52B74A] border-teal-900/50'
              : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
          }`}
          title="Close Sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── 260px Navigation Items List ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-sidebar-scroll relative z-10">
        {navSections.map((section) => {
          if (section.type === 'label') {
            return (
              <div key={section.id} className="px-3 pt-5 pb-1 flex items-center gap-2">
                <div className={`h-[1px] flex-1 ${isSuperAdmin ? 'bg-teal-900/40' : 'bg-white/5'}`} />
                <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] ${isSuperAdmin ? 'text-teal-500/70' : 'text-slate-500'}`}>
                  {section.label}
                </span>
                <div className={`h-[1px] flex-1 ${isSuperAdmin ? 'bg-teal-900/40' : 'bg-white/5'}`} />
              </div>
            );
          }

          const SectionIcon = section.icon;

          // Single Direct Item (Dashboard)
          if (section.type === 'item') {
            const isActive =
              location.pathname === section.to ||
              (section.to !== '/' && location.pathname === section.to);

            return (
              <NavLink
                key={section.id}
                to={section.to}
                onClick={handleCloseDrawer}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1C5362]/80 to-[#15424F]/80 text-white shadow-[0_8px_16px_-6px_rgba(28,83,98,0.5)] border border-[#52B74A]/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }`}
              >
                <SectionIcon size={19} strokeWidth={isActive ? 2.5 : 2} className={`flex-shrink-0 transition-colors duration-300 ${isActive ? 'text-[#52B74A]' : 'group-hover:text-emerald-400'}`} />
                <span className="truncate text-[13px]">{section.label}</span>
              </NavLink>
            );
          }

          // Expandable Submenu Group
          if (section.type === 'group') {
            const isOpen = openSubmenus[section.id];
            const isAnySubActive = section.items.some((item) => location.pathname === item.to);

            return (
              <div key={section.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(section.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group ${
                    isAnySubActive
                      ? 'bg-white/5 text-white border border-[#52B74A]/20 shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SectionIcon size={19} strokeWidth={isAnySubActive ? 2.5 : 2} className={`transition-colors duration-300 ${isAnySubActive ? 'text-[#52B74A]' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                    <span className="truncate text-[13px]">{section.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {/* Submenu Items */}
                {isOpen && (
                  <div className="space-y-1 pl-4 border-l border-white/10 ml-4">
                    {section.items.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = location.pathname === sub.to;

                      return (
                        <NavLink
                          key={sub.to + sub.label}
                          to={sub.to}
                          onClick={handleCloseDrawer}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                            isSubActive
                              ? 'bg-gradient-to-r from-[#1C5362] to-transparent text-white border-l-2 border-[#52B74A]'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                          }`}
                        >
                          <SubIcon size={15} strokeWidth={isSubActive ? 2.5 : 2} className={`flex-shrink-0 ${isSubActive ? 'text-[#52B74A]' : 'text-slate-500'}`} />
                          <span className="truncate text-[12.5px]">{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Action Items (Complaints, Reports, Profile, Logout)
          if (section.type === 'action') {
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  section.onClick();
                  handleCloseDrawer();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 text-left group cursor-pointer hover:translate-x-1 ${
                  section.isDanger
                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20 border border-transparent'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/10 border border-transparent'
                }`}
              >
                <SectionIcon
                  size={19}
                  strokeWidth={2.2}
                  className={`flex-shrink-0 ${
                    section.isDanger ? 'text-red-400' : 'text-sky-400'
                  }`}
                />
                <div className="flex flex-col min-w-0 text-left">
                  <span className="truncate text-[13px]">{section.label}</span>
                  {section.subtitle && (
                    <span
                      className={`text-[10px] font-semibold ${
                        section.isDanger ? 'text-red-400/80' : 'text-slate-400'
                      }`}
                    >
                      {section.subtitle}
                    </span>
                  )}
                </div>
              </button>
            );
          }

          return null;
        })}
      </div>

      {/* ── Bottom User Profile & Logout Section ── */}
      <div className="p-3 bg-black/20 backdrop-blur-md border-t border-white/5 flex-shrink-0 relative z-10">
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-extrabold text-white truncate leading-tight tracking-wide">
                {user?.name || (isHostelUser ? 'Hostel Warden' : isMessUser ? 'Mess Staff' : 'Super Admin')}
              </span>
              <span className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest truncate">
                {user?.role === 'super_admin'
                  ? 'Super Admin'
                  : isHostelUser
                  ? 'Hostel Warden'
                  : 'Mess Staff'}
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => {
              handleLogout();
              handleCloseDrawer();
            }}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors border border-red-500/30 flex-shrink-0 cursor-pointer"
            title="Logout"
          >
            <LogOut size={16} strokeWidth={2.2} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Slide-out Sidebar Drawer with Smooth Slide-In/Out */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] max-w-[85vw] z-50 transition-transform duration-300 ease-in-out ${
          sidebarVisible || mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
