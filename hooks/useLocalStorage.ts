"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const val = next instanceof Function ? next(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(val));
        } catch {
          // ignore quota errors
        }
        return val;
      });
    },
    [key],
  );

  return [value, set, hydrated] as const;
}
