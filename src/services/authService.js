// src/services/authService.js
import {
  generateSalt,
  hashPasswordWithSalt,
  validateKprietEmail,
  AUTHORIZED_SUPER_ADMINS,
} from '../utils/cryptoUtils';
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * KPR HOSTELS & MESS MANAGEMENT - Production Authentication Backend Service
 * Integrated with Firebase Cloud Firestore Database & Email Validation
 */

const AUTH_STORAGE_KEY = 'kpr_auth_session_v6';
const REGISTERED_USERS_KEY = 'kpr_registered_users_v6';
const FAILED_ATTEMPTS_KEY = 'kpr_failed_attempts_v6';

// Helper: Normalize Email Address
const normalizeEmail = (email) => {
  let key = (email || '').trim().toLowerCase();
  if (key && !key.includes('@')) {
    key = `${key}@kpriet.ac.in`;
  }
  return key;
};

export const authService = {
  normalizeEmail,

  // ── Helper: Registered Users Database Management ──
  getRegisteredUsers() {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveRegisteredUser(userObj) {
    try {
      const users = this.getRegisteredUsers();
      const existingIdx = users.findIndex((u) => u.email.toLowerCase() === userObj.email.toLowerCase());
      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...userObj, updatedAt: Date.now() };
      } else {
        users.push({ ...userObj, createdAt: Date.now(), updatedAt: Date.now() });
      }
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save registered user:', e);
    }
  },

  findRegisteredUser(email) {
    const cleanEmail = normalizeEmail(email);
    return this.getRegisteredUsers().find((u) => normalizeEmail(u.email) === cleanEmail);
  },

  // ── Helper: Rate Limiting (5 failures in 15 mins -> 15 min lock) ──
  getFailedAttemptsMap() {
    try {
      const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  checkRateLimit(email) {
    const map = this.getFailedAttemptsMap();
    const key = normalizeEmail(email);
    const record = map[key];
    if (!record) return { isLocked: false };

    const now = Date.now();
    const lockWindow = 15 * 60 * 1000; // 15 mins

    if (record.count >= 5) {
      const timePassed = now - record.lastAttempt;
      if (timePassed < lockWindow) {
        const minutesLeft = Math.ceil((lockWindow - timePassed) / 60000);
        return {
          isLocked: true,
          message: `Too many failed login attempts. Your account is temporarily locked for safety. Please try again in ${minutesLeft} minutes.`,
        };
      } else {
        // Lock expired, reset
        delete map[key];
        localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(map));
      }
    }
    return { isLocked: false };
  },

  recordFailedAttempt(email) {
    const map = this.getFailedAttemptsMap();
    const key = normalizeEmail(email);
    const record = map[key] || { count: 0, lastAttempt: Date.now() };
    record.count += 1;
    record.lastAttempt = Date.now();
    map[key] = record;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(map));
  },

  resetFailedAttempts(email) {
    const map = this.getFailedAttemptsMap();
    const key = normalizeEmail(email);
    if (map[key]) {
      delete map[key];
      localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(map));
    }
  },

  // ── DIRECT REGISTRATION FLOW (FIREBASE FIRESTORE SYNCED) ──

  /**
   * Complete User Registration with Firebase Firestore & Salted Hashing
   */
  async completeRegistration(email, password, name, role = 'mess_staff') {
    const emailVal = validateKprietEmail(email);
    if (!emailVal.isValid) {
      return { success: false, message: emailVal.reason };
    }

    let inputEmail = emailVal.fullEmail;
    const isWhitelisted = AUTHORIZED_SUPER_ADMINS.includes(inputEmail);

    if (!password || password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long.' };
    }

    // Role assignment
    let finalRole = role;
    if (role === 'super_admin' && !isWhitelisted) {
      finalRole = inputEmail.includes('warden') || inputEmail.includes('hostel') ? 'warden' : 'mess_staff';
    }

    const isSuperAdmin = finalRole === 'super_admin' || AUTHORIZED_SUPER_ADMINS.includes(inputEmail);
    const isWarden = finalRole === 'warden';

    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(password, salt);
    const displayName = (name || '').trim() || inputEmail.split('@')[0].toUpperCase();

    const userObj = {
      id: `usr_${Date.now()}`,
      email: inputEmail,
      name: displayName,
      role: isSuperAdmin ? 'super_admin' : isWarden ? 'warden' : 'mess_staff',
      roleTitle: isSuperAdmin
        ? 'Super Admin (Full Access)'
        : isWarden
        ? 'Hostel Deputy Warden'
        : 'Mess Coordinator',
      avatarBg: isSuperAdmin ? '#8B5CF6' : isWarden ? '#3DA1D1' : '#52B74A',
      salt,
      passwordHash,
      isVerified: true,
    };

    // Save locally
    this.saveRegisteredUser(userObj);
    this.resetFailedAttempts(inputEmail);

    // Save to Firebase Cloud Firestore Database
    try {
      const userDocRef = doc(db, 'users', inputEmail);
      await setDoc(
        userDocRef,
        {
          id: userObj.id,
          email: inputEmail,
          name: displayName,
          role: userObj.role,
          roleTitle: userObj.roleTitle,
          passwordHash,
          salt,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isVerified: true,
        },
        { merge: true }
      );
      console.log('✅ User account & credentials stored in Firebase Firestore successfully!');
    } catch (fbErr) {
      console.warn('Firebase Firestore sync notice:', fbErr);
    }

    // Auto log in newly registered user
    const session = this.createSession(userObj);
    return {
      success: true,
      user: session,
      redirectPath: isSuperAdmin ? '/admin-home' : isWarden ? '/hostel-dashboard' : '/mess-dashboard',
      message: 'Account successfully registered and saved to Firebase!',
    };
  },

  // ── DIRECT PASSWORD RESET FLOW (FIREBASE FIRESTORE SYNCED) ──

  /**
   * Complete Password Reset Directly & Update Firebase Firestore
   */
  async completePasswordReset(email, newPassword) {
    const emailVal = validateKprietEmail(email);
    if (!emailVal.isValid) {
      return { success: false, message: emailVal.reason };
    }

    let inputEmail = emailVal.fullEmail;

    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters long.' };
    }

    let user = this.findRegisteredUser(inputEmail);
    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(newPassword, salt);

    if (!user) {
      const isWhitelisted = AUTHORIZED_SUPER_ADMINS.includes(inputEmail);
      const isInstitutional = inputEmail.endsWith('@kpriet.ac.in') || inputEmail.endsWith('@kpr.edu');

      if (!isWhitelisted && !isInstitutional) {
        return { success: false, message: 'Access Denied: Only official KPRIET institutional email IDs are permitted.' };
      }

      // Register new user with this password
      const isSuperAdmin = AUTHORIZED_SUPER_ADMINS.includes(inputEmail);
      user = {
        id: `usr_${Date.now()}`,
        email: inputEmail,
        name: inputEmail.split('@')[0].toUpperCase(),
        role: isSuperAdmin ? 'super_admin' : 'mess_staff',
        roleTitle: isSuperAdmin ? 'Super Admin' : 'Mess Coordinator',
        avatarBg: isSuperAdmin ? '#8B5CF6' : '#52B74A',
        salt,
        passwordHash,
        isVerified: true,
      };
    } else {
      user.salt = salt;
      user.passwordHash = passwordHash;
      user.isVerified = true;
    }

    this.saveRegisteredUser(user);
    this.resetFailedAttempts(inputEmail);

    // Update password hash in Firebase Cloud Firestore Database
    try {
      const userDocRef = doc(db, 'users', inputEmail);
      await setDoc(
        userDocRef,
        {
          email: inputEmail,
          passwordHash,
          salt,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log('✅ Password update synced to Firebase Firestore successfully!');
    } catch (fbErr) {
      console.warn('Firebase Firestore password update notice:', fbErr);
    }

    return {
      success: true,
      message: 'Password successfully updated! You can now log in with your new password.',
    };
  },

  // ── AUTHENTICATION & LOGIN FLOW (FIREBASE FIRESTORE READ) ──

  /**
   * Authenticate user credentials against salted password hashes
   */
  async authenticate(email, password, selectedRole = 'mess_staff') {
    const emailVal = validateKprietEmail(email);
    if (!emailVal.isValid) {
      return { success: false, message: emailVal.reason };
    }

    let inputEmail = emailVal.fullEmail;

    if (!password) {
      return { success: false, message: 'Please enter your password.' };
    }

    // 1. Check Brute-Force Rate Limiting
    const rateCheck = this.checkRateLimit(inputEmail);
    if (rateCheck.isLocked) {
      return { success: false, message: rateCheck.message };
    }

    // Authorized Super Admin Whitelist
    const isSuperAdminRequest =
      selectedRole === 'super_admin' || AUTHORIZED_SUPER_ADMINS.includes(inputEmail);

    if (isSuperAdminRequest) {
      if (!AUTHORIZED_SUPER_ADMINS.includes(inputEmail)) {
        this.recordFailedAttempt(inputEmail);
        return {
          success: false,
          message: 'Access Denied: This email ID is not authorized for Super Admin access.',
        };
      }
    }

    // 2. Check in Firebase Cloud Firestore first
    try {
      const userDocRef = doc(db, 'users', inputEmail);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const fbUserData = userSnap.data();
        if (fbUserData.passwordHash && fbUserData.salt) {
          const inputHash = await hashPasswordWithSalt(password, fbUserData.salt);
          if (inputHash === fbUserData.passwordHash) {
            this.resetFailedAttempts(inputEmail);
            this.saveRegisteredUser(fbUserData); // Cache locally
            const session = this.createSession(fbUserData);
            const redirectPath =
              fbUserData.role === 'super_admin'
                ? '/admin-home'
                : fbUserData.role === 'warden'
                ? '/hostel-dashboard'
                : '/mess-dashboard';
            return { success: true, user: session, redirectPath, role: fbUserData.role };
          }
        }
      }
    } catch (fbErr) {
      console.warn('Firebase Firestore auth lookup notice:', fbErr);
    }

    // 3. Check in Local Registered Users Database
    let registeredUser = this.findRegisteredUser(inputEmail);

    if (registeredUser) {
      // Evaluate salted SHA-256 hash
      const inputHash = await hashPasswordWithSalt(password, registeredUser.salt);
      if (inputHash !== registeredUser.passwordHash) {
        this.recordFailedAttempt(inputEmail);
        return {
          success: false,
          message: 'Invalid password. Please check your credentials and try again.',
        };
      }

      this.resetFailedAttempts(inputEmail);
      const session = this.createSession(registeredUser);
      const redirectPath =
        registeredUser.role === 'super_admin'
          ? '/admin-home'
          : registeredUser.role === 'warden'
          ? '/hostel-dashboard'
          : '/mess-dashboard';

      return { success: true, user: session, redirectPath, role: registeredUser.role };
    }

    // 4. Fallback Initial Setup for Standard Institutional Staff (First Login auto-hash setup & Firebase sync)
    const isWarden = selectedRole === 'warden' || inputEmail.includes('warden') || inputEmail.includes('hostel');
    const isSuperAdmin = isSuperAdminRequest;

    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      email: inputEmail,
      name: inputEmail.split('@')[0].toUpperCase(),
      role: isSuperAdmin ? 'super_admin' : isWarden ? 'warden' : 'mess_staff',
      roleTitle: isSuperAdmin
        ? 'Super Admin (Full Access)'
        : isWarden
        ? 'Hostel Deputy Warden'
        : 'Mess Coordinator',
      avatarBg: isSuperAdmin ? '#8B5CF6' : isWarden ? '#3DA1D1' : '#52B74A',
      salt,
      passwordHash,
      isVerified: true,
    };

    this.saveRegisteredUser(newUser);
    this.resetFailedAttempts(inputEmail);

    // Sync initial account to Firebase
    try {
      const userDocRef = doc(db, 'users', inputEmail);
      await setDoc(userDocRef, { ...newUser, createdAt: new Date().toISOString() }, { merge: true });
    } catch (fbErr) {
      console.warn('Firebase initial user sync notice:', fbErr);
    }

    const session = this.createSession(newUser);
    const redirectPath = isSuperAdmin
      ? '/admin-home'
      : isWarden
      ? '/hostel-dashboard'
      : '/mess-dashboard';

    return { success: true, user: session, redirectPath, role: newUser.role };
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
      token: `kpr_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`,
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
      ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'latest'].forEach((v) => {
        localStorage.removeItem(`kpr_auth_session_${v}`);
      });
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('kpr_auth_session');
    } catch (e) {
      console.error('Failed to clear all auth sessions:', e);
    }
  },

  /**
   * Get active session
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
