/**
 * Utility functions for date and time operations.
 */

/**
 * Generate an array of dates from today up to `daysAhead` days in the future.
 * Returns ISO date strings: 'YYYY-MM-DD'
 */
export function generateAvailableDates(daysAhead: number = 30): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(toISODate(date));
  }
  return dates;
}

/**
 * Format a date string 'YYYY-MM-DD' into a human-readable object.
 * e.g. { dayName: 'Thu', day: '18', month: 'Sep', isToday: true }
 */
export function formatDateLabel(isoDate: string): {
  dayName: string;
  day: string;
  month: string;
  isToday: boolean;
} {
  const date = new Date(isoDate + 'T00:00:00');
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return {
    dayName: isToday
      ? 'Today'
      : date.toLocaleDateString('en-US', { weekday: 'short' }),
    day: date.getDate().toString(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    isToday,
  };
}

/**
 * Convert a Date object to ISO date string 'YYYY-MM-DD'.
 */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Get today's ISO date string.
 */
export function getTodayISO(): string {
  return toISODate(new Date());
}

/**
 * Check if a time slot's end time has already passed for a given date.
 * Returns true if the slot is in the past.
 *
 * @param isoDate - 'YYYY-MM-DD'
 * @param slotEndTime - 'HH:MM'
 */
export function isSlotPast(isoDate: string, slotEndTime: string): boolean {
  const now = new Date();
  const todayISO = toISODate(now);

  // If the date is in the future, no slot can be past
  if (isoDate > todayISO) return false;
  // If the date is in the past (shouldn't happen, but guard)
  if (isoDate < todayISO) return true;

  // It's today — compare current time to slot end time
  const [endHour, endMin] = slotEndTime.split(':').map(Number);
  const slotEnd = new Date();
  slotEnd.setHours(endHour, endMin, 0, 0);

  return now >= slotEnd;
}

/**
 * Format a full date string 'YYYY-MM-DD' to a long readable format.
 * e.g. 'Thursday, 18 Sep 2026'
 */
export function formatFullDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
