// src/components/Records/RecordsTable.jsx
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, ChefHat } from 'lucide-react';
import Badge from '../UI/Badge';
import ConfirmDialog from '../UI/ConfirmDialog';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import FilterBar from './FilterBar';
import { formatDisplayDate, formatKg } from '../../utils/dateUtils';
import { useEntries } from '../../hooks/useEntries';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'day', label: 'Day', sortable: true },
  { key: 'meal', label: 'Meal', sortable: true },
  { key: 'mainCourse', label: 'Main Course', sortable: false },
  { key: 'rawMaterial', label: 'Raw Mat. (KG)', sortable: true },
  { key: 'cookName', label: 'Cook Name', sortable: true },
  { key: 'strength', label: 'Strength', sortable: true },
  { key: 'wastage', label: 'Wastage (KG)', sortable: true },
  { key: 'remarks', label: 'Remarks', sortable: false },
  { key: 'actions', label: 'Actions', sortable: false },
];

function SortIcon({ colKey, sortKey, sortDir }) {
  if (sortKey !== colKey)
    return <ArrowUpDown size={12} strokeWidth={2} className="text-gray-400 flex-shrink-0" />;
  return sortDir === 'asc'
    ? <ArrowUp size={12} strokeWidth={2} className="text-[#52B74A] flex-shrink-0" />
    : <ArrowDown size={12} strokeWidth={2} className="text-[#52B74A] flex-shrink-0" />;
}

export default function RecordsTable() {
  const { entries, deleteEntry } = useEntries();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ search: '', date: '', day: '', meal: '', cook: '' });
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters({ search: '', date: '', day: '', meal: '', cook: '' });
    setPage(1);
  }, []);

  const handleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }, [sortKey]);

  // Filter logic
  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchMain = (e.mainCourse || '').toLowerCase().includes(q);
        const matchCook = (e.cookName || '').toLowerCase().includes(q);
        const matchRemarks = (e.remarks || '').toLowerCase().includes(q);
        if (!matchMain && !matchCook && !matchRemarks) return false;
      }
      if (filters.date && e.date !== filters.date) return false;
      if (filters.day && e.day !== filters.day) return false;
      if (filters.meal && e.meal !== filters.meal) return false;
      if (filters.cook && e.cookName !== filters.cook) return false;
      return true;
    });
  }, [entries, filters]);

  // Sort logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA = a[sortKey] ?? '';
      let valB = b[sortKey] ?? '';

      if (['strength', 'wastage', 'rawMaterial'].includes(sortKey)) {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sorted.slice(start, start + ITEMS_PER_PAGE);
  }, [sorted, page]);

  const handleDelete = useCallback(() => {
    deleteEntry(deleteId);
    toast.success('Entry deleted');
    setDeleteId(null);
    if (paginated.length === 1 && page > 1) setPage((p) => p - 1);
  }, [deleteEntry, deleteId, paginated.length, page]);

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="records-workspace">
      <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleFilterReset} />

      {sorted.length === 0 ? (
        <div className="card rounded-2xl p-8">
          <EmptyState isFiltered={hasFilters} />
        </div>
      ) : (
        <>
          {/* Count bar */}
          <div className="records-count flex items-center justify-between mb-3 px-1">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">
              Showing <span className="font-extrabold text-[#52B74A]">{sorted.length}</span>{' '}
              {hasFilters ? 'matching' : 'total'} meal maintenance records
            </p>
          </div>

          {/* Table wrapper */}
          <div className="card records-table-card overflow-hidden p-0 rounded-2xl shadow-xs border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        onClick={() => col.sortable && handleSort(col.key)}
                        className={col.sortable ? 'cursor-pointer select-none hover:opacity-80 transition-opacity' : ''}
                      >
                        <span className="inline-flex items-center gap-1.5 leading-none text-xs font-bold uppercase tracking-wider">
                          {col.label}
                          {col.sortable && (
                            <SortIcon colKey={col.key} sortKey={sortKey} sortDir={sortDir} />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((entry, idx) => {
                    const wastageVal = parseFloat(entry.wastage) || 0;
                    const wastageSeverity = wastageVal > 10 ? 'High' : wastageVal > 5 ? 'Moderate' : 'Low';

                    return (
                      <tr key={entry.id} style={{ animationDelay: `${idx * 30}ms` }} className="animate-fade-in hover:bg-[var(--bg-subtle)] transition-colors">
                        <td className="font-semibold text-[var(--text-primary)] whitespace-nowrap text-xs">
                          {formatDisplayDate(entry.date)}
                        </td>
                        <td>
                          <Badge label={entry.day} />
                        </td>
                        <td>
                          <Badge label={entry.meal} />
                        </td>
                        <td className="max-w-[180px] truncate text-xs font-medium text-[var(--text-secondary)]" title={entry.mainCourse}>
                          {entry.mainCourse}
                        </td>
                        <td className="font-bold text-[#52B74A] text-xs tabular-nums">
                          {formatKg(entry.rawMaterial)}
                        </td>
                        <td>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)]">
                            <ChefHat size={13} className="text-[#52B74A]" />
                            <span>{entry.cookName}</span>
                          </div>
                        </td>
                        <td className="font-bold text-[#52B74A] text-xs tabular-nums">
                          {parseInt(entry.strength).toLocaleString()}
                        </td>
                        <td>
                          <div className="inline-flex items-center gap-1.5">
                            <span className="font-bold text-xs tabular-nums text-[var(--text-primary)]">
                              {formatKg(entry.wastage)}
                            </span>
                            <Badge label={wastageSeverity} />
                          </div>
                        </td>
                        <td className="text-[var(--text-muted)] text-xs max-w-[120px] truncate" title={entry.remarks}>
                          {entry.remarks || '—'}
                        </td>
                        <td>
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/add-entry/${entry.id}`)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#52B74A]/15 text-[#52B74A] transition-colors"
                              title="Edit entry"
                              aria-label={`Edit entry from ${entry.date}`}
                            >
                              <Edit2 size={14} strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => setDeleteId(entry.id)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-red-500/15 text-red-500 transition-colors"
                              title="Delete entry"
                              aria-label={`Delete entry from ${entry.date}`}
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={sorted.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Entry"
        message="Are you sure you want to delete this food maintenance record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
