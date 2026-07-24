// src/components/Entry/EntryForm.jsx
import { useEffect, useState, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  AlertCircle,
  RotateCcw,
  Utensils,
  Scale,
  ChefHat,
  Users,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Check,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sun,
  Coffee,
  Sunset,
  MoonStar,
} from 'lucide-react';
import { useEntries } from '../../hooks/useEntries';
import { getDayFromDate, getTodayString } from '../../utils/dateUtils';
import { days, mealTypes } from '../../data/menuData';
import { COOKS } from '../../constants/cooks';
import Button from '../UI/Button';
import Badge from '../UI/Badge';

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 font-semibold mt-1">
      <AlertCircle size={13} className="flex-shrink-0" strokeWidth={2} />
      <span>{message}</span>
    </p>
  );
}

const MEAL_ICONS = {
  Breakfast: Sun,
  Lunch: Utensils,
  Snacks: Coffee,
  Dinner: MoonStar,
};

export default function EntryForm({ editEntry = null }) {
  const { addEntry, updateEntry } = useEntries();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cookScrollRef = useRef(null);

  const defaultValues = useMemo(() => ({
    date:        editEntry?.date        || getTodayString(),
    day:         editEntry?.day         || getDayFromDate(getTodayString()),
    meal:        editEntry?.meal        || 'Breakfast',
    mainCourse:  editEntry?.mainCourse  || '',
    rawMaterial: editEntry?.rawMaterial || '',
    cookName:    editEntry?.cookName    || COOKS[0] || '',
    strength:    editEntry?.strength    || '',
    wastage:     editEntry?.wastage     || '',
    remarks:     editEntry?.remarks     || '',
  }), [editEntry]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const watchDate = watch('date');
  const watchDay  = watch('day');
  const watchMeal = watch('meal');
  const watchCook = watch('cookName');
  const watchWastage = watch('wastage');

  // Auto-update Day when Date changes
  useEffect(() => {
    if (watchDate) {
      const derivedDay = getDayFromDate(watchDate);
      if (derivedDay) setValue('day', derivedDay);
    }
  }, [watchDate, setValue]);

  // Calculations for day index for sliding pill
  const dayIndex = useMemo(() => {
    const idx = days.indexOf(watchDay);
    return idx >= 0 ? idx : 0;
  }, [watchDay]);

  // Calculations for meal index for sliding pill
  const mealIndex = useMemo(() => {
    const idx = mealTypes.indexOf(watchMeal);
    return idx >= 0 ? idx : 0;
  }, [watchMeal]);

  // Wastage live severity calculations
  const wastageVal = parseFloat(watchWastage) || 0;
  const wastageSeverity = wastageVal > 10 ? 'High' : wastageVal > 5 ? 'Moderate' : 'Low';

  const scrollCooks = (direction) => {
    if (cookScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      cookScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editEntry) {
        updateEntry(editEntry.id, data);
        toast.success('Food maintenance entry updated successfully!');
      } else {
        addEntry(data);
        toast.success('New food entry logged successfully!');
      }
      navigate('/records');
    } catch (err) {
      toast.error(err.message || 'Failed to save entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      
      {/* ── Card 1: Schedule & Meal Type Setup ── */}
      <div className="card p-6 rounded-2xl flex flex-col gap-5 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-[#52B74A]/15 text-[#52B74A] flex items-center justify-center font-bold">
            <Calendar size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--text-primary)] leading-none">
              1. Schedule & Meal Timing
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Select date, day of week & meal session using the sliding controls</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Date Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Entry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="form-input text-xs h-10"
              {...register('date', { required: 'Date is required' })}
            />
            <FieldError message={errors.date?.message} />
          </div>
        </div>

        {/* ── UNIQUE SEGMENTED SELECTOR 1: Day of Week ── */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#52B74A]" />
              <span>Day of Week</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] font-bold text-[#52B74A] bg-[#52B74A]/10 px-2 py-0.5 rounded-md">
              {watchDay}
            </span>
          </div>

          {/* Segmented Track */}
          <div className="p-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] shadow-inner grid grid-cols-7 gap-1 select-none">
            {days.map((d) => {
              const isSelected = watchDay === d;
              return (
                <button
                  type="button"
                  key={d}
                  onClick={() => setValue('day', d)}
                  className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all duration-200 flex flex-col items-center justify-center leading-tight border ${
                    isSelected
                      ? 'bg-[#52B74A] text-white border-[#52B74A] shadow-sm scale-[1.02]'
                      : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{d.slice(0, 3)}</span>
                  <span className="text-[9px] font-normal opacity-80 hidden sm:inline">{d}</span>
                </button>
              );
            })}
          </div>
          <FieldError message={errors.day?.message} />
        </div>

        {/* ── UNIQUE SEGMENTED SELECTOR 2: Meal Session ── */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Utensils size={14} className="text-[#52B74A]" />
              <span>Meal Session</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] font-bold text-[#52B74A] bg-[#52B74A]/10 px-2 py-0.5 rounded-md">
              {watchMeal}
            </span>
          </div>

          {/* Segmented Track (Single-Row 4 Columns) */}
          <div className="p-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] shadow-inner grid grid-cols-4 gap-1.5 select-none">
            {mealTypes.map((m) => {
              const isSelected = watchMeal === m;
              const Icon = MEAL_ICONS[m] || Utensils;
              return (
                <button
                  type="button"
                  key={m}
                  onClick={() => setValue('meal', m)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#52B74A] text-white border-[#52B74A] shadow-sm scale-[1.02]'
                      : 'bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.2} className="flex-shrink-0" />
                  <span className="truncate text-[11.5px] sm:text-xs">{m}</span>
                </button>
              );
            })}
          </div>
          <FieldError message={errors.meal?.message} />
        </div>
      </div>

      {/* ── Card 2: Kitchen Operations & Chef Slider ── */}
      <div className="card p-6 rounded-2xl flex flex-col gap-5 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-[#3DA1D1]/15 text-[#3DA1D1] flex items-center justify-center font-bold">
            <ChefHat size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--text-primary)] leading-none">
              2. Kitchen Operations & Chef Selection
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Specify main course menu, raw material quantity & slide to select cook</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Main Course */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Main Course Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Idli & Sambar, Veg Biryani, Chapati & Kurma"
              className="form-input text-xs h-10"
              {...register('mainCourse', { required: 'Main course menu is required' })}
            />
            <FieldError message={errors.mainCourse?.message} />
          </div>

          {/* Raw Material (KG) */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1">
              <Scale size={14} className="text-[#52B74A]" />
              <span>Raw Material Weight (KG)</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 45.5"
              className="form-input text-xs h-10"
              {...register('rawMaterial', {
                required: 'Raw material weight is required',
                min: { value: 0.1, message: 'Weight must be greater than 0' },
              })}
            />
            <FieldError message={errors.rawMaterial?.message} />
          </div>
        </div>

        {/* ── UNIQUE SLIDING CAROUSEL SELECTOR 3: Assigned Cook ── */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <ChefHat size={14} className="text-[#52B74A]" />
              <span>Assigned Cook / Chef (Slide & Click)</span>
              <span className="text-red-500">*</span>
            </label>

            {/* Slide Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollCooks('left')}
                className="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text-primary)] flex items-center justify-center transition-colors border border-[var(--border)]"
                title="Slide left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollCooks('right')}
                className="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text-primary)] flex items-center justify-center transition-colors border border-[var(--border)]"
                title="Slide right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Chef Cards Track */}
          <div
            ref={cookScrollRef}
            className="flex items-center gap-3 overflow-x-auto py-2 px-1 scroll-smooth no-scrollbar select-none"
          >
            {COOKS.map((c) => {
              const isSelected = watchCook === c;
              return (
                <div
                  key={c}
                  onClick={() => setValue('cookName', c)}
                  className={`min-w-[190px] flex-shrink-0 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#52B74A] text-white border-[#52B74A] shadow-md scale-[1.02]'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#52B74A]/15 text-[#52B74A]'
                    }`}>
                      <ChefHat size={18} strokeWidth={2.2} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-extrabold truncate leading-tight">{c}</span>
                      <span className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                        Mess Chef
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-white text-[#52B74A] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Check size={13} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <FieldError message={errors.cookName?.message} />
        </div>
      </div>

      {/* ── Card 3: Headcount Strength & Wastage Audit ── */}
      <div className="card p-6 rounded-2xl flex flex-col gap-5 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
            <Users size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--text-primary)] leading-none">
              3. Headcount & Wastage Audit
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Input headcount served, wastage in KG & observations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Headcount Strength */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1">
              <Users size={14} className="text-[#52B74A]" />
              <span>Student Headcount Served</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 450"
              className="form-input text-xs h-10"
              {...register('strength', {
                required: 'Student headcount strength is required',
                min: { value: 1, message: 'Strength must be at least 1' },
              })}
            />
            <FieldError message={errors.strength?.message} />
          </div>

          {/* Wastage KG with Live Indicator */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={14} className="text-amber-500" />
                <span>Food Wastage (KG)</span>
                <span className="text-red-500">*</span>
              </label>
              {watchWastage !== '' && (
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">Severity:</span>
                  <Badge label={wastageSeverity} />
                </div>
              )}
            </div>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 3.2"
              className="form-input text-xs h-10"
              {...register('wastage', {
                required: 'Wastage weight is required',
                min: { value: 0, message: 'Wastage cannot be negative' },
              })}
            />
            <FieldError message={errors.wastage?.message} />
          </div>

          {/* Remarks Notes */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1">
              <FileText size={14} className="text-[#52B74A]" />
              <span>Remarks / Observations</span>
            </label>
            <textarea
              rows={3}
              placeholder="Optional notes regarding food quality, delay, or special events..."
              className="form-textarea text-xs p-3 rounded-xl"
              {...register('remarks')}
            />
          </div>
        </div>
      </div>

      {/* ── Form Actions Bar ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => reset(defaultValues)}
          disabled={isSubmitting}
        >
          <RotateCcw size={16} strokeWidth={2} />
          Reset
        </Button>

        <Button
          type="submit"
          variant="success"
          size="md"
          disabled={isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <span>Saving...</span>
          ) : (
            <>
              <CheckCircle2 size={17} strokeWidth={2.2} />
              <span>{editEntry ? 'Update Record' : 'Save Meal Entry'}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
