// src/components/Records/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end   = Math.min(currentPage * itemsPerPage, totalItems);

  // Build page list with ellipsis
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const btnBase =
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all leading-none';

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      {/* Record count */}
      <p className="text-xs text-[#B0D0D8] leading-none">
        Showing{' '}
        <span className="font-semibold text-white">{start}–{end}</span>
        {' '}of{' '}
        <span className="font-semibold text-white">{totalItems}</span>
        {' '}records
      </p>

      {/* Page buttons */}
      <div className="inline-flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} w-8 h-8 text-[#B0D0D8] hover:bg-[#1D5060] disabled:opacity-35 disabled:cursor-not-allowed`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex items-center justify-center w-8 h-8 text-[#7E9FA9] text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`${btnBase} w-8 h-8 ${
                p === currentPage
                  ? 'bg-[#52B74A] text-white font-semibold shadow-sm'
                  : 'text-[#B0D0D8] hover:bg-[#1D5060]'
              }`}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} w-8 h-8 text-[#B0D0D8] hover:bg-[#1D5060] disabled:opacity-35 disabled:cursor-not-allowed`}
          aria-label="Next page"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
