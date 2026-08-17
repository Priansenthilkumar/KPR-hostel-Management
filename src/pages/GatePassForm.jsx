// src/pages/GatePassForm.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  User,
  Building,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
} from 'lucide-react';
import { gatepassService } from '../services/gatepassService';
import { adminManagementService } from '../services/adminManagementService';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Computer Science Engineering',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biomedical Engineering',
  'Artificial Intelligence & Data Science',
  'Information Technology',
  'Biotechnology',
  'Chemical Engineering',
  'Computer Science and Business Systems'
];

const PURPOSES = [
  'Medical Emergency / Hospital',
  
];

export default function GatePassForm() {
  const navigate = useNavigate();
  const activeBlocks = useMemo(() => adminManagementService.getBlocks(), []);

  // Today & Tomorrow default strings
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }, []);

  const [form, setForm] = useState({
    studentName: '',
    rollNo: '',
    wardenName: activeBlocks[0]?.warden || 'NAME',
    block: activeBlocks[0]?.name || 'BLOCK NAME ',
    department: DEPARTMENTS[0],
    purpose: PURPOSES[0],
    depDate: todayStr,
    depTime: '17:00',
    arrDate: tomorrowStr,
    arrTime: '20:00',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.studentName.trim()) {
      setErrorMsg('Student Name is required.');
      toast.error('Student Name is required.');
      return;
    }

    // Validate Departure & Arrival Timestamps
    const depTimestamp = new Date(`${form.depDate}T${form.depTime}`).getTime();
    const arrTimestamp = new Date(`${form.arrDate}T${form.arrTime}`).getTime();

    if (isNaN(depTimestamp) || isNaN(arrTimestamp)) {
      setErrorMsg('Please enter valid departure and arrival dates and times.');
      toast.error('Invalid date or time format.');
      return;
    }

    if (arrTimestamp <= depTimestamp) {
      setErrorMsg('Arrival Date & Time cannot be earlier than or equal to Departure Date & Time.');
      toast.error('Arrival time must be after departure time!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Create Gate Pass
      const createdPass = gatepassService.addGatePass(form);
      toast.success(`Gate pass submitted for ${createdPass.studentName}! Status: Pending Warden Approval`, {
        icon: '🎫',
      });
      setIsSubmitting(false);
      navigate('/gatepass-review');
    }, 500);
  };

  return (
    <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 pt-6 pb-12 page-enter">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white shadow-xl border border-[#245767] mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#52B74A]/20 border border-[#52B74A]/30 flex items-center justify-center text-[#52B74A] flex-shrink-0">
            <Ticket size={24} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#52B74A] uppercase tracking-wider mb-0.5">
              <Sparkles size={12} />
              <span>Hostel Student Outing System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manual Gate Pass Request
            </h1>
            <p className="text-xs sm:text-sm text-[#B0D0D8] mt-0.5">
              Create official gate pass for student departure and arrival with Warden approval workflow
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/gatepass-review')}
          className="text-xs font-bold border-white/20 text-white hover:bg-white/10"
        >
          View Gate Pass Review List
        </Button>
      </div>

      {/* Main Form Container */}
      <div className="card p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-xl bg-[var(--bg-card)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-extrabold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student Info Section */}
          <div>
            <h3 className="text-xs font-extrabold text-[#52B74A] uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={15} />
              <span>1. Student & Department Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Vignesh"
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  className="form-input text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Roll / Register Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 21CS104"
                  value={form.rollNo}
                  onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                  className="form-input text-xs font-semibold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Department *
                </label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="form-select text-xs font-semibold"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Hostel / Block *
                </label>
                <select
                  value={form.block}
                  onChange={(e) => {
                    const blkName = e.target.value;
                    const matched = activeBlocks.find((b) => b.name === blkName);
                    setForm({
                      ...form,
                      block: blkName,
                      wardenName: matched?.warden || form.wardenName,
                    });
                  }}
                  className="form-select text-xs font-semibold"
                >
                  {activeBlocks.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Assigned Warden Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. M. Senthil"
                  value={form.wardenName}
                  onChange={(e) => setForm({ ...form, wardenName: e.target.value })}
                  className="form-input text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Purpose of Outing
                </label>
                <select
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="form-select text-xs font-semibold"
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <hr className="border-[var(--border)]" />

          {/* Schedule Section with Date & Time Pickers */}
          <div>
            <h3 className="text-xs font-extrabold text-[#52B74A] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={15} />
              <span>2. Departure & Arrival Date & Time Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[var(--bg-subtle)] p-5 rounded-2xl border border-[var(--border)]">
              {/* Departure */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} /> Departure Date & Time *
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Departure Date</label>
                    <input
                      type="date"
                      required
                      value={form.depDate}
                      onChange={(e) => setForm({ ...form, depDate: e.target.value })}
                      className="form-input text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Departure Time</label>
                    <input
                      type="time"
                      required
                      value={form.depTime}
                      onChange={(e) => setForm({ ...form, depTime: e.target.value })}
                      className="form-input text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="flex flex-col gap-3 sm:border-l sm:border-[var(--border)] sm:pl-6">
                <span className="text-xs font-extrabold text-sky-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} /> Expected Arrival Date & Time *
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Arrival Date</label>
                    <input
                      type="date"
                      required
                      value={form.arrDate}
                      onChange={(e) => setForm({ ...form, arrDate: e.target.value })}
                      className="form-input text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Arrival Time</label>
                    <input
                      type="time"
                      required
                      value={form.arrTime}
                      onChange={(e) => setForm({ ...form, arrTime: e.target.value })}
                      className="form-input text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/hostel-dashboard')}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              size="md"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="text-xs font-extrabold flex items-center gap-2 shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 active:scale-95 transition-all duration-150 btn-shine btn-submit-glow"
            >
              <ShieldCheck size={16} />
              <span>{isSubmitting ? 'Submitting Gate Pass...' : 'Submit Gate Pass for Approval'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
