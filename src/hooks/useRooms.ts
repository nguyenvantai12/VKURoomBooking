import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Room } from '../types/room';
import { roomService } from '../services/roomService';
import { useFilterStore, CapacityFilter } from '../store/useFilterStore';
import { useBookingStore } from '../store/useBookingStore';
import { hasConflict } from '../utils/bookingUtils';
import { getTodayISO } from '../utils/dateUtils';

/** Fetches all rooms from the server (cached via TanStack Query). */
export function useRoomsQuery() {
  return useQuery<Room[], Error>({
    queryKey: ['rooms'],
    queryFn: roomService.getRooms,
  });
}

/** Returns the room matching roomId, using the cached query (no extra API call). */
export function useRoom(roomId: string) {
  return useQuery<Room[], Error, Room | undefined>({
    queryKey: ['rooms'],
    queryFn: roomService.getRooms,
    select: (rooms) => rooms.find((r) => r.id === roomId),
  });
}

function matchesCapacity(capacity: number, filter: CapacityFilter): boolean {
  switch (filter) {
    case 'small':  return capacity <= 10;
    case 'medium': return capacity >= 11 && capacity <= 30;
    case 'large':  return capacity > 30;
    default:       return true;
  }
}

/**
 * Combines server data (TanStack Query) + filters (Zustand) + booking data (Zustand).
 * Dynamic room status: a room is 'Occupied NOW' if it has an active booking at this moment.
 */
export function useFilteredRooms() {
  const { data: rooms = [], isLoading, isError, isRefetching, refetch } = useRoomsQuery();
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const selectedTypes = useFilterStore((s) => s.selectedTypes);
  const selectedBuilding = useFilterStore((s) => s.selectedBuilding);
  const capacityFilter = useFilterStore((s) => s.capacityFilter);
  const onlyAvailable = useFilterStore((s) => s.onlyAvailable);
  const bookings = useBookingStore((s) => s.bookings);

  const filtered = useMemo(() => {
    const today = getTodayISO();
    const now = new Date();
    const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const searchLower = searchQuery.trim().toLowerCase();

    return rooms
      .map((room) => {
        // Dynamic status: occupied if there's an active booking right now
        const isOccupiedNow = hasConflict(bookings, room.id, today, nowTime, nowTime);
        const dynamicStatus: 'Available' | 'Occupied' = isOccupiedNow ? 'Occupied' : room.status;
        return { ...room, status: dynamicStatus };
      })
      .filter((room) => {
        if (searchLower) {
          const matches =
            room.name.toLowerCase().includes(searchLower) ||
            room.building.toLowerCase().includes(searchLower) ||
            room.type.toLowerCase().includes(searchLower);
          if (!matches) return false;
        }

        if (selectedTypes.length > 0 && !selectedTypes.includes(room.type)) return false;
        if (selectedBuilding && room.building !== selectedBuilding) return false;
        if (!matchesCapacity(room.capacity, capacityFilter)) return false;
        if (onlyAvailable && room.status !== 'Available') return false;

        return true;
      });
  }, [rooms, searchQuery, selectedTypes, selectedBuilding, capacityFilter, onlyAvailable, bookings]);

  return { rooms: filtered, isLoading, isError, isRefetching, refetch, totalCount: rooms.length };
}
