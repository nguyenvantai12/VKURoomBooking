import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// ─── Stack navigator param list ─────────────────────────────────────────────

export type RootStackParamList = {
  MainTabs: undefined;
  RoomDetails: { roomId: string; roomName: string };
  Booking: { roomId: string };
  BookingConfirmation: {
    roomId: string;
    roomName: string;
    date: string;
    startTime: string;
    endTime: string;
  };
};

// ─── Tab navigator param list ────────────────────────────────────────────────

export type TabParamList = {
  BrowseRooms: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

// ─── Screen props helpers ────────────────────────────────────────────────────

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/** Screens inside a tab that also need access to the root stack navigator. */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// ─── Global navigation type augmentation ────────────────────────────────────
// Allows useNavigation() to be fully typed without generic parameter.

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
