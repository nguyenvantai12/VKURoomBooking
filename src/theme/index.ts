/** Centralized design tokens — no magic numbers elsewhere */

export const Colors = {
  // Brand
  primary: '#1E3A5F',     // header/nav bar
  accent: '#3B82F6',      // interactive elements
  accentLight: '#DBEAFE', // accent background tint

  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Backgrounds
  background: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',

  // Status
  available: '#16A34A',
  availableLight: '#DCFCE7',
  occupied: '#DC2626',
  occupiedLight: '#FEE2E2',
  cancelled: '#6B7280',
  cancelledLight: '#F3F4F6',

  // UI
  border: '#E2E8F0',
  divider: '#F1F5F9',
  shadow: '#000000',

  // Slot states
  slotPast: '#CBD5E1',
  slotPastBg: '#F8FAFC',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,

  // Font weights (as typed literals)
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const Shadow = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
} as const;
