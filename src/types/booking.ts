export type BookingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

/** Single source of truth for the current user ID. */
export const CURRENT_USER_ID = 'u1' as const;

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'Available' | 'Occupied' | 'Selected' | 'Disabled';
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  date: string;       // 'YYYY-MM-DD'
  startTime: string;  // 'HH:MM'
  endTime: string;    // 'HH:MM'
  /** Only 'upcoming' and 'cancelled' are persisted. 'ongoing'/'completed' are derived. */
  status: BookingStatus;
}
