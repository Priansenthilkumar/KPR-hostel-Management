// src/pages/AddHostelEntry.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  UserCheck,
  MessageSquare,
  Building,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  User,
  FileText,
  Wrench,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/UI/Button';
import { hostelService } from '../services/hostelService';

const HOSTEL_BLOCKS = [
  'Pallavan Hostel',
  'Cheran Hostel',
  'Thiruvalluvar Ground Floor',
  'Thiruvalluvar 1st Floor',
  'Thiruvalluvar 2nd Floor',
  'Thiruvalluvar 3rd Floor',
  'Thiruvalluvar 4th Floor',
  'Bharathi Dorm',
  'Bharathi International',
];

export default function AddHostelEntry() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('duty'); // 'duty' | 'remark'

  // Duty Form States
  const [staffName, setStaffName] = useState('');
  const [designation, setDesignation] = useState('Deputy Warden');
  const [hostelBlock, setHostelBlock] = useState(HOSTEL_BLOCKS[0]);
  const [dutyDate, setDutyDate] = useState(new Date().toISOString().split('T')[0]);
  const [inTime, setInTime] = useState('07:30 PM');
  const [outTime, setOutTime] = useState('10:00 PM');

  // Remark Form States
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [remarkBlock, setRemarkBlock] = useState(HOSTEL_BLOCKS[0]);
  const [category, setCategory] = useState('Water & Plumbing');
  const [remarkText, setRemarkText] = useState('');

  // Submit Duty Form
  const handleSubmitDuty = (e) => {
    e.preventDefault();
    if (!staffName.trim()) {
      toast.error('Please enter Staff Name.');
      return;
    }

    try {
      hostelService.addDutyLog({
        name: staffName.trim(),
        designation,
        block: hostelBlock,
        date: dutyDate,
        inTime: inTime.trim(),
        outTime: outTime.trim() || 'On Duty',
        status: outTime.trim() ? 'Completed' : 'On Duty',
      });

      toast.success('Warden duty in/out log recorded successfully!');
      navigate('/hostel-overview');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save duty entry.');
    }
  };

  // Submit Remark Form
  const handleSubmitRemark = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !remarkText.trim()) {
      toast.error('Please fill in Student Name and Remark details.');
      return;
    }

    try {
      hostelService.addStudentRemark({
        studentName: studentName.trim(),
        rollNo: rollNo.trim() || 'N/A',
        roomNo: roomNo.trim() || 'Hostel',
        block: remarkBlock,
        date: new Date().toISOString().split('T')[0],
        session: 'Daily Feedback',
        category,
        remark: remarkText.trim(),
      });

      toast.success('Student remark recorded successfully!');
      navigate('/hostel-overview');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save student remark.');
    }
  };

  return (
    <div className="add-hostel-entry-page max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 flex flex-col gap-8 page-enter">
      
      {/* ── Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white p-6 sm:p-8 shadow-xl border border-[#245767]">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#3DA1D1]/15 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6">
          <div className="max-w-2xl flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#3DA1D1] mb-3 backdrop-blur-xs">
              <PlusCircle size={14} className="text-[#3DA1D1]" />
              <span>Log New Hostel Entry</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Add Hostel Entry & Warden Duty Log
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-[#B0D0D8] leading-relaxed max-w-xl">
              Record new Warden / Tutor duty check-in times or log student complaints & maintenance issues across all 9 hostel blocks.
            </p>
          </div>
        </div>
      </div>

      {/* ── Entry Type Tabs ── */}
      <div className="flex items-center justify-center sm:justify-start gap-3 border-b border-[var(--border)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('duty')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'duty'
              ? 'bg-[#3DA1D1] text-white shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <UserCheck size={16} />
          <span>Warden / Tutor Duty Shift Log</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('remark')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'remark'
              ? 'bg-[#52B74A] text-white shadow-md'
              : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-subtle)]'
          }`}
        >
          <MessageSquare size={16} />
          <span>Student Remark / Maintenance Issue</span>
        </button>
      </div>

      {/* ── Form Container ── */}
      <div className="card p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-md">
        
        {activeTab === 'duty' ? (
          /* ── FORM 1: Warden Duty Shift ── */
          <form onSubmit={handleSubmitDuty} className="flex flex-col gap-5">
            <h3 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <UserCheck size={18} className="text-[#3DA1D1]" />
              <span>Log Supervisory Staff Duty Shift</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <User size={14} className="text-[#3DA1D1]" />
                  <span>Staff Name *</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. Dr. Arunkumar / Mrs. Jayanthi"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <User size={16} className="absolute left-3 text-[#3DA1D1] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#3DA1D1]" />
                  <span>Designation *</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="form-select pl-10 font-semibold"
                  >
                    <option value="Chief Warden">Chief Warden</option>
                    <option value="Deputy Warden">Deputy Warden</option>
                    <option value="Resident Tutor">Resident Tutor</option>
                    <option value="Floor Tutor">Floor Tutor</option>
                  </select>
                  <ShieldCheck size={16} className="absolute left-3 text-[#3DA1D1] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Building size={14} className="text-[#3DA1D1]" />
                  <span>Hostel Block *</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    className="form-select pl-10 font-semibold"
                  >
                    {HOSTEL_BLOCKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <Building size={16} className="absolute left-3 text-[#3DA1D1] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#3DA1D1]" />
                  <span>Duty Date *</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={dutyDate}
                    onChange={(e) => setDutyDate(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <Calendar size={16} className="absolute left-3 text-[#3DA1D1] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Clock size={14} className="text-[#3DA1D1]" />
                  <span>In Time *</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. 07:30 PM"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <Clock size={16} className="absolute left-3 text-[#3DA1D1] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Clock size={14} className="text-[#3DA1D1]" />
                  <span>Out Time</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. 10:00 PM (or empty if On Duty)"
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                    className="form-input pl-10"
                  />
                  <Clock size={16} className="absolute left-3 text-[#3DA1D1] pointer-events-none" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="success"
              size="lg"
              className="w-full sm:w-auto shadow-md text-sm font-bold flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 size={18} />
              <span>Save Warden Duty Record</span>
            </Button>
          </form>
        ) : (
          /* ── FORM 2: Student Remark ── */
          <form onSubmit={handleSubmitRemark} className="flex flex-col gap-5">
            <h3 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <MessageSquare size={18} className="text-[#52B74A]" />
              <span>Record New Student Remark / Grievance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <User size={14} className="text-[#52B74A]" />
                  <span>Student Name *</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. Rahul K."
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <User size={16} className="absolute left-3 text-[#52B74A] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <FileText size={14} className="text-[#52B74A]" />
                  <span>Roll No / ID</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. 21CS042"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="form-input pl-10"
                  />
                  <FileText size={16} className="absolute left-3 text-[#52B74A] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Building size={14} className="text-[#52B74A]" />
                  <span>Room No</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. R-204"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    className="form-input pl-10"
                  />
                  <Building size={16} className="absolute left-3 text-[#52B74A] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Building size={14} className="text-[#52B74A]" />
                  <span>Hostel Block *</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    value={remarkBlock}
                    onChange={(e) => setRemarkBlock(e.target.value)}
                    className="form-select pl-10 font-semibold"
                  >
                    {HOSTEL_BLOCKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <Building size={16} className="absolute left-3 text-[#52B74A] pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 text-xs">
              <div className="flex flex-col gap-1.5 sm:col-span-1">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Wrench size={14} className="text-[#52B74A]" />
                  <span>Category *</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select pl-10 font-semibold"
                  >
                    <option value="Water & Plumbing">Water & Plumbing</option>
                    <option value="Electricity & Lighting">Electricity & Lighting</option>
                    <option value="Room Maintenance">Room Furniture & Maintenance</option>
                    <option value="Cleanliness">Hygiene & Cleanliness</option>
                    <option value="Discipline/Noise">Discipline & Quiet Hours</option>
                    <option value="General Query">General Hostel Query</option>
                  </select>
                  <Wrench size={16} className="absolute left-3 text-[#52B74A] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-[#52B74A]" />
                  <span>Student Remark Details *</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="What remark or complaint was asked/reported by the student?"
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <MessageSquare size={16} className="absolute left-3 text-[#52B74A] pointer-events-none" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="success"
              size="lg"
              className="w-full sm:w-auto shadow-md text-sm font-bold flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 size={18} />
              <span>Record Student Remark</span>
            </Button>
          </form>
        )}

      </div>

    </div>
  );
}
