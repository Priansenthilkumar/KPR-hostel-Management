// src/services/gatepassService.js
import { db } from './firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { notificationService } from './notificationService';
import { realtimeSync } from './realtimeSync';

const STORAGE_GATEPASS_KEY = 'kpr_hostel_gatepasses_v2';
const GATEPASS_COLLECTION = 'hostel_gate_passes';

/**
 * Guard flag — set to true while a local write (add/update/delete) is in-flight.
 * While true, the Firestore onSnapshot callback skips overwriting localStorage
 * so that stale cloud cache does not restore a just-deleted or just-modified record.
 */
let _pendingLocalWrite = false;
let _pendingLocalWriteTimer = null;

function _beginLocalWrite() {
  _pendingLocalWrite = true;
  // Safety valve: clear the flag after 5 s even if Firestore never responds
  clearTimeout(_pendingLocalWriteTimer);
  _pendingLocalWriteTimer = setTimeout(() => {
    _pendingLocalWrite = false;
  }, 5000);
}

function _endLocalWrite() {
  clearTimeout(_pendingLocalWriteTimer);
  _pendingLocalWrite = false;
}

function purgeLegacyGatePassKeys() {
  try {
    ['v1', 'v2', 'v3', 'legacy'].forEach((v) => {
      localStorage.removeItem(`kpr_hostel_gatepasses_${v}`);
    });
    localStorage.removeItem('kpr_hostel_gatepasses_v1');
  } catch (e) {
    console.error('Purge legacy gatepass keys error:', e);
  }
}

function notifyChange() {
  realtimeSync.broadcast('kpr_gatepass_updated');
  realtimeSync.broadcast('kpr_data_updated');
}

// Real-Time Cloud Subscription via Firestore onSnapshot
if (db) {
  try {
    const q = query(collection(db, GATEPASS_COLLECTION), orderBy('createdAt', 'desc'));
    onSnapshot(
      q,
      (snapshot) => {
        // Skip overwriting localStorage while a local mutation is still in-flight.
        // This prevents Firestore's optimistic-cache snapshot from restoring a
        // record that the user just deleted/modified locally.
        if (_pendingLocalWrite) return;
        const cloudPasses = [];
        snapshot.forEach((d) => cloudPasses.push({ id: d.id, ...d.data() }));
        localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(cloudPasses));
        notifyChange();
      },
      (err) => console.warn('Gatepasses Firestore listener notice:', err.message)
    );
  } catch (e) {
    console.warn('Gatepasses realtime subscription notice:', e);
  }
}

export const gatepassService = {
  getGatePasses() {
    purgeLegacyGatePassKeys();
    try {
      const raw = localStorage.getItem(STORAGE_GATEPASS_KEY);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Normalize any legacy mixed-case status values to lowercase
          // so all UI comparisons using .toLowerCase() work correctly
          const normalized = parsed.map((p) => ({
            ...p,
            status: (p.status || 'pending').toLowerCase(),
          }));
          return normalized;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  addGatePass(data) {
    const passes = this.getGatePasses();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newPass = {
      ...data,
      id: `KPR-GP-${new Date().getFullYear()}-${randomSuffix}`,
      status: 'pending',  // Always lowercase — consistent with approve/reject/complete
      wardenRemark: '',
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date().toISOString(),
    };

    _beginLocalWrite();
    passes.unshift(newPass);
    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    // Sync to Firestore Cloud DB for real-time cross-device sync
    try {
      if (db) {
        setDoc(doc(db, GATEPASS_COLLECTION, newPass.id), newPass)
          .then(() => _endLocalWrite())
          .catch((err) => {
            _endLocalWrite();
            console.warn('Firestore setDoc gatepass warning:', err);
          });
      } else {
        _endLocalWrite();
      }
    } catch (e) {
      _endLocalWrite();
      console.warn('Cloud gatepass sync error:', e);
    }

    // Trigger Notification
    try {
      notificationService.addNotification({
        title: 'New Gate Pass Request Created',
        message: `Gate pass submitted for ${newPass.studentName} (${newPass.block}) awaiting Warden approval.`,
        type: 'hostel',
        link: '/gatepass-review',
      });
    } catch (e) {
      console.warn('Notif gatepass warning:', e);
    }

    return newPass;
  },

  approveGatePass(id, wardenName, remark = 'Approved by Warden') {
    const passes = this.getGatePasses();
    const idx = passes.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Gate pass record not found');

    passes[idx] = {
      ...passes[idx],
      status: 'approved',
      approvedBy: wardenName || passes[idx].wardenName || 'Hostel Warden',
      approvedAt: new Date().toISOString(),
      wardenRemark: remark,
      updatedAt: new Date().toISOString(),
    };

    _beginLocalWrite();
    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    // Sync update to Cloud DB
    try {
      if (db) {
        setDoc(doc(db, GATEPASS_COLLECTION, id), passes[idx], { merge: true })
          .then(() => _endLocalWrite())
          .catch((err) => {
            _endLocalWrite();
            console.warn('Firestore approve gatepass warning:', err);
          });
      } else {
        _endLocalWrite();
      }
    } catch (e) {
      _endLocalWrite();
      console.warn('Cloud approve gatepass error:', e);
    }

    // Notification
    try {
      notificationService.addNotification({
        title: 'Gate Pass Approved',
        message: `Gate pass ${id} for ${passes[idx].studentName} has been APPROVED. Receipt is ready to download.`,
        type: 'hostel',
        link: '/gatepass-review',
      });
    } catch (e) {
      console.warn('Notif approve warning:', e);
    }

    return passes[idx];
  },

  rejectGatePass(id, wardenName, remark = 'Rejected by Warden') {
    const passes = this.getGatePasses();
    const idx = passes.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Gate pass record not found');

    passes[idx] = {
      ...passes[idx],
      status: 'rejected',
      approvedBy: wardenName || passes[idx].wardenName || 'Hostel Warden',
      approvedAt: new Date().toISOString(),
      wardenRemark: remark,
      updatedAt: new Date().toISOString(),
    };

    _beginLocalWrite();
    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    // Sync update to Cloud DB
    try {
      if (db) {
        setDoc(doc(db, GATEPASS_COLLECTION, id), passes[idx], { merge: true })
          .then(() => _endLocalWrite())
          .catch((err) => {
            _endLocalWrite();
            console.warn('Firestore reject gatepass warning:', err);
          });
      } else {
        _endLocalWrite();
      }
    } catch (e) {
      _endLocalWrite();
      console.warn('Cloud reject gatepass error:', e);
    }

    return passes[idx];
  },

  completeGatePass(id) {
    const passes = this.getGatePasses();
    const idx = passes.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Gate pass record not found');

    passes[idx] = {
      ...passes[idx],
      status: 'completed',
      updatedAt: new Date().toISOString(),
    };

    _beginLocalWrite();
    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    // Sync to Cloud DB
    try {
      if (db) {
        setDoc(doc(db, GATEPASS_COLLECTION, id), passes[idx], { merge: true })
          .then(() => _endLocalWrite())
          .catch((err) => {
            _endLocalWrite();
            console.warn('Firestore complete gatepass warning:', err);
          });
      } else {
        _endLocalWrite();
      }
    } catch (e) {
      _endLocalWrite();
      console.warn('Cloud complete gatepass error:', e);
    }

    return passes[idx];
  },

  deleteGatePass(id) {
    const passes = this.getGatePasses().filter((p) => p.id !== id);
    _beginLocalWrite();
    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    try {
      if (db) {
        deleteDoc(doc(db, GATEPASS_COLLECTION, id))
          .then(() => _endLocalWrite())
          .catch((err) => {
            _endLocalWrite();
            console.warn('Firestore delete gatepass warning:', err);
          });
      } else {
        _endLocalWrite();
      }
    } catch (e) {
      _endLocalWrite();
      console.warn('Cloud delete gatepass error:', e);
    }

    return passes;
  },

  clearAllGatePasses() {
    try {
      ['v1', 'v2', 'v3'].forEach((v) => {
        localStorage.removeItem(`kpr_hostel_gatepasses_${v}`);
      });
      localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify([]));
      notifyChange();
    } catch (e) {
      console.error('Failed to clear gate passes:', e);
    }

    try {
      if (db) {
        getDocs(collection(db, GATEPASS_COLLECTION)).then((snapshot) => {
          snapshot.forEach((d) => deleteDoc(doc(db, GATEPASS_COLLECTION, d.id)));
        });
      }
    } catch (e) {
      console.warn('Cloud clear gatepass error:', e);
    }
  },
};
