// src/components/Records/EmptyState.jsx
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PlusCircle } from 'lucide-react';
import Button from '../UI/Button';

export default function EmptyState({ isFiltered = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-xl">
          <ClipboardList size={48} className="text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">0</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {isFiltered ? 'No matching records' : 'No entries yet'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
        {isFiltered
          ? 'Try adjusting your search filters to find what you\'re looking for.'
          : 'Start tracking hostel food by adding your first meal entry.'}
      </p>

      {!isFiltered && (
        <Button
          variant="primary"
          className="mt-6"
          onClick={() => navigate('/add-entry')}
        >
          <PlusCircle size={16} />
          Add First Entry
        </Button>
      )}
    </div>
  );
}
