// src/hooks/useDarkMode.js
import { useState, useEffect } from 'react';

const DARK_MODE_KEY = 'kpr_dark_mode';

/**
 * Hook to manage dark mode state with localStorage persistence
 */
export function useDarkMode() {
  // The maintenance workspace is intentionally white-first. This also clears
  // the previous persisted dark preference after the visual redesign.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return { isDark, toggle };
}
