import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Room } from '../types/room';
import { Colors, Spacing, Typography, Shadow, Radius } from '../theme';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(View);

const RoomCardComponent: React.FC<RoomCardProps> = ({ room, onPress, index = 0 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tap = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    })
    .onEnd(() => {
      // runOnJS is needed to call React state setters from UI thread
      // onPress is called via runOnJS implicitly by Gesture.Tap
    });

  const handlePress = useCallback(() => {
    onPress(room);
  }, [onPress, room]);

  // Combine tap gesture with onPress handler
  const tapWithPress = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    })
    .runOnJS(true)
    .onEnd(handlePress);

  const delayMs = Math.min(index, 8) * 80; // cap at 8 items to avoid slow stagger

  return (
    <Animated.View
      entering={FadeInDown.delay(delayMs).springify().damping(14)}
    >
      <GestureDetector gesture={tapWithPress}>
        <AnimatedPressable style={[styles.card, animatedStyle]}>
          <Image source={{ uri: room.image }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.roomName} numberOfLines={1}>{room.name}</Text>
            <Text style={styles.buildingText}>{room.building}</Text>

            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>👥 {room.capacity}</Text>
              <Text style={styles.separator}>·</Text>
              <Text style={styles.detailText}>{room.type}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                room.status === 'Available' ? styles.statusAvailable : styles.statusOccupied,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  room.status === 'Available' ? styles.statusTextAvailable : styles.statusTextOccupied,
                ]}
              >
                {room.status === 'Available' ? '● Available' : '● Occupied'}
              </Text>
            </View>
          </View>
        </AnimatedPressable>
      </GestureDetector>
    </Animated.View>
  );
};

export const RoomCard = React.memo(RoomCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginVertical: Spacing.sm - 2,
    marginHorizontal: Spacing.lg,
    overflow: 'hidden',
    ...Shadow.md,
  },
  image: {
    width: 110,
    height: '100%' as unknown as number,
    minHeight: 120,
    backgroundColor: Colors.border,
  },
  infoContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  roomName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  buildingText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  separator: {
    marginHorizontal: Spacing.xs,
    color: Colors.textMuted,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
  },
  statusAvailable: {
    backgroundColor: Colors.availableLight,
  },
  statusOccupied: {
    backgroundColor: Colors.occupiedLight,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  statusTextAvailable: {
    color: Colors.available,
  },
  statusTextOccupied: {
    color: Colors.occupied,
  },
});
