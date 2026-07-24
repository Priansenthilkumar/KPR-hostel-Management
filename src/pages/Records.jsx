// src/pages/Records.jsx
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Download, Database, ShieldCheck } from 'lucide-react';
import RecordsTable from '../components/Records/RecordsTable';
import Button from '../components/UI/Button';
import { exportToExcel } from '../utils/exportExcel';
import { storageService } from '../services/storage';
import toast from 'react-hot-toast';

export default function Records() {
  const navigate = useNavigate();

  const handleExport = () => {
    try {
      const entries = storageService.getEntries();
      if (entries.length === 0) { toast.error('No records to export!'); return; }
      exportToExcel(entries);
      toast.success(`Exported ${entries.length} records to Excel!`);
    } catch (err) {
      toast.error(err.message || 'Export failed');
    }
  };

  return (
    <div className="max-w-[1280px] w-full mx-auto px-6 pt-8 pb-12 page-enter">
      {/* ── Executive Header Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 mb-6 rounded-2xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white shadow-md border border-[#245767]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#52B74A]/20 border border-[#52B74A]/30 flex items-center justify-center text-[#52B74A] flex-shrink-0">
            <Database size={24} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52B74A] uppercase tracking-wider mb-0.5">
              <span>Database Audit Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Food Maintenance Records
            </h1>
            <p className="text-xs sm:text-sm text-[#B0D0D8] mt-0.5">
              View, search, filter, edit & manage all logged hostel meal entries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="secondary" size="md" onClick={handleExport} className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-xs">
            <Download size={16} strokeWidth={2} />
            Export Excel
          </Button>

          <Button variant="success" size="md" onClick={() => navigate('/add-entry')} className="shadow-sm">
            <PlusCircle size={16} strokeWidth={2.2} />
            Add New Entry
          </Button>
        </div>
      </div>

      <RecordsTable />
    </div>
  );
}
