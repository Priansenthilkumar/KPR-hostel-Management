// src/services/gatepassService.js
import { db } from './firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { notificationService } from './notificationService';

const STORAGE_GATEPASS_KEY = 'kpr_hostel_gatepasses_v2';
const GATEPASS_COLLECTION = 'hostel_gate_passes';

const DEFAULT_GATEPASSES = [];

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
  try {
    window.dispatchEvent(new CustomEvent('kpr_data_updated'));
    window.dispatchEvent(new CustomEvent('kpr_gatepass_updated'));
    window.dispatchEvent(new CustomEvent('storage'));
  } catch (e) {
    console.error('Gate pass event dispatch notice:', e);
  }
}

// Background Cloud Sync Routine
async function syncGatepassesFromCloud() {
  if (!db) return;
  try {
    const snapshot = await getDocs(query(collection(db, GATEPASS_COLLECTION), orderBy('createdAt', 'desc')));
    const cloudPasses = [];
    snapshot.forEach((d) => cloudPasses.push({ id: d.id, ...d.data() }));
    if (cloudPasses.length > 0) {
      localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(cloudPasses));
      notifyChange();
    }
  } catch (err) {
    console.warn('Gatepass Firestore sync notice:', err.message);
  }
}

// Auto sync cloud data on load
syncGatepassesFromCloud();

export const gatepassService = {
  getGatePasses() {
    purgeLegacyGatePassKeys();
    try {
      const raw = localStorage.getItem(STORAGE_GATEPASS_KEY);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify([]));
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
      status: 'Pending',
      wardenRemark: '',
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date().toISOString(),
    };

    passes.unshift(newPass);
    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    // Sync to Firestore Cloud DB
    try {
      setDoc(doc(db, GATEPASS_COLLECTION, newPass.id), newPass).catch((err) =>
        console.warn('Firestore setDoc gatepass warning:', err)
      );
    } catch (e) {
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
      status: 'Approved',
      approvedBy: wardenName || passes[idx].wardenName || 'Hostel Warden',
      approvedAt: new Date().toISOString(),
      wardenRemark: remark,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    // Sync update to Cloud DB
    try {
      setDoc(doc(db, GATEPASS_COLLECTION, id), passes[idx], { merge: true }).catch((err) =>
        console.warn('Firestore approve gatepass warning:', err)
      );
    } catch (e) {
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
      status: 'Rejected',
      approvedBy: wardenName || passes[idx].wardenName || 'Hostel Warden',
      approvedAt: new Date().toISOString(),
      wardenRemark: remark,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    // Sync update to Cloud DB
    try {
      setDoc(doc(db, GATEPASS_COLLECTION, id), passes[idx], { merge: true }).catch((err) =>
        console.warn('Firestore reject gatepass warning:', err)
      );
    } catch (e) {
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
      status: 'Completed',
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();
    return passes[idx];
  },

  deleteGatePass(id) {
    const passes = this.getGatePasses().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_GATEPASS_KEY, JSON.stringify(passes));
    notifyChange();

    try {
      deleteDoc(doc(db, GATEPASS_COLLECTION, id)).catch((err) =>
        console.warn('Firestore delete gatepass warning:', err)
      );
    } catch (e) {
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
  },
};
