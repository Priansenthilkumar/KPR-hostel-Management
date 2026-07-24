// src/components/Records/FilterBar.jsx
import { X, Filter, Search, RotateCcw } from 'lucide-react';
import { days, mealTypes } from '../../data/menuData';
import { COOKS } from '../../constants/cooks';

function FilterField({ children, className = '' }) {
  return <div className={`relative ${className}`}>{children}</div>;
}

export default function FilterBar({ filters, onChange, onReset }) {
  const hasFilters = filters.search || filters.day || filters.meal || filters.cook || filters.date;

  return (
    <div className="card p-4 mb-5 rounded-2xl animate-fade-in shadow-xs">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#52B74A]/15 text-[#52B74A] flex items-center justify-center flex-shrink-0 font-bold">
            <Filter size={14} strokeWidth={2.2} />
          </div>
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
            Filter & Search Database
          </span>
        </div>

        {hasFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-bold transition-colors"
          >
            <RotateCcw size={12} strokeWidth={2.2} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter inputs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <FilterField className="sm:col-span-2 lg:col-span-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search main course, cook, remarks..."
              className="form-input text-xs h-9.5 pl-8"
              value={filters.search}
              onChange={(e) => onChange('search', e.target.value)}
              aria-label="Search records"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-[var(--text-muted)]" />
          </div>
        </FilterField>

        {/* Date Filter */}
        <FilterField>
          <input
            type="date"
            className="form-input text-xs h-9.5"
            value={filters.date}
            onChange={(e) => onChange('date', e.target.value)}
            title="Filter by date"
            aria-label="Filter by date"
          />
        </FilterField>

        {/* Day Filter */}
        <FilterField>
          <select
            className="form-select text-xs h-9.5"
            value={filters.day}
            onChange={(e) => onChange('day', e.target.value)}
            aria-label="Filter by day"
          >
            <option value="">All Days</option>
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </FilterField>

        {/* Meal Filter */}
        <FilterField>
          <select
            className="form-select text-xs h-9.5"
            value={filters.meal}
            onChange={(e) => onChange('meal', e.target.value)}
            aria-label="Filter by meal"
          >
            <option value="">All Meals</option>
            {mealTypes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </FilterField>

        {/* Cook Filter */}
        <FilterField>
          <select
            className="form-select text-xs h-9.5"
            value={filters.cook}
            onChange={(e) => onChange('cook', e.target.value)}
            aria-label="Filter by cook"
          >
            <option value="">All Cooks</option>
            {COOKS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FilterField>
      </div>
    </div>
  );
}
