// src/pages/Dashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  BarChart3,
  Download,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Utensils,
  Clock,
  ChevronRight,
  MessageSquareWarning,
  AlertCircle,
} from 'lucide-react';
import { useEntries } from '../hooks/useEntries';
import { formatDisplayDate, formatKg } from '../utils/dateUtils';
import { exportToExcel } from '../utils/exportExcel';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import ComplaintBox from '../components/Dashboard/ComplaintBox';
import kprLogo from '../assets/kprLogo.png';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { entries } = useEntries();
  const navigate = useNavigate();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  const recentEntries = useMemo(
    () => [...entries].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 4),
    [entries]
  );

  const handleExport = () => {
    try {
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
    <div className="welcome-dashboard max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 flex flex-col gap-8 page-enter">
      
      {/* ── Welcome Hero Banner (Centered on Mobile) ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white p-6 sm:p-10 shadow-xl border border-[#245767]">
        {/* Subtle background glow */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#52B74A]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-60 h-60 rounded-full bg-[#3DA1D1]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center text-center lg:text-left justify-between gap-6">
          <div className="max-w-2xl flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#52B74A] mb-4 backdrop-blur-xs">
              <Sparkles size={14} className="text-[#52B74A]" />
              <span>KPR MESS Portal</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Welcome to KPR MESS
            </h1>

            <p className="mt-3 text-xs sm:text-base text-[#B0D0D8] leading-relaxed max-w-xl">
              Track daily hostel meal logs, monitor student headcount strength, assign cooks, and audit food wastage analytics efficiently.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Button
                variant="danger"
                size="md"
                onClick={() => setIsComplaintModalOpen(true)}
                className="shadow-lg hover:scale-[1.02] transition-transform text-xs sm:text-sm bg-red-600/90 hover:bg-red-600 text-white border border-red-500/40 flex items-center gap-2 font-extrabold"
              >
                <AlertCircle size={16} strokeWidth={2.2} />
                <span>Complaint Box (App Fault Resolution)</span>
              </Button>
            </div>
          </div>

          {/* Institutional Badge Card */}
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-center text-center max-w-xs w-full shadow-inner mx-auto lg:mx-0">
            <img
              src={kprLogo}
              alt="KPR Logo"
              className="h-12 w-auto object-contain bg-white/95 p-1.5 rounded-xl mb-3 shadow-sm"
            />
            <h3 className="text-base font-extrabold text-white leading-tight">
              KPR MESS
            </h3>
            <p className="text-[11px] text-[#B0D0D8] mt-1 font-medium">
              Hostel Food & Mess Operations
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 w-full flex items-center justify-center gap-1.5 text-xs text-[#52B74A] font-semibold">
              <ShieldCheck size={14} />
              <span>System Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── App Fault & Bug Resolution Modal Popup ── */}
      <ComplaintBox
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />

      {/* ── Quick Action Launchpad (Mobile & Desktop) ── */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-4 tracking-tight flex items-center gap-2">
          <Utensils size={18} className="text-[#52B74A]" />
          <span>Quick Launchpad</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Add Entry */}
          <div
            onClick={() => navigate('/add-entry')}
            className="card p-5 rounded-2xl cursor-pointer group hover:border-[#52B74A] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#52B74A]/10 text-[#52B74A] flex items-center justify-center mb-3 group-hover:bg-[#52B74A] group-hover:text-white transition-colors">
                <PlusCircle size={22} strokeWidth={2.2} />
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[#52B74A] transition-colors">
                Add Meal Entry
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Log today's meal, headcount, cook name, and wastage details.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[#52B74A]">
              <span>Create Record</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Overview Analytics */}
          <div
            onClick={() => navigate('/overview')}
            className="card p-5 rounded-2xl cursor-pointer group hover:border-[#52B74A] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#3DA1D1]/10 text-[#3DA1D1] flex items-center justify-center mb-3 group-hover:bg-[#3DA1D1] group-hover:text-white transition-colors">
                <BarChart3 size={22} strokeWidth={2.2} />
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[#3DA1D1] transition-colors">
                System Overview
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                View charts, meal trends, cook performance, and wastage analytics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[#3DA1D1]">
              <span>View Analytics</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Food Records */}
          <div
            onClick={() => navigate('/overview')}
            className="card p-5 rounded-2xl cursor-pointer group hover:border-[#52B74A] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#174351]/10 dark:bg-[#174351]/60 text-[#174351] dark:text-[#B0D0D8] flex items-center justify-center mb-3 group-hover:bg-[#174351] group-hover:text-white transition-colors">
                <BarChart3 size={22} strokeWidth={2.2} />
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[#174351] dark:group-hover:text-[#B0D0D8] transition-colors">
                Food Records Log
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Search, filter, edit, or manage all historical hostel food entries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
              <span>Browse Log</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Export Excel */}
          <div
            onClick={handleExport}
            className="card p-5 rounded-2xl cursor-pointer group hover:border-amber-500 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Download size={22} strokeWidth={2.2} />
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-amber-600 transition-colors">
                Export Excel Audit
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Download a complete spreadsheet report of all logged food records.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>Download File</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Complaint Box (App Fault Resolution) */}
          <div
            onClick={() => setIsComplaintModalOpen(true)}
            className="card p-5 rounded-2xl cursor-pointer group hover:border-red-500 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between border border-red-500/30 bg-red-500/5 shadow-xs"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-3 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <AlertCircle size={22} strokeWidth={2.2} />
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-red-500 transition-colors">
                Complaint Box
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Report app glitches, menu errors, or fault resolution complaints.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-red-500/20 flex items-center justify-between text-xs font-semibold text-red-500">
              <span>Open Complaint Box</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Maintenance Activity Datatable ── */}
      {recentEntries.length > 0 && (
        <div className="card overflow-hidden p-0 rounded-2xl flex flex-col shadow-xs">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-subtle)]">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#52B74A]" />
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm leading-none">
                  Recent Food Maintenance Activity
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Latest meal entries registered in the database</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/overview')}
              className="inline-flex items-center gap-1 text-xs text-[#52B74A] hover:text-[#44A03C] font-bold transition-colors"
            >
              View Full Overview
              <ChevronRight size={14} strokeWidth={2.2} />
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="data-table dashboard-data-table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Meal</th>
                  <th>Main Course</th>
                  <th>Cook</th>
                  <th className="text-right">Headcount Strength</th>
                  <th className="text-right">Wastage (KG)</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((e) => {
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
                        {parseInt(e.strength).toLocaleString()}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-bold text-xs tabular-nums text-[var(--text-primary)]">
                            {formatKg(e.wastage)}
                          </span>
                          <Badge label={wastageSeverity} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
