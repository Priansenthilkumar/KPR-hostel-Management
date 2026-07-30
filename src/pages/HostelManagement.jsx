// src/pages/HostelManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  User,
  Calendar,
  Check,
  Trash2,
  Sparkles,
  MessageSquare,
  Wrench,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/UI/Button';
import { hostelService } from '../services/hostelService';

export default function HostelManagement() {
  const navigate = useNavigate();

  // Duty Logs State connected to backend service
  const [dutyLogs, setDutyLogs] = useState(() => hostelService.getDutyLogs());

  // Student Remarks State connected to backend service
  const [remarks, setRemarks] = useState(() => hostelService.getStudentRemarks());

  // Rectification Modal Input State
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionText, setResolutionText] = useState('');
  const [filterTab, setFilterTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with hostelService and listen for live data update events
  useEffect(() => {
    const handleDataUpdate = () => {
      setDutyLogs(hostelService.getDutyLogs());
      setRemarks(hostelService.getStudentRemarks());
    };
    window.addEventListener('kpr_data_updated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);
    return () => {
      window.removeEventListener('kpr_data_updated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  // Mark Remark as Rectified
  const handleConfirmRectified = (id) => {
    const note = resolutionText.trim() || 'Issue inspected & rectified by Warden Committee.';
    hostelService.toggleRectified(id, note);
    setResolvingId(null);
    setResolutionText('');
    toast.success('Remark marked as RECTIFIED! ✅');
  };

  const handleDeleteRemark = (id) => {
    hostelService.deleteStudentRemark(id);
    toast.success('Remark deleted.');
  };

  const filteredRemarks = remarks.filter((r) => {
    if (filterTab === 'Pending' && r.rectified) return false;
    if (filterTab === 'Rectified' && !r.rectified) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.roomNo.toLowerCase().includes(q) ||
        r.block.toLowerCase().includes(q) ||
        r.remark.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = remarks.filter((r) => !r.rectified).length;
  const rectifiedCount = remarks.filter((r) => r.rectified).length;

  return (
    <div className="hostel-management-page max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 flex flex-col gap-8 page-enter">
      
      {/* ── Page Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white p-6 sm:p-8 shadow-xl border border-[#245767]">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#3DA1D1]/15 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6">
          <div className="max-w-2xl flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#3DA1D1] mb-3 backdrop-blur-xs">
              <ShieldCheck size={14} className="text-[#3DA1D1]" />
              <span>Hostel Warden Administration Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              KPR Hostels Management & Warden Duty Oversight
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-[#B0D0D8] leading-relaxed max-w-xl">
              Track Warden, Deputy Warden, & Resident Tutor in/out duty hours, log student remarks, and verify issue rectifications.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="success"
                size="md"
                onClick={() => navigate('/hostel-add-entry')}
                className="shadow-md text-xs font-bold flex items-center gap-1.5"
              >
                <PlusCircle size={15} />
                <span>Log New Duty Shift / Entry</span>
              </Button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-row sm:flex-col items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-inner">
            <div className="text-center px-3">
              <span className="text-[10px] font-bold uppercase text-[#B0D0D8] block">Pending Issues</span>
              <strong className="text-xl font-extrabold text-amber-400">{pendingCount}</strong>
            </div>
            <div className="h-8 w-px sm:w-full sm:h-px bg-white/15" />
            <div className="text-center px-3">
              <span className="text-[10px] font-bold uppercase text-[#B0D0D8] block">Rectified Issues</span>
              <strong className="text-xl font-extrabold text-emerald-400">{rectifiedCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: Wardens, Deputy Wardens & Tutors Duty Log Overview ── */}
      <div className="card p-5 sm:p-6 rounded-2xl flex flex-col gap-6 shadow-xs border border-[var(--border)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-[#3DA1D1] flex items-center justify-center flex-shrink-0">
              <UserCheck size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-primary)] leading-tight">
                Wardens, Deputy Wardens & Tutors Duty Log Overview
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Overview of check-in dates, in-times, and out-times for supervisory hostel staff ({dutyLogs.length} shifts recorded)
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/hostel-add-entry')}
            className="text-xs font-bold flex items-center gap-1.5 self-end sm:self-auto"
          >
            <PlusCircle size={14} className="text-[#3DA1D1]" />
            <span>Log Staff Duty Shift</span>
          </Button>
        </div>

        {/* Duty Logs Table */}
        {dutyLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] font-medium bg-[var(--bg-subtle)] rounded-xl border border-dashed border-[var(--border)]">
            No warden duty logs recorded yet. Click <strong className="text-sky-500 cursor-pointer underline" onClick={() => navigate('/hostel-add-entry')}>Log Staff Duty Shift</strong> to record a duty shift.
          </div>
        ) : (
          <div className="overflow-x-auto w-full border border-[var(--border)] rounded-xl">
            <table className="data-table w-full text-xs">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Designation</th>
                  <th>Hostel Block</th>
                  <th>Date</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {dutyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="font-bold text-[var(--text-primary)]">{log.name}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-[#3DA1D1] font-bold text-[10.5px]">
                        {log.designation}
                      </span>
                    </td>
                    <td className="text-[var(--text-secondary)] font-semibold">{log.block}</td>
                    <td className="whitespace-nowrap font-semibold">{log.date}</td>
                    <td className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {log.inTime}
                    </td>
                    <td className="font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {log.outTime}
                    </td>
                    <td className="text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          log.status === 'Completed'
                            ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-600 border border-amber-500/30 animate-pulse'
                        }`}
                      >
                        {log.status || (log.outTime === 'On Duty' ? 'On Duty' : 'Completed')}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete duty log for ${log.name}?`)) {
                            hostelService.deleteDutyLog(log.id);
                            toast.success('Duty log deleted!');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-500 transition-colors"
                        title="Delete Duty Log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── SECTION 2 & 3: Student Remarks & Rectification Tracker Overview ── */}
      <div className="card p-5 sm:p-6 rounded-2xl flex flex-col gap-6 shadow-xs border border-[var(--border)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-primary)] leading-tight">
                Student Remarks & Rectification Board Overview
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Track remarks asked from students and verify whether they are rectified or pending
              </p>
            </div>
          </div>

          {/* Search, Filter Tabs & Add Remark Link */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/hostel-add-entry')}
              className="text-xs font-bold flex items-center gap-1.5 mr-1"
            >
              <PlusCircle size={14} className="text-[#52B74A]" />
              <span>Add Remark</span>
            </Button>

            <div className="relative flex-1 md:w-48">
              <input
                type="text"
                placeholder="Search remarks or block..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input text-xs pl-8 h-8 py-1"
              />
              <Search size={14} className="absolute left-2.5 top-2 text-[var(--text-muted)]" />
            </div>

            <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border border-[var(--border)]">
              {['All', 'Pending', 'Rectified'].map((tab) => (
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
        </div>

        {/* Remarks & Rectification Cards */}
        {filteredRemarks.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] font-medium bg-[var(--bg-subtle)] rounded-xl border border-dashed border-[var(--border)]">
            No student remarks found for filter "{filterTab}".
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filteredRemarks.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col gap-3 text-xs ${
                  item.rectified
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-amber-500/5 border-amber-500/30'
                }`}
              >
                {/* Top Info Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[var(--text-primary)] text-sm">
                      {item.studentName}
                    </span>
                    <span className="text-[11px] font-semibold text-[#3DA1D1]">
                      ({item.block} • {item.roomNo})
                    </span>
                  </div>

                  {/* Rectification Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[10.5px] font-extrabold flex items-center gap-1.5 ${
                      item.rectified
                        ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-600 border border-amber-500/40 animate-pulse'
                    }`}
                  >
                    {item.rectified ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    <span>{item.rectified ? 'RECTIFIED' : 'PENDING RECTIFICATION'}</span>
                  </span>
                </div>

                {/* Remark Text */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/60 dark:bg-black/20 text-[var(--text-muted)] px-2 py-0.5 rounded-md font-bold uppercase border border-[var(--border)]">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">
                      Date: {item.date}
                    </span>
                  </div>
                  <p className="text-[var(--text-primary)] font-medium leading-relaxed mt-1 text-xs sm:text-sm bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-[var(--border)]">
                    "{item.remark}"
                  </p>
                </div>

                {/* Rectification Note if Rectified */}
                {item.rectified && item.resolutionNote && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-semibold text-xs leading-relaxed">
                    <Check size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                    <div>
                      <span className="font-extrabold uppercase text-[10px] block text-emerald-600">
                        Rectification Details:
                      </span>
                      {item.resolutionNote}
                      {item.rectifiedAt && (
                        <span className="opacity-75 block text-[10px] mt-0.5">
                          Rectified on: {item.rectifiedAt}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <div>
                    {!item.rectified && (
                      <>
                        {resolvingId === item.id ? (
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter resolution notes (e.g., Plumber repaired tap)..."
                              value={resolutionText}
                              onChange={(e) => setResolutionText(e.target.value)}
                              className="form-input text-xs h-9 py-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleConfirmRectified(item.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#52B74A] hover:bg-[#44A03C] text-white text-xs font-bold whitespace-nowrap shadow-xs"
                            >
                              Confirm Rectified
                            </button>
                            <button
                              type="button"
                              onClick={() => setResolvingId(null)}
                              className="px-2 py-1 text-xs text-[var(--text-muted)] font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setResolvingId(item.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#52B74A] hover:bg-[#44A03C] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                          >
                            <Wrench size={14} />
                            <span>Mark as Rectified</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteRemark(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                    title="Delete Remark"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
