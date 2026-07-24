// src/components/UI/Badge.jsx
const VARIANTS = {
  // Meal types
  Breakfast: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold',
  Lunch:     'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold',
  Snacks:    'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold',
  Dinner:    'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/20 font-bold',
  
  // Wastage status
  Low:       'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold',
  Moderate:  'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold',
  High:      'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/20 font-bold',

  // Fallback for days & others
  default:   'bg-slate-500/10 text-slate-700 dark:text-slate-200 border border-slate-500/20 font-medium',
};

export default function Badge({ label, className = '' }) {
  const cls = VARIANTS[label] || VARIANTS.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] leading-tight select-none ${cls} ${className}`}>
      {label}
    </span>
  );
}
