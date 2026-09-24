import { useEffect, useRef, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after
 * `delayMs` milliseconds of inactivity. Prevents excessive
 * filter recalculations on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delayMs]);

  return debouncedValue;
}
