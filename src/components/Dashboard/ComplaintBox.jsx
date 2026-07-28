// src/components/Dashboard/ComplaintBox.jsx
import { useState, useEffect } from 'react';
import {
  Bug,
  Send,
  CheckCircle2,
  Clock,
  User,
  Wrench,
  Trash2,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';

const FAULT_CATEGORIES = [
  'PDF Export / Print Fault',
  'Food Menu Schedule Mistake',
  'Meal Log / Calculation Error',
  'Mobile UI Layout Glitch',
  'General App Bug / Suggestion',
];

const STORAGE_KEY = 'kpr_app_fault_complaints_v5';

export default function ComplaintBox({ isOpen, onClose }) {
  const [category, setCategory] = useState(FAULT_CATEGORIES[0]);
  const [reporterName, setReporterName] = useState('');
  const [description, setDescription] = useState('');
  const [faults, setFaults] = useState(() => {
    try {
      ['v1', 'v2', 'v3', 'v4'].forEach((v) => {
        localStorage.removeItem(`kpr_app_fault_complaints_${v}`);
      });
      localStorage.removeItem('kpr_app_fault_complaints');
      localStorage.removeItem('complaints');

      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filterTab, setFilterTab] = useState('All');
  const [resolvingId, setResolvingId] = useState(null);
  const [solutionNote, setSolutionNote] = useState('');

  // Persist faults to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(faults));
    } catch (e) {
      console.error('Failed to save app faults:', e);
    }
  }, [faults]);

  if (!isOpen) return null;

  const handleSubmitFault = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please describe the app fault or issue.');
      return;
    }

    const newFault = {
      id: Date.now(),
      name: reporterName.trim() || 'Mess User',
      category,
      description: description.trim(),
      status: 'Pending',
      resolutionNote: '',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      solvedAt: null,
    };

    setFaults([newFault, ...faults]);
    setReporterName('');
    setDescription('');

    toast.success('App fault reported! Our dev team will solve it shortly.', {
      icon: '🛠️',
      duration: 4000,
    });
  };

  const handleMarkAsSolved = (id) => {
    const updated = faults.map((f) => {
      if (f.id === id) {
        return {
          ...f,
          status: 'Solved',
          resolutionNote: solutionNote.trim() || 'Resolved & verified by App Admin team.',
          solvedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        };
      }
      return f;
    });

    setFaults(updated);
    setResolvingId(null);
    setSolutionNote('');
    toast.success('App fault marked as SOLVED!', { icon: '✅' });
  };

  const handleDeleteFault = (id) => {
    setFaults(faults.filter((f) => f.id !== id));
    toast.success('Report deleted.');
  };

  const filteredFaults = faults.filter((f) => {
    if (filterTab === 'Pending') return f.status === 'Pending';
    if (filterTab === 'Solved') return f.status === 'Solved';
    return true;
  });

  const pendingCount = faults.filter((f) => f.status === 'Pending').length;
  const solvedCount = faults.filter((f) => f.status === 'Solved').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-[95vw] max-w-2xl bg-[var(--bg-card)] rounded-3xl shadow-2xl border border-[var(--border)] z-10 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white flex items-start justify-between gap-3 border-b border-[#245767] flex-shrink-0">
          <div className="flex items-start gap-3 min-w-0 pr-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bug size={20} strokeWidth={2.2} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                  App Fault & Bug Resolution Desk
                </h3>
                <span className="text-[9.5px] sm:text-[10px] bg-[#52B74A]/25 text-[#52B74A] border border-[#52B74A]/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">
                  Active Desk
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#B0D0D8] leading-normal">
                Report glitches or bugs in mess management. Admin team will fix it!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0 active:scale-95"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-5">
          
          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border)] text-xs">
            <span className="font-semibold text-[var(--text-secondary)] leading-normal">
              Total Reported Faults: <strong className="text-[var(--text-primary)]">{faults.length}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-extrabold border border-amber-500/30 text-[11px] whitespace-nowrap">
                {pendingCount} Pending
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-extrabold border border-emerald-500/30 text-[11px] whitespace-nowrap">
                {solvedCount} Solved
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitFault} className="flex flex-col gap-4 bg-[var(--bg-subtle)] p-4 rounded-2xl border border-[var(--border)]">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2 leading-snug">
              <Wrench size={14} className="text-[#52B74A] flex-shrink-0" />
              <span className="leading-normal">Report an App Fault or Bug</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider leading-normal whitespace-normal">
                  Fault Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input text-xs h-10 font-medium"
                >
                  {FAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reporter Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1 leading-normal whitespace-normal">
                  <User size={12} className="text-[#3DA1D1] flex-shrink-0" />
                  <span>Your Name / Staff ID (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mess Manager / Student"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="form-input text-xs h-10"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider leading-normal whitespace-normal">
                Describe the Fault or Mistake <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="2"
                placeholder="Explain what went wrong in the app so we can solve it..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input text-xs p-3 leading-relaxed"
                required
              />
            </div>

            <Button type="submit" variant="success" size="md" className="shadow-md self-start text-xs">
              <Send size={14} strokeWidth={2.2} />
              <span>Submit Fault Report</span>
            </Button>
          </form>

          {/* Fault Resolution Board */}
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5 leading-snug">
                <ShieldCheck size={15} className="text-[#52B74A] flex-shrink-0" />
                <span className="leading-normal">App Fault Resolution Log ({faults.length})</span>
              </h4>

              <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border)]">
                {['All', 'Pending', 'Solved'].map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      filterTab === tab
                        ? 'bg-[#52B74A] text-white shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {filteredFaults.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--text-muted)] font-medium bg-[var(--bg-subtle)] rounded-xl border border-dashed border-[var(--border)] leading-normal">
                No {filterTab.toLowerCase()} app faults reported yet. All systems running cleanly!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredFaults.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col gap-2.5 text-xs ${
                      item.status === 'Solved'
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-amber-500/5 border-amber-500/30'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[var(--text-primary)] text-xs leading-normal">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">
                          by {item.name} • {item.date}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                          item.status === 'Solved'
                            ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-600 border border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {item.status === 'Solved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        <span>{item.status}</span>
                      </span>
                    </div>

                    <p className="text-[var(--text-secondary)] font-medium leading-relaxed bg-white/60 dark:bg-black/20 p-2.5 rounded-lg border border-[var(--border)]">
                      "{item.description}"
                    </p>

                    {item.status === 'Solved' && item.resolutionNote && (
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] leading-normal">
                        <Check size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                        <div>
                          <span className="font-extrabold">Solution Note: </span>
                          {item.resolutionNote}
                          {item.solvedAt && <span className="opacity-75"> ({item.solvedAt})</span>}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] mt-1">
                      <div className="flex items-center gap-2">
                        {item.status !== 'Solved' && (
                          <>
                            {resolvingId === item.id ? (
                              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full">
                                <input
                                  type="text"
                                  placeholder="Add resolution note (e.g. Fixed!)..."
                                  value={solutionNote}
                                  onChange={(e) => setSolutionNote(e.target.value)}
                                  className="form-input text-[11px] h-8 py-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleMarkAsSolved(item.id)}
                                  className="px-3 py-1 rounded-md bg-[#52B74A] text-[#52B74A] text-white text-[11px] font-bold whitespace-nowrap"
                                >
                                  Confirm Solved
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setResolvingId(null)}
                                  className="px-2 py-1 text-[11px] text-[var(--text-muted)] font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setResolvingId(item.id)}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#52B74A] hover:bg-[#44A03C] text-white text-[11px] font-bold shadow-xs transition-all"
                              >
                                <CheckCircle2 size={13} />
                                <span>Mark as Solved</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteFault(item.id)}
                        className="p-1 rounded-md hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Delete Fault Log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
