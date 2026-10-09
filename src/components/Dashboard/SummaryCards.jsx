// src/components/Dashboard/SummaryCards.jsx
// KPRIET Official Colors: --blue: #1B345F | --green: #1B924B | --s1: #19909B | --s5: #3BB5DD
import { Users, AlertTriangle, ClipboardList, Calendar, ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import { isDateToday, formatKg } from '../../utils/dateUtils';

const CARDS = [
  {
    key: 'records',
    label: 'Total Records',
    sub: 'All time entries logged',
    icon: ClipboardList,
    // --blue: #1B345F
    accent: '#1B345F',
    gradient: 'rgba(27, 52, 95, 0.08)',
    badge: 'Live Logged',
  },
  {
    key: 'strength',
    label: 'Total Headcount',
    sub: 'Cumulative student strength',
    icon: Users,
    // --green: #1B924B
    accent: '#1B924B',
    gradient: 'rgba(27, 146, 75, 0.08)',
    badge: 'Enrolled',
  },
  {
    key: 'wastage',
    label: 'Total Wastage',
    sub: 'Across all meals (KG)',
    icon: AlertTriangle,
    // warm orange — standard warning
    accent: '#D97706',
    gradient: 'rgba(217, 119, 6, 0.08)',
    badge: 'Tracked KG',
  },
  {
    key: 'today',
    label: "Today's Entries",
    sub: 'students served today',
    icon: Calendar,
    // --s5: #3BB5DD (sky)
    accent: '#19909B',
    gradient: 'rgba(25, 144, 155, 0.08)',
    badge: 'Active Today',
  },
];

function StatCard({ label, value, sub, badge, icon: Icon, accent, gradient, delay }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between h-full group animate-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: '0px 2px 4px 0 rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '1px 8px 16px 0 rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0px 2px 4px 0 rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top accent bar — like kpriet.ac.in .top-dash */}
      <div className="h-1 w-full absolute top-0 left-0 right-0" style={{ backgroundColor: accent }} />

      {/* Background gradient blob */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-transform duration-500 group-hover:scale-125"
        style={{ background: gradient }}
      />

      <div className="p-5 pt-6 flex flex-col gap-3 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
              <span
                className="text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide"
                style={{ color: accent, background: `${accent}15`, border: `1px solid ${accent}30` }}
              >
                {badge}
              </span>
            </div>
            <p
              className="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums leading-none"
              style={{ color: 'var(--text-primary)' }}
            >
              {value}
            </p>
          </div>

          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-sm"
            style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
          >
            <Icon size={21} strokeWidth={2} style={{ color: accent }} />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <p className="text-xs font-normal text-[var(--text-secondary)] truncate" title={sub}>{sub}</p>
          <span className="text-[10.5px] font-semibold flex items-center gap-0.5 flex-shrink-0" style={{ color: '#1B924B' }}>
            <ArrowUpRight size={12} />
            <span>Live</span>
          </span>
        </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 w-full">
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
          delay={i * 60}
        />
      ))}
    </div>
  );
}
