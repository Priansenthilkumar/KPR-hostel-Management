// src/services/emailService.js
/**
 * Real Email Dispatch Service for KPRIET Verification Codes
 * Sends actual email messages to user inboxes using FormSubmit AJAX & Web APIs.
 */

export const emailService = {
  /**
   * Dispatch 6-digit OTP code to real email inbox (Non-blocking background fetch)
   */
  sendOTPEmail(email, otpCode, purpose = 'Verification') {
    let cleanEmail = (email || '').trim().toLowerCase();
    if (cleanEmail && !cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@kpriet.ac.in`;
    }

    // Background non-blocking email dispatch
    fetch(`https://formsubmit.co/ajax/${cleanEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `KPRIET Portal ${purpose} OTP Code: ${otpCode}`,
        _captcha: 'false',
        _template: 'table',
        email: cleanEmail,
        Verification_Code: otpCode,
        Message: `Your 6-digit KPRIET Portal ${purpose} code is ${otpCode}. It is valid for 10 minutes. Do not share this code with anyone.`,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log('OTP Email Dispatched:', data))
      .catch((err) => console.warn('Email dispatch background notice:', err));

    return { success: true };
  },
};
