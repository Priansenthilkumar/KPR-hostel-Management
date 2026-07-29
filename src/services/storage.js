// src/services/storage.js
// Abstracted storage service — swap localStorage for Firebase/Supabase here
// without touching any other file.

const STORAGE_KEY = 'kpr_food_entries_v5';

function getAll() {
  try {
    ['kpr_food_entries', 'kpr_food_entries_v1', 'kpr_food_entries_v2', 'kpr_food_entries_v3', 'kpr_food_entries_v4'].forEach((k) => {
      localStorage.removeItem(k);
    });
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  try {
    window.dispatchEvent(new CustomEvent('kpr_data_updated'));
  } catch (e) {
    console.error('Event dispatch notice:', e);
  }
}

export const storageService = {
  /** Return all entries */
  getEntries() {
    return getAll();
  },

  /** Add a new entry — auto-assigns a unique id */
  addEntry(entry) {
    const entries = getAll();
    const newEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    entries.push(newEntry);
    save(entries);
    return newEntry;
  },

  /** Update an existing entry by id */
  updateEntry(id, updates) {
    const entries = getAll();
    const idx = entries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Entry ${id} not found`);
    entries[idx] = { ...entries[idx], ...updates, updatedAt: new Date().toISOString() };
    save(entries);
    return entries[idx];
  },

  /** Delete an entry by id */
  deleteEntry(id) {
    const entries = getAll().filter((e) => e.id !== id);
    save(entries);
  },

  /** Clear all entries (use with caution) */
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
