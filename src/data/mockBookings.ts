import { Booking } from '../types/booking';

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    roomId: '1', // Room A101
    userId: 'u1',
    date: '2026-09-20',
    startTime: '09:00',
    endTime: '10:00',
    status: 'upcoming'
  },
  {
    id: 'b2',
    roomId: '1', // Room A101
    userId: 'u2',
    date: '2026-09-20',
    startTime: '13:00',
    endTime: '15:00',
    status: 'upcoming'
  }
];
