import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../theme';

/** Full-screen skeleton loader for the rooms list */
export const RoomListSkeleton: React.FC = () => (
  <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </Animated.View>
);

const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.imageShimmer} />
    <View style={styles.content}>
      <View style={[styles.shimmer, styles.titleShimmer]} />
      <View style={[styles.shimmer, styles.subtitleShimmer]} />
      <View style={[styles.shimmer, styles.badgeShimmer]} />
    </View>
  </View>
);

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator size="large" color={Colors.accent} />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    height: 120,
  },
  imageShimmer: {
    width: 110,
    backgroundColor: Colors.border,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  shimmer: {
    backgroundColor: Colors.border,
    borderRadius: 4,
  },
  titleShimmer: {
    height: 20,
    width: '70%',
  },
  subtitleShimmer: {
    height: 14,
    width: '50%',
  },
  badgeShimmer: {
    height: 22,
    width: 80,
    borderRadius: 6,
    marginTop: Spacing.xs,
  },
});
