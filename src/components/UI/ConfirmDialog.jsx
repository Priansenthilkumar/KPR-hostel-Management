// src/components/UI/ConfirmDialog.jsx
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
  isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onCancel}>
      <div className="card max-w-sm w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} strokeWidth={2} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1">
              {title}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm leading-snug">{message}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-4" />

        {/* Actions */}
        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
