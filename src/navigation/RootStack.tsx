import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { RoomDetailScreen } from '../screens/RoomDetailScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { BookingConfirmationScreen } from '../screens/BookingConfirmationScreen';
import { Colors, Typography } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.primary },
      headerTintColor: Colors.textInverse,
      headerTitleStyle: {
        fontWeight: Typography.semibold,
        fontSize: Typography.base,
      },
      headerBackTitle: 'Back',
      contentStyle: { backgroundColor: Colors.background },
    }}
  >
    <Stack.Screen
      name="MainTabs"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RoomDetails"
      component={RoomDetailScreen}
      options={({ route }) => ({
        title: route.params.roomName,
        headerBackTitle: 'Browse',
      })}
    />
    <Stack.Screen
      name="Booking"
      component={BookingScreen}
      options={{ title: 'Book Room' }}
    />
    <Stack.Screen
      name="BookingConfirmation"
      component={BookingConfirmationScreen}
      options={{
        title: 'Confirm Booking',
        presentation: 'modal',
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.textPrimary,
      }}
    />
  </Stack.Navigator>
);
