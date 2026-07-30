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
  Layers,
  Wrench,
  UserCheck,
  MessageSquare,
  Edit3,
  Trash2,
  Bug,
} from 'lucide-react';
import { storageService } from '../services/storage';
import { hostelService } from '../services/hostelService';
import { formatDisplayDate, formatKg } from '../utils/dateUtils';
import { exportToExcel } from '../utils/exportExcel';
import ComplaintBox from '../components/Dashboard/ComplaintBox';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import kprLogo from '../assets/kprLogo.png';
import toast from 'react-hot-toast';

export default function SuperAdminHome() {
  const navigate = useNavigate();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // Dynamic Live State synced across storage & custom events
  const [messEntries, setMessEntries] = useState(() => storageService.getEntries());
  const [dutyLogs, setDutyLogs] = useState(() => hostelService.getDutyLogs());
  const [remarksList, setRemarksList] = useState(() => hostelService.getStudentRemarks());
  const [complaintCount, setComplaintCount] = useState(() => {
    try {
      const saved = localStorage.getItem('kpr_app_fault_complaints_v5');
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  });

  const refreshAllData = useCallback(() => {
    setMessEntries(storageService.getEntries());
    setDutyLogs(hostelService.getDutyLogs());
    setRemarksList(hostelService.getStudentRemarks());
    try {
      const saved = localStorage.getItem('kpr_app_fault_complaints_v5');
      setComplaintCount(saved ? JSON.parse(saved).length : 0);
    } catch {
      setComplaintCount(0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('kpr_data_updated', refreshAllData);
    window.addEventListener('storage', refreshAllData);
    return () => {
      window.removeEventListener('kpr_data_updated', refreshAllData);
      window.removeEventListener('storage', refreshAllData);
    };
  }, [refreshAllData]);

  const totalMessEntriesCount = messEntries.length;
  const totalDutyLogsCount = dutyLogs.length;
  const totalRemarksCount = remarksList.length;
  const pendingRemarksCount = remarksList.filter((r) => !r.rectified).length;

  const handleExportFullAudit = () => {
    try {
      if (messEntries.length === 0) {
        toast.error('No mess records to export!');
        return;
      }
      exportToExcel(messEntries);
      toast.success(`Exported ${messEntries.length} records to Excel file!`);
    } catch (err) {
      toast.error(err.message || 'Export failed');
    }
  };

  return (
    <div className="super-admin-home max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 flex flex-col gap-8 page-enter">
      
      {/* ── Executive Super Admin Master Command Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-[#164350] to-[#0E2730] text-white p-6 sm:p-10 shadow-2xl border border-purple-500/40">
        {/* Glow Effects */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#52B74A]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center text-center lg:text-left justify-between gap-6">
          <div className="max-w-2xl flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-extrabold text-purple-300 mb-4 backdrop-blur-xs">
              <Crown size={15} className="text-purple-300" />
              <span>SUPER ADMIN COMMAND CENTER</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Welcome, System Super Admin
            </h1>

            <p className="mt-3 text-xs sm:text-base text-[#B0D0D8] leading-relaxed max-w-xl">
              You have full master authorization and CRUD access across both <strong>KPR Hostel Warden Administration</strong> and <strong>KPR Mess Food Operations</strong>.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Button
                variant="success"
                size="md"
                onClick={() => navigate('/mess-dashboard')}
                className="shadow-lg hover:scale-[1.02] transition-transform text-xs sm:text-sm font-extrabold flex items-center gap-2"
              >
                <Utensils size={16} />
                <span>Mess Management Portal</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/hostel-dashboard')}
                className="shadow-lg hover:scale-[1.02] transition-transform text-xs sm:text-sm bg-sky-600 hover:bg-sky-500 text-white border-sky-400/40 font-extrabold flex items-center gap-2"
              >
                <ShieldCheck size={16} />
                <span>Hostel Warden Portal</span>
              </Button>

              <Button
                variant="danger"
                size="md"
                onClick={() => setIsComplaintModalOpen(true)}
                className="shadow-lg hover:scale-[1.02] transition-transform text-xs sm:text-sm bg-red-600 hover:bg-red-500 text-white border-red-400/40 font-extrabold flex items-center gap-2"
              >
                <AlertCircle size={16} />
                <span>Complaint Box</span>
              </Button>
            </div>
          </div>

          {/* Institutional Emblem Card */}
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-purple-400/30 flex flex-col items-center text-center max-w-xs w-full shadow-inner mx-auto lg:mx-0">
            <img
              src={kprLogo}
              alt="KPR Logo"
              className="h-14 w-auto object-contain bg-white/95 p-2 rounded-2xl mb-3 shadow-md"
            />
            <h3 className="text-base font-extrabold text-white leading-tight">
              KPR INSTITUTIONS
            </h3>
            <p className="text-[11px] font-bold text-purple-300 mt-1 uppercase tracking-wider">
              Master Admin Operations
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 w-full flex items-center justify-center gap-1.5 text-xs text-[#52B74A] font-extrabold">
              <CheckCircle2 size={15} />
              <span>Full Master Control</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── App Fault & Bug Resolution Modal Popup ── */}
      <ComplaintBox
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />

      {/* ── Live Master Metrics Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              Mess Records
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#52B74A]/15 text-[#52B74A] flex items-center justify-center font-bold">
              <Utensils size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tabular-nums">
              {totalMessEntriesCount}
            </span>
            <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">
              Logged food maintenance entries
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              Hostel Blocks
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tabular-nums">
              9
            </span>
            <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">
              Active hostel blocks (1,460 residents)
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              Duty Check-ins
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tabular-nums">
              {totalDutyLogsCount}
            </span>
            <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">
              Warden duty logs registered
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              Pending Remarks
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-500 tabular-nums">
              {pendingRemarksCount}
            </span>
            <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">
              Awaiting warden rectification
            </p>
          </div>
        </div>

        {/* Metric 5: User App Complaints & Bug Desk */}
        <div
          onClick={() => setIsComplaintModalOpen(true)}
          className="card p-5 rounded-2xl border border-red-500/40 bg-red-500/5 hover:bg-red-500/10 shadow-xs flex flex-col justify-between gap-2 cursor-pointer transition-all col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-red-400 tracking-wider">
              App Complaints
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              <Bug size={16} />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-red-500 tabular-nums">
              {complaintCount}
            </span>
            <p className="text-[11px] text-red-400 font-semibold mt-0.5">
              Click to view user reported complaints
            </p>
          </div>
        </div>
      </div>

      {/* ── Dual Hub Switcher Launchpad (Mobile & Desktop View) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* HUB A: MESS MANAGEMENT */}
        <div className="card p-6 rounded-3xl border border-[#52B74A]/30 bg-gradient-to-b from-[#52B74A]/5 to-transparent flex flex-col justify-between gap-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#52B74A] text-white flex items-center justify-center font-bold shadow-md">
                  <Utensils size={24} />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#52B74A] uppercase tracking-wider">
                    Mess Portal Hub
                  </span>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] leading-tight">
                    Hostel Dining & Food Operations
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Manage daily meal entries, monitor student headcount strength, assign cooks, and view food wastage charts.
            </p>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/add-entry')}
                className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[#52B74A] text-left flex flex-col gap-1 transition-all group"
              >
                <div className="flex items-center justify-between text-[#52B74A]">
                  <PlusCircle size={16} />
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Add Meal Log</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/menu')}
                className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[#52B74A] text-left flex flex-col gap-1 transition-all group"
              >
                <div className="flex items-center justify-between text-sky-500">
                  <Utensils size={16} />
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Food Menu Table</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/overview')}
                className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[#52B74A] text-left flex flex-col gap-1 transition-all group"
              >
                <div className="flex items-center justify-between text-purple-500">
                  <BarChart3 size={16} />
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Food Analytics</span>
              </button>
            </div>
          </div>

          <Button
            variant="success"
            size="lg"
            onClick={() => navigate('/mess-dashboard')}
            className="w-full shadow-md text-xs font-extrabold flex items-center justify-center gap-2 h-12"
          >
            <span>Open Mess Management Portal</span>
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* HUB B: HOSTEL WARDEN */}
        <div className="card p-6 rounded-3xl border border-sky-500/30 bg-gradient-to-b from-sky-500/5 to-transparent flex flex-col justify-between gap-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-sky-500 uppercase tracking-wider">
                    Hostel Portal Hub
                  </span>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] leading-tight">
                    Hostel Warden Administration
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Monitor student headcount across 9 hostel blocks, register warden duty logs, and track student discipline remarks.
            </p>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/hostel-add-entry')}
                className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-sky-500 text-left flex flex-col gap-1 transition-all group"
              >
                <div className="flex items-center justify-between text-sky-500">
                  <PlusCircle size={16} />
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Log Duty / Remark</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/hostel-overview')}
                className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-sky-500 text-left flex flex-col gap-1 transition-all group"
              >
                <div className="flex items-center justify-between text-[#52B74A]">
                  <FileText size={16} />
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Duty & Remarks Log</span>
              </button>

              <button
                type="button"
                onClick={handleExportFullAudit}
                className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-sky-500 text-left flex flex-col gap-1 transition-all group"
              >
                <div className="flex items-center justify-between text-purple-500">
                  <Download size={16} />
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">Export Spreadsheet</span>
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/hostel-dashboard')}
            className="w-full shadow-md text-xs font-extrabold flex items-center justify-center gap-2 h-12 bg-sky-600 hover:bg-sky-500 text-white border-0"
          >
            <span>Open Warden Administration Portal</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* ── LIVE MESS FOOD MAINTENANCE ACTIVITY DATATABLE ── */}
      <div className="card overflow-hidden p-0 rounded-3xl flex flex-col shadow-xs border border-[#52B74A]/30">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#52B74A]/15 text-[#52B74A] flex items-center justify-center font-bold">
              <Utensils size={15} />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-primary)] text-sm leading-none">
                Live Mess Food Maintenance Activity Log
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Real-time logged food entries ({messEntries.length} total records)
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/overview')}
            className="inline-flex items-center gap-1 text-xs text-[#52B74A] hover:text-[#44A03C] font-bold transition-colors"
          >
            Full Mess Log
            <ChevronRight size={14} strokeWidth={2.2} />
          </button>
        </div>

        {messEntries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-secondary)] font-medium">
            No Mess entries logged yet. Click <strong className="text-[#52B74A] cursor-pointer" onClick={() => navigate('/add-entry')}>Add Meal Log</strong> to record your first entry.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="data-table dashboard-data-table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Meal</th>
                  <th>Main Course</th>
                  <th>Cook</th>
                  <th className="text-right">Headcount</th>
                  <th className="text-right">Wastage (KG)</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messEntries.slice(0, 5).map((e) => {
                  const wastageVal = parseFloat(e.wastage) || 0;
                  const wastageSeverity = wastageVal > 10 ? 'High' : wastageVal > 5 ? 'Moderate' : 'Low';
                  return (
                    <tr key={e.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="font-semibold text-[var(--text-primary)] whitespace-nowrap text-xs">
                        {formatDisplayDate(e.date)}
                      </td>
                      <td><Badge label={e.day} /></td>
                      <td><Badge label={e.meal} /></td>
                      <td className="text-xs font-medium text-[var(--text-secondary)] max-w-[180px] truncate" title={e.mainCourse}>
                        {e.mainCourse}
                      </td>
                      <td className="text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                        {e.cookName}
                      </td>
                      <td className="font-bold text-[#52B74A] text-right tabular-nums text-xs">
                        {parseInt(e.strength || 0).toLocaleString()}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-bold text-xs tabular-nums text-[var(--text-primary)]">
                            {formatKg(e.wastage)}
                          </span>
                          <Badge label={wastageSeverity} />
                        </div>
                      </td>
                      <td className="text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate('/add-entry', { state: { editEntry: e } })}
                            className="p-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-500 transition-colors"
                            title="Edit Mess Entry"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Delete this mess record?')) {
                                storageService.deleteEntry(e.id);
                                toast.success('Mess entry deleted!');
                              }
                            }}
                            className="p-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-500 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── DEDICATED SECTION: HOSTEL WARDEN DUTY OVERSIGHT & SHIFT OVERVIEW ── */}
      <div className="card overflow-hidden p-0 rounded-3xl flex flex-col shadow-xs border border-sky-500/40">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-sky-950/20 via-sky-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold flex-shrink-0 border border-sky-500/30">
              <UserCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[var(--text-primary)] text-base leading-none">
                  Hostel Warden Duty Oversight & Shift Overview
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 uppercase">
                  Live Duty Oversight
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Real-time tracking of Wardens, Deputy Wardens & Resident Tutors shift check-in logs across 9 hostel blocks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <button
              onClick={() => navigate('/hostel-add-entry')}
              className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 text-xs font-bold transition-all border border-sky-500/30 flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              <span>Log Duty Shift</span>
            </button>
            <button
              onClick={() => navigate('/hostel-overview')}
              className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-bold transition-colors px-2 py-1"
            >
              <span>Full Warden Desk</span>
              <ChevronRight size={14} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Quick KPI Strip for Warden Duty */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[var(--bg-subtle)] border-b border-[var(--border)] text-xs">
          <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Total Duty Logs</span>
            <strong className="text-lg font-extrabold text-sky-400">{dutyLogs.length}</strong>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Currently On Duty</span>
            <strong className="text-lg font-extrabold text-amber-400 flex items-center gap-1.5">
              <span>{dutyLogs.filter((d) => d.status === 'On Duty' || d.outTime === 'On Duty').length}</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            </strong>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Completed Shifts</span>
            <strong className="text-lg font-extrabold text-emerald-400">
              {dutyLogs.filter((d) => d.status === 'Completed' || (d.outTime && d.outTime !== 'On Duty')).length}
            </strong>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Latest Duty Check-in</span>
            <span className="text-xs font-bold text-[var(--text-primary)] truncate" title={dutyLogs[0]?.name || 'None'}>
              {dutyLogs[0]?.name ? `${dutyLogs[0].name} (${dutyLogs[0].block})` : 'No Check-ins Yet'}
            </span>
          </div>
        </div>

        {/* Dedicated Warden Duty Datatable */}
        {dutyLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-secondary)] font-medium">
            No Warden duty check-in logs recorded yet. Click <strong className="text-sky-400 cursor-pointer underline" onClick={() => navigate('/hostel-add-entry')}>Log Duty Shift</strong> to register warden check-ins.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="data-table dashboard-data-table w-full">
              <thead>
                <tr>
                  <th>Staff Name & Role</th>
                  <th>Hostel Block</th>
                  <th>Duty Date</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                  <th className="text-center">Duty Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dutyLogs.map((d) => (
                  <tr key={d.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-[var(--text-primary)]">{d.name}</span>
                        <span className="text-[10px] font-semibold text-sky-400">{d.designation}</span>
                      </div>
                    </td>
                    <td className="text-xs font-semibold text-[var(--text-secondary)]">{d.block}</td>
                    <td className="font-semibold text-xs text-[var(--text-primary)] whitespace-nowrap">{formatDisplayDate(d.date)}</td>
                    <td className="font-bold text-emerald-400 whitespace-nowrap text-xs">{d.inTime}</td>
                    <td className="font-bold text-amber-400 whitespace-nowrap text-xs">{d.outTime}</td>
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                          d.status === 'Completed' || (d.outTime && d.outTime !== 'On Duty')
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                        }`}
                      >
                        <ShieldCheck size={12} />
                        <span>{d.status || (d.outTime === 'On Duty' ? 'On Duty' : 'Completed')}</span>
                      </span>
                    </td>
                    <td className="text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate('/hostel-overview')}
                          className="p-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 transition-colors"
                          title="Manage Hostel Duty"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete duty log for ${d.name}?`)) {
                              hostelService.deleteDutyLog(d.id);
                              toast.success('Warden duty log deleted!');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-colors"
                          title="Delete Duty Log"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── DEDICATED SECTION: HOSTEL STUDENT REMARKS & ISSUE LOGS ── */}
      <div className="card overflow-hidden p-0 rounded-3xl flex flex-col shadow-xs border border-purple-500/30">
        <div className="px-6 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-950/20 via-purple-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold flex-shrink-0 border border-purple-500/30">
              <MessageSquare size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[var(--text-primary)] text-base leading-none">
                  Hostel Student Remarks & Facility Issue Logs
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 uppercase">
                  Maintenance Desk
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Student reported hostel facility remarks ({remarksList.length} total, {pendingRemarksCount} pending resolution).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
            <button
              onClick={() => navigate('/hostel-add-entry')}
              className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 text-xs font-bold transition-all border border-purple-500/30 flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              <span>Add Student Remark</span>
            </button>
          </div>
        </div>

        {remarksList.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-secondary)] font-medium">
            No student remarks recorded yet. Click <strong className="text-purple-400 cursor-pointer underline" onClick={() => navigate('/hostel-add-entry')}>Add Student Remark</strong> to file a maintenance remark.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="data-table dashboard-data-table w-full">
              <thead>
                <tr>
                  <th>Student & Room</th>
                  <th>Hostel Block</th>
                  <th>Date</th>
                  <th>Category & Remark</th>
                  <th className="text-right">Rectification Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {remarksList.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-[var(--text-primary)]">{r.studentName}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">Room #{r.roomNo} ({r.rollNo || 'N/A'})</span>
                      </div>
                    </td>
                    <td className="text-xs font-semibold text-[var(--text-secondary)]">{r.block}</td>
                    <td className="font-semibold text-xs text-[var(--text-primary)] whitespace-nowrap">{formatDisplayDate(r.date)}</td>
                    <td className="text-xs text-[var(--text-secondary)] max-w-[280px]">
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 text-[10px] font-extrabold mr-1.5 uppercase">
                        {r.category}
                      </span>
                      <span>{r.remark}</span>
                    </td>
                    <td className="text-right">
                      <Badge label={r.rectified ? 'Rectified' : 'Pending'} />
                    </td>
                    <td className="text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate('/hostel-overview')}
                          className="p-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-400 transition-colors"
                          title="Manage Remarks"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this student remark?')) {
                              hostelService.deleteStudentRemark(r.id);
                              toast.success('Student remark deleted!');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-colors"
                          title="Delete Remark"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── System Audit & Master Controls ── */}
      <div className="card p-6 rounded-3xl flex flex-col gap-4 border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-purple-500" />
            <h3 className="font-extrabold text-sm text-[var(--text-primary)] uppercase tracking-wider">
              Super Admin Master System Controls
            </h3>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-500 border border-purple-500/30 uppercase">
            Master Rights Active
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[var(--text-secondary)] font-medium max-w-xl leading-relaxed">
            As Super Admin, any changes, meal logs, or student remarks you generate or edit are stored directly to the official KPRIET database with full edit privileges.
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportFullAudit}
              className="px-4 py-2.5 rounded-xl bg-[#52B74A] hover:bg-[#44A03C] text-white text-xs font-extrabold shadow-sm flex items-center gap-2"
            >
              <Download size={15} />
              <span>Download Combined Excel Report</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to Clear all old records from Mess and Hostel pages?')) {
                  storageService.clearAll();
                  hostelService.clearAllHostelRecords();
                  toast.success('All old records cleared successfully from all pages!');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold shadow-sm flex items-center gap-2"
            >
              <Wrench size={15} />
              <span>Clear Old Records</span>
            </button>

            <button
              type="button"
              onClick={() => setIsComplaintModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-sm flex items-center gap-2"
            >
              <AlertCircle size={15} />
              <span>Open Complaint Box</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
