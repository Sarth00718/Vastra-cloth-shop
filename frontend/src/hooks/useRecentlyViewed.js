import { useState, useEffect, useCallback } from 'react';

const MAX_RECENT = 8;
const STORAGE_KEY = 'vastra_recently_viewed';

/**
 * Tracks recently viewed product IDs in sessionStorage.
 * Returns [recentIds, addToRecent]
 */
export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const addToRecent = useCallback((productId) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, MAX_RECENT);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return [recentIds, addToRecent];
}
