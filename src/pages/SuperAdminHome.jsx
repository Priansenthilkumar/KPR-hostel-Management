// src/pages/SuperAdminHome.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  ShieldCheck,
  Utensils,
  BarChart3,
  PlusCircle,
  Ticket,
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
} from 'lucide-react';
import { storageService } from '../services/storage';
import { hostelService } from '../services/hostelService';
import { exportToExcel } from '../utils/exportExcel';
import ComplaintBox from '../components/Dashboard/ComplaintBox';
import Button from '../components/UI/Button';
import kprLogo from '../assets/kprLogo.png';
import toast from 'react-hot-toast';

export default function SuperAdminHome() {
  const navigate = useNavigate();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // Dynamic Live Stats from Backend Services
  const messEntries = useMemo(() => storageService.getEntries(), []);
  const dutyLogs = useMemo(() => hostelService.getDutyLogs(), []);
  const remarksList = useMemo(() => hostelService.getStudentRemarks(), []);

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              onClick={() => setIsComplaintModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-sm flex items-center gap-2"
            >
              <Wrench size={15} />
              <span>Open Complaint & Fault Resolver</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
