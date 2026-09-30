// src/services/storage.js
import { db } from './firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { notificationService } from './notificationService';
import { realtimeSync } from './realtimeSync';

const STORAGE_KEY = 'kpr_food_entries_v6';
const MESS_COLLECTION = 'mess_entries';

function getAll() {
  try {
    ['kpr_food_entries', 'kpr_food_entries_v1', 'kpr_food_entries_v2', 'kpr_food_entries_v3', 'kpr_food_entries_v4', 'kpr_food_entries_v5'].forEach((k) => {
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
  realtimeSync.broadcast('kpr_data_updated');
}

// Subscribe to Realtime Cloud Updates via Firestore onSnapshot
if (db) {
  try {
    const q = query(collection(db, MESS_COLLECTION), orderBy('createdAt', 'desc'));
    onSnapshot(
      q,
      (snapshot) => {
        const cloudEntries = [];
        snapshot.forEach((d) => cloudEntries.push({ id: d.id, ...d.data() }));
        if (cloudEntries.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudEntries));
          realtimeSync.broadcast('kpr_data_updated');
        }
      },
      (err) => console.warn('Mess entries Firestore listener notice:', err.message)
    );
  } catch (e) {
    console.warn('Mess entries realtime sync setup notice:', e);
  }
}

export const storageService = {
  /** Return all entries */
  getEntries() {
    return getAll();
  },

  /** Add a new entry — auto-assigns a unique id and syncs to cloud & all devices */
  addEntry(entry) {
    const entries = getAll();
    const newEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    entries.unshift(newEntry);
    save(entries);

    // Sync to Firestore Cloud DB for real-time cross-device sync
    try {
      if (db) {
        setDoc(doc(db, MESS_COLLECTION, newEntry.id), newEntry).catch((err) =>
          console.warn('Firestore setDoc new meal entry warning:', err)
        );
      }
    } catch (e) {
      console.warn('Cloud new meal entry error:', e);
    }

    // Trigger Super Admin Real-Time Notification
    try {
      notificationService.addNotification({
        title: 'New Mess Meal Entry Logged',
        message: `Meal entry logged for ${newEntry.meal} (${newEntry.mainCourse || 'Special Menu'}) with ${newEntry.strength || 0} headcount.`,
        type: 'mess',
        link: '/overview',
      });
    } catch (e) {
      console.warn('Notif dispatch warning:', e);
    }

    return newEntry;
  },

  /** Update an existing entry by id */
  updateEntry(id, updates) {
    const entries = getAll();
    const idx = entries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Entry ${id} not found`);
    entries[idx] = { ...entries[idx], ...updates, updatedAt: new Date().toISOString() };
    save(entries);

    // Sync update to Firestore Cloud DB
    try {
      if (db) {
        setDoc(doc(db, MESS_COLLECTION, id), entries[idx], { merge: true }).catch((err) =>
          console.warn('Firestore update warning:', err)
        );
      }
    } catch (e) {
      console.warn('Cloud update error:', e);
    }

    return entries[idx];
  },

  /** Delete an entry by id */
  deleteEntry(id) {
    const entries = getAll().filter((e) => e.id !== id);
    save(entries);

    // Delete from Firestore Cloud DB
    try {
      if (db) {
        deleteDoc(doc(db, MESS_COLLECTION, id)).catch((err) =>
          console.warn('Firestore delete warning:', err)
        );
      }
    } catch (e) {
      console.warn('Cloud delete error:', e);
    }
  },

  /** Clear all entries */
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    ['kpr_food_entries', 'kpr_food_entries_v1', 'kpr_food_entries_v2', 'kpr_food_entries_v3', 'kpr_food_entries_v4', 'kpr_food_entries_v5'].forEach((k) => {
      localStorage.removeItem(k);
    });
    save([]);

    // Clear cloud records
    try {
      if (db) {
        getDocs(collection(db, MESS_COLLECTION)).then((snapshot) => {
          snapshot.forEach((d) => deleteDoc(doc(db, MESS_COLLECTION, d.id)));
        });
      }
    } catch (e) {
      console.warn('Cloud clear error:', e);
    }
  },
};
