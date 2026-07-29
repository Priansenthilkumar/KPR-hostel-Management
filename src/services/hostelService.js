// src/services/hostelService.js
/**
 * KPR HOSTELS MANAGEMENT - Backend Storage & Data Service
 */
import { db } from './firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { notificationService } from './notificationService';

const STORAGE_DUTY_KEY = 'kpr_warden_duty_logs_v6';
const STORAGE_REMARKS_KEY = 'kpr_student_remarks_v6';
const DUTY_COLLECTION = 'hostel_duty_logs';
const REMARKS_COLLECTION = 'hostel_student_remarks';

function notifyChange() {
  try {
    window.dispatchEvent(new CustomEvent('kpr_data_updated'));
  } catch (e) {
    console.error('Hostel event dispatch notice:', e);
  }
}

function purgeLegacyHostelKeys() {
  try {
    ['v1', 'v2', 'v3', 'v4', 'v5'].forEach((v) => {
      localStorage.removeItem(`kpr_warden_duty_logs_${v}`);
      localStorage.removeItem(`kpr_student_remarks_${v}`);
    });
  } catch (e) {
    console.error('Purge legacy keys error:', e);
  }
}

// Background Cloud Sync Routine
async function syncHostelFromCloud() {
  try {
    const dutySnapshot = await getDocs(query(collection(db, DUTY_COLLECTION), orderBy('createdAt', 'desc')));
    const cloudDuty = [];
    dutySnapshot.forEach((d) => cloudDuty.push({ id: d.id, ...d.data() }));
    if (cloudDuty.length > 0) {
      localStorage.setItem(STORAGE_DUTY_KEY, JSON.stringify(cloudDuty));
    }

    const remarksSnapshot = await getDocs(query(collection(db, REMARKS_COLLECTION), orderBy('createdAt', 'desc')));
    const cloudRemarks = [];
    remarksSnapshot.forEach((d) => cloudRemarks.push({ id: d.id, ...d.data() }));
    if (cloudRemarks.length > 0) {
      localStorage.setItem(STORAGE_REMARKS_KEY, JSON.stringify(cloudRemarks));
    }

    notifyChange();
  } catch (err) {
    console.warn('Hostel Firestore sync notice:', err.message);
  }
}

// Auto sync cloud data on load
syncHostelFromCloud();

export const hostelService = {
  // ── Warden Duty Logs ──
  getDutyLogs() {
    purgeLegacyHostelKeys();
    try {
      const raw = localStorage.getItem(STORAGE_DUTY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addDutyLog(logData) {
    const logs = this.getDutyLogs();
    const newLog = {
      ...logData,
      id: `duty_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    try {
      localStorage.setItem(STORAGE_DUTY_KEY, JSON.stringify(logs));
      notifyChange();
    } catch (e) {
      console.error('Failed to save duty log:', e);
    }

    // Sync to Firestore Cloud DB
    try {
      setDoc(doc(db, DUTY_COLLECTION, newLog.id), newLog).catch((err) =>
        console.warn('Firestore setDoc duty warning:', err)
      );
    } catch (e) {
      console.warn('Cloud duty sync error:', e);
    }

    // Trigger Super Admin Notification
    try {
      notificationService.addNotification({
        title: 'Hostel Warden Duty Check-in',
        message: `${newLog.name} (${newLog.designation}) checked in at ${newLog.block}.`,
        type: 'hostel',
        link: '/hostel-overview',
      });
    } catch (e) {
      console.warn('Notif duty warning:', e);
    }

    return newLog;
  },

  deleteDutyLog(id) {
    const logs = this.getDutyLogs().filter((l) => l.id !== id);
    try {
      localStorage.setItem(STORAGE_DUTY_KEY, JSON.stringify(logs));
      notifyChange();
    } catch (e) {
      console.error('Failed to delete duty log:', e);
    }

    // Delete from Firestore Cloud DB
    try {
      deleteDoc(doc(db, DUTY_COLLECTION, id)).catch((err) =>
        console.warn('Firestore delete duty warning:', err)
      );
    } catch (e) {
      console.warn('Cloud delete duty error:', e);
    }

    return logs;
  },

  // ── Student Remarks & Rectification Tracker ──
  getStudentRemarks() {
    purgeLegacyHostelKeys();
    try {
      const raw = localStorage.getItem(STORAGE_REMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addStudentRemark(remarkData) {
    const remarks = this.getStudentRemarks();
    const newRemark = {
      ...remarkData,
      id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'Pending',
      rectified: false,
      rectifiedDate: null,
      rectifiedNotes: '',
      createdAt: new Date().toISOString(),
    };
    remarks.unshift(newRemark);
    try {
      localStorage.setItem(STORAGE_REMARKS_KEY, JSON.stringify(remarks));
      notifyChange();
    } catch (e) {
      console.error('Failed to save student remark:', e);
    }

    // Sync to Firestore Cloud DB
    try {
      setDoc(doc(db, REMARKS_COLLECTION, newRemark.id), newRemark).catch((err) =>
        console.warn('Firestore setDoc remark warning:', err)
      );
    } catch (e) {
      console.warn('Cloud remark sync error:', e);
    }

    // Trigger Super Admin Notification
    try {
      notificationService.addNotification({
        title: 'Student Grievance Logged',
        message: `[${newRemark.category}] Remark filed for ${newRemark.studentName} (${newRemark.roomNo}) at ${newRemark.block}.`,
        type: 'remark',
        link: '/hostel-overview',
      });
    } catch (e) {
      console.warn('Notif remark warning:', e);
    }

    return newRemark;
  },

  toggleRectified(id, solutionNotes = 'Rectified by Warden') {
    let targetRemark = null;
    const remarks = this.getStudentRemarks().map((r) => {
      if (r.id === id) {
        const nextRectified = !r.rectified;
        targetRemark = {
          ...r,
          rectified: nextRectified,
          status: nextRectified ? 'Rectified' : 'Pending',
          rectifiedDate: nextRectified ? new Date().toLocaleDateString('en-GB') : null,
          rectifiedNotes: nextRectified ? solutionNotes : '',
        };
        return targetRemark;
      }
      return r;
    });

    try {
      localStorage.setItem(STORAGE_REMARKS_KEY, JSON.stringify(remarks));
      notifyChange();
    } catch (e) {
      console.error('Failed to update remark status:', e);
    }

    // Sync update to Firestore Cloud DB
    if (targetRemark) {
      try {
        setDoc(doc(db, REMARKS_COLLECTION, id), targetRemark, { merge: true }).catch((err) =>
          console.warn('Firestore update remark warning:', err)
        );
      } catch (e) {
        console.warn('Cloud remark update error:', e);
      }
    }

    return remarks;
  },

  deleteStudentRemark(id) {
    const remarks = this.getStudentRemarks().filter((r) => r.id !== id);
    try {
      localStorage.setItem(STORAGE_REMARKS_KEY, JSON.stringify(remarks));
      notifyChange();
    } catch (e) {
      console.error('Failed to delete student remark:', e);
    }

    // Delete from Firestore Cloud DB
    try {
      deleteDoc(doc(db, REMARKS_COLLECTION, id)).catch((err) =>
        console.warn('Firestore delete remark warning:', err)
      );
    } catch (e) {
      console.warn('Cloud delete remark error:', e);
    }

    return remarks;
  },

  // ── Purge All Hostel Records ──
  clearAllHostelRecords() {
    try {
      ['v1', 'v2', 'v3', 'v4', 'v5'].forEach((v) => {
        localStorage.removeItem(`kpr_warden_duty_logs_${v}`);
        localStorage.removeItem(`kpr_student_remarks_${v}`);
      });
      localStorage.setItem(STORAGE_DUTY_KEY, JSON.stringify([]));
      localStorage.setItem(STORAGE_REMARKS_KEY, JSON.stringify([]));
      notifyChange();
    } catch (e) {
      console.error('Failed to clear hostel records:', e);
    }

    // Clear cloud records
    try {
      getDocs(collection(db, DUTY_COLLECTION)).then((snapshot) => {
        snapshot.forEach((d) => deleteDoc(doc(db, DUTY_COLLECTION, d.id)));
      });
      getDocs(collection(db, REMARKS_COLLECTION)).then((snapshot) => {
        snapshot.forEach((d) => deleteDoc(doc(db, REMARKS_COLLECTION, d.id)));
      });
    } catch (e) {
      console.warn('Cloud clear hostel error:', e);
    }
  },
};
