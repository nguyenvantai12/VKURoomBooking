import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, FlatList, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { useRoom } from '../hooks/useRooms';
import { useBookingStore } from '../store/useBookingStore';
import { hasConflict, durationMinutes, formatDuration } from '../utils/bookingUtils';
import { generateAvailableDates, formatDateLabel, formatFullDate, getTodayISO, isSlotPast } from '../utils/dateUtils';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';
import { LoadingSpinner } from '../components/SkeletonLoader';

const ALL_SLOTS = [
  { start: '07:00', end: '08:00' },
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
];

const AVAILABLE_DATES = generateAvailableDates(30);
type SlotStatus = 'available' | 'selected' | 'occupied' | 'past';

export const BookingScreen: React.FC = () => {
  const route = useRoute<RootStackScreenProps<'Booking'>['route']>();
  const navigation = useNavigation<RootStackScreenProps<'Booking'>['navigation']>();
  
  const { data: room, isLoading } = useRoom(route.params.roomId);
  const bookings = useBookingStore(s => s.bookings);

  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());
  // Support multi-hour booking by tracking selected range
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const slotsWithStatus = useMemo(() => {
    if (!room) return [];
    
    return ALL_SLOTS.map((slot) => {
      const isPast = isSlotPast(selectedDate, slot.start); // check start time, not end, so you can't book if it started
      const isOccupied = hasConflict(bookings, room.id, selectedDate, slot.start, slot.end);
      
      const isSelected = selectedStart !== null && selectedEnd !== null && 
                         slot.start >= selectedStart && slot.end <= selectedEnd;

      let status: SlotStatus = 'available';
      if (isPast) status = 'past';
      else if (isOccupied) status = 'occupied';
      else if (isSelected) status = 'selected';

      return { label: `${slot.start} - ${slot.end}`, start: slot.start, end: slot.end, status };
    });
  }, [selectedDate, selectedStart, selectedEnd, bookings, room, currentTime]);

  if (isLoading || !room) return <LoadingSpinner />;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedStart(null);
    setSelectedEnd(null);
  };

  const handleSlotPress = (slot: { start: string; end: string; status: SlotStatus }) => {
    if (slot.status === 'past' || slot.status === 'occupied') return;

    if (!selectedStart || (selectedStart && selectedEnd && selectedStart !== selectedEnd)) {
      // Start fresh single slot
      setSelectedStart(slot.start);
      setSelectedEnd(slot.end);
    } else {
      // Trying to extend a single slot
      const newStart = slot.start < selectedStart ? slot.start : selectedStart;
      const newEnd = slot.end > selectedEnd! ? slot.end : selectedEnd;
      
      // Check max duration (3 hours)
      const durationMins = durationMinutes(newStart, newEnd!);
      if (durationMins > 180) {
        Alert.alert('Max Duration', 'You can only book up to 3 hours at a time.');
        setSelectedStart(slot.start);
        setSelectedEnd(slot.end);
        return;
      }
      
      // Check if there's any conflict in the continuous range
      if (hasConflict(bookings, room.id, selectedDate, newStart, newEnd!)) {
        Alert.alert('Conflict', 'The selected time range contains occupied slots.');
        setSelectedStart(slot.start);
        setSelectedEnd(slot.end);
        return;
      }

      setSelectedStart(newStart);
      setSelectedEnd(newEnd);
    }
  };

  const handleConfirm = () => {
    if (!selectedStart || !selectedEnd) return;
    
    // Final sanity check before navigating
    if (hasConflict(bookings, room.id, selectedDate, selectedStart, selectedEnd)) {
      Alert.alert('Error', 'Slot became unavailable. Please select another time.');
      return;
    }

    navigation.navigate('BookingConfirmation', {
      roomId: room.id,
      roomName: room.name,
      date: selectedDate,
      startTime: selectedStart,
      endTime: selectedEnd,
    });
  };

  const durationStr = (selectedStart && selectedEnd) ? formatDuration(durationMinutes(selectedStart, selectedEnd)) : '';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomSub}>{room.building} · {room.type}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Text style={styles.sectionSubtitle}>{formatFullDate(selectedDate)}</Text>
          <FlatList
            horizontal
            data={AVAILABLE_DATES}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}
            renderItem={({ item: date }) => {
              const label = formatDateLabel(date);
              const isSelected = selectedDate === date;
              return (
                <Pressable
                  onPress={() => handleDateSelect(date)}
                  style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                >
                  <Text style={[styles.dateDayName, isSelected && styles.dateTextSelected]}>{label.dayName}</Text>
                  <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>{label.day}</Text>
                  <Text style={[styles.dateMonth, isSelected && styles.dateTextSelected]}>{label.month}</Text>
                </Pressable>
              );
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <Text style={styles.sectionSubtitle}>Tap a slot to select, tap another to extend (up to 3 hrs).</Text>
          
          <View style={styles.legend}>
            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: Colors.available }]} /><Text style={styles.legendText}>Available</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: Colors.occupied }]} /><Text style={styles.legendText}>Occupied</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: Colors.slotPast }]} /><Text style={styles.legendText}>Passed</Text></View>
          </View>
          
          <View style={styles.slotsGrid}>
            {slotsWithStatus.map((slot) => {
              const isSelected = slot.status === 'selected';
              const isOccupied = slot.status === 'occupied';
              const isPast = slot.status === 'past';
              
              return (
                <Pressable
                  key={slot.label}
                  onPress={() => handleSlotPress(slot)}
                  disabled={isPast || isOccupied}
                  style={[
                    styles.slot,
                    isSelected && styles.slotSelected,
                    isOccupied && styles.slotOccupied,
                    isPast && styles.slotPast,
                  ]}
                >
                  <Text style={[
                    styles.slotTime,
                    isSelected && styles.slotTextSelected,
                    isOccupied && styles.slotTextOccupied,
                    isPast && styles.slotTextPast,
                  ]}>{slot.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {selectedStart ? (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedInfoLabel}>Duration: <Text style={{fontWeight: 'bold', color: Colors.accent}}>{durationStr}</Text></Text>
            <Text style={styles.selectedInfoValue}>{selectedStart} - {selectedEnd}</Text>
          </View>
        ) : null}
        <Pressable
          style={[styles.confirmButton, !selectedStart && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!selectedStart}
        >
          <Text style={styles.confirmButtonText}>Review Booking</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: Spacing.xxxl },
  roomInfo: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  roomName: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary },
  roomSub: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 4 },
  section: { paddingTop: Spacing.xl, paddingHorizontal: Spacing.xl },
  sectionTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: Spacing.xs },
  sectionSubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  
  dateList: { gap: Spacing.md, paddingVertical: Spacing.xs },
  dateCard: {
    width: 60,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dateCardSelected: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dateDayName: { fontSize: Typography.xs, color: Colors.textMuted, fontWeight: Typography.medium },
  dateDay: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, marginVertical: 2 },
  dateMonth: { fontSize: Typography.xs, color: Colors.textMuted },
  dateTextSelected: { color: Colors.textInverse },

  legend: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: Typography.xs, color: Colors.textSecondary },

  slotsGrid: { gap: Spacing.md },
  slot: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  slotSelected: { backgroundColor: Colors.accentLight, borderColor: Colors.accent },
  slotOccupied: { backgroundColor: Colors.occupiedLight, borderColor: Colors.occupiedLight },
  slotPast: { backgroundColor: Colors.slotPastBg, borderColor: Colors.slotPastBg },
  
  slotTime: { fontSize: Typography.md, fontWeight: Typography.semibold, color: Colors.textPrimary },
  slotTextSelected: { color: Colors.accent },
  slotTextOccupied: { color: Colors.occupied, textDecorationLine: 'line-through' },
  slotTextPast: { color: Colors.slotPast },

  footer: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.md,
  },
  selectedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedInfoLabel: { fontSize: Typography.sm, color: Colors.textSecondary },
  selectedInfoValue: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.accent },
  confirmButton: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  confirmButtonDisabled: { backgroundColor: Colors.border },
  confirmButtonText: { color: Colors.textInverse, fontSize: Typography.base, fontWeight: Typography.bold },
});
