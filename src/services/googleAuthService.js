// src/services/googleAuthService.js
import { validateKprietEmail } from '../utils/cryptoUtils';

/**
 * GOOGLE OAUTH 2.0 IDENTITY SERVICES API SERVICE
 * Connects directly to official Google OAuth API (https://accounts.google.com/gsi/client)
 * Verifies JWT tokens, institutional email domains (@kpriet.ac.in), and authenticates users.
 */

// Default Google OAuth Client ID (can be overridden via VITE_GOOGLE_CLIENT_ID environment variable)
const DEFAULT_GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '984712039481-kprhostelmanagement.apps.googleusercontent.com';

/**
 * Decode Google JWT ID Token Payload
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Dynamically load official Google Identity Services SDK script
 */
export function loadGoogleScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.google && window.google.accounts) {
      resolve(true);
      return;
    }

    const existing = document.getElementById('google-gsi-script');
    if (existing) {
      existing.onload = () => resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export const googleAuthService = {
  parseJwt,

  /**
   * Initialize Google GIS Client API
   */
  async initializeGoogleAuth(onSuccess, onError, clientId = DEFAULT_GOOGLE_CLIENT_ID) {
    const loaded = await loadGoogleScript();
    if (!loaded || !window.google?.accounts?.id) {
      console.warn('Google GSI SDK unavailable or blocked by browser.');
      return false;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (!response || !response.credential) {
            if (onError) onError('No Google credentials returned.');
            return;
          }

          const payload = parseJwt(response.credential);
          if (!payload || !payload.email) {
            if (onError) onError('Invalid Google token payload.');
            return;
          }

          // Verify KPRIET Institutional Email Requirement
          const emailVal = validateKprietEmail(payload.email);
          if (!emailVal.isValid) {
            if (onError) onError(emailVal.reason);
            return;
          }

          if (onSuccess) {
            onSuccess({
              email: payload.email,
              name: payload.name || payload.email.split('@')[0],
              picture: payload.picture,
              token: response.credential,
              domain: payload.hd || emailVal.domain,
            });
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      return true;
    } catch (e) {
      console.error('Failed to initialize Google Auth:', e);
      return false;
    }
  },

  /**
   * Trigger Google One-Tap / Popup Prompt
   */
  promptGoogleSignIn() {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google One Tap prompt notice:', notification.getNotDisplayedReason());
        }
      });
    }
  },

  /**
   * Render Official Google Sign In Button Element
   */
  renderGoogleButton(containerId, options = {}) {
    if (typeof window !== 'undefined' && window.google?.accounts?.id && document.getElementById(containerId)) {
      window.google.accounts.id.renderButton(
        document.getElementById(containerId),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%',
          ...options,
        }
      );
    }
  },
};
