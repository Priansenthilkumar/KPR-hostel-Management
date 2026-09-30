// src/services/notificationService.js
import { db } from './firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { realtimeSync } from './realtimeSync';

const NOTIF_KEY = 'kpr_superadmin_notifications_v1';
const NOTIF_COLLECTION = 'system_notifications';

function notifyChange() {
  realtimeSync.broadcast('kpr_notification_updated');
}

// Real-Time Cloud Listener via Firestore onSnapshot
if (db) {
  try {
    const q = query(collection(db, NOTIF_COLLECTION), orderBy('timestamp', 'desc'));
    onSnapshot(
      q,
      (snapshot) => {
        const cloudNotifs = [];
        snapshot.forEach((d) => cloudNotifs.push({ id: d.id, ...d.data() }));
        if (cloudNotifs.length > 0) {
          localStorage.setItem(NOTIF_KEY, JSON.stringify(cloudNotifs));
          notifyChange();
        }
      },
      (err) => console.warn('Notifications Firestore listener notice:', err.message)
    );
  } catch (e) {
    console.warn('Notifications realtime listener setup notice:', e);
  }
}

export const notificationService = {
  getNotifications() {
    try {
      const raw = localStorage.getItem(NOTIF_KEY);
      if (raw) return JSON.parse(raw);
      const defaults = this.getDefaultNotifications();
      localStorage.setItem(NOTIF_KEY, JSON.stringify(defaults));
      return defaults;
    } catch {
      return this.getDefaultNotifications();
    }
  },

  getDefaultNotifications() {
    return [
      {
        id: 'notif_1',
        title: 'New Mess Meal Entry Logged',
        message: 'Mess staff recorded 450 student strength & 3.2 KG food wastage.',
        type: 'mess',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/overview',
      },
      {
        id: 'notif_2',
        title: 'Hostel Warden Duty Check-in',
        message: 'Deputy Warden check-in logged at Thiruvalluvar 1st Floor.',
        type: 'hostel',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false,
        link: '/hostel-overview',
      },
      {
        id: 'notif_3',
        title: 'Student Grievance Logged',
        message: 'Water & Plumbing remark filed for Room 204 Cheran Hostel.',
        type: 'remark',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        link: '/hostel-overview',
      },
      {
        id: 'notif_4',
        title: 'App Fault Complaint Received',
        message: 'Mobile UI Layout glitch feedback submitted by Mess User.',
        type: 'bug',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        link: '/admin-home',
      },
    ];
  },

  addNotification(notif) {
    const list = this.getNotifications();
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notif,
    };
    list.unshift(newNotif);
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
      notifyChange();
    } catch (e) {
      console.error('Failed to save notification:', e);
    }

    // Sync to Cloud DB for real-time cross-device notification alert
    try {
      if (db) {
        setDoc(doc(db, NOTIF_COLLECTION, newNotif.id), newNotif).catch((err) =>
          console.warn('Firestore setDoc notification warning:', err)
        );
      }
    } catch (e) {
      console.warn('Cloud notification sync error:', e);
    }

    return newNotif;
  },

  markAllAsRead() {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
      notifyChange();
    } catch (e) {
      console.error('Failed to mark notifications read:', e);
    }

    // Batch update cloud notifications
    try {
      if (db) {
        list.forEach((n) => setDoc(doc(db, NOTIF_COLLECTION, n.id), n, { merge: true }));
      }
    } catch (e) {
      console.warn('Cloud mark all read warning:', e);
    }

    return list;
  },

  markAsRead(id) {
    let updatedNotif = null;
    const list = this.getNotifications().map((n) => {
      if (n.id === id) {
        updatedNotif = { ...n, read: true };
        return updatedNotif;
      }
      return n;
    });

    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
      notifyChange();
    } catch (e) {
      console.error('Failed to mark notification read:', e);
    }

    if (updatedNotif && db) {
      try {
        setDoc(doc(db, NOTIF_COLLECTION, id), updatedNotif, { merge: true }).catch((err) =>
          console.warn('Firestore mark read warning:', err)
        );
      } catch (e) {
        console.warn('Cloud mark read warning:', e);
      }
    }

    return list;
  },

  deleteNotification(id) {
    const list = this.getNotifications().filter((n) => n.id !== id);
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
      notifyChange();
    } catch (e) {
      console.error('Failed to delete notification:', e);
    }

    try {
      if (db) {
        deleteDoc(doc(db, NOTIF_COLLECTION, id)).catch((err) =>
          console.warn('Firestore delete notification warning:', err)
        );
      }
    } catch (e) {
      console.warn('Cloud delete notification error:', e);
    }

    return list;
  },

  clearAll() {
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify([]));
      notifyChange();
    } catch (e) {
      console.error('Failed to clear notifications:', e);
    }

    try {
      if (db) {
        getDocs(collection(db, NOTIF_COLLECTION)).then((snapshot) => {
          snapshot.forEach((d) => deleteDoc(doc(db, NOTIF_COLLECTION, d.id)));
        });
      }
    } catch (e) {
      console.warn('Cloud clear notifications error:', e);
    }
  },
};
