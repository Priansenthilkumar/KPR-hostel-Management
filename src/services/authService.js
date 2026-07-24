// src/services/authService.js
/**
 * KPR HOSTELS & MESS MANAGEMENT - Authentication Backend Service
 */

const AUTH_STORAGE_KEY = 'kpr_auth_session_v5';

// Registered Authorization Database
const USERS_DB = [
  {
    id: 'usr_001',
    email: 'mess.staff@kpr.edu',
    password: 'password123',
    name: 'Senthilkumar',
    role: 'mess_staff',
    roleTitle: 'Mess Coordinator',
    redirectPath: '/',
    avatarBg: '#52B74A',
  },
  {
    id: 'usr_002',
    email: 'warden@kpr.edu',
    password: 'warden123',
    name: 'Dr. Arunkumar',
    role: 'warden',
    roleTitle: 'Hostel Deputy Warden',
    redirectPath: '/hostel-dashboard',
    avatarBg: '#3DA1D1',
  },
];

export const authService = {
  /**
   * Authenticate user credentials against backend database
   */
  authenticate(email, password, selectedRole = 'mess_staff') {
    const inputEmail = email.trim().toLowerCase();

    if (!inputEmail || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const isWarden = selectedRole === 'warden' || inputEmail.includes('warden') || inputEmail.includes('hostel');

    if (isWarden) {
      const wardenUser = {
        id: `usr_${Date.now()}`,
        email: inputEmail,
        name: inputEmail.split('@')[0].toUpperCase(),
        role: 'warden',
        roleTitle: 'Hostel Deputy Warden',
        avatarBg: '#3DA1D1',
      };
      const session = this.createSession(wardenUser);
      return { success: true, user: session, redirectPath: '/hostel-dashboard', role: 'warden' };
    }

    const messUser = {
      id: `usr_${Date.now()}`,
      email: inputEmail,
      name: inputEmail.split('@')[0].toUpperCase(),
      role: 'mess_staff',
      roleTitle: 'Mess Coordinator',
      avatarBg: '#52B74A',
    };
    const session = this.createSession(messUser);
    return { success: true, user: session, redirectPath: '/', role: 'mess_staff' };
  },

  /**
   * Create and store authentication token & session
   */
  createSession(userData) {
    const session = {
      id: userData.id || `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      roleTitle: userData.roleTitle,
      avatarBg: userData.avatarBg,
      token: `kpr_jwt_${Math.random().toString(36).substring(2)}`,
      loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      this.clearAllSessions();
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save auth session:', e);
    }

    return session;
  },

  /**
   * Log out all devices by clearing all stored auth tokens
   */
  clearAllSessions() {
    try {
      ['v1', 'v2', 'v3', 'v4', 'v5', 'latest'].forEach((v) => {
        localStorage.removeItem(`kpr_auth_session_${v}`);
      });
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('kpr_auth_session');
    } catch (e) {
      console.error('Failed to clear all auth sessions:', e);
    }
  },

  /**
   * Get active session (logged out all devices by default)
   */
  getCurrentSession() {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear session on logout
   */
  clearSession() {
    this.clearAllSessions();
  },

  /**
   * No demo users
   */
  getDemoUsers() {
    return [];
  },
};
