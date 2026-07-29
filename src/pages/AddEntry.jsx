// src/pages/AddEntry.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Edit3, ShieldCheck } from 'lucide-react';
import EntryForm from '../components/Entry/EntryForm';
import { storageService } from '../services/storage';

export default function AddEntry() {
  const { id } = useParams();

  const editEntry = useMemo(() => {
    if (!id) return null;
    return storageService.getEntries().find((e) => e.id === id) || null;
  }, [id]);

  const isEdit = Boolean(id);

  return (
    <div className="max-w-[1000px] w-full mx-auto px-6 pt-8 pb-12 entry-page page-enter">
      {/* Header card */}
      <div className="mb-6">
        <Link
          to="/records"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#52B74A] hover:underline mb-3 transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={2.2} />
          Back to Records Database
        </Link>

        <div className="flex items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white shadow-md border border-[#245767]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#52B74A]/20 border border-[#52B74A]/30 flex items-center justify-center text-[#52B74A] flex-shrink-0">
              {isEdit ? <Edit3 size={24} strokeWidth={2.2} /> : <PlusCircle size={24} strokeWidth={2.2} />}
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {isEdit ? 'Edit Meal Log Entry' : 'Log New Hostel Meal Entry'}
              </h1>
              <p className="text-xs sm:text-sm text-[#B0D0D8] mt-0.5 truncate">
                {isEdit
                  ? 'Modify entry parameters, strength headcount, and wastage figures'
                  : 'Record meal schedule, raw materials, cook assignment & wastage figures'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#52B74A] border border-white/15">
            <ShieldCheck size={14} />
            <span>KPR Audit Form</span>
          </div>
        </div>
      </div>

      {isEdit && !editEntry ? (
        <div className="card p-10 text-center rounded-2xl">
          <p className="text-[var(--text-secondary)] font-medium">Record not found. It may have been deleted.</p>
          <Link
            to="/records"
            className="inline-flex items-center gap-1.5 text-[#52B74A] hover:underline text-xs font-bold mt-3"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Return to Records Database
          </Link>
        </div>
      ) : (
        <EntryForm editEntry={editEntry} />
      )}
    </div>
  );
}
