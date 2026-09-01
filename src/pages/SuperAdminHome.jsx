// src/pages/SuperAdminHome.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  ShieldCheck,
  Utensils,
  BarChart3,
  PlusCircle,
  Download,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  UserCheck,
  MessageSquare,
  Edit3,
  Trash2,
  Search,
  X,
  Save,
  RotateCcw,
  ChefHat,
  Building,
  Calendar,
  Filter,
  Check,
  Power,
  Phone,
  Layers,
} from 'lucide-react';
import { storageService } from '../services/storage';
import { hostelService } from '../services/hostelService';
import { adminManagementService } from '../services/adminManagementService';
import { days } from '../data/menuData';
import { exportToExcel } from '../utils/exportExcel';
import ComplaintBox from '../components/Dashboard/ComplaintBox';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

export default function SuperAdminHome() {
  const navigate = useNavigate();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // Active Control Center Tab: 'overview' | 'menu' | 'cooks' | 'blocks'
  const [activeTab, setActiveTab] = useState('overview');

  // Dynamic Live State
  const [messEntries, setMessEntries] = useState(() => storageService.getEntries());
  const [dutyLogs, setDutyLogs] = useState(() => hostelService.getDutyLogs());
  const [remarksList, setRemarksList] = useState(() => hostelService.getStudentRemarks());

  // Management State
  const [menuState, setMenuState] = useState(() => adminManagementService.getMenu());
  const [cooksList, setCooksList] = useState(() => adminManagementService.getCooks());
  const [blocksList, setBlocksList] = useState(() => adminManagementService.getBlocks());

  // ── 1. MESS MENU MANAGEMENT STATE ──
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [menuInputText, setMenuInputText] = useState('');

  // ── 2. COOK MANAGEMENT STATE ──
  const [cookSearch, setCookSearch] = useState('');
  const [cookFilterStatus, setCookFilterStatus] = useState('all');
  const [isCookModalOpen, setIsCookModalOpen] = useState(false);
  const [editingCookId, setEditingCookId] = useState(null);
  const [cookForm, setCookForm] = useState({
    name: '',
    specialty: '',
    shift: 'Morning',
    contact: '',
    status: 'Active',
  });

  // ── 3. HOSTEL BLOCK MANAGEMENT STATE ──
  const [blockSearch, setBlockSearch] = useState('');
  const [blockFilterType, setBlockFilterType] = useState('all');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [blockForm, setBlockForm] = useState({
    name: '',
    code: '',
    type: 'Boys Hostel',
    capacity: 200,
    rooms: 50,
    warden: '',
    status: 'Active',
  });

  const refreshAllData = useCallback(() => {
    setMessEntries(storageService.getEntries());
    setDutyLogs(hostelService.getDutyLogs());
    setRemarksList(hostelService.getStudentRemarks());
    setMenuState(adminManagementService.getMenu());
    setCooksList(adminManagementService.getCooks());
    setBlocksList(adminManagementService.getBlocks());
  }, []);

  useEffect(() => {
    window.addEventListener('kpr_data_updated', refreshAllData);
    window.addEventListener('kpr_menu_updated', refreshAllData);
    window.addEventListener('kpr_cooks_updated', refreshAllData);
    window.addEventListener('kpr_blocks_updated', refreshAllData);
    window.addEventListener('storage', refreshAllData);
    return () => {
      window.removeEventListener('kpr_data_updated', refreshAllData);
      window.removeEventListener('kpr_menu_updated', refreshAllData);
      window.removeEventListener('kpr_cooks_updated', refreshAllData);
      window.removeEventListener('kpr_blocks_updated', refreshAllData);
      window.removeEventListener('storage', refreshAllData);
    };
  }, [refreshAllData]);

  // Sync menu input text when day or meal changes
  useEffect(() => {
    const items = menuState[selectedDay]?.[selectedMeal] || [];
    setMenuInputText(items.join(', '));
  }, [selectedDay, selectedMeal, menuState]);

  // ── MENU HANDLERS ──
  const handleSaveMenu = (e) => {
    e.preventDefault();
    const newItems = menuInputText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (newItems.length === 0) {
      toast.error('Please enter at least one dish name.');
      return;
    }

    const updated = adminManagementService.updateMealItems(selectedDay, selectedMeal, newItems);
    setMenuState(updated);
    toast.success(`Updated ${selectedDay} ${selectedMeal} menu!`, { icon: '🍲' });
  };

  const handleResetMenuToDefault = () => {
    if (window.confirm('Reset the entire menu schedule to default campus menu?')) {
      const reset = adminManagementService.resetMenu();
      setMenuState(reset);
      toast.success('Food menu reset to default schedule!');
    }
  };

  const handleDeleteMenuItem = (day, meal, item) => {
    const updated = adminManagementService.deleteMealItem(day, meal, item);
    setMenuState(updated);
    toast.success(`Removed ${item} from ${day} ${meal}`);
  };

  // ── COOK HANDLERS ──
  const handleOpenAddCook = () => {
    setEditingCookId(null);
    setCookForm({
      name: '',
      specialty: '',
      shift: 'Morning',
      contact: '',
      status: 'Active',
    });
    setIsCookModalOpen(true);
  };

  const handleOpenEditCook = (cook) => {
    setEditingCookId(cook.id);
    setCookForm({
      name: cook.name || '',
      specialty: cook.specialty || '',
      shift: cook.shift || 'Morning',
      contact: cook.contact || '',
      status: cook.status || 'Active',
    });
    setIsCookModalOpen(true);
  };

  const handleSaveCook = (e) => {
    e.preventDefault();
    if (!cookForm.name.trim()) {
      toast.error('Cook name is required');
      return;
    }

    if (editingCookId) {
      adminManagementService.updateCook(editingCookId, cookForm);
      toast.success(`Updated cook ${cookForm.name}`);
    } else {
      adminManagementService.addCook(cookForm);
      toast.success(`Added new cook ${cookForm.name}`);
    }

    setIsCookModalOpen(false);
    setCooksList(adminManagementService.getCooks());
  };

  const handleToggleCookStatus = (cook) => {
    const newStatus = cook.status === 'Active' ? 'Inactive' : 'Active';
    adminManagementService.updateCook(cook.id, { status: newStatus });
    toast.success(`${cook.name} marked as ${newStatus}`);
    setCooksList(adminManagementService.getCooks());
  };

  const handleDeleteCook = (cook) => {
    if (window.confirm(`Delete cook profile for ${cook.name}?`)) {
      adminManagementService.deleteCook(cook.id);
      toast.success(`Deleted ${cook.name}`);
      setCooksList(adminManagementService.getCooks());
    }
  };

  const filteredCooks = useMemo(() => {
    return cooksList.filter((c) => {
      const q = cookSearch.toLowerCase().trim();
      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        (c.specialty && c.specialty.toLowerCase().includes(q)) ||
        (c.shift && c.shift.toLowerCase().includes(q));

      const matchStatus =
        cookFilterStatus === 'all' || c.status.toLowerCase() === cookFilterStatus.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [cooksList, cookSearch, cookFilterStatus]);

  // ── BLOCK HANDLERS ──
  const handleOpenAddBlock = () => {
    setEditingBlockId(null);
    setBlockForm({
      name: '',
      code: '',
      type: 'Boys Hostel',
      capacity: 200,
      rooms: 50,
      warden: '',
      status: 'Active',
    });
    setIsBlockModalOpen(true);
  };

  const handleOpenEditBlock = (block) => {
    setEditingBlockId(block.id);
    setBlockForm({
      name: block.name || '',
      code: block.code || '',
      type: block.type || 'Boys Hostel',
      capacity: block.capacity || 200,
      rooms: block.rooms || 50,
      warden: block.warden || '',
      status: block.status || 'Active',
    });
    setIsBlockModalOpen(true);
  };

  const handleSaveBlock = (e) => {
    e.preventDefault();
    if (!blockForm.name.trim()) {
      toast.error('Block name is required');
      return;
    }

    if (editingBlockId) {
      adminManagementService.updateBlock(editingBlockId, blockForm);
      toast.success(`Updated block ${blockForm.name}`);
    } else {
      adminManagementService.addBlock(blockForm);
      toast.success(`Added new hostel block ${blockForm.name}`);
    }

    setIsBlockModalOpen(false);
    setBlocksList(adminManagementService.getBlocks());
  };

  const handleToggleBlockStatus = (block) => {
    const newStatus = block.status === 'Active' ? 'Maintenance' : 'Active';
    adminManagementService.updateBlock(block.id, { status: newStatus });
    toast.success(`${block.name} status updated to ${newStatus}`);
    setBlocksList(adminManagementService.getBlocks());
  };

  const handleDeleteBlock = (block) => {
    if (window.confirm(`Delete hostel block ${block.name}?`)) {
      adminManagementService.deleteBlock(block.id);
      toast.success(`Deleted block ${block.name}`);
      setBlocksList(adminManagementService.getBlocks());
    }
  };

  const filteredBlocks = useMemo(() => {
    return blocksList.filter((b) => {
      const q = blockSearch.toLowerCase().trim();
      const matchSearch =
        b.name.toLowerCase().includes(q) ||
        (b.code && b.code.toLowerCase().includes(q)) ||
        (b.warden && b.warden.toLowerCase().includes(q));

      const matchType =
        blockFilterType === 'all' ||
        (blockFilterType === 'boys' && b.type.toLowerCase().includes('boys')) ||
        (blockFilterType === 'girls' && b.type.toLowerCase().includes('girls')) ||
        (blockFilterType === 'dorm' && b.type.toLowerCase().includes('dorm')) ||
        (blockFilterType === 'pg' && b.type.toLowerCase().includes('international'));

      return matchSearch && matchType;
    });
  }, [blocksList, blockSearch, blockFilterType]);

  const handleExportFullAudit = () => {
    try {
      if (messEntries.length === 0) {
        toast.error('No mess entries to export!');
        return;
      }
      exportToExcel(messEntries);
      toast.success('Exported Executive Audit Report to Excel!', { icon: '📊' });
    } catch (err) {
      toast.error(err.message || 'Export failed');
    }
  };

  return (
    <div className="super-admin-home max-w-[1500px] w-full mx-auto pt-2 sm:pt-4 pb-12 flex flex-col gap-5 sm:gap-6 page-enter">
      
      {/* ── Executive Super Admin Master Command Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-[#164350] to-[#0E2730] max-md:from-[#1F0B3D] max-md:via-[#2D0F50] max-md:to-[#130726] text-white p-5 sm:p-8 shadow-2xl border border-purple-500/40">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-purple-600/20 max-md:bg-purple-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#52B74A]/15 max-md:bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center text-center lg:text-left justify-between gap-6">
          <div className="max-w-2xl flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 max-md:bg-amber-500/20 border border-purple-400/30 max-md:border-amber-400/40 text-xs font-extrabold text-purple-300 max-md:text-amber-300 mb-3 backdrop-blur-xs">
              <Crown size={15} className="text-purple-300 max-md:text-amber-400" />
              <span>SUPER ADMIN EXECUTIVE CONTROL CENTER</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
              Executive Administration Suite
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#B0D0D8] max-md:text-purple-200/80 leading-relaxed max-w-xl">
              Full master CRUD authority over <strong>Mess Menu Schedule</strong>, <strong>Cook Assignments</strong>, and <strong>Hostel Block Infrastructure</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button
              variant="success"
              size="md"
              onClick={handleExportFullAudit}
              className="shadow-lg text-xs font-extrabold flex items-center gap-2 max-md:bg-gradient-to-r max-md:from-purple-600 max-md:to-indigo-600 max-md:border max-md:border-purple-400/40"
            >
              <Download size={15} />
              <span>Export Audit Report</span>
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => setIsComplaintModalOpen(true)}
              className="shadow-lg text-xs bg-red-600 hover:bg-red-500 text-white font-extrabold flex items-center gap-2"
            >
              <AlertCircle size={15} />
              <span>Complaints Box</span>
            </Button>
          </div>
        </div>
      </div>

      <ComplaintBox
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />

      {/* ── Control Center Mode Tabs ── */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-[#123843]/40 max-md:bg-[#1B0E33]/90 border border-white/10 max-md:border-purple-500/30 backdrop-blur-md overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 scale-102'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Crown size={16} />
            <span>Master Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#52B74A] text-white shadow-lg shadow-emerald-900/40 scale-102'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Utensils size={16} />
            <span>Menu Management</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cooks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'cooks'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 scale-102'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ChefHat size={16} />
            <span>Cook Roster ({cooksList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blocks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'blocks'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40 scale-102'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Building size={16} />
            <span>Hostel Infrastructure ({blocksList.length})</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
         TAB 1: MASTER OVERVIEW
      ═══════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Live Executive Metrics Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="card p-4 sm:p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase text-[var(--text-muted)] tracking-wider truncate">
                  Mess Records
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#52B74A]/20 to-emerald-600/20 text-[#52B74A] flex items-center justify-center font-bold flex-shrink-0">
                  <Utensils size={18} />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tabular-nums mt-2">
                {messEntries.length}
              </span>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-semibold mt-0.5 truncate">Logged meal entries</p>
            </div>

            <div className="card p-4 sm:p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase text-[var(--text-muted)] tracking-wider truncate">
                  Active Cooks
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">
                  <ChefHat size={18} />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-amber-500 tabular-nums mt-2">
                {cooksList.filter((c) => c.status === 'Active').length}
              </span>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-semibold mt-0.5 truncate">Assigned kitchen chefs</p>
            </div>

            <div className="card p-4 sm:p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase text-[var(--text-muted)] tracking-wider truncate">
                  Hostel Blocks
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 text-sky-500 flex items-center justify-center font-bold flex-shrink-0">
                  <Building size={18} />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-sky-500 tabular-nums mt-2">
                {blocksList.length}
              </span>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-semibold mt-0.5 truncate">Campus hostel blocks</p>
            </div>

            <div className="card p-4 sm:p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase text-[var(--text-muted)] tracking-wider truncate">
                  Total Capacity
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 text-purple-500 flex items-center justify-center font-bold flex-shrink-0">
                  <Users size={18} />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-purple-500 tabular-nums mt-2">
                {blocksList.reduce((acc, b) => acc + (Number(b.capacity) || 0), 0)}
              </span>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-semibold mt-0.5 truncate">Student bed capacity</p>
            </div>
          </div>

          {/* Super Admin Control Launchpad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div
              onClick={() => setActiveTab('menu')}
              className="card p-6 rounded-3xl border border-[var(--border)] hover:border-[#52B74A] shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#52B74A]/15 text-[#52B74A] flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                  <Utensils size={24} />
                </div>
                <h3 className="text-lg font-black text-[var(--text-primary)]">Menu Management</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed font-medium">
                  Add, edit, or remove breakfast, lunch, and dinner food items for any day of the week.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-extrabold text-[#52B74A]">
                <span>Manage Food Menu</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('cooks')}
              className="card p-6 rounded-3xl border border-[var(--border)] hover:border-amber-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                  <ChefHat size={24} />
                </div>
                <h3 className="text-lg font-black text-[var(--text-primary)]">Cook Roster</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed font-medium">
                  Add new cooks, edit specialty & shift details, and activate or deactivate kitchen staff.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-extrabold text-amber-500">
                <span>Manage Cook Roster</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('blocks')}
              className="card p-6 rounded-3xl border border-[var(--border)] hover:border-sky-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-500 flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                  <Building size={24} />
                </div>
                <h3 className="text-lg font-black text-[var(--text-primary)]">Hostel Infrastructure</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed font-medium">
                  Add new hostel blocks, edit wardens & room capacity, filter blocks, and update statuses.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-extrabold text-sky-500">
                <span>Manage Hostel Blocks</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
         TAB 2: MESS MENU MANAGEMENT
      ═══════════════════════════════════════ */}
      {activeTab === 'menu' && (
        <div className="card p-5 sm:p-8 rounded-3xl border border-[var(--border)] shadow-md flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#52B74A]/15 text-[#52B74A] flex items-center justify-center font-bold flex-shrink-0">
                <Utensils size={20} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Mess Menu Management</h2>
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  Select day and meal type to add, edit, or remove menu dishes.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetMenuToDefault}
              className="text-xs font-bold flex items-center gap-1.5 text-amber-500 border-amber-500/40 hover:bg-amber-500/10 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Default Schedule</span>
            </Button>
          </div>

          {/* Interactive Day Pill Selector */}
          <div>
            <span className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider block mb-2">
              1. Select Day of Week:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDay === d
                      ? 'bg-[#52B74A] text-white shadow-md shadow-emerald-900/30'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Type Pill Selector */}
          <div>
            <span className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider block mb-2">
              2. Select Meal Type:
            </span>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { type: 'Breakfast', label: 'Breakfast', sub: '7:30 AM - 9:00 AM' },
                { type: 'Lunch', label: 'Lunch', sub: '12:30 PM - 2:00 PM' },
                { type: 'Dinner', label: 'Dinner', sub: '7:30 PM - 9:00 PM' },
              ].map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setSelectedMeal(m.type)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col ${
                    selectedMeal === m.type
                      ? 'bg-[#52B74A]/10 border-[#52B74A] text-[#52B74A] ring-2 ring-[#52B74A]/30'
                      : 'bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-secondary)] hover:border-slate-400'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black">{m.label}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5 truncate">{m.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSaveMenu} className="flex flex-col gap-4 pt-2 border-t border-[var(--border)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                  Menu Items for {selectedDay} — {selectedMeal}
                </label>
                <span className="text-[11px] text-[var(--text-muted)] font-semibold">
                  (Comma separated items)
                </span>
              </div>
              <textarea
                value={menuInputText}
                onChange={(e) => setMenuInputText(e.target.value)}
                rows={3}
                placeholder="e.g. Idli, Sambar, Coconut Chutney, Coffee"
                className="form-textarea font-semibold text-sm leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const items = menuState[selectedDay]?.[selectedMeal] || [];
                  setMenuInputText(items.join(', '));
                  toast('Cancelled unsaved changes');
                }}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button type="submit" variant="success" size="sm" className="text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                <Save size={15} />
                <span>Save Menu Items</span>
              </Button>
            </div>
          </form>

          {/* Current Food Items Cards List */}
          <div className="pt-3 border-t border-[var(--border)]">
            <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider mb-3">
              Active Dishes in {selectedDay} ({selectedMeal}):
            </h3>
            <div className="flex flex-wrap gap-2">
              {(menuState[selectedDay]?.[selectedMeal] || []).map((dish, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-xs font-extrabold text-[var(--text-primary)] shadow-xs"
                >
                  <span>{dish}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteMenuItem(selectedDay, selectedMeal, dish)}
                    className="text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
         TAB 3: COOK MANAGEMENT
      ═══════════════════════════════════════ */}
      {activeTab === 'cooks' && (
        <div className="card p-5 sm:p-8 rounded-3xl border border-[var(--border)] shadow-md flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">
                <ChefHat size={20} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Cook Roster & Staff</h2>
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  Add kitchen cooks, assign shifts, edit specialty, and toggle active status.
                </p>
              </div>
            </div>

            <Button
              variant="warning"
              size="sm"
              onClick={handleOpenAddCook}
              className="text-xs font-extrabold flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-md cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Add New Cook</span>
            </Button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search cook name, specialty or shift..."
                value={cookSearch}
                onChange={(e) => setCookSearch(e.target.value)}
                className="form-input text-xs pl-10"
              />
              <Search size={15} className="absolute left-3 top-3.5 text-[var(--text-muted)]" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-extrabold text-[var(--text-muted)] uppercase">Status:</span>
              <select
                value={cookFilterStatus}
                onChange={(e) => setCookFilterStatus(e.target.value)}
                className="form-select text-xs font-bold w-36"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Cooks Datatable View */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border)] text-[11px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
                  <th className="py-3.5 px-4">Cook Name</th>
                  <th className="py-3.5 px-4">Specialty</th>
                  <th className="py-3.5 px-4">Work Shift</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredCooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-xs font-medium text-[var(--text-muted)]">
                      No cooks found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCooks.map((cook) => (
                    <tr key={cook.id} className="hover:bg-[var(--bg-subtle)]/50 transition-colors">
                      <td className="py-3.5 px-4 font-black text-[var(--text-primary)]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">
                            <ChefHat size={16} />
                          </div>
                          <span className="text-sm">{cook.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[var(--text-secondary)]">{cook.specialty}</td>
                      <td className="py-3.5 px-4 font-bold text-[var(--text-primary)]">{cook.shift}</td>
                      <td className="py-3.5 px-4 font-medium text-[var(--text-muted)]">{cook.contact}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            cook.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                              : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cook.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {cook.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleCookStatus(cook)}
                            className="p-2 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 transition-colors cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCook(cook)}
                            className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 transition-colors cursor-pointer"
                            title="Edit Cook"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCook(cook)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                            title="Delete Cook"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add / Edit Cook Modal ── */}
      {isCookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                {editingCookId ? 'Edit Cook Details' : 'Add New Cook'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCookModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCook} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">Cook Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Balu"
                  value={cookForm.name}
                  onChange={(e) => setCookForm({ ...cookForm, name: e.target.value })}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. Biryani & Special Curry"
                  value={cookForm.specialty}
                  onChange={(e) => setCookForm({ ...cookForm, specialty: e.target.value })}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Shift</label>
                  <select
                    value={cookForm.shift}
                    onChange={(e) => setCookForm({ ...cookForm, shift: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="Morning">Morning Shift</option>
                    <option value="Afternoon">Afternoon Shift</option>
                    <option value="Evening">Evening Shift</option>
                    <option value="Night">Night Shift</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Status</label>
                  <select
                    value={cookForm.status}
                    onChange={(e) => setCookForm({ ...cookForm, status: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">Contact Number</label>
                <input
                  type="text"
                  placeholder="+91 98421 12345"
                  value={cookForm.contact}
                  onChange={(e) => setCookForm({ ...cookForm, contact: e.target.value })}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCookModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="warning" size="sm" className="text-xs font-bold shadow-md">
                  Save Cook
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
         TAB 4: HOSTEL BLOCK MANAGEMENT
      ═══════════════════════════════════════ */}
      {activeTab === 'blocks' && (
        <div className="card p-5 sm:p-8 rounded-3xl border border-[var(--border)] shadow-md flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center font-bold flex-shrink-0">
                <Building size={20} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Hostel Infrastructure & Blocks</h2>
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  Add hostel blocks, edit wardens, room capacity, search and filter campus blocks.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddBlock}
              className="text-xs font-extrabold flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white shadow-md cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Add New Hostel Block</span>
            </Button>
          </div>

          {/* Search & Type Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search block name, code, or warden..."
                value={blockSearch}
                onChange={(e) => setBlockSearch(e.target.value)}
                className="form-input text-xs pl-10"
              />
              <Search size={15} className="absolute left-3 top-3.5 text-[var(--text-muted)]" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-extrabold text-[var(--text-muted)] uppercase">Hostel Type:</span>
              <select
                value={blockFilterType}
                onChange={(e) => setBlockFilterType(e.target.value)}
                className="form-select text-xs font-bold w-40"
              >
                <option value="all">All Types</option>
                <option value="boys">Boys Hostel</option>
                <option value="girls">Girls Hostel</option>
                <option value="dorm">Dormitory</option>
                <option value="pg">International / PG</option>
              </select>
            </div>
          </div>

          {/* Hostel Blocks Datatable View */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border)] text-[11px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
                  <th className="py-3.5 px-4">Block Name</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Hostel Type</th>
                  <th className="py-3.5 px-4">Warden</th>
                  <th className="py-3.5 px-4">Capacity & Rooms</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredBlocks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-xs font-medium text-[var(--text-muted)]">
                      No hostel blocks found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBlocks.map((block) => (
                    <tr key={block.id} className="hover:bg-[var(--bg-subtle)]/50 transition-colors">
                      <td className="py-3.5 px-4 font-black text-[var(--text-primary)]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center font-bold flex-shrink-0">
                            <Building size={16} />
                          </div>
                          <span className="text-sm">{block.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-500">{block.code}</td>
                      <td className="py-3.5 px-4 font-semibold text-[var(--text-secondary)]">{block.type}</td>
                      <td className="py-3.5 px-4 font-bold text-[var(--text-primary)]">{block.warden}</td>
                      <td className="py-3.5 px-4 font-medium text-[var(--text-muted)]">
                        <span className="font-bold text-[var(--text-primary)]">{block.capacity}</span> beds ({block.rooms} rooms)
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            block.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              block.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {block.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleBlockStatus(block)}
                            className="p-2 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 transition-colors cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditBlock(block)}
                            className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 transition-colors cursor-pointer"
                            title="Edit Block"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(block)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                            title="Delete Block"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add / Edit Hostel Block Modal ── */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                {editingBlockId ? 'Edit Hostel Block' : 'Add New Hostel Block'}
              </h3>
              <button
                type="button"
                onClick={() => setIsBlockModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Block Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pallavan Hostel"
                    value={blockForm.name}
                    onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Block Code</label>
                  <input
                    type="text"
                    placeholder="e.g. BLK-PAL"
                    value={blockForm.code}
                    onChange={(e) => setBlockForm({ ...blockForm, code: e.target.value })}
                    className="form-input text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Hostel Type</label>
                  <select
                    value={blockForm.type}
                    onChange={(e) => setBlockForm({ ...blockForm, type: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="Boys Hostel">Boys Hostel</option>
                    <option value="Girls Hostel">Girls Hostel</option>
                    <option value="Boys Dormitory">Boys Dormitory</option>
                    <option value="Girls Dormitory">Girls Dormitory</option>
                    <option value="International PG">International PG</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Status</label>
                  <select
                    value={blockForm.status}
                    onChange={(e) => setBlockForm({ ...blockForm, status: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Bed Capacity</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="250"
                    value={blockForm.capacity}
                    onChange={(e) => setBlockForm({ ...blockForm, capacity: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">Number of Rooms</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="60"
                    value={blockForm.rooms}
                    onChange={(e) => setBlockForm({ ...blockForm, rooms: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">Warden / Incharge Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. M. Senthil"
                  value={blockForm.warden}
                  onChange={(e) => setBlockForm({ ...blockForm, warden: e.target.value })}
                  className="form-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md">
                  Save Hostel Block
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
