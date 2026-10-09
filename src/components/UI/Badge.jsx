// src/components/UI/Badge.jsx
const VARIANTS = {
  // Meal types
  Breakfast: 'bg-[#1B345F]/10 text-[#1B345F] border border-[#1B345F]/20 font-bold',
  Lunch:     'bg-[#1B924B]/10 text-[#1B924B] border border-[#1B924B]/20 font-bold',
  Snacks:    'bg-[#19909B]/10 text-[#19909B] border border-[#19909B]/20 font-bold',
  Dinner:    'bg-[#3BB5DD]/10 text-[#157193] border border-[#3BB5DD]/20 font-bold',
  
  // Wastage status & Risk
  Low:       'bg-[#1B924B]/10 text-[#1B924B] border border-[#1B924B]/20 font-bold',
  Moderate:  'bg-amber-500/15 text-amber-700 border border-amber-500/20 font-bold',
  High:      'bg-red-500/15 text-red-700 border border-red-500/20 font-bold',

  // Gatepass / Duty Statuses
  Approved:  'bg-[#1B924B]/10 text-[#1B924B] border border-[#1B924B]/30 font-extrabold',
  Pending:   'bg-amber-500/15 text-amber-700 border border-amber-500/30 font-extrabold',
  Rejected:  'bg-red-500/15 text-red-700 border border-red-500/30 font-extrabold',

  // Hostel / Warden Log statuses
  Active:    'bg-[#1B345F]/10 text-[#1B345F] border border-[#1B345F]/20 font-bold',
  Rectified: 'bg-[#1B924B]/10 text-[#1B924B] border border-[#1B924B]/20 font-bold',

  // Fallback for days & others
  default:   'bg-slate-500/10 text-slate-700 dark:text-slate-200 border border-slate-500/20 font-medium',
};

export default function Badge({ label, className = '' }) {
  const cls = VARIANTS[label] || VARIANTS.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] leading-tight select-none ${cls} ${className}`}>
      {label}
    </span>
  );
}
