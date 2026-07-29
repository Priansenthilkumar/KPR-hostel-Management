// src/pages/HostelSchedule.jsx
import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bell,
  Sparkles,
} from 'lucide-react';
import Button from '../components/UI/Button';

const WEEKDAYS = [
  {
    day: 'Monday',
    gateOpen: '06:00 AM',
    studyHours: '09:00 PM - 10:30 PM',
    outingCurfew: '08:30 PM',
    nightRollCall: '09:30 PM',
    specialNote: 'Weekday Regular Schedule & Mandatory Study Hours',
  },
  {
    day: 'Tuesday',
    gateOpen: '06:00 AM',
    studyHours: '09:00 PM - 10:30 PM',
    outingCurfew: '08:30 PM',
    nightRollCall: '09:30 PM',
    specialNote: 'Room Cleanliness Inspection Day (05:00 PM)',
  },
  {
    day: 'Wednesday',
    gateOpen: '06:00 AM',
    studyHours: '09:00 PM - 10:30 PM',
    outingCurfew: '08:30 PM',
    nightRollCall: '09:30 PM',
    specialNote: 'Mid-week Campus Outing Permitted till 08:30 PM',
  },
  {
    day: 'Thursday',
    gateOpen: '06:00 AM',
    studyHours: '09:00 PM - 10:30 PM',
    outingCurfew: '08:30 PM',
    nightRollCall: '09:30 PM',
    specialNote: 'Sports & Gym Timings: 05:30 PM - 07:30 PM',
  },
  {
    day: 'Friday',
    gateOpen: '06:00 AM',
    studyHours: '09:00 PM - 10:30 PM',
    outingCurfew: '08:30 PM',
    nightRollCall: '09:30 PM',
    specialNote: 'Weekend Gate Pass Verification at Warden Office',
  },
  {
    day: 'Saturday',
    gateOpen: '06:00 AM',
    studyHours: 'Optional Study',
    outingCurfew: '08:30 PM',
    nightRollCall: '09:30 PM',
    specialNote: 'Outing Allowed from 01:30 PM - 08:30 PM',
  },
  {
    day: 'Sunday',
    gateOpen: '06:00 AM',
    studyHours: 'Quiet Hours Post 10 PM',
    outingCurfew: '07:30 PM',
    nightRollCall: '09:00 PM',
    specialNote: 'Full Day Outing (10:00 AM - 07:30 PM) & Family Visits',
  },
];

export default function HostelSchedule() {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const currentSchedule = WEEKDAYS.find((w) => w.day === selectedDay) || WEEKDAYS[0];

  return (
    <div className="hostel-schedule-page max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 flex flex-col gap-8 page-enter">
      
      {/* ── Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white p-6 sm:p-8 shadow-xl border border-[#245767]">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#3DA1D1]/15 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6">
          <div className="max-w-2xl flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#3DA1D1] mb-3 backdrop-blur-xs">
              <FileText size={14} className="text-[#3DA1D1]" />
              <span>Official Hostel Timings & Guidelines</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Hostel Rules & Weekly Timings Schedule
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-[#B0D0D8] leading-relaxed max-w-xl">
              Inspect daily gate opening hours, study hours, evening outing deadlines, and night roll call schedules across all 9 hostel blocks.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-inner">
            <Clock size={32} className="text-[#52B74A] mb-1" />
            <span className="text-[11px] font-extrabold text-white">Curfew: 08:30 PM</span>
          </div>
        </div>
      </div>

      {/* ── Day Selector Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {WEEKDAYS.map((w) => (
          <button
            type="button"
            key={w.day}
            onClick={() => setSelectedDay(w.day)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedDay === w.day
                ? 'bg-[#52B74A] text-white shadow-md scale-105'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            {w.day}
          </button>
        ))}
      </div>

      {/* ── Daily Schedule Card Details ── */}
      <div className="card p-6 rounded-3xl border border-[var(--border)] shadow-md flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#52B74A]/10 text-[#52B74A] flex items-center justify-center font-extrabold text-lg">
              <Calendar size={22} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] leading-tight">
                {currentSchedule.day} Hostel Schedule
              </h2>
              <span className="text-xs font-semibold text-[#3DA1D1]">
                {currentSchedule.specialNote}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Gate Opening</span>
            <strong className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {currentSchedule.gateOpen}
            </strong>
            <span className="text-[10px] text-[var(--text-secondary)]">Main Hostel Gate Opens</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Outing Curfew</span>
            <strong className="text-lg font-extrabold text-red-500">
              {currentSchedule.outingCurfew}
            </strong>
            <span className="text-[10px] text-red-400 font-semibold">Strict Gate Closure</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Study & Quiet Hours</span>
            <strong className="text-lg font-extrabold text-[#3DA1D1]">
              {currentSchedule.studyHours}
            </strong>
            <span className="text-[10px] text-[var(--text-secondary)]">Corridor Quiet Period</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Night Roll Call</span>
            <strong className="text-lg font-extrabold text-amber-500">
              {currentSchedule.nightRollCall}
            </strong>
            <span className="text-[10px] text-[var(--text-secondary)]">Warden Room Attendance</span>
          </div>

        </div>
      </div>

      {/* ── Official Rules & Guidelines ── */}
      <div className="card p-6 rounded-3xl border border-[var(--border)] shadow-xs flex flex-col gap-4">
        <h3 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#3DA1D1]" />
          <span>General Hostel Code of Conduct</span>
        </h3>

        <ul className="flex flex-col gap-2.5 text-xs text-[var(--text-secondary)]">
          <li className="flex items-start gap-2 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
            <CheckCircle2 size={16} className="text-[#52B74A] mt-0.5 flex-shrink-0" />
            <span><strong>Institutional ID Card:</strong> Students must produce their official KPR ID Card at the gate security counter when entering or leaving.</span>
          </li>
          <li className="flex items-start gap-2 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
            <CheckCircle2 size={16} className="text-[#52B74A] mt-0.5 flex-shrink-0" />
            <span><strong>Gate Pass Requirement:</strong> Overnight leave or out-of-station travel requires an approved Gate Pass generated via the portal.</span>
          </li>
          <li className="flex items-start gap-2 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
            <CheckCircle2 size={16} className="text-[#52B74A] mt-0.5 flex-shrink-0" />
            <span><strong>Maintenance Complaints:</strong> Report water, electrical, or room maintenance issues directly using the Warden Remarks Desk.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
