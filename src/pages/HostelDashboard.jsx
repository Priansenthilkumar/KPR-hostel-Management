// src/pages/HostelDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Building,
  PlusCircle,
  BarChart2,
  Ticket,
  FileText,
  Clock,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Printer,
  Wrench,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ComplaintBox from '../components/Dashboard/ComplaintBox';
import Button from '../components/UI/Button';
import kprLogo from '../assets/kprLogo.png';
import { adminManagementService } from '../services/adminManagementService';
import { gatepassService } from '../services/gatepassService';
import { hostelService } from '../services/hostelService';

export default function HostelDashboard() {
  const navigate = useNavigate();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  const [blocks, setBlocks] = useState(() => adminManagementService.getBlocks());
  const [gatePasses, setGatePasses] = useState(() => gatepassService.getGatePasses());
  const [remarks, setRemarks] = useState(() => hostelService.getStudentRemarks());

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to remove all old gate passes, student remarks, and warden logs?')) {
      gatepassService.clearAllGatePasses();
      hostelService.clearAllHostelRecords();
      setGatePasses([]);
      setRemarks([]);
      toast.success('All old hostel gate passes, remarks, and warden logs cleared successfully!', { icon: '🧹' });
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      setBlocks(adminManagementService.getBlocks());
      setGatePasses(gatepassService.getGatePasses());
      setRemarks(hostelService.getStudentRemarks());
    };
    window.addEventListener('kpr_data_updated', handleUpdate);
    window.addEventListener('kpr_blocks_updated', handleUpdate);
    window.addEventListener('kpr_gatepass_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kpr_data_updated', handleUpdate);
      window.removeEventListener('kpr_blocks_updated', handleUpdate);
      window.removeEventListener('kpr_gatepass_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalCapacity = useMemo(() => {
    return blocks.reduce((acc, b) => acc + (Number(b.capacity) || 0), 0);
  }, [blocks]);

  const pendingPassesCount = useMemo(() => {
    return gatePasses.filter((p) => p.status === 'Pending').length;
  }, [gatePasses]);

  const pendingRemarksCount = useMemo(() => {
    return remarks.filter((r) => !r.rectified).length;
  }, [remarks]);

  return (
    <div className="hostel-dashboard-page max-w-[1500px] w-full mx-auto px-4 sm:px-6 pt-4 pb-12 flex flex-col gap-6 page-enter">
      
      {/* ── Welcome Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white p-6 sm:p-8 shadow-xl border border-[#245767]">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#3DA1D1]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-[#52B74A]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="max-w-2xl flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-extrabold text-[#3DA1D1] mb-3 backdrop-blur-xs">
              <ShieldCheck size={14} className="text-[#3DA1D1]" />
              <span>KPR Hostel Warden Executive Operations</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Hostel Warden Administration Hub
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#B0D0D8] leading-relaxed">
              Manage student gate passes, approve departure permits, monitor hostel block capacity, and track warden duty logs.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Button
                variant="success"
                size="md"
                onClick={() => navigate('/hostel-gatepass')}
                className="shadow-lg text-xs font-extrabold flex items-center gap-2"
              >
                <Ticket size={16} />
                <span>Create Manual Gate Pass</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/gatepass-review')}
                className="shadow-lg text-xs font-extrabold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-2"
              >
                <ShieldCheck size={16} />
                <span>Gate Pass Review System</span>
              </Button>

              <Button
                variant="danger"
                size="md"
                onClick={() => setIsComplaintModalOpen(true)}
                className="shadow-lg text-xs font-extrabold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2"
              >
                <AlertCircle size={16} />
                <span>Complaint Box</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-inner min-w-[140px]">
            <img
              src={kprLogo}
              alt="KPR Logo"
              className="h-14 w-auto object-contain bg-white/95 p-2 rounded-2xl shadow-md mb-2"
            />
            <span className="text-[11px] font-extrabold text-[#52B74A] uppercase tracking-wider">
              KPR Hostels
            </span>
          </div>
        </div>
      </div>

      {/* ── Live Metrics Summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)]">Hostel Blocks</span>
            <Building size={16} className="text-sky-500" />
          </div>
          <span className="text-2xl font-black text-sky-500 mt-2 block">{blocks.length}</span>
          <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">Active campus blocks</p>
        </div>

        <div className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)]">Bed Capacity</span>
            <Users size={16} className="text-purple-500" />
          </div>
          <span className="text-2xl font-black text-purple-500 mt-2 block">{totalCapacity}</span>
          <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">Total student beds</p>
        </div>

        <div className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)]">Pending Passes</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-500 mt-2 block">{pendingPassesCount}</span>
          <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">Awaiting Warden review</p>
        </div>

        <div className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)]">Pending Remarks</span>
            <AlertCircle size={16} className="text-red-500" />
          </div>
          <span className="text-2xl font-black text-red-500 mt-2 block">{pendingRemarksCount}</span>
          <p className="text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">Student issues pending</p>
        </div>
      </div>

      {/* ── Quick Access Operations Grid ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
        <h2 className="text-lg font-black text-[var(--text-primary)]">Warden Quick Operations</h2>
        <button
          type="button"
          onClick={handleClearAllData}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-extrabold text-xs border border-red-500/20 shadow-xs transition-all cursor-pointer active:scale-95"
          title="Remove all old gate passes, student remarks, and warden duty logs"
        >
          <Trash2 size={14} />
          <span>Clear All Old Data</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Option 1: Manual Gate Pass */}
        <div
          onClick={() => navigate('/hostel-gatepass')}
          className="card p-5 rounded-3xl border border-[var(--border)] hover:border-[#52B74A] cursor-pointer transition-all group flex flex-col justify-between shadow-xs hover:shadow-lg"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#52B74A]/15 text-[#52B74A] flex items-center justify-center mb-3 font-bold group-hover:scale-110 transition-transform">
              <Ticket size={24} />
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">Manual Gate Pass</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
              Create student outing pass with departure and arrival schedule.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-extrabold text-[#52B74A]">
            <span>Create Gate Pass</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 2: Gate Pass Review System */}
        <div
          onClick={() => navigate('/gatepass-review')}
          className="card p-5 rounded-3xl border border-[var(--border)] hover:border-sky-500 cursor-pointer transition-all group flex flex-col justify-between shadow-xs hover:shadow-lg"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-500 flex items-center justify-center mb-3 font-bold group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">Gate Pass Review</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
              Review requests, approve permits, view & print barcode receipts.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-extrabold text-sky-500">
            <span>Review Approvals</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 3: Hostel Logs & Duty Overview */}
        <div
          onClick={() => navigate('/hostel-overview')}
          className="card p-5 rounded-3xl border border-[var(--border)] hover:border-purple-500 cursor-pointer transition-all group flex flex-col justify-between shadow-xs hover:shadow-lg"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center mb-3 font-bold group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">Hostel Audit Logs</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
              Inspect warden duty logs, student remarks, and gate pass history.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-extrabold text-purple-500">
            <span>View Hostel Logs</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 4: Log Staff Duty / Remark Entry */}
        <div
          onClick={() => navigate('/hostel-add-entry')}
          className="card p-5 rounded-3xl border border-[var(--border)] hover:border-amber-500 cursor-pointer transition-all group flex flex-col justify-between shadow-xs hover:shadow-lg"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3 font-bold group-hover:scale-110 transition-transform">
              <PlusCircle size={24} />
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">Log Shift / Remark</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">
              Record warden duty check-in/out times or file student grievance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-extrabold text-amber-500">
            <span>Log New Entry</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* ── Hostel Blocks Infrastructure Grid ── */}
      <h2 className="text-lg font-black text-[var(--text-primary)] mt-4">Campus Hostel Blocks</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((b) => (
          <div key={b.id || b.name} className="card p-5 rounded-2xl border border-[var(--border)] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building size={18} className="text-sky-500" />
                <h4 className="font-extrabold text-sm text-[var(--text-primary)]">{b.name}</h4>
              </div>
              <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-500 border border-sky-500/30">
                {b.code || 'BLK'}
              </span>
            </div>

            <div className="text-xs text-[var(--text-secondary)] space-y-1 font-medium">
              <p>Type: <strong className="text-[var(--text-primary)]">{b.type}</strong></p>
              <p>Capacity: <strong className="text-emerald-500 font-extrabold">{b.capacity} beds</strong> ({b.rooms || 40} rooms)</p>
              <p>Warden: <strong className="text-[var(--text-primary)]">{b.warden}</strong></p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {b.status || 'Active'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Complaint Box Floating Modal */}
      <ComplaintBox
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />

    </div>
  );
}
