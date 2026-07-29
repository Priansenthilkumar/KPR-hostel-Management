// src/services/hostelService.js
/**
 * KPR HOSTELS MANAGEMENT - Backend Storage & Data Service
 */

const STORAGE_DUTY_KEY = 'kpr_warden_duty_logs_v6';
const STORAGE_REMARKS_KEY = 'kpr_student_remarks_v6';

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
    return newRemark;
  },

  toggleRectified(id, solutionNotes = 'Rectified by Warden') {
    const remarks = this.getStudentRemarks().map((r) => {
      if (r.id === id) {
        const nextRectified = !r.rectified;
        return {
          ...r,
          rectified: nextRectified,
          status: nextRectified ? 'Rectified' : 'Pending',
          rectifiedDate: nextRectified ? new Date().toLocaleDateString('en-GB') : null,
          rectifiedNotes: nextRectified ? solutionNotes : '',
        };
      }
      return r;
    });

    try {
      localStorage.setItem(STORAGE_REMARKS_KEY, JSON.stringify(remarks));
      notifyChange();
    } catch (e) {
      console.error('Failed to update remark status:', e);
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
  },
};
