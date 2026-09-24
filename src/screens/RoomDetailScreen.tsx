import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { useRoom } from '../hooks/useRooms';
import { Colors, Spacing, Typography, Radius } from '../theme';
import { LoadingSpinner } from '../components/SkeletonLoader';
import { ErrorBanner } from '../components/ErrorBanner';

export const RoomDetailScreen: React.FC = () => {
  const route = useRoute<RootStackScreenProps<'RoomDetails'>['route']>();
  const navigation = useNavigation<RootStackScreenProps<'RoomDetails'>['navigation']>();
  
  const { data: room, isLoading, isError } = useRoom(route.params.roomId);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !room) return <ErrorBanner message="Room not found" onRetry={() => navigation.goBack()} />;

  const facilities = room.facilities || ['Air Conditioner', 'Projector', 'Whiteboard', 'Wi-Fi'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: room.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.buildingInfo}>{room.building} · {room.type}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capacity</Text>
            <Text style={styles.sectionText}>{room.capacity} students</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Facilities</Text>
            {facilities.map((fac, index) => (
              <Text key={index} style={styles.facilityItem}>• {fac}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>
              {room.description || 'A quiet, comfortable room for focused study and group work.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Base Status</Text>
            <Text style={[styles.sectionText, { color: room.status === 'Available' ? Colors.available : Colors.occupied }]}>
              {room.status}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [
            styles.bookButton, 
            pressed && styles.bookButtonPressed
          ]}
          onPress={() => navigation.navigate('Booking', { roomId: room.id })}
        >
          <Text style={styles.bookButtonText}>Proceed to Booking</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.border,
  },
  content: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
  },
  roomName: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  buildingInfo: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  sectionText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  facilityItem: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  footer: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  bookButton: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  bookButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  bookButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
});
