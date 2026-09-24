import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { RootStackScreenProps } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { formatDuration, durationMinutes } from '../utils/bookingUtils';
import { formatFullDate } from '../utils/dateUtils';
import { CURRENT_USER_ID } from '../types/booking';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';

export const BookingConfirmationScreen: React.FC = () => {
  const route = useRoute<RootStackScreenProps<'BookingConfirmation'>['route']>();
  const navigation = useNavigation<RootStackScreenProps<'BookingConfirmation'>['navigation']>();
  const { roomId, roomName, date, startTime, endTime } = route.params;
  
  const addBooking = useBookingStore(s => s.addBooking);

  const durationStr = formatDuration(durationMinutes(startTime, endTime));

  const handleConfirm = () => {
    const success = addBooking({
      roomId,
      userId: CURRENT_USER_ID,
      date,
      startTime,
      endTime,
    });

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      // Navigate to MyBookings tab
      navigation.navigate('MainTabs', { screen: 'MyBookings' } as any);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      Alert.alert(
        'Booking Failed',
        'This slot was just booked by someone else. Please choose another time.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Room:</Text>
          <Text style={styles.value}>{roomName}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatFullDate(date)}</Text>
          
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{startTime} - {endTime}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{durationStr}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable 
          style={({ pressed }) => [styles.confirmButton, pressed && styles.pressed]} 
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.xxxl,
    borderRadius: Radius.xl,
    ...Shadow.lg,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.md,
  },
  pressed: { opacity: 0.8 },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  confirmButton: {
    flex: 2,
    backgroundColor: Colors.available,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
});
