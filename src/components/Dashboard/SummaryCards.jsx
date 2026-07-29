// src/components/Dashboard/SummaryCards.jsx
import { Users, AlertTriangle, ClipboardList, Calendar } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { isDateToday, formatKg } from '../../utils/dateUtils';

const CARDS = [
  {
    key: 'records',
    label: 'Total Records',
    sub: 'All time entries',
    icon: ClipboardList,
    accent: '#174351',         // Primary petrol teal
    lightBg: '#EBF4F6',
    darkBg: '#1F5161',
  },
  {
    key: 'strength',
    label: 'Total Strength',
    sub: 'Cumulative headcount',
    icon: Users,
    accent: '#52B74A',         // Vibrant leaf green
    lightBg: '#EAF7EA',
    darkBg: '#1E3F20',
  },
  {
    key: 'wastage',
    label: 'Total Wastage',
    sub: 'All meals (KG)',
    icon: AlertTriangle,
    accent: '#E65100',         // Warm orange
    lightBg: '#FFF7ED',
    darkBg: '#3A2210',
  },
  {
    key: 'today',
    label: "Today's Entries",
    sub: 'people served today',
    icon: Calendar,
    accent: '#2A819B',         // Teal slate accent
    lightBg: '#EAF4F7',
    darkBg: '#1B4A5A',
  },
];

function StatCard({ label, value, sub, icon: Icon, accent, delay }) {
  return (
    <div
      className="card rounded-2xl p-5 
                 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 
                 flex flex-col justify-between h-full relative overflow-hidden group border-t-4 animate-fade-in"
      style={{ borderTopColor: accent, animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {label}
          </p>
          <p className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight tabular-nums mt-1.5 leading-none">
            {value}
          </p>
        </div>

        {/* Icon bubble */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-xs bg-[var(--bg-subtle)]"
        >
          <Icon size={20} strokeWidth={2.2} style={{ color: accent }} />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--text-muted)] truncate" title={sub}>
          {sub}
        </p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {CARDS.map((card, i) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={cardValues[i]}
          sub={cardSubs[i]}
          icon={card.icon}
          accent={card.accent}
          lightBg={card.lightBg}
          darkBg={card.darkBg}
          delay={i * 70}
        />
      ))}
    </div>
  );
}
