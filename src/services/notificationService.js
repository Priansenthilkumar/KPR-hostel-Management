// src/services/notificationService.js

const NOTIF_KEY = 'kpr_superadmin_notifications_v1';

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
      window.dispatchEvent(new CustomEvent('kpr_notification_updated'));
    } catch (e) {
      console.error('Failed to save notification:', e);
    }
    return newNotif;
  },

  markAllAsRead() {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('kpr_notification_updated'));
    } catch (e) {
      console.error('Failed to mark notifications read:', e);
    }
    return list;
  },

  markAsRead(id) {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('kpr_notification_updated'));
    } catch (e) {
      console.error('Failed to mark notification read:', e);
    }
    return list;
  },

  deleteNotification(id) {
    const list = this.getNotifications().filter((n) => n.id !== id);
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('kpr_notification_updated'));
    } catch (e) {
      console.error('Failed to delete notification:', e);
    }
    return list;
  },

  clearAll() {
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('kpr_notification_updated'));
    } catch (e) {
      console.error('Failed to clear notifications:', e);
    }
  },
};
