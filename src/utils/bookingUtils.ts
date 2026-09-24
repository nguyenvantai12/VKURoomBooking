import { Booking } from '../types/booking';

/**
 * Check if a new booking would conflict with existing bookings.
 * Uses interval overlap formula: startA < endB && startB < endA.
 * Cancelled bookings are ignored.
 *
 * Time strings are 'HH:MM' — lexicographic comparison works because
 * all times are zero-padded to the same width.
 */
export function hasConflict(
  bookings: Booking[],
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  return bookings.some(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      b.status !== 'cancelled' &&
      startTime < b.endTime &&
      b.startTime < endTime,
  );
}

/**
 * Compute the derived booking status from stored data + current time.
 * We only store 'upcoming' and 'cancelled' in the store. All other
 * statuses ('ongoing', 'completed') are derived on the fly.
 *
 * @param booking - Stored booking object (status may be 'upcoming' or 'cancelled')
 * @param now     - Current timestamp (defaults to Date.now())
 */
export function computeBookingStatus(
  booking: Booking,
  now: number = Date.now(),
): 'upcoming' | 'ongoing' | 'completed' | 'cancelled' {
  if (booking.status === 'cancelled') return 'cancelled';

  const start = new Date(`${booking.date}T${booking.startTime}:00`).getTime();
  const end = new Date(`${booking.date}T${booking.endTime}:00`).getTime();

  if (now < start) return 'upcoming';
  if (now >= start && now < end) return 'ongoing';
  return 'completed';
}

/**
 * Calculate duration in minutes between two 'HH:MM' time strings.
 */
export function durationMinutes(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

/**
 * Format a duration in minutes as a human-readable string.
 * e.g. 60 → '1 hour', 90 → '1.5 hours', 120 → '2 hours'
 */
export function formatDuration(minutes: number): string {
  const hours = minutes / 60;
  const label = hours === 1 ? 'hour' : 'hours';
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} ${label}`;
}
