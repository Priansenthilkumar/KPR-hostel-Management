// src/pages/FoodMenu.jsx
import { useState, useMemo } from 'react';
import {
  Utensils,
  Search,
  Calendar,
  Sun,
  MoonStar,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { menuData, days } from '../data/menuData';

const MEAL_ICONS = {
  Breakfast: Sun,
  Lunch: Utensils,
  Dinner: MoonStar,
};

const MEAL_TIMINGS = {
  Breakfast: '7:30 AM - 9:00 AM',
  Lunch: '12:30 PM - 2:00 PM',
  Dinner: '7:30 PM - 9:00 PM',
};

const MEAL_COLORS = {
  Breakfast: 'from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600',
  Lunch: 'from-[#52B74A]/10 to-emerald-500/10 border-[#52B74A]/30 text-[#52B74A]',
  Dinner: 'from-[#174351]/10 to-blue-900/10 border-[#174351]/30 text-[#174351]',
};

export default function FoodMenu() {
  const todayDayName = useMemo(() => {
    const d = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return days.includes(d) ? d : 'Monday';
  }, []);

  const [selectedDay, setSelectedDay] = useState(todayDayName);
  const [searchQuery, setSearchQuery] = useState('');

  // Search matching across all days & meals
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results = [];

    days.forEach((d) => {
      const dayMeals = menuData[d] || {};
      Object.entries(dayMeals).forEach(([meal, items]) => {
        const matchingItems = items.filter((item) => item.toLowerCase().includes(q));
        if (matchingItems.length > 0) {
          results.push({ day: d, meal, items: matchingItems, allItems: items });
        }
      });
    });

    return results;
  }, [searchQuery]);

  const currentDayMenu = menuData[selectedDay] || {};

  return (
    <div className="max-w-[1280px] w-full mx-auto px-6 pt-8 pb-12 page-enter">
      
      {/* ── Executive Header Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 mb-6 rounded-2xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white shadow-md border border-[#245767]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#52B74A]/20 border border-[#52B74A]/30 flex items-center justify-center text-[#52B74A] flex-shrink-0">
            <Utensils size={24} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52B74A] uppercase tracking-wider mb-0.5">
              <span>Official KPR Dining Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hostel Food Menu
            </h1>
            <p className="text-xs sm:text-sm text-[#B0D0D8] mt-0.5">
              Weekly meal schedule, dish breakdown & dining timings for KPR Hostels
            </p>
          </div>
        </div>

        {/* Dish Search Input */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <input
            type="text"
            placeholder="Search dish (e.g. Briyani, Dosa)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-white/60 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-white/20 focus:outline-none focus:border-[#52B74A]"
          />
          <Search size={14} className="absolute left-3 top-3 text-white/60" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-white/60 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Search Results Banner (If searching) ── */}
      {searchQuery.trim() !== '' ? (
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Search Results for <span className="text-[#52B74A]">"{searchQuery}"</span>
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-semibold">
              Found {searchResults.length} matching meal sessions
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="card p-8 text-center rounded-2xl">
              <p className="text-xs font-semibold text-[var(--text-muted)]">
                No dishes matching "{searchQuery}" found in the weekly menu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((res, idx) => (
                <div
                  key={`${res.day}-${res.meal}-${idx}`}
                  className="card p-4 rounded-2xl flex flex-col gap-2.5 border border-[var(--border)] hover:border-[#52B74A]/40 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <span className="text-xs font-extrabold text-[#52B74A]">{res.day}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                      {res.meal}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.allItems.map((item) => {
                      const isMatch = item.toLowerCase().includes(searchQuery.toLowerCase());
                      return (
                        <span
                          key={item}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                            isMatch
                              ? 'bg-[#52B74A] text-white border-[#52B74A] font-bold shadow-xs'
                              : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border)]'
                          }`}
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── Today's Mess Spotlight Card ── */}
          <div className="card p-6 mb-8 rounded-2xl border-2 border-[#52B74A]/30 bg-gradient-to-r from-[#52B74A]/5 via-transparent to-[#174351]/5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#52B74A] text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#52B74A] uppercase tracking-wider">
                      Today's Live Menu
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#52B74A] text-white">
                      {todayDayName}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Active meal schedule serving today at KPR Hostel Mess</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDay(todayDayName)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#52B74A] hover:underline"
              >
                <span>View Full {todayDayName} Schedule</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Breakfast', 'Lunch', 'Dinner'].map((meal) => {
                const Icon = MEAL_ICONS[meal] || Utensils;
                const items = menuData[todayDayName]?.[meal] || [];
                return (
                  <div
                    key={meal}
                    className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col gap-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-[#52B74A]" />
                        <span className="text-xs font-extrabold text-[var(--text-primary)]">{meal}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
                        <Clock size={11} />
                        {MEAL_TIMINGS[meal]}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="text-[11.5px] px-2.5 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-secondary)] font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Interactive Day Selector & Daily Menu Table (Mobile-Optimized) ── */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                <Calendar size={16} className="text-[#52B74A]" />
                <span>Daily Menu Table — {selectedDay}</span>
              </h2>
              <span className="text-xs text-[var(--text-muted)] font-semibold">
                Tap day to view table
              </span>
            </div>

            {/* Segmented Day Selector Button Row */}
            <div className="p-1 sm:p-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] shadow-inner grid grid-cols-7 gap-1 select-none">
              {days.map((d) => {
                const isSelected = selectedDay === d;
                const isToday = d === todayDayName;
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`py-2 sm:py-2.5 px-0.5 sm:px-1 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all duration-200 flex flex-col items-center justify-center leading-tight border ${
                      isSelected
                        ? 'bg-[#52B74A] text-white border-[#52B74A] shadow-xs scale-[1.02]'
                        : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      <span>{d.slice(0, 3)}</span>
                      {isToday && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Today" />}
                    </div>
                    <span className="text-[9px] font-normal opacity-80 hidden sm:inline">{d}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Selected Day Dedicated Menu Table ── */}
            <div className="card p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-[#52B74A]">{selectedDay} Menu Table</span>
                  {selectedDay === todayDayName && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#52B74A] text-white uppercase">
                      Today
                    </span>
                  )}
                </div>
                <span className="text-xs text-[var(--text-muted)] font-bold">3 Meals Served</span>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[11px] font-extrabold uppercase text-[var(--text-muted)] bg-[var(--bg-subtle)]">
                      <th className="py-2.5 px-3 w-28 sm:w-36">Meal</th>
                      <th className="py-2.5 px-3 w-32 sm:w-40">Timing</th>
                      <th className="py-2.5 px-3">Items Served</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-xs">
                    {['Breakfast', 'Lunch', 'Dinner'].map((meal) => {
                      const Icon = MEAL_ICONS[meal] || Utensils;
                      const items = currentDayMenu[meal] || [];
                      const colorBadge =
                        meal === 'Breakfast'
                          ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                          : meal === 'Lunch'
                          ? 'bg-[#52B74A]/15 text-[#52B74A] border-[#52B74A]/30'
                          : 'bg-[#174351]/15 text-[#174351] dark:text-[#3DA1D1] border-[#174351]/30';

                      return (
                        <tr key={meal} className="hover:bg-[var(--bg-subtle)] transition-colors">
                          <td className="py-3 px-3 align-top font-bold">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-extrabold ${colorBadge}`}>
                              <Icon size={13} />
                              <span>{meal}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 align-top text-[11px] font-semibold text-[var(--text-muted)] whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{MEAL_TIMINGS[meal]}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 align-top">
                            <div className="flex flex-wrap gap-1.5">
                              {items.map((item) => (
                                <span
                                  key={item}
                                  className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] font-semibold leading-relaxed"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Selected Day Card Visual View ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {['Breakfast', 'Lunch', 'Dinner'].map((meal) => {
              const Icon = MEAL_ICONS[meal] || Utensils;
              const items = currentDayMenu[meal] || [];

              return (
                <div
                  key={meal}
                  className="card p-5 sm:p-6 rounded-2xl flex flex-col gap-4 shadow-xs border border-[var(--border)] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#52B74A]/15 text-[#52B74A] flex items-center justify-center font-bold">
                        <Icon size={18} strokeWidth={2.2} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[var(--text-primary)] leading-none">
                          {meal}
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1 font-semibold">
                          <Clock size={11} />
                          {MEAL_TIMINGS[meal]}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-secondary)]">
                      {items.length} items
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {items.map((dish) => (
                      <div
                        key={dish}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)]"
                      >
                        <CheckCircle2 size={15} className="text-[#52B74A] flex-shrink-0" />
                        <span>{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Complete 7-Day Menu Tables Stack (Every Day Table View for Mobile & Desktop) ── */}
          <div className="card p-4 sm:p-6 rounded-2xl flex flex-col gap-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-[#52B74A]" />
                <h3 className="font-extrabold text-xs sm:text-sm text-[var(--text-primary)] uppercase tracking-wider">
                  Full 7-Day Weekly Mess Menu Tables
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#52B74A]/15 text-[#52B74A] border border-[#52B74A]/30">
                All 7 Days
              </span>
            </div>

            {/* Stacked Tables for Every Single Day */}
            <div className="flex flex-col gap-6">
              {days.map((dayName) => {
                const isToday = dayName === todayDayName;
                const isSelected = dayName === selectedDay;
                const dayMenu = menuData[dayName] || {};

                return (
                  <div
                    key={dayName}
                    className={`rounded-2xl border transition-all p-4 ${
                      isSelected
                        ? 'border-[#52B74A] bg-[#52B74A]/5 shadow-sm'
                        : 'border-[var(--border)] bg-[var(--bg-card)]'
                    }`}
                  >
                    {/* Day Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border)] mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[var(--text-primary)]">{dayName} Menu</span>
                        {isToday && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#52B74A] text-white uppercase">
                            Today
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedDay(dayName)}
                        className="text-xs font-bold text-[#52B74A] hover:underline"
                      >
                        Select Day
                      </button>
                    </div>

                    {/* Day Table */}
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[var(--border)] text-[10.5px] font-extrabold uppercase text-[var(--text-muted)] bg-[var(--bg-subtle)]">
                            <th className="py-2 px-3 w-28">Meal</th>
                            <th className="py-2 px-3 w-32">Timing</th>
                            <th className="py-2 px-3">Dishes Served</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {['Breakfast', 'Lunch', 'Dinner'].map((meal) => {
                            const Icon = MEAL_ICONS[meal] || Utensils;
                            const items = dayMenu[meal] || [];

                            return (
                              <tr key={meal} className="hover:bg-[var(--bg-subtle)]/50">
                                <td className="py-2.5 px-3 font-bold align-top">
                                  <span className="inline-flex items-center gap-1 text-[11.5px] text-[var(--text-primary)]">
                                    <Icon size={13} className="text-[#52B74A]" />
                                    <span>{meal}</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-[11px] text-[var(--text-muted)] font-semibold align-top whitespace-nowrap">
                                  {MEAL_TIMINGS[meal]}
                                </td>
                                <td className="py-2.5 px-3 text-xs text-[var(--text-secondary)] font-medium align-top leading-relaxed">
                                  {items.join(', ')}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
