// src/components/UI/ConfirmDialog.jsx
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
  isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0 border border-red-100 dark:border-red-900/50">
            <AlertTriangle size={20} strokeWidth={2} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="font-black text-[var(--text-primary)] text-base leading-tight mb-1">
              {title}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm leading-snug">{message}</p>
          </div>
        </div>

        <div className="h-px bg-[var(--border)] mb-4" />

        {/* Actions */}
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
