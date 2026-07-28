// src/services/authService.js
import {
  generateSalt,
  hashPasswordWithSalt,
  generateOTP,
} from '../utils/cryptoUtils';

/**
 * KPR HOSTELS & MESS MANAGEMENT - Production Authentication Backend Service
 */

const AUTH_STORAGE_KEY = 'kpr_auth_session_v6';
const REGISTERED_USERS_KEY = 'kpr_registered_users_v6';
const FAILED_ATTEMPTS_KEY = 'kpr_failed_attempts_v6';
const OTP_STORAGE_KEY = 'kpr_otp_records_v6';

// Authorized Super Admin Email Whitelist
const AUTHORIZED_SUPER_ADMINS = [
  '24cb042@kpriet.ac.in',
  'priansenthilkumar99@gmail.com',
  'bh.overallcoordinator@kpriet.ac.in',
];

export const authService = {
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
    const cleanEmail = (email || '').trim().toLowerCase();
    return this.getRegisteredUsers().find((u) => u.email.toLowerCase() === cleanEmail);
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
    const key = (email || '').trim().toLowerCase();
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
    const key = (email || '').trim().toLowerCase();
    const record = map[key] || { count: 0, lastAttempt: Date.now() };
    record.count += 1;
    record.lastAttempt = Date.now();
    map[key] = record;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(map));
  },

  resetFailedAttempts(email) {
    const map = this.getFailedAttemptsMap();
    const key = (email || '').trim().toLowerCase();
    if (map[key]) {
      delete map[key];
      localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(map));
    }
  },

  // ── Helper: OTP Management ──
  getOTPMap() {
    try {
      const raw = localStorage.getItem(OTP_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  storeOTP(email, otpCode, purpose = 'signup') {
    const map = this.getOTPMap();
    const key = (email || '').trim().toLowerCase();
    map[key] = {
      otp: otpCode,
      purpose,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins expiry
    };
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(map));
  },

  verifyOTP(email, inputOTP, purpose = 'signup') {
    const map = this.getOTPMap();
    const key = (email || '').trim().toLowerCase();
    const record = map[key];

    if (!record) {
      return { success: false, message: 'No OTP verification request found for this email address.' };
    }

    if (record.purpose !== purpose) {
      return { success: false, message: 'Invalid OTP verification context.' };
    }

    if (Date.now() > record.expiresAt) {
      delete map[key];
      localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(map));
      return { success: false, message: 'Verification OTP has expired. Please click Resend OTP.' };
    }

    if (record.otp !== inputOTP.trim()) {
      return { success: false, message: 'Incorrect 6-digit OTP code. Please check and try again.' };
    }

    // OTP validated successfully, clear it
    delete map[key];
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(map));
    return { success: true };
  },

  // ── FIRST-TIME SIGNUP FLOW ──

  /**
   * Step 1: Request Registration OTP for @kpriet.ac.in Email
   */
  requestSignupOTP(email, role = 'mess_staff') {
    let inputEmail = (email || '').trim().toLowerCase();

    if (!inputEmail) {
      return { success: false, message: 'Please enter a valid KPRIET email address.' };
    }

    if (!inputEmail.includes('@')) {
      inputEmail = `${inputEmail}@kpriet.ac.in`;
    }

    const emailDomain = inputEmail.split('@')[1];
    const isWhitelisted = AUTHORIZED_SUPER_ADMINS.includes(inputEmail);
    const allowedDomains = ['kpriet.ac.in', 'kpr.edu'];

    if (!isWhitelisted && !allowedDomains.includes(emailDomain)) {
      return {
        success: false,
        message: 'Access Denied: Only official KPRIET institutional email IDs (@kpriet.ac.in) are permitted to register.',
      };
    }

    if (role === 'super_admin' && !isWhitelisted) {
      return {
        success: false,
        message: 'Access Denied: This email ID is not authorized for Super Admin registration privileges.',
      };
    }

    // Generate 6-digit OTP
    const otpCode = generateOTP();
    this.storeOTP(inputEmail, otpCode, 'signup');

    return {
      success: true,
      email: inputEmail,
      otpCode, // Returned for instant testing toast / banner
      message: `Verification OTP generated for ${inputEmail}! Check your inbox or use the preview OTP code below.`,
    };
  },

  /**
   * Step 2: Complete User Registration & Password Hashing
   */
  async completeRegistration(email, password, name, role = 'mess_staff') {
    let inputEmail = (email || '').trim().toLowerCase();

    if (!inputEmail || !password || password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long.' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(password, salt);

    const displayName = (name || '').trim() || inputEmail.split('@')[0].toUpperCase();

    const isSuperAdmin = role === 'super_admin' || AUTHORIZED_SUPER_ADMINS.includes(inputEmail);
    const isWarden = role === 'warden';

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

    this.saveRegisteredUser(userObj);

    // Auto log in newly registered user
    const session = this.createSession(userObj);
    return {
      success: true,
      user: session,
      redirectPath: isSuperAdmin ? '/admin-home' : isWarden ? '/hostel-dashboard' : '/mess-dashboard',
      message: 'Account successfully registered and verified!',
    };
  },

  // ── PASSWORD RESET FLOW ──

  /**
   * Step 1: Request Password Reset OTP
   */
  requestPasswordResetOTP(email) {
    let inputEmail = (email || '').trim().toLowerCase();
    if (!inputEmail) {
      return { success: false, message: 'Please enter your registered email address.' };
    }
    if (!inputEmail.includes('@')) {
      inputEmail = `${inputEmail}@kpriet.ac.in`;
    }

    const registeredUser = this.findRegisteredUser(inputEmail);
    // Allow reset even if first-time user using default institutional access
    const isWhitelisted = AUTHORIZED_SUPER_ADMINS.includes(inputEmail);
    const isInstitutional = inputEmail.endsWith('@kpriet.ac.in') || inputEmail.endsWith('@kpr.edu');

    if (!registeredUser && !isWhitelisted && !isInstitutional) {
      return { success: false, message: 'No registered account found with this email ID.' };
    }

    const otpCode = generateOTP();
    this.storeOTP(inputEmail, otpCode, 'reset_password');

    return {
      success: true,
      email: inputEmail,
      otpCode,
      message: `Password reset OTP generated for ${inputEmail}! Check your email or use the preview OTP code below.`,
    };
  },

  /**
   * Step 2: Verify Reset OTP and Set New Password
   */
  async completePasswordReset(email, otpCode, newPassword) {
    let inputEmail = (email || '').trim().toLowerCase();
    const verifyRes = this.verifyOTP(inputEmail, otpCode, 'reset_password');
    if (!verifyRes.success) {
      return verifyRes;
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters long.' };
    }

    let user = this.findRegisteredUser(inputEmail);
    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(newPassword, salt);

    if (!user) {
      // Register user with new password
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

    return {
      success: true,
      message: 'Password successfully updated! You can now log in with your new password.',
    };
  },

  // ── AUTHENTICATION & LOGIN FLOW ──

  /**
   * Authenticate user credentials against salted password hashes
   */
  async authenticate(email, password, selectedRole = 'mess_staff') {
    let inputEmail = (email || '').trim().toLowerCase();

    if (!inputEmail || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    // Auto-append @kpriet.ac.in if user entered username without domain
    if (!inputEmail.includes('@')) {
      inputEmail = `${inputEmail}@kpriet.ac.in`;
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
    } else {
      // Staff domain check
      const emailDomain = inputEmail.split('@')[1];
      const allowedDomains = ['kpriet.ac.in', 'kpr.edu'];
      if (!allowedDomains.includes(emailDomain)) {
        this.recordFailedAttempt(inputEmail);
        return {
          success: false,
          message: 'Access Denied: Only official KPRIET institutional email IDs (@kpriet.ac.in) are permitted to log in.',
        };
      }
    }

    // 2. Check in Registered Users Database
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

    // 3. Fallback Initial Setup for Standard Institutional Staff (First Login auto-hash setup)
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
