import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, Radius } from '../theme';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected,
  onPress,
  accessibilityLabel,
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, isSelected && styles.chipSelected]}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: isSelected }}
    accessibilityLabel={accessibilityLabel ?? label}
    hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
  >
    <Text style={[styles.label, isSelected && styles.labelSelected]}>
      {isSelected ? `✓ ${label}` : label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.textInverse,
  },
});
