// src/components/Dashboard/SummaryCards.jsx
import { Users, AlertTriangle, ClipboardList, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { isDateToday, formatKg } from '../../utils/dateUtils';

const CARDS = [
  {
    key: 'records',
    label: 'Total Records',
    sub: 'All time entries',
    icon: ClipboardList,
    accent: '#174351',         // Primary petrol teal
    gradient: 'from-[#174351]/10 via-[#174351]/5 to-transparent',
    badge: 'Live Logged',
  },
  {
    key: 'strength',
    label: 'Total Strength',
    sub: 'Cumulative headcount',
    icon: Users,
    accent: '#52B74A',         // Vibrant leaf green
    gradient: 'from-[#52B74A]/15 via-[#52B74A]/5 to-transparent',
    badge: 'Headcount',
  },
  {
    key: 'wastage',
    label: 'Total Wastage',
    sub: 'All meals (KG)',
    icon: AlertTriangle,
    accent: '#E65100',         // Warm orange
    gradient: 'from-[#E65100]/15 via-[#E65100]/5 to-transparent',
    badge: 'Tracked KG',
  },
  {
    key: 'today',
    label: "Today's Entries",
    sub: 'people served today',
    icon: Calendar,
    accent: '#3DA1D1',         // Sky blue accent
    gradient: 'from-[#3DA1D1]/15 via-[#3DA1D1]/5 to-transparent',
    badge: 'Active Today',
  },
];

function StatCard({ label, value, sub, badge, icon: Icon, accent, gradient, delay }) {
  return (
    <div
      className="card rounded-3xl p-5 
                 bg-[var(--bg-card)] border border-[var(--border)]
                 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                 flex flex-col justify-between h-full relative overflow-hidden group animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Gradient Accent Glow */}
      <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${gradient} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />
      
      {/* Top Accent Stripe Line */}
      <div
        className="h-1.5 w-full absolute top-0 left-0 right-0"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-[var(--text-muted)]">
              {label}
            </span>
            <span
              className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide border shadow-2xs"
              style={{
                color: accent,
                backgroundColor: `${accent}15`,
                borderColor: `${accent}30`,
              }}
            >
              {badge}
            </span>
          </div>
          <p className="text-3xl sm:text-3.5xl font-black text-[var(--text-primary)] tracking-tight tabular-nums mt-1 leading-none">
            {value}
          </p>
        </div>

        {/* Icon Bubble Tile */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md border border-white/20"
          style={{
            backgroundColor: `${accent}18`,
            borderColor: `${accent}30`,
          }}
        >
          <Icon size={22} strokeWidth={2.2} style={{ color: accent }} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)]/80 flex items-center justify-between">
        <p className="text-xs font-semibold text-[var(--text-secondary)] truncate" title={sub}>
          {sub}
        </p>
        <span className="text-[11px] font-extrabold flex items-center gap-0.5 text-emerald-500">
          <TrendingUp size={12} />
          <span>Realtime</span>
        </span>
      </div>
    </div>
  );
}

export default function SummaryCards({ entries }) {
  const stats = useMemo(() => {
    const todayEntries = entries.filter((e) => isDateToday(e.date));
    const totalStrength = entries.reduce((s, e) => s + (parseInt(e.strength) || 0), 0);
    const totalWastage  = entries.reduce((s, e) => s + (parseFloat(e.wastage) || 0), 0);
    return { todayEntries, totalStrength, totalWastage };
  }, [entries]);

  const cardValues = [
    entries.length,
    stats.totalStrength.toLocaleString(),
    `${formatKg(stats.totalWastage)} KG`,
    stats.todayEntries.length,
  ];

  const cardSubs = [
    CARDS[0].sub,
    CARDS[1].sub,
    CARDS[2].sub,
    `${stats.todayEntries.reduce((s, e) => s + (parseInt(e.strength) || 0), 0)} ${CARDS[3].sub}`,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full">
      {CARDS.map((card, i) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={cardValues[i]}
          sub={cardSubs[i]}
          badge={card.badge}
          icon={card.icon}
          accent={card.accent}
          gradient={card.gradient}
          delay={i * 70}
        />
      ))}
    </div>
  );
}

