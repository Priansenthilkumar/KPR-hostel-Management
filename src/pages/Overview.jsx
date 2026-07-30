// src/pages/Overview.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  TrendingUp,
  BarChart3,
  Activity,
  Layers,
  Database,
  Sparkles,
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
          <div className="relative overflow-hidden card p-8 sm:p-14 text-center rounded-3xl border border-dashed border-[#52B74A]/40 bg-gradient-to-b from-[#52B74A]/5 via-sky-500/5 to-transparent flex flex-col items-center justify-center shadow-xs">
            {/* Background Glow Orbs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#52B74A]/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#3DA1D1]/10 blur-2xl pointer-events-none" />

            {/* Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#52B74A]/20 to-[#3DA1D1]/20 border border-[#52B74A]/30 flex items-center justify-center mx-auto mb-4 shadow-md backdrop-blur-xs">
              <TrendingUp size={30} strokeWidth={2.2} className="text-[#52B74A]" />
            </div>

            <h3 className="font-extrabold text-lg text-[var(--text-primary)]">No Meal Data Available Yet</h3>
            <p className="text-[var(--text-secondary)] font-medium text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
              Charts will automatically calculate meal distribution, daily wastage trends, and cook performance once you add food entries.
            </p>

            {/* Super Attractive Action Button */}
            <button
              type="button"
              onClick={() => navigate('/add-entry')}
              className="mt-6 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#52B74A] via-emerald-500 to-[#3DA1D1] text-white text-sm font-extrabold shadow-lg shadow-[#52B74A]/25 hover:shadow-xl hover:shadow-[#52B74A]/40 hover:scale-[1.04] active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 group"
            >
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                <PlusCircle size={18} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="tracking-wide">Add First Entry</span>
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
            </button>
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
