// src/components/Dashboard/ChartSection.jsx
import { useState, useEffect, lazy, Suspense } from 'react';
import { UtensilsCrossed, TrendingDown, ChefHat } from 'lucide-react';

const MealChart    = lazy(() => import('../Charts/MealChart'));
const WastageChart = lazy(() => import('../Charts/WastageChart'));
const CookChart    = lazy(() => import('../Charts/CookChart'));

const ChartSkeleton = () => (
  <div className="skeleton h-[220px] w-full rounded-xl" />
);

const CHART_DEFS = [
  { title: 'Meal-wise Entries',       icon: UtensilsCrossed, accent: '#174351', bg: '#EBF4F6', Component: MealChart },
  { title: 'Daily Wastage Trend',     icon: TrendingDown,    accent: '#E65100', bg: '#FFF7ED', Component: WastageChart },
  { title: 'Cook-wise Distribution',  icon: ChefHat,         accent: '#52B74A', bg: '#EAF7EA', Component: CookChart },
];

export default function ChartSection({ entries }) {
  return (
    <div className="dashboard-charts grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {CHART_DEFS.map(({ title, icon: Icon, accent, bg, Component }) => (
        <div key={title} className="card dashboard-chart-card flex flex-col h-full p-6 rounded-2xl animate-fade-in">
          {/* Card header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: bg }}
            >
              <Icon size={16} strokeWidth={2} style={{ color: accent }} />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm leading-none">
              {title}
            </h3>
          </div>
          <div className="flex-1 min-h-[220px] flex flex-col justify-center">
            <Suspense fallback={<ChartSkeleton />}>
              <Component entries={entries} />
            </Suspense>
          </div>
        </div>
      ))}
    </div>
  );
}
