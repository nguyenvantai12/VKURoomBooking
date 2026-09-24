import { Room } from '../types/room';
import { ROOMS } from '../data/rooms';

let simulateError = false;

/**
 * Service to handle API calls related to Rooms.
 * Simulates network latency and optionally errors for demo/testing.
 * Toggle simulateError to demonstrate error state in the UI.
 */
export const roomService = {
  async getRooms(): Promise<Room[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Failed to load rooms. Check your connection.'));
        } else {
          resolve(ROOMS);
        }
      }, 500);
    });
  },

  /** Toggle error simulation for demo purposes */
  setSimulateError(value: boolean) {
    simulateError = value;
  },
};
