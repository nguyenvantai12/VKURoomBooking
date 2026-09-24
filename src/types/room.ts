export type RoomType = 'Study Room' | 'Meeting Room' | 'Discussion Room' | 'Computer Lab' | 'Lecture Hall';

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  type: RoomType;
  /** Static base status from the data source. Dynamic status (occupied now?) is computed separately. */
  status: 'Available' | 'Occupied';
  image: string;
  description?: string;
  facilities?: string[];
}

export const ROOM_TYPES: RoomType[] = [
  'Study Room',
  'Meeting Room',
  'Discussion Room',
  'Computer Lab',
  'Lecture Hall',
];

export const BUILDINGS = ['Building A', 'Building B', 'Building C', 'Building D'] as const;
export type Building = typeof BUILDINGS[number];
