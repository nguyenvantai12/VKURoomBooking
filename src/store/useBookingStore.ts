import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types/booking';
import { hasConflict } from '../utils/bookingUtils';

interface BookingState {
  bookings: Booking[];
  _hasHydrated: boolean;

  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => boolean;
  cancelBooking: (bookingId: string) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      _hasHydrated: false,

      addBooking: (newBooking) => {
        const { bookings } = get();
        // Final conflict check before adding (prevents race conditions)
        if (
          hasConflict(
            bookings,
            newBooking.roomId,
            newBooking.date,
            newBooking.startTime,
            newBooking.endTime,
          )
        ) {
          return false;
        }

        const booking: Booking = {
          ...newBooking,
          id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          status: 'upcoming',
        };

        set((state) => ({ bookings: [...state.bookings, booking] }));
        return true;
      },

      cancelBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b,
          ),
        }));
      },

      setHasHydrated: (value) => {
        set({ _hasHydrated: value });
      },
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
