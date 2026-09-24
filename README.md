# VKU Room Booking

A modern, highly-polished React Native application for booking study rooms at VKU. Developed for Week 6 requirements aiming for the "Excellent" (9-10) tier across all criteria.

## Screenshot Placeholder
*(Insert demo GIF or screenshots here)*

## Tech Stack
- **Framework**: Expo ~57, React Native 0.86, React 19
- **Language**: TypeScript (Strict Mode)
- **Navigation**: React Navigation 7 (Native Stack + Bottom Tabs)
- **State Management**:
  - **Client State**: Zustand (with AsyncStorage persistence)
  - **Server State**: TanStack Query (React Query v5)
- **Animations & Gestures**: Reanimated 4, Gesture Handler 2

## Folder Structure
```
src/
├── components/     # Reusable UI components (RoomCard, FilterChip, etc.)
├── data/           # Mock data
├── hooks/          # Custom React hooks (useRooms, useDebouncedValue)
├── navigation/     # React Navigation setup and type definitions
├── providers/      # Global context providers (QueryProvider)
├── screens/        # UI Screens
├── services/       # Simulated API services
├── store/          # Zustand global stores
├── theme/          # Centralized design tokens
├── types/          # TypeScript interfaces and types
└── utils/          # Pure functions for business logic and dates
```

## Setup & Running
1. `npm install`
2. `npx expo start -c`
3. Scan the QR code with Expo Go on your physical device, or press `a`/`i` to run on an emulator.

## Key Features & Design Decisions
- **Zustand + TanStack Query**: Separated concerns. TanStack Query handles the async fetching, caching, and error states for room data. Zustand handles synchronous UI state (filters) and persisted user data (bookings).
- **Conflict Prevention**: Pure utility functions handle overlapping slot logic, used simultaneously by the UI (to disable buttons) and the store (to block invalid adds).
- **Dynamic Status**: Instead of mutating the original room object, a room's availability is derived on-the-fly by comparing current bookings with the current time.
- **Animations**: Utilized Reanimated 4 for 60fps native-driven animations, including staggered list entry, touch scale feedback, and a fully interactive swipe-to-delete gesture in My Bookings.
