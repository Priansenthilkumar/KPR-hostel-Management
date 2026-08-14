// src/pages/GatePassReview.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Printer,
  Download,
  PlusCircle,
  Sparkles,
  Building,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { gatepassService } from '../services/gatepassService';
import { useAuth } from '../context/AuthContext';
import GatePassReceipt from '../components/Hostel/GatePassReceipt';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

export default function GatePassReview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [passes, setPasses] = useState(() => gatepassService.getGatePasses());
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Pass for Modal Receipt or Approval Action
  const [selectedPass, setSelectedPass] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState('approve'); // 'approve' | 'reject'
  const [actionRemark, setActionRemark] = useState('');

  const refreshPasses = useCallback(() => {
    setPasses(gatepassService.getGatePasses());
  }, []);

  useEffect(() => {
    window.addEventListener('kpr_data_updated', refreshPasses);
    window.addEventListener('kpr_gatepass_updated', refreshPasses);
    window.addEventListener('storage', refreshPasses);
    return () => {
      window.removeEventListener('kpr_data_updated', refreshPasses);
      window.removeEventListener('kpr_gatepass_updated', refreshPasses);
      window.removeEventListener('storage', refreshPasses);
    };
  }, [refreshPasses]);

  // Status Metrics
  const totalCount = passes.length;
  const pendingCount = passes.filter((p) => p.status === 'Pending').length;
  const approvedCount = passes.filter((p) => p.status === 'Approved').length;
  const rejectedCount = passes.filter((p) => p.status === 'Rejected').length;

  // Filtered Passes
  const filteredPasses = useMemo(() => {
    return passes.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        p.studentName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.block.toLowerCase().includes(q) ||
        (p.wardenName && p.wardenName.toLowerCase().includes(q));

      const matchStatus =
        filterStatus === 'all' || p.status.toLowerCase() === filterStatus.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [passes, searchQuery, filterStatus]);

  // Action Handlers
  const handleOpenActionModal = (pass, type) => {
    setSelectedPass(pass);
    setActionType(type);
    setActionRemark(
      type === 'approve'
        ? 'Parents confirmed. Outing approved.'
        : 'Discipline restriction. Outing rejected.'
    );
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = (e) => {
    e.preventDefault();
    if (!selectedPass) return;

    const wardenName = user?.name || selectedPass.wardenName || 'Hostel Warden';

    if (actionType === 'approve') {
      const updated = gatepassService.approveGatePass(selectedPass.id, wardenName, actionRemark);
      toast.success(`Gate Pass ${updated.id} APPROVED for ${updated.studentName}!`, { icon: '✅' });
    } else {
      const updated = gatepassService.rejectGatePass(selectedPass.id, wardenName, actionRemark);
      toast.error(`Gate Pass ${updated.id} REJECTED for ${updated.studentName}`, { icon: '❌' });
    }

    setIsActionModalOpen(false);
    refreshPasses();
  };

  const handleCompletePass = (pass) => {
    gatepassService.completeGatePass(pass.id);
    toast.success(`Marked student ${pass.studentName} as returned to hostel!`, { icon: '🏠' });
    refreshPasses();
  };

  const handleDeletePass = (pass) => {
    if (window.confirm(`Delete gate pass record ${pass.id} for ${pass.studentName}?`)) {
      gatepassService.deleteGatePass(pass.id);
      toast.success(`Deleted gate pass ${pass.id}`);
      refreshPasses();
    }
  };

  const handleViewReceipt = (pass) => {
    setSelectedPass(pass);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 pt-4 pb-12 flex flex-col gap-6 page-enter">
      
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#174351] via-[#1A4B5B] to-[#0E2730] text-white shadow-xl border border-[#245767]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#52B74A]/20 border border-[#52B74A]/30 flex items-center justify-center text-[#52B74A] flex-shrink-0">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#52B74A] uppercase tracking-wider mb-0.5">
              <Sparkles size={12} />
              <span>Super Admin & Warden Audit Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gate Pass Review & Approval System
            </h1>
            <p className="text-xs sm:text-sm text-[#B0D0D8] mt-0.5">
              Review student gate pass requests, approve permits, generate barcodes & download official receipts
            </p>
          </div>
        </div>

        <Button
          variant="success"
          size="md"
          onClick={() => navigate('/hostel-gatepass')}
          className="text-xs font-extrabold flex items-center gap-2 shadow-lg"
        >
          <PlusCircle size={16} />
          <span>New Gate Pass Request</span>
        </Button>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterStatus('all')}
          className={`card p-4 rounded-2xl border border-[var(--border)] cursor-pointer transition-all ${
            filterStatus === 'all' ? 'ring-2 ring-[#52B74A]' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[var(--text-muted)]">Total Passes</span>
            <Ticket size={16} className="text-[#52B74A]" />
          </div>
          <span className="text-2xl font-black text-[var(--text-primary)] mt-1 block">{totalCount}</span>
        </div>

        <div
          onClick={() => setFilterStatus('pending')}
          className={`card p-4 rounded-2xl border border-[var(--border)] cursor-pointer transition-all ${
            filterStatus === 'pending' ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-amber-500">Pending Review</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-500 mt-1 block">{pendingCount}</span>
        </div>

        <div
          onClick={() => setFilterStatus('approved')}
          className={`card p-4 rounded-2xl border border-[var(--border)] cursor-pointer transition-all ${
            filterStatus === 'approved' ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-emerald-500">Approved Passes</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-500 mt-1 block">{approvedCount}</span>
        </div>

        <div
          onClick={() => setFilterStatus('rejected')}
          className={`card p-4 rounded-2xl border border-[var(--border)] cursor-pointer transition-all ${
            filterStatus === 'rejected' ? 'ring-2 ring-red-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-red-500">Rejected Passes</span>
            <XCircle size={16} className="text-red-500" />
          </div>
          <span className="text-2xl font-black text-red-500 mt-1 block">{rejectedCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-6 rounded-3xl border border-[var(--border)] shadow-md flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search student, department, ID or warden..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input text-xs pl-10"
            />
            <Search size={15} className="absolute left-3 top-3.5 text-[var(--text-muted)]" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['all', 'pending', 'approved', 'rejected', 'completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-[#52B74A] text-white shadow-md'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Datatable */}
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border)] text-[11px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
                <th className="py-3.5 px-4">Gate Pass ID</th>
                <th className="py-3.5 px-4">Student & Dept</th>
                <th className="py-3.5 px-4">Hostel / Block</th>
                <th className="py-3.5 px-4">Departure Time</th>
                <th className="py-3.5 px-4">Arrival Time</th>
                <th className="py-3.5 px-4">Warden</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredPasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs font-semibold text-[var(--text-muted)]">
                    No gate passes found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPasses.map((pass) => (
                  <tr key={pass.id} className="hover:bg-[var(--bg-subtle)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-500 whitespace-nowrap">
                      {pass.id}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[var(--text-primary)]">
                      <div>
                        <span className="block font-black text-sm">{pass.studentName}</span>
                        <span className="text-[11px] font-medium text-[var(--text-muted)] block truncate max-w-[160px]">
                          {pass.department}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-primary)] whitespace-nowrap">
                      {pass.block}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-amber-500 whitespace-nowrap">
                      {pass.depDate} ({pass.depTime})
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-sky-500 whitespace-nowrap">
                      {pass.arrDate} ({pass.arrTime})
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-secondary)] whitespace-nowrap">
                      {pass.wardenName}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black uppercase ${
                          pass.status === 'Approved'
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                            : pass.status === 'Pending'
                            ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                            : pass.status === 'Rejected'
                            ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                            : 'bg-sky-500/15 text-sky-500 border border-sky-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            pass.status === 'Approved'
                              ? 'bg-emerald-500'
                              : pass.status === 'Pending'
                              ? 'bg-amber-500 animate-pulse'
                              : pass.status === 'Rejected'
                              ? 'bg-red-500'
                              : 'bg-sky-500'
                          }`}
                        />
                        {pass.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {pass.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenActionModal(pass, 'approve')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 font-extrabold text-[11px] border border-emerald-500/30 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenActionModal(pass, 'reject')}
                              className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-500 font-extrabold text-[11px] border border-red-500/30 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {pass.status === 'Approved' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleViewReceipt(pass)}
                              className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-500 font-extrabold text-[11px] border border-sky-500/30 transition-all flex items-center gap-1"
                            >
                              <Printer size={13} />
                              <span>Receipt</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCompletePass(pass)}
                              className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 font-extrabold text-[11px] border border-purple-500/30 transition-all"
                            >
                              Complete
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeletePass(pass)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Warden Action Approval / Rejection Modal ── */}
      {isActionModalOpen && selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                {actionType === 'approve' ? 'Approve Gate Pass' : 'Reject Gate Pass'}
              </h3>
              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-[var(--text-secondary)] space-y-2 bg-[var(--bg-subtle)] p-3.5 rounded-2xl border border-[var(--border)]">
              <p>
                Student: <strong className="text-[var(--text-primary)]">{selectedPass.studentName}</strong> ({selectedPass.department})
              </p>
              <p>
                Hostel: <strong className="text-[var(--text-primary)]">{selectedPass.block}</strong>
              </p>
              <p>
                Schedule: Departure {selectedPass.depDate} {selectedPass.depTime} — Arrival {selectedPass.arrDate} {selectedPass.arrTime}
              </p>
            </div>

            <form onSubmit={handleConfirmAction} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">
                  Warden Approval / Rejection Remark
                </label>
                <textarea
                  rows={3}
                  value={actionRemark}
                  onChange={(e) => setActionRemark(e.target.value)}
                  placeholder="Enter approval notes or reason for rejection..."
                  className="form-textarea text-xs font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsActionModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={actionType === 'approve' ? 'success' : 'danger'}
                  size="sm"
                  className="text-xs font-extrabold"
                >
                  {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Official Gate Pass Receipt Modal ── */}
      {isReceiptModalOpen && selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-2xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] print:hidden">
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                Official Gate Pass & Barcode Receipt
              </h3>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
              >
                <X size={18} />
              </button>
            </div>

            <GatePassReceipt
              gatePass={selectedPass}
              onClose={() => setIsReceiptModalOpen(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
