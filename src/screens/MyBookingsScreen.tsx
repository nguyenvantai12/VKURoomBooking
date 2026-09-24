import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  runOnJS,
  FadeInUp
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { TabScreenProps } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { useRoomsQuery } from '../hooks/useRooms';
import { computeBookingStatus } from '../utils/bookingUtils';
import { Booking } from '../types/booking';
import { EmptyState } from '../components/EmptyState';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';

const SWIPE_THRESHOLD = -80;

interface BookingItemProps {
  item: Booking;
  roomName?: string;
  roomBuilding?: string;
  onCancel: (id: string) => void;
}

const BookingItem: React.FC<BookingItemProps> = ({ item, roomName, roomBuilding, onCancel }) => {
  const status = computeBookingStatus(item);
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(130);
  const opacity = useSharedValue(1);

  const confirmCancel = () => {
    Alert.alert('Cancel Booking?', 'Are you sure you want to cancel?', [
      { text: 'No', onPress: () => { translateX.value = withSpring(0); }, style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => {
          opacity.value = withTiming(0);
          itemHeight.value = withTiming(0, undefined, () => {
            runOnJS(onCancel)(item.id);
          });
      }},
    ]);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (status !== 'upcoming') return; // Only allow swipe on upcoming
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (status !== 'upcoming') return;
      if (event.translationX < SWIPE_THRESHOLD) {
        runOnJS(confirmCancel)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    opacity: opacity.value,
    marginBottom: itemHeight.value > 0 ? Spacing.md : 0,
  }));

  let badgeColor: string = Colors.accent;
  let badgeBg: string = Colors.accentLight;
  if (status === 'completed') { badgeColor = Colors.available; badgeBg = Colors.availableLight; }
  else if (status === 'cancelled') { badgeColor = Colors.cancelled; badgeBg = Colors.cancelledLight; }
  else if (status === 'ongoing') { badgeColor = Colors.occupied; badgeBg = Colors.occupiedLight; }

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.deleteBackground}>
        <Ionicons name="trash-outline" size={28} color={Colors.textInverse} />
      </View>
      
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.cardHeader}>
            <Text style={styles.roomName}>{roomName || 'Unknown Room'}</Text>
            <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.statusText, { color: badgeColor }]}>{status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.buildingInfo}>{roomBuilding}</Text>
          
          <View style={styles.timeInfo}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.timeText}>{item.startTime} - {item.endTime}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export const MyBookingsScreen: React.FC<TabScreenProps<'MyBookings'>> = () => {
  const { bookings, cancelBooking, _hasHydrated } = useBookingStore();
  const { data: rooms } = useRoomsQuery();

  // Sort: upcoming first (by date), then completed, then cancelled
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const statusA = computeBookingStatus(a);
      const statusB = computeBookingStatus(b);
      if (statusA === 'upcoming' && statusB !== 'upcoming') return -1;
      if (statusA !== 'upcoming' && statusB === 'upcoming') return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [bookings]);

  if (!_hasHydrated) return null; // Avoid empty flash during persist hydration

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <FlatList
        data={sortedBookings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const room = rooms?.find(r => r.id === item.roomId);
          return (
            <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
              <BookingItem 
                item={item} 
                roomName={room?.name} 
                roomBuilding={room?.building} 
                onCancel={cancelBooking} 
              />
            </Animated.View>
          );
        }}
        ListEmptyComponent={<EmptyState title="No bookings yet" message="You haven't booked any rooms." />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  title: { fontSize: Typography.xxxl, fontWeight: Typography.bold, color: Colors.textPrimary },
  listContent: { padding: Spacing.lg },
  
  deleteBackground: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.occupied,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: Spacing.xl,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  roomName: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: Radius.sm },
  statusText: { fontSize: Typography.xs, fontWeight: Typography.bold },
  buildingInfo: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  dateText: { fontSize: Typography.sm, fontWeight: Typography.medium, color: Colors.textPrimary },
  timeText: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.accent },
});
