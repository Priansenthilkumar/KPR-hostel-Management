// src/pages/MessToken.jsx
import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Ticket,
  Printer,
  Download,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTodayString } from '../utils/dateUtils';
import Button from '../components/UI/Button';
import kprLogoAsset from '../assets/kprLogo.png';

const PRESETS = [
  'Friday Lunch',
  'Sunday Biryani',
  'Hostel Feast',
  'Guest Meal',
  'Exam Special',
];

const TOKENS_PER_PDF_PAGE = 12; // 3 rows x 4 columns fits 100% on A4

// Helper to format date as "THU • 23 JUL 2026"
function formatTokenDateString(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNum  = String(d.getDate()).padStart(2, '0');
  const month   = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year    = d.getFullYear();

  return `${dayName} • ${dayNum} ${month} ${year}`;
}

export default function MessToken() {
  const [count, setCount] = useState(20);
  const [mealLabel, setMealLabel] = useState('FRIDAY LUNCH');
  const [tokenDate, setTokenDate] = useState(getTodayString());
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [logoSrc, setLogoSrc] = useState(kprLogoAsset);
  const pageRefs = useRef([]);

  // Pre-load local logo to Base64 to guarantee 100% CORS-free PDF capture in html2canvas
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        setLogoSrc(dataURL);
      } catch {
        setLogoSrc(kprLogoAsset);
      }
    };
    img.onerror = () => setLogoSrc(kprLogoAsset);
    img.src = kprLogoAsset;
  }, []);

  // Generate tokens array based on count
  const tokens = useMemo(() => {
    const total = Math.max(1, Math.min(500, parseInt(count) || 1));
    return Array.from({ length: total }, (_, i) => ({
      displayId: String(i + 1).padStart(2, '0'),
      index: i + 1,
    }));
  }, [count]);

  // Group tokens into pages of 12 for perfect A4 page rendering
  const tokenPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < tokens.length; i += TOKENS_PER_PDF_PAGE) {
      pages.push(tokens.slice(i, i + TOKENS_PER_PDF_PAGE));
    }
    return pages;
  }, [tokens]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (pageRefs.current.length === 0) return;
    setIsExportingPDF(true);
    const toastId = toast.loading('Generating Perfect A4 Token PDF...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageRefs.current.length; i++) {
        const pageEl = pageRefs.current[i];
        if (!pageEl) continue;

        if (i > 0) pdf.addPage();

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          logging: false,
          onclone: (clonedDoc) => {
            // Fix Tailwind v4 oklch() color parsing & text alignment in html2canvas
            const elements = clonedDoc.querySelectorAll('*');
            elements.forEach((el) => {
              const style = window.getComputedStyle(el);
              if (style.color && style.color.includes('oklch')) {
                el.style.color = '#0B1E48';
              }
              if (style.backgroundColor && style.backgroundColor.includes('oklch')) {
                el.style.backgroundColor = '#FFFFFF';
              }
              if (style.borderColor && style.borderColor.includes('oklch')) {
                el.style.borderColor = '#C5A059';
              }
            });

            // Prevent html2canvas text baseline shift
            const cardTexts = clonedDoc.querySelectorAll('.token-card h3, .token-card span');
            cardTexts.forEach((el) => {
              el.style.lineHeight = '1.2';
              el.style.display = 'inline-block';
              el.style.verticalAlign = 'middle';
            });
          },
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // Render page canvas with top padding so tokens never touch edge
        const verticalOffset = Math.max(0, (pdfHeight - imgHeight) / 2);
        pdf.addImage(imgData, 'JPEG', 0, verticalOffset > 0 ? verticalOffset : 0, pdfWidth, imgHeight);
      }

      const cleanFileName = (mealLabel || 'Tokens').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`KPR_Mess_Tokens_${cleanFileName}_${tokenDate}.pdf`);

      toast.success('Multi-Page A4 PDF exported successfully!', { id: toastId });
    } catch (err) {
      toast.error(err?.message || 'Failed to export PDF file', { id: toastId });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const formattedDateStr = useMemo(() => formatTokenDateString(tokenDate), [tokenDate]);

  return (
    <div className="max-w-[1280px] w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-8 pb-12 page-enter">
      
      {/* ── Executive Header Banner (One Line Header) ── */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 mb-6 rounded-2xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white shadow-md border border-[#245767]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#52B74A]/20 border border-[#52B74A]/30 flex items-center justify-center text-[#52B74A] flex-shrink-0">
            <Ticket size={18} strokeWidth={2.2} />
          </div>
          <h1 className="text-sm sm:text-xl font-extrabold text-white tracking-tight leading-snug">
            <span className="sm:hidden">Mess Token Generator</span>
            <span className="hidden sm:inline">KPR Mess Token Generator</span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-xs text-xs px-2.5 py-1.5"
          >
            <Download size={14} strokeWidth={2} />
            <span>{isExportingPDF ? 'Generating...' : 'Export PDF'}</span>
          </Button>

          <Button variant="success" size="sm" onClick={handlePrint} className="shadow-md text-xs px-2.5 py-1.5">
            <Printer size={14} strokeWidth={2.2} />
            <span>Print Tokens</span>
          </Button>
        </div>
      </div>

      {/* ── Token Customization Controls (Hidden on Print) ── */}
      <div className="no-print card p-6 mb-8 rounded-2xl flex flex-col gap-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
          <Sparkles size={18} className="text-[#52B74A]" />
          <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider">
            Token Controls & Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Quantity Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              How Many Tokens? <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="form-input text-xs h-10 font-bold text-[#52B74A]"
            />
          </div>

          {/* Meal Label */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Meal Session Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. FRIDAY LUNCH"
              value={mealLabel}
              onChange={(e) => setMealLabel(e.target.value)}
              className="form-input text-xs h-10 uppercase font-bold"
            />
          </div>

          {/* Token Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Token Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={tokenDate}
              onChange={(e) => setTokenDate(e.target.value)}
              className="form-input text-xs h-10"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Quick Meal Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setMealLabel(preset.toUpperCase())}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  mealLabel.toUpperCase() === preset.toUpperCase()
                    ? 'bg-[#52B74A] text-white border-[#52B74A] shadow-xs'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--border)]'
                }`}
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live Printable Token Grid (Grouped by A4 Pages) ── */}
      <div className="token-grid-container flex flex-col gap-6">
        <div className="no-print flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Live Printable Token Grid (<span className="text-[#52B74A]">{tokens.length}</span> Tokens in {tokenPages.length} A4 Pages)
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-semibold">
            Ready for Print / Multi-page PDF Export
          </span>
        </div>

        {/* ── PAGE-BY-PAGE A4 TOKEN BLOCKS ── */}
        {tokenPages.map((pageTokens, pageIdx) => (
          <div
            key={pageIdx}
            ref={(el) => (pageRefs.current[pageIdx] = el)}
            className="token-page-block p-4 bg-white rounded-2xl border border-[var(--border)] shadow-xs flex flex-col gap-3"
          >
            <div className="no-print flex items-center justify-between pb-2 border-b border-gray-100 text-[11px] font-bold text-[var(--text-muted)]">
              <span>A4 Page {pageIdx + 1} of {tokenPages.length}</span>
              <span>Tokens {pageTokens[0].displayId} - {pageTokens[pageTokens.length - 1].displayId}</span>
            </div>

            {/* 3 Rows x 4 Columns Token Grid */}
            <div className="token-print-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {pageTokens.map((t) => (
                <div
                  key={t.displayId}
                  className="token-card relative w-full bg-white rounded-3xl border-2 border-[#C5A059] shadow-md overflow-hidden flex flex-col justify-between select-none"
                  style={{ minHeight: '340px' }}
                >
                  {/* 1. Header Bar: Deep Navy Blue + Official KPR "Learn Beyond" Logo + Title */}
                  <div className="bg-[#0B1E48] px-3 py-2.5 flex items-center gap-2.5 border-b-4 border-[#C5A059] min-h-[56px]">
                    <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden">
                      <img
                        src={logoSrc}
                        alt="KPR Learn Beyond Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3
                      className="text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase truncate"
                      style={{ lineHeight: '1.2', margin: 0, padding: 0 }}
                    >
                      KPR MESS TOKEN
                    </h3>
                  </div>

                  {/* 2. Center Ring Section: Large Big Serial Number */}
                  <div className="flex-1 flex items-center justify-center py-5">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#F0F3F8] border-[3.5px] border-[#C5A059] flex items-center justify-center shadow-inner">
                      <span
                        className="text-4xl sm:text-5xl font-black text-[#0B1E48] tracking-tight"
                        style={{ lineHeight: '1', margin: 0, padding: 0 }}
                      >
                        {t.displayId}
                      </span>
                    </div>
                  </div>

                  {/* 3. Meal Label Banner & Date Pill Container */}
                  <div className="flex flex-col items-center gap-2.5 pb-4 px-3">
                    {/* Meal Banner Bar */}
                    <div className="w-full bg-[#0B1E48] px-3 py-2 text-center rounded-md shadow-xs flex items-center justify-center min-h-[36px]">
                      <span
                        className="text-[#C5A059] font-extrabold text-xs sm:text-sm uppercase tracking-wider block text-center truncate"
                        style={{ lineHeight: '1.2', margin: 0, padding: 0 }}
                      >
                        {mealLabel || 'FRIDAY LUNCH'}
                      </span>
                    </div>

                    {/* Date Pill Badge */}
                    <div className="bg-[#0B1E48] px-4 py-1.5 rounded-full text-center shadow-xs flex items-center justify-center min-h-[28px]">
                      <span
                        className="text-[#C5A059] font-bold text-[11px] uppercase tracking-widest block text-center whitespace-nowrap"
                        style={{ lineHeight: '1.2', margin: 0, padding: 0 }}
                      >
                        {formattedDateStr}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer Credit Box (Visible on Print & Web) ── */}
      <div className="mt-10 p-4 rounded-2xl bg-[#164350] text-white border border-[#245767] text-center shadow-xs">
        <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
          Created for Hostel Mess by Hostel Committee
        </p>
        <p className="text-[11px] text-[#B0D0D8] mt-0.5">
          For any queries, contact the Hostel Deputy Warden • KPR MESS
        </p>
      </div>

    </div>
  );
}
