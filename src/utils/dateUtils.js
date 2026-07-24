// src/utils/dateUtils.js
import { format, parseISO, isToday } from 'date-fns';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Get day name from a date string (YYYY-MM-DD)
 * @param {string} dateStr
 * @returns {string} Day name e.g. "Monday"
 */
export function getDayFromDate(dateStr) {
  if (!dateStr) return '';
  try {
    // Parse as local date to avoid timezone offset issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return DAY_NAMES[date.getDay()];
  } catch {
    return '';
  }
}

/**
 * Format a date string (YYYY-MM-DD) for display
 * @param {string} dateStr
 * @returns {string} e.g. "22 Jul 2026"
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Returns today's date as YYYY-MM-DD string
 */
export function getTodayString() {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Check if a date string is today
 * @param {string} dateStr
 */
export function isDateToday(dateStr) {
  if (!dateStr) return false;
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return isToday(date);
  } catch {
    return false;
  }
}

/**
 * Format a number to 2 decimal places
 */
export function formatKg(val) {
  const n = parseFloat(val);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}
