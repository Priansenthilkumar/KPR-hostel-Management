// src/hooks/useEntries.js
import { useState, useCallback } from 'react';
import { storageService } from '../services/storage';

/**
 * Hook for CRUD operations on food entries
 */
export function useEntries() {
  const [entries, setEntries] = useState(() => storageService.getEntries());

  const refresh = useCallback(() => {
    setEntries(storageService.getEntries());
  }, []);

  const addEntry = useCallback((data) => {
    const entry = storageService.addEntry(data);
    setEntries(storageService.getEntries());
    return entry;
  }, []);

  const updateEntry = useCallback((id, updates) => {
    const updated = storageService.updateEntry(id, updates);
    setEntries(storageService.getEntries());
    return updated;
  }, []);

  const deleteEntry = useCallback((id) => {
    storageService.deleteEntry(id);
    setEntries(storageService.getEntries());
  }, []);

  return { entries, addEntry, updateEntry, deleteEntry, refresh };
}
