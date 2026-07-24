// src/pages/HostelGatePass.jsx
import { useState, useRef } from 'react';
import {
  Ticket,
  Printer,
  Download,
  PenTool,
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import kprLogo from '../assets/kprLogo.png';
import Button from '../components/UI/Button';

export default function HostelGatePass() {
  const passRef = useRef(null);

  // 1. Name
  const [studentName, setStudentName] = useState('Senthilkumar P.');
  // 2. Department
  const [department, setDepartment] = useState('Computer Science & Engineering');
  // 3. Year & Class
  const [yearClass, setYearClass] = useState('III Year / CSE-A');
  // 4. Reason
  const [reason, setReason] = useState('Personal Outing / Project Materials Purchase');
  // 5. Out Date & Out Time
  const [outDate, setOutDate] = useState(new Date().toISOString().split('T')[0]);
  const [outTime, setOutTime] = useState('04:30 PM');
  // 6. In Date & In Time
  const [inDate, setInDate] = useState(new Date().toISOString().split('T')[0]);
  const [inTime, setInTime] = useState('08:15 PM');
  // 7. Mentor Signature / Name
  const [mentorName, setMentorName] = useState('Prof. Ramesh (Mentor)');
  // 8. Tutor or Warden Signature / Name
  const [tutorWardenName, setTutorWardenName] = useState('Dr. Arunkumar (Deputy Warden)');

  const [passNumber, setPassNumber] = useState(`KPR-GP-${Math.floor(100000 + Math.random() * 900000)}`);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNewSerial = () => {
    setPassNumber(`KPR-GP-${Math.floor(100000 + Math.random() * 900000)}`);
    toast.success('Generated new Gate Pass Serial ID!');
  };

  const generateNativePDF = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
    });

    // Top Petrol Teal Header Bar
    pdf.setFillColor(23, 67, 81);
    pdf.rect(0, 0, 148, 22, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KPR HOSTELS ADMINISTRATION', 10, 11);
    pdf.setFontSize(8);
    pdf.text('OFFICIAL GATE PASS SLIP', 10, 17);

    let y = 32;
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(8.5);

    // 1. Name
    pdf.setFont('helvetica', 'bold');
    pdf.text(`1. Name:`, 10, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(studentName, 45, y);

    // 2. Department
    y += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`2. Department:`, 10, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(department, 45, y);

    // 3. Year & Class
    y += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`3. Year & Class:`, 10, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(yearClass, 45, y);

    // 4. Reason
    y += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`4. Reason:`, 10, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(reason, 45, y);

    // 5. Out Date & Out Time
    y += 10;
    pdf.setFillColor(236, 253, 245);
    pdf.rect(10, y - 4, 128, 9, 'F');
    pdf.setTextColor(4, 120, 87);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`5. Out Date & Out Time:`, 13, y + 2);
    pdf.text(`${outDate} @ ${outTime}`, 65, y + 2);

    // 6. In Date & In Time
    y += 12;
    pdf.setFillColor(254, 242, 242);
    pdf.rect(10, y - 4, 128, 9, 'F');
    pdf.setTextColor(185, 28, 28);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`6. In Date & In Time:`, 13, y + 2);
    pdf.text(`${inDate} @ ${inTime}`, 65, y + 2);

    // Signatures
    y += 26;
    pdf.setDrawColor(15, 23, 42);
    pdf.setLineWidth(0.5);

    // 7. Mentor Signature
    pdf.line(10, y, 60, y);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('7. Mentor Signature', 10, y + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(mentorName, 10, y + 10);

    // 8. Tutor or Warden Signature
    pdf.line(80, y, 135, y);
    pdf.setFont('helvetica', 'bold');
    pdf.text('8. Tutor / Warden Signature', 80, y + 5);
    pdf.setTextColor(28, 83, 98);
    pdf.text(tutorWardenName, 80, y + 10);

    pdf.save(`KPR_GatePass_${studentName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const toastId = toast.loading('Generating Official Gate Pass PDF...');

    try {
      if (passRef.current) {
        const canvas = await html2canvas(passRef.current, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a5',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`KPR_GatePass_${studentName.replace(/\s+/g, '_')}.pdf`);

        toast.success('Gate Pass PDF downloaded successfully!', { id: toastId, duration: 4000 });
        return;
      }
      
      generateNativePDF();
      toast.success('Gate Pass PDF downloaded successfully!', { id: toastId, duration: 4000 });
    } catch (err) {
      console.warn('html2canvas fallback trigger:', err);
      try {
        generateNativePDF();
        toast.success('Gate Pass PDF downloaded successfully!', { id: toastId, duration: 4000 });
      } catch (fallbackErr) {
        console.error(fallbackErr);
        toast.error('Failed to generate PDF. Please try printing directly.', { id: toastId });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="hostel-gate-pass-page max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 flex flex-col gap-8 page-enter">
      
      {/* ── Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white p-6 sm:p-8 shadow-xl border border-[#245767]">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#3DA1D1]/15 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6">
          <div className="max-w-2xl flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#52B74A]/20 border border-[#52B74A]/30 text-xs font-semibold text-[#52B74A] mb-3 backdrop-blur-xs">
              <Ticket size={14} className="text-[#52B74A]" />
              <span>Official Outing Gate Pass Slip</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Hostel Student Outing Gate Pass
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-[#B0D0D8] leading-relaxed max-w-xl">
              Fill the 8 official fields below to generate and print or download the physical Gate Pass Slip with Mentor & Warden signature lines.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrintReceipt}
              className="shadow-md text-xs font-extrabold flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Printer size={15} />
              <span>Print Slip</span>
            </Button>

            <Button
              variant="success"
              size="md"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="shadow-lg text-xs font-extrabold flex items-center gap-2"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── 8 Fields Form (Left 5 Cols) ── */}
        <div className="lg:col-span-5 card p-5 sm:p-6 rounded-3xl border border-[var(--border)] shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-2">
              <PenTool size={16} className="text-[#3DA1D1]" />
              <span>Gate Pass 8 Details Form</span>
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            {/* 1. Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[var(--text-primary)]">1. Student Name *</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="form-input h-10 text-xs"
              />
            </div>

            {/* 2. Department */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[var(--text-primary)]">2. Department *</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-input h-10 text-xs"
              />
            </div>

            {/* 3. Year & Class */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[var(--text-primary)]">3. Year & Class *</label>
              <input
                type="text"
                value={yearClass}
                onChange={(e) => setYearClass(e.target.value)}
                className="form-input h-10 text-xs"
              />
            </div>

            {/* 4. Reason */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[var(--text-primary)]">4. Reason *</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-input h-10 text-xs"
              />
            </div>

            {/* 5. Out Date & Out Time */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-primary)]">5. Out Date</label>
                <input
                  type="date"
                  value={outDate}
                  onChange={(e) => setOutDate(e.target.value)}
                  className="form-input h-10 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-primary)]">5. Out Time</label>
                <input
                  type="text"
                  value={outTime}
                  onChange={(e) => setOutTime(e.target.value)}
                  className="form-input h-10 text-xs"
                />
              </div>
            </div>

            {/* 6. In Date & In Time */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-primary)]">6. In Date</label>
                <input
                  type="date"
                  value={inDate}
                  onChange={(e) => setInDate(e.target.value)}
                  className="form-input h-10 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[var(--text-primary)]">6. In Time</label>
                <input
                  type="text"
                  value={inTime}
                  onChange={(e) => setInTime(e.target.value)}
                  className="form-input h-10 text-xs"
                />
              </div>
            </div>

            {/* 7. Mentor Signature Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[var(--text-primary)]">7. Mentor Name (Signature)</label>
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="form-input h-10 text-xs"
              />
            </div>

            {/* 8. Tutor or Warden Signature Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[var(--text-primary)]">8. Tutor / Warden Name (Signature)</label>
              <input
                type="text"
                value={tutorWardenName}
                onChange={(e) => setTutorWardenName(e.target.value)}
                className="form-input h-10 text-xs font-bold text-[#1C5362]"
              />
            </div>
          </div>
        </div>

        {/* ── Printable PDF Pass Preview (Right 7 Cols) ── */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">
          <div
            ref={passRef}
            id="printable-gatepass"
            className="w-full max-w-md bg-white text-gray-900 rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-gray-800 flex flex-col gap-4 relative overflow-hidden text-left"
          >
            {/* Top Branding Header */}
            <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={kprLogo}
                  alt="KPR Logo"
                  className="h-11 w-auto object-contain bg-white p-1 rounded-lg border border-gray-300"
                />
                <div>
                  <h2 className="text-sm font-extrabold text-gray-900 leading-tight uppercase tracking-tight">
                    KPR HOSTELS ADMINISTRATION
                  </h2>
                  <span className="text-[9.5px] font-extrabold text-[#1C5362] block uppercase">
                    OFFICIAL GATE PASS SLIP
                  </span>
                </div>
              </div>
            </div>

            {/* 8 Items Grid */}
            <div className="flex flex-col gap-3 text-xs pt-1">
              {/* 1. Name */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase">1. Name</span>
                <strong className="text-sm font-extrabold text-gray-900">{studentName}</strong>
              </div>

              {/* 2. Department */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase">2. Department</span>
                <strong className="text-xs font-bold text-gray-800">{department}</strong>
              </div>

              {/* 3. Year & Class */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase">3. Year & Class</span>
                <strong className="text-xs font-bold text-gray-800">{yearClass}</strong>
              </div>

              {/* 4. Reason */}
              <div className="flex flex-col gap-0.5 border-b border-gray-200 pb-2">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase">4. Reason</span>
                <span className="text-xs font-semibold text-gray-900">{reason}</span>
              </div>

              {/* 5. Out Date & Out Time */}
              <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase">5. Out Date & Out Time</span>
                <strong className="text-xs font-extrabold text-emerald-800">{outDate} • {outTime}</strong>
              </div>

              {/* 6. In Date & In Time */}
              <div className="flex items-center justify-between bg-red-50 p-2.5 rounded-xl border border-red-200">
                <span className="text-[11px] font-extrabold text-red-800 uppercase">6. In Date & In Time</span>
                <strong className="text-xs font-extrabold text-red-800">{inDate} • {inTime}</strong>
              </div>

              {/* 7 & 8. Signatures Box */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-gray-900 mt-2">
                {/* 7. Mentor Signature */}
                <div className="flex flex-col text-left">
                  <div className="w-32 border-b-2 border-gray-800 mb-1" />
                  <span className="text-[9.5px] font-extrabold text-gray-900 uppercase">7. Mentor Signature</span>
                  <span className="text-[10px] font-semibold text-gray-600">{mentorName}</span>
                </div>

                {/* 8. Tutor or Warden Signature */}
                <div className="flex flex-col text-left">
                  <div className="w-32 border-b-2 border-gray-800 mb-1" />
                  <span className="text-[9.5px] font-extrabold text-gray-900 uppercase">8. Tutor / Warden Signature</span>
                  <span className="text-[10px] font-bold text-[#1C5362]">{tutorWardenName}</span>
                </div>
              </div>

            </div>

          </div>

          <div className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePrintReceipt}
              className="flex-1 shadow-md font-extrabold flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white"
            >
              <Printer size={18} />
              <span>Print Receipt</span>
            </Button>

            <Button
              variant="success"
              size="lg"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex-1 shadow-md font-extrabold flex items-center justify-center gap-2"
            >
              <Download size={18} />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}
