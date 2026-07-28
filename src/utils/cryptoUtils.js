// src/utils/cryptoUtils.js
/**
 * Cryptographic Utility Functions for Salted Password Hashing, OTP Generation & Email Validation
 */

// Whitelisted Super Admins
export const AUTHORIZED_SUPER_ADMINS = [
  '24cb042@kpriet.ac.in',
  'priansenthilkumar99@gmail.com',
  'bh.overallcoordinator@kpriet.ac.in',
];

/**
 * Validate standard email syntax and KPRIET domain requirements
 */
export function validateKprietEmail(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) {
    return { isValid: false, reason: 'Email address is required.' };
  }

  // Auto-append domain if user typed username without @
  const fullEmail = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@kpriet.ac.in`;

  // Standard RFC 5322 Email Format Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(fullEmail)) {
    return { isValid: false, reason: 'Invalid email format. Please enter a valid email address.' };
  }

  const domain = fullEmail.split('@')[1];
  const isWhitelisted = AUTHORIZED_SUPER_ADMINS.includes(fullEmail);
  const allowedDomains = ['kpriet.ac.in', 'kpr.edu'];

  if (!isWhitelisted && !allowedDomains.includes(domain)) {
    return {
      isValid: false,
      fullEmail,
      reason: 'Access Denied: Only official KPRIET institutional email IDs (@kpriet.ac.in) are permitted.',
    };
  }

  return { isValid: true, fullEmail, domain };
}

/**
 * Generate a random 16-byte hex salt string using Web Crypto API
 */
export function generateSalt() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash password with a salt using Web Crypto API SHA-256
 */
export async function hashPasswordWithSalt(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '::KPRIET_SALT::' + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a 6-digit numeric OTP code
 */
export function generateOTP() {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const val = (array[0] % 900000) + 100000;
  return val.toString();
}

/**
 * Evaluate password strength
 * Returns { score: 1-4, label: 'Weak' | 'Medium' | 'Strong' | 'Very Strong', color: string }
 */
export function evaluatePasswordStrength(password) {
  if (!password) {
    return { score: 0, label: 'Too Short', color: 'bg-gray-300' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score: 1, label: 'Weak', color: 'bg-red-500' };
  }
  if (score === 2) {
    return { score: 2, label: 'Medium', color: 'bg-amber-500' };
  }
  if (score === 3) {
    return { score: 3, label: 'Strong', color: 'bg-[#52B74A]' };
  }
  return { score: 4, label: 'Very Strong', color: 'bg-emerald-600' };
}
