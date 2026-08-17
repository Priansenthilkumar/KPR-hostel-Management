// src/components/Hostel/GatePassReceipt.jsx
import { useState, useMemo } from 'react';
import { ShieldCheck, Download, Printer, Sparkles, CheckCircle2, QrCode, Calendar, Clock, MapPin, Building, User, FileText } from 'lucide-react';
import kprLogo from '../../assets/kprLogo.png';
import Button from '../UI/Button';
import toast from 'react-hot-toast';

export default function GatePassReceipt({ gatePass, onClose }) {
  if (!gatePass) return null;

  const formattedDepDate = useMemo(() => {
    try {
      return new Date(gatePass.depDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return gatePass.depDate;
    }
  }, [gatePass.depDate]);

  const formattedArrDate = useMemo(() => {
    try {
      return new Date(gatePass.arrDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return gatePass.arrDate;
    }
  }, [gatePass.arrDate]);

  const formattedApprovedAt = useMemo(() => {
    if (!gatePass.approvedAt) return 'N/A';
    try {
      return new Date(gatePass.approvedAt).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return gatePass.approvedAt;
    }
  }, [gatePass.approvedAt]);

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    toast.success('Preparing printable PDF receipt...', { icon: '🖨️' });
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  // SVG Barcode Line Generator based on Gate Pass ID string
  const barcodeBars = useMemo(() => {
    const str = gatePass.id || 'KPR-GP-2026-00000';
    const bars = [];
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const width1 = (charCode % 3) + 1;
      const width2 = ((charCode * 2) % 4) + 1;
      bars.push(<rect key={`b1-${i}`} x={i * 9} y="0" width={width1} height="48" fill="#000000" />);
      bars.push(<rect key={`b2-${i}`} x={i * 9 + width1 + 1} y="0" width={width2} height="48" fill="#000000" />);
    }
    return bars;
  }, [gatePass.id]);

  return (
    <div className="flex flex-col gap-4">
      {/* Action Bar (Screen only) */}
      <div className="flex items-center justify-between gap-3 p-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-2xl print:hidden">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#52B74A]">
          <ShieldCheck size={16} />
          <span>Approved Official Gate Pass Receipt</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="success"
            size="sm"
            loading={isPrinting}
            disabled={isPrinting}
            onClick={handlePrint}
            className="text-xs font-extrabold flex items-center gap-1.5 shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 active:scale-95 transition-all duration-150 btn-shine btn-submit-glow cursor-pointer"
          >
            <Printer size={15} />
            <span>{isPrinting ? 'Preparing PDF...' : 'Download / Print Receipt'}</span>
          </Button>
        </div>
      </div>

      {/* ── PRINTABLE RECEIPT TEMPLATE (#printable-gatepass) ── */}
      <div
        id="printable-gatepass"
        className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-slate-900 shadow-2xl relative overflow-hidden font-sans"
      >
        {/* Top Watermark Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#174351] via-[#52B74A] to-[#3DA1D1]" />
        
        {/* Header Branding */}
        <div className="flex items-center justify-between pb-5 border-b-2 border-slate-900 gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={kprLogo}
              alt="KPR Logo"
              className="h-12 w-auto object-contain bg-white p-1 rounded-xl border border-slate-300 shadow-xs"
            />
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#174351] leading-tight tracking-tight">
                KPR HOSTEL & MESS ADMINISTRATION
              </h1>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                KPR Institute of Engineering and Technology, Coimbatore
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-black uppercase">
              <CheckCircle2 size={13} />
              <span>APPROVED</span>
            </span>
            <p className="text-[11px] font-mono font-bold text-slate-600 mt-1">
              Ref: {gatePass.id}
            </p>
          </div>
        </div>

        {/* Title Banner */}
        <div className="my-5 text-center bg-slate-100 py-2 rounded-xl border border-slate-300">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            OFFICIAL STUDENT GATE PASS & OUTING PERMIT
          </h2>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-800 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student Name</span>
            <span className="text-sm font-black text-slate-900">{gatePass.studentName}</span>
            {gatePass.rollNo && <span className="text-xs font-mono text-slate-600">Roll: {gatePass.rollNo}</span>}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</span>
            <span className="text-sm font-bold text-slate-900">{gatePass.department}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hostel / Block</span>
            <span className="text-sm font-bold text-slate-900">{gatePass.block}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Purpose of Outing</span>
            <span className="text-sm font-bold text-[#174351]">{gatePass.purpose || 'Campus Outing'}</span>
          </div>
        </div>

        {/* Departure & Arrival Schedule Box */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#174351] text-white mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              Departure Schedule
            </span>
            <span className="text-base font-black text-white">{formattedDepDate}</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
              <Clock size={13} /> {gatePass.depTime}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-l border-white/20 pl-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
              Arrival Deadline
            </span>
            <span className="text-base font-black text-white">{formattedArrDate}</span>
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1">
              <Clock size={13} /> {gatePass.arrTime}
            </span>
          </div>
        </div>

        {/* Approval Verification & Remark Box */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-slate-900 mb-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span className="text-xs font-extrabold text-emerald-900 uppercase">Warden Approval Authorization</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">{formattedApprovedAt}</span>
          </div>
          <p className="text-xs font-semibold text-slate-800">
            Approved By: <strong>{gatePass.approvedBy || gatePass.wardenName}</strong>
          </p>
          {gatePass.wardenRemark && (
            <p className="text-xs font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-emerald-200">
              Warden Remark: &ldquo;{gatePass.wardenRemark}&rdquo;
            </p>
          )}
        </div>

        {/* Barcode & Security Stamp Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-slate-900">
          {/* Barcode Graphic */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[9px] font-bold uppercase text-slate-500 mb-1">
              Scan Barcode at Security Gate
            </span>
            <svg width="220" height="48" className="bg-white">
              {barcodeBars}
            </svg>
            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-900 mt-1">
              *{gatePass.id}*
            </span>
          </div>

          {/* Institutional Security Seal */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 border border-slate-300 text-center sm:text-right">
            <QrCode size={36} className="text-slate-800" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black text-slate-900 uppercase">Verified Security Pass</span>
              <span className="text-[9.5px] font-semibold text-slate-600">KPR Executive Hostels Administration</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
