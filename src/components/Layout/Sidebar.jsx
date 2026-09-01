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
  Users,
  UserCheck,
  ClipboardList,
  BarChart2,
  Activity,
  MessageSquare,
  FileSpreadsheet,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  Sparkles,
  PanelLeft,
  Crown,
  ChefHat,
  Ticket,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';
import kprLogo from '../../assets/kprLogo.png';
import toast from 'react-hot-toast';

export default function Sidebar({
  sidebarVisible = false,
  onClose,
  onHideSidebar,
  mobileOpen,
  onCloseMobile,
  onOpenComplaints,
  isDark,
  onToggleDark,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Accordion state for expandable submenus
  const [openSubmenus, setOpenSubmenus] = useState({
    admin: true,
    mess: true,
    hostel: true,
    logs: true,
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

  // Determine home dashboard target path based on user role
  const homePath =
    isSuperAdmin
      ? '/admin-home'
      : isHostelUser
      ? '/hostel-dashboard'
      : '/mess-dashboard';

  // Role-based Navigation Structure
  const navSections = [
    {
      id: 'dashboard',
      type: 'item',
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: homePath,
    },

    // Super Admin Control Center Section
    ...(isSuperAdmin
      ? [
          {
            id: 'admin',
            type: 'group',
            label: 'Super Admin Access',
            icon: Crown,
            items: [
              { label: 'Control Center', to: '/admin-home', icon: Crown },
              { label: 'Mess Menu Manager', to: '/menu', icon: Utensils },
              { label: 'Mess Operations', to: '/mess-dashboard', icon: FileText },
              { label: 'Hostel Operations', to: '/hostel-dashboard', icon: Building },
            ],
          },
        ]
      : []),

    // Mess Management — Hidden if Hostel Warden logged in
    ...(!isHostelUser
      ? [
          {
            id: 'mess',
            type: 'group',
            label: 'Mess Management',
            icon: UtensilsCrossed,
            items: [
              { label: 'Food Maintenance', to: '/add-entry', icon: PlusCircle },
              { label: 'Mess Menu', to: '/menu', icon: Utensils },
              { label: 'Mess Records', to: '/mess-dashboard', icon: FileText },
            ],
          },
        ]
      : []),

    // Hostel Management — Hidden if Mess Staff logged in
    ...(!isMessUser
      ? [
          {
            id: 'hostel',
            type: 'group',
            label: 'Hostel Management',
            icon: Building,
            items: [
              { label: 'Hostel Blocks', to: '/hostel-dashboard', icon: Building },
              { label: 'Create Gate Pass', to: '/hostel-gatepass', icon: Ticket },
              { label: 'Gate Pass Review', to: '/gatepass-review', icon: ShieldCheck },
              { label: 'Hostel Logs', to: '/hostel-overview', icon: FileText },
              { label: 'Log Shift / Remark', to: '/hostel-add-entry', icon: UserCheck },
            ],
          },
        ]
      : []),

    // Logs Section — Filtered by role
    {
      id: 'logs',
      type: 'group',
      label: 'Logs',
      icon: ClipboardList,
      items: [
        ...(!isHostelUser ? [{ label: 'Mess Logs', to: '/overview', icon: BarChart2 }] : []),
        ...(!isMessUser ? [{ label: 'Hostel Logs', to: '/hostel-overview', icon: Activity }] : []),
      ],
    },
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
      className={`flex flex-col h-full select-none text-white border-r shadow-2xl overflow-hidden w-[260px] transition-all duration-300 ${
        isSuperAdmin
          ? 'bg-gradient-to-b from-[#180B2B] via-[#2A104E] to-[#0E061B] border-purple-500/30'
          : 'bg-gradient-to-b from-[#0C242C] via-[#123843] to-[#091B22] border-white/10'
      }`}
    >
      {/* ── Top KPR Logo & Branding + Hide Sidebar Toggle Button ── */}
      <div
        className={`h-20 px-4 flex items-center justify-between gap-2 border-b flex-shrink-0 backdrop-blur-md ${
          isSuperAdmin ? 'bg-[#160A29]/90 border-purple-500/30' : 'bg-[#0A1F26]/70 border-white/10'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl p-1.5 shadow-md flex items-center justify-center flex-shrink-0 border transition-all ${
              isSuperAdmin
                ? 'bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 border-amber-200/80 shadow-amber-950/50'
                : 'bg-white border-white/20'
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
              className={`text-[10px] font-extrabold uppercase tracking-wider truncate flex items-center gap-1 mt-0.5 ${
                isSuperAdmin ? 'text-amber-300' : 'text-white'
              }`}
            >
              <Sparkles size={11} />
              <span>{brandSubtitle}</span>
            </span>
          </div>
        </div>

        {/* Close Sidebar Drawer Button */}
        <button
          type="button"
          onClick={handleCloseDrawer}
          className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all active:scale-95 flex-shrink-0 cursor-pointer ${
            isSuperAdmin
              ? 'bg-purple-900/50 hover:bg-purple-800/80 text-amber-300 border-purple-500/40'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
          }`}
          title="Close Sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── 260px Navigation Items List ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-sidebar-scroll">
        {navSections.map((section) => {
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#52B74A] to-[#44A03C] text-white shadow-lg shadow-emerald-900/30'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <SectionIcon size={19} strokeWidth={2.2} className="flex-shrink-0" />
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                    isAnySubActive
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SectionIcon size={19} strokeWidth={2.2} className={isAnySubActive ? 'text-[#52B74A]' : 'text-slate-300'} />
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
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                            isSubActive
                              ? 'bg-[#52B74A] text-white shadow-sm font-extrabold'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <SubIcon size={16} strokeWidth={2.2} className="flex-shrink-0" />
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left group cursor-pointer ${
                  section.isDanger
                    ? 'text-red-300 hover:bg-red-500/20 hover:text-red-200'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
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
      <div className="p-3 bg-[#08181E]/90 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-extrabold text-white truncate leading-tight">
                {user?.name || (isHostelUser ? 'Hostel Warden' : isMessUser ? 'Mess Staff' : 'Super Admin')}
              </span>
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider truncate">
                {user?.role === 'super_admin'
                  ? 'Super Admin'
                  : isHostelUser
                  ? 'Hostel Warden'
                  : 'Mess Staff'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              handleLogout();
              handleCloseDrawer();
            }}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors border border-red-500/30 flex-shrink-0 cursor-pointer"
            title="Logout"
          >
            <LogOut size={16} strokeWidth={2.2} />
          </button>
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
