// src/pages/Overview.jsx
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  TrendingUp,
  BarChart3,
  Activity,
  Layers,
  Database,
} from 'lucide-react';
import SummaryCards from '../components/Dashboard/SummaryCards';
import ChartSection from '../components/Dashboard/ChartSection';
import RecordsTable from '../components/Records/RecordsTable';
import { useEntries } from '../hooks/useEntries';
import Button from '../components/UI/Button';

export default function Overview() {
  const { entries } = useEntries();
  const navigate = useNavigate();

  const scrollToLogs = () => {
    const el = document.getElementById('browse-logs-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="overview-page max-w-[1280px] w-full mx-auto px-6 pt-8 pb-12 flex flex-col gap-8 page-enter">
      {/* ── Executive Header Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white shadow-md border border-[#245767]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#52B74A] uppercase tracking-wider mb-1.5">
            <Activity size={15} />
            <span>KPR Mess Analytics & Performance Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Overview & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-[#B0D0D8] mt-1">
            Real-time graphical insights of meal logs, headcount strength, cook distribution & wastage data.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="secondary"
            size="md"
            onClick={scrollToLogs}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-xs"
          >
            <Database size={16} strokeWidth={2} />
            Browse Logs
          </Button>

          <Button
            variant="success"
            size="md"
            onClick={() => navigate('/add-entry')}
            className="shadow-sm"
          >
            <PlusCircle size={16} strokeWidth={2.2} />
            Add Entry
          </Button>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Layers size={18} className="text-[#52B74A]" />
            <span>Key Performance Indicators</span>
          </h2>
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Total {entries.length} Entries Recorded
          </span>
        </div>
        <SummaryCards entries={entries} />
      </div>

      {/* ── Interactive Charts Section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 size={18} className="text-[#3DA1D1]" />
            <span>Graphical Trends & Analytics</span>
          </h2>
        </div>

        {entries.length > 0 ? (
          <ChartSection entries={entries} />
        ) : (
          <div className="card p-12 text-center rounded-2xl border border-dashed border-[var(--border)]">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={28} strokeWidth={2} className="text-[#52B74A]" />
            </div>
            <h3 className="font-bold text-base text-[var(--text-primary)]">No Meal Data Available Yet</h3>
            <p className="text-[var(--text-secondary)] font-medium text-xs mt-1 max-w-sm mx-auto">
              Charts will automatically calculate meal distribution, daily wastage trends, and cook performance once you add food entries.
            </p>
            <Button variant="success" className="mt-5 mx-auto" onClick={() => navigate('/add-entry')}>
              <PlusCircle size={16} strokeWidth={2.2} />
              Add First Entry
            </Button>
          </div>
        )}
      </div>

      {/* ── Embedded Browse Logs Section ── */}
      <div id="browse-logs-section" className="scroll-mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Database size={18} className="text-[#52B74A]" />
            <span>Browse Logs & Maintenance Audit Records</span>
          </h2>
        </div>

        <RecordsTable />
      </div>
    </div>
  );
}
