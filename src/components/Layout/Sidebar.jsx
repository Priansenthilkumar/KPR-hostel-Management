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
  UserCheck,
  Users,
  BarChart2,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { exportToExcel } from '../../utils/exportExcel';
import { storageService } from '../../services/storage';
import kprLogo from '../../assets/kprLogo.png';
import toast from 'react-hot-toast';
import Button from '../UI/Button';

// KPRIET Official Colors from kpriet.ac.in:
// --blue: #1B345F | --darkBlue: #112547 | --green: #1B924B

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

  const [openSubmenus, setOpenSubmenus] = useState({
    hostel_mgmt: true,
    hostel_schedule: false,
    hostel_records: false,
    mess_mgmt: true,
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
      if (entries.length === 0) { toast.error('No records to export!'); return; }
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

  const navSections = [
    ...(isSuperAdmin ? [{ id: 'admin', type: 'item', label: 'Admin Control Center', icon: Crown, to: '/admin-home' }] : []),

    // HOSTEL SECTION
    ...(!isMessUser ? [
      { id: 'hostel_header', type: 'label', label: 'HOSTEL MANAGEMENT' },
      { id: 'hostel_dashboard', type: 'item', label: 'Hostel Dashboard', icon: LayoutDashboard, to: '/hostel-dashboard' },
      { id: 'hostel_mgmt', type: 'group', label: 'Gate Pass & Permits', icon: Building, items: [
        { label: 'Create Gate Pass', to: '/hostel-gatepass', icon: Ticket },
        { label: 'Gate Pass Review', to: '/gatepass-review', icon: ShieldCheck },
      ]},
      { id: 'hostel_schedule', type: 'group', label: 'Warden Duty Logs', icon: UserCheck, items: [
        { label: 'Log Duty / Remark', to: '/hostel-add-entry', icon: UserCheck },
      ]},
      { id: 'hostel_records', type: 'group', label: 'Hostel Records', icon: FileText, items: [
        { label: 'Hostel Logs & History', to: '/hostel-overview', icon: Activity },
      ]},
    ] : []),

    // MESS SECTION
    ...(!isHostelUser ? [
      { id: 'mess_header', type: 'label', label: 'MESS MANAGEMENT' },
      { id: 'mess_dashboard', type: 'item', label: 'Mess Dashboard', icon: LayoutDashboard, to: '/mess-dashboard' },
      { id: 'mess_mgmt', type: 'group', label: 'Food & Meal Operations', icon: UtensilsCrossed, items: [
        { label: 'Food Maintenance Log', to: '/add-entry', icon: PlusCircle },
      ]},
      { id: 'cook_mgmt', type: 'group', label: 'Cook Staff Roster', icon: ChefHat, items: [
        { label: 'Cook Details & Roster', to: '/overview', icon: Users },
      ]},
      { id: 'mess_schedule', type: 'group', label: 'Mess Food Menu', icon: Utensils, items: [
        { label: 'Weekly Mess Menu', to: '/menu', icon: Utensils },
      ]},
      { id: 'mess_records', type: 'group', label: 'Mess Records', icon: FileText, items: [
        { label: 'Mess Meal Analytics', to: '/overview', icon: BarChart2 },
      ]},
    ] : []),

    { id: 'actions_header', type: 'label', label: 'SYSTEM & ACTIONS' },
    { id: 'complaints', type: 'action', label: 'Complaints Box', icon: MessageSquare, onClick: () => { if (onOpenComplaints) onOpenComplaints(); else toast('Complaints channel open', { icon: '💬' }); } },
    { id: 'reports', type: 'action', label: 'Export Excel Reports', icon: FileSpreadsheet, onClick: handleExport },
    { id: 'profile', type: 'action', label: 'My Profile', icon: User, onClick: () => { navigate(isSuperAdmin ? '/admin-home' : isHostelUser ? '/hostel-dashboard' : '/mess-dashboard'); }, subtitle: user?.name ? `${user.name} (${isSuperAdmin ? 'Super Admin' : isHostelUser ? 'Hostel Warden' : 'Mess Staff'})` : 'User Profile Details' },
  ];

  const brandTitle = isHostelUser ? 'KPRIET Hostels' : isMessUser ? 'KPRIET Mess Hub' : 'KPRIET Portal';
  const brandSubtitle = isHostelUser ? 'HOSTEL WARDEN SYSTEM' : isMessUser ? 'MESS OPERATIONS' : 'SUPER ADMIN CENTER';

  const sidebarContent = (
    <div
      className="flex flex-col h-full select-none text-white overflow-hidden w-[270px] transition-all duration-300 relative"
      style={{ background: 'linear-gradient(180deg, #1B345F 0%, #112547 100%)', boxShadow: '2px 0 20px rgba(0,0,0,0.25)' }}
    >
      {/* Subtle top green accent line — matches kpriet.ac.in .top-dash color */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: '#1B924B' }} />

      {/* ── KPRIET Header ── */}
      <div className="px-4 py-4 flex items-center justify-between gap-2.5 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl p-1.5 bg-white shadow-md flex items-center justify-center flex-shrink-0">
            <img src={kprLogo} alt="KPRIET Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white leading-tight truncate flex items-center gap-1">
              <span>{brandTitle}</span>
              {isSuperAdmin && <Crown size={13} className="text-amber-300 flex-shrink-0" />}
            </span>
            <span className="text-[9.5px] font-semibold uppercase tracking-widest truncate mt-0.5" style={{ color: '#1B924B' }}>
              {brandSubtitle}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCloseDrawer}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 flex-shrink-0 cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
          title="Close Sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── User Role Strip ── */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2" style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#1B924B' }} />
          <span className="text-[11px] font-medium text-slate-200 truncate">
            {user?.name || 'KPRIET User'}
          </span>
        </div>
        <span
          className="text-[9px] font-bold uppercase px-2 py-0.5 rounded flex-shrink-0"
          style={{ background: 'rgba(27,146,75,0.2)', color: '#4DD47A', border: '1px solid rgba(27,146,75,0.35)' }}
        >
          {user?.role === 'super_admin' ? 'Admin' : isHostelUser ? 'Warden' : 'Mess Staff'}
        </span>
      </div>

      {/* ── Navigation ── */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 custom-sidebar-scroll">
        {navSections.map((section) => {
          if (section.type === 'label') {
            return (
              <div key={section.id} className="px-2 pt-4 pb-1 flex items-center gap-2">
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {section.label}
                </span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
              </div>
            );
          }

          const SectionIcon = section.icon;

          if (section.type === 'item') {
            const isActive = location.pathname === section.to;
            return (
              <NavLink
                key={section.id}
                to={section.to}
                onClick={handleCloseDrawer}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
                style={isActive ? {
                  background: '#1B924B',
                  boxShadow: '0 2px 10px rgba(27,146,75,0.35)',
                } : {
                  background: 'transparent',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <SectionIcon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                <span className="truncate">{section.label}</span>
              </NavLink>
            );
          }

          if (section.type === 'group') {
            const isOpen = openSubmenus[section.id];
            const isAnySubActive = section.items.some((item) => location.pathname === item.to);
            return (
              <div key={section.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(section.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                    isAnySubActive ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  style={{
                    background: isAnySubActive ? 'rgba(27,146,75,0.2)' : 'transparent',
                    border: isAnySubActive ? '1px solid rgba(27,146,75,0.3)' : '1px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SectionIcon size={18} strokeWidth={isAnySubActive ? 2.5 : 2} style={{ color: isAnySubActive ? '#1B924B' : '' }} className="flex-shrink-0" />
                    <span className="truncate">{section.label}</span>
                  </div>
                  {isOpen ? <ChevronDown size={15} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={15} className="text-slate-400 flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="space-y-0.5 pl-4 ml-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
                    {section.items.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = location.pathname === sub.to;
                      return (
                        <NavLink
                          key={sub.to + sub.label}
                          to={sub.to}
                          onClick={handleCloseDrawer}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all ${
                            isSubActive ? 'text-white' : 'text-slate-300 hover:text-white'
                          }`}
                          style={isSubActive ? {
                            background: 'rgba(27,146,75,0.25)',
                            borderLeft: '2px solid #1B924B',
                          } : {}}
                        >
                          <SubIcon size={15} strokeWidth={isSubActive ? 2.5 : 2} style={{ color: isSubActive ? '#1B924B' : '' }} className="flex-shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          if (section.type === 'action') {
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => { section.onClick(); handleCloseDrawer(); }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left cursor-pointer text-slate-300 hover:text-white"
                style={{ background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <SectionIcon size={18} strokeWidth={2} className="flex-shrink-0" style={{ color: '#3BB5DD' }} />
                <div className="flex flex-col min-w-0 text-left">
                  <span className="truncate">{section.label}</span>
                  {section.subtitle && (
                    <span className="text-[10px] font-normal text-slate-400 truncate">{section.subtitle}</span>
                  )}
                </div>
              </button>
            );
          }

          return null;
        })}
      </div>

      {/* ── Bottom User Session ── */}
      <div className="p-3 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-sm flex-shrink-0" style={{ background: '#1B924B' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'K'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate leading-tight">
                {user?.name || 'KPRIET Staff'}
              </span>
              <span className="text-[9px] font-medium uppercase tracking-wide truncate" style={{ color: '#1B924B' }}>
                {user?.role === 'super_admin' ? 'Super Admin' : isHostelUser ? 'Hostel Warden' : 'Mess Staff'}
              </span>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => { handleLogout(); handleCloseDrawer(); }}
            className="p-2 rounded-lg flex-shrink-0 cursor-pointer"
            style={{ background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.3)', color: '#FCA5A5' }}
            title="Logout"
          >
            <LogOut size={15} strokeWidth={2.2} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[270px] max-w-[85vw] z-50 transition-transform duration-300 ease-in-out ${
        sidebarVisible || mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {sidebarContent}
    </aside>
  );
}
