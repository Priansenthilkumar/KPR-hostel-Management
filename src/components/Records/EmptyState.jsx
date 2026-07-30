// src/components/Records/EmptyState.jsx
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PlusCircle, Sparkles } from 'lucide-react';

export default function EmptyState({ isFiltered = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#174351] via-[#1D5060] to-[#52B74A] flex items-center justify-center shadow-xl">
          <ClipboardList size={48} className="text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-md border-2 border-white dark:border-[#174351]">
          <span className="text-white font-bold text-sm">0</span>
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">
        {isFiltered ? 'No matching records' : 'No entries yet'}
      </h3>
      <p className="text-[var(--text-secondary)] text-sm max-w-sm font-medium">
        {isFiltered
          ? 'Try adjusting your search filters to find what you\'re looking for.'
          : 'Start tracking hostel food by adding your first meal entry.'}
      </p>

      {!isFiltered && (
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
      )}
    </div>
  );
}
