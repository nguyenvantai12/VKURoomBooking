import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { computeBookingStatus } from '../utils/bookingUtils';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';

export const ProfileScreen: React.FC = () => {
  const bookings = useBookingStore((s) => s.bookings);
  
  const stats = bookings.reduce(
    (acc, booking) => {
      const status = computeBookingStatus(booking);
      if (status === 'upcoming' || status === 'ongoing') acc.upcoming++;
      if (status === 'completed') acc.completed++;
      if (status === 'cancelled') acc.cancelled++;
      return acc;
    },
    { upcoming: 0, completed: 0, cancelled: 0 }
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>SV</Text>
          </View>
          <Text style={styles.name}>Nguyễn Văn Tài</Text>
          <Text style={styles.studentId}>ID: 23IT.EB07</Text>
          <Text style={styles.major}>Software Engineering - VKU</Text>
        </View>

        <Text style={styles.sectionTitle}>Booking Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderTopColor: Colors.accent }]}>
            <Ionicons name="calendar-outline" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>{stats.upcoming}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          
          <View style={[styles.statCard, { borderTopColor: Colors.available }]}>
            <Ionicons name="checkmark-circle-outline" size={24} color={Colors.available} />
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={[styles.statCard, { borderTopColor: Colors.cancelled }]}>
            <Ionicons name="close-circle-outline" size={24} color={Colors.cancelled} />
            <Text style={styles.statValue}>{stats.cancelled}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoText}>tainv.23ite@vku.udn.vn</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.infoText}>+84 123 456 789</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: Typography.bold,
    color: Colors.accent,
  },
  name: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  studentId: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    marginBottom: Spacing.xs,
  },
  major: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderTopWidth: 4,
    ...Shadow.sm,
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.lg,
    ...Shadow.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
});
