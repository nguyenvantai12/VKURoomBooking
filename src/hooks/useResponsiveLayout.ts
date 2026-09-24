import { useWindowDimensions } from 'react-native';

interface ResponsiveLayout {
  numColumns: 1 | 2 | 3;
  isTablet: boolean;
}

/**
 * Returns column count for FlatList based on window width.
 * Design decision: phone portrait → 1 col, tablet/landscape → 2 col,
 * large landscape → 3 col.
 */
export function useResponsiveLayout(): ResponsiveLayout {
  const { width } = useWindowDimensions();

  if (width >= 900) return { numColumns: 3, isTablet: true };
  if (width >= 600) return { numColumns: 2, isTablet: true };
  return { numColumns: 1, isTablet: false };
}
