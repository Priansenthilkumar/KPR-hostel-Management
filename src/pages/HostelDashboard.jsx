// src/pages/HostelDashboard.jsx
import { useState } from 'react';
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
} from 'lucide-react';
import ComplaintBox from '../components/Dashboard/ComplaintBox';
import Button from '../components/UI/Button';
import kprLogo from '../assets/kprLogo.png';

const HOSTEL_BLOCKS_DATA = [
  { block: 'Pallavan Hostel', students: 240, capacity: 250 },
  { block: 'Cheran Hostel', students: 220, capacity: 230 },
  { block: 'Thiruvalluvar GF', students: 160, capacity: 160 },
  { block: 'Thiruvalluvar 1st F', students: 160, capacity: 160 },
  { block: 'Thiruvalluvar 2nd F', students: 160, capacity: 160 },
  { block: 'Thiruvalluvar 3rd F', students: 160, capacity: 160 },
  { block: 'Thiruvalluvar 4th F', students: 160, capacity: 160 },
  { block: 'Bharathi Dorm', students: 100, capacity: 120 },
  { block: 'Bharathi Intl.', students: 60, capacity: 80 },
];

export default function HostelDashboard() {
  const navigate = useNavigate();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  const totalStudents = HOSTEL_BLOCKS_DATA.reduce((acc, b) => acc + b.students, 0);
  const totalCapacity = HOSTEL_BLOCKS_DATA.reduce((acc, b) => acc + b.capacity, 0);

  return (
    <div className="hostel-dashboard-page max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 flex flex-col gap-8 page-enter">
      
      {/* ── Welcome Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white p-6 sm:p-8 shadow-xl border border-[#245767]">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#3DA1D1]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-[#52B74A]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="max-w-2xl flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#3DA1D1] mb-3 backdrop-blur-xs">
              <ShieldCheck size={14} className="text-[#3DA1D1]" />
              <span>Hostel Warden Administration Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Welcome to KPR Hostels Management Portal
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-[#B0D0D8] leading-relaxed">
              Monitor student strength across 9 hostel blocks, track warden duty check-ins, and inspect student remarks.
            </p>

            {/* Quick Action Complaint Box Button */}
            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Button
                variant="danger"
                size="md"
                onClick={() => setIsComplaintModalOpen(true)}
                className="shadow-lg border border-red-400/30 text-xs font-extrabold flex items-center gap-2"
              >
                <AlertCircle size={15} />
                <span>Complaint Box (App Fault Resolution)</span>
              </Button>
            </div>
          </div>

          {/* Institutional Badge Logo */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-inner">
            <img
              src={kprLogo}
              alt="KPR Logo"
              className="h-16 w-auto object-contain bg-white/95 p-2 rounded-2xl shadow-md mb-2"
            />
            <span className="text-[11px] font-extrabold text-[#52B74A] uppercase tracking-wider">
              KPR Hostels
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick Access Launcher Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div
          onClick={() => navigate('/hostel-overview')}
          className="card p-5 rounded-2xl border border-[var(--border)] hover:border-[#3DA1D1] cursor-pointer transition-all group flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-[#3DA1D1] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart2 size={20} />
            </div>
            <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-[#3DA1D1] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Hostel Overview</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">View duty logs & remarks table</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/hostel-add-entry')}
          className="card p-5 rounded-2xl border border-[var(--border)] hover:border-[#3DA1D1] cursor-pointer transition-all group flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-[#3DA1D1] flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={20} />
            </div>
            <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-[#3DA1D1] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Add Hostel Entry</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Log duty shifts or remarks</p>
          </div>
        </div>
      </div>

      {/* Complaint Box Floating Modal */}
      <ComplaintBox
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />

    </div>
  );
}
