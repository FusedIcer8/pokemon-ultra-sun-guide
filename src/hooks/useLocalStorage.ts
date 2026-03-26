'use client';
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch { /* empty */ }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const next = value instanceof Function ? value(prev) : value;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  return [hydrated ? storedValue : initialValue, setValue];
}
