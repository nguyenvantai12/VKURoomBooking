import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TabScreenProps } from '../navigation/types';
import { RoomCard } from '../components/RoomCard';
import { FilterChip } from '../components/FilterChip';
import { RoomListSkeleton, LoadingSpinner } from '../components/SkeletonLoader';
import { ErrorBanner } from '../components/ErrorBanner';
import { EmptyState } from '../components/EmptyState';
import { useFilteredRooms } from '../hooks/useRooms';
import { useFilterStore, CapacityFilter } from '../store/useFilterStore';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { Room, ROOM_TYPES, BUILDINGS } from '../types/room';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';

export const BrowseRoomsScreen: React.FC<TabScreenProps<'BrowseRooms'>> = ({ navigation }) => {
  // Local state for instant UI update on text input, debounced for actual filtering
  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearch = useDebouncedValue(localSearch, 300);
  
  const { 
    setSearchQuery, 
    selectedTypes, 
    toggleType, 
    selectedBuilding, 
    setBuilding,
    capacityFilter,
    setCapacityFilter,
    onlyAvailable,
    setOnlyAvailable,
    resetFilters
  } = useFilterStore();

  // Sync debounced search to store
  React.useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const { rooms, isLoading, isError, isRefetching, refetch } = useFilteredRooms();
  const { numColumns } = useResponsiveLayout();

  const handleRoomPress = useCallback((room: Room) => {
    navigation.navigate('RoomDetails', { roomId: room.id, roomName: room.name });
  }, [navigation]);

  const renderItem = useCallback(({ item, index }: { item: Room; index: number }) => (
    <View style={{ flex: 1 / numColumns }}>
      <RoomCard room={item} onPress={handleRoomPress} index={index} />
    </View>
  ), [numColumns, handleRoomPress]);

  if (isLoading && !isRefetching) {
    return <RoomListSkeleton />;
  }

  if (isError) {
    return <ErrorBanner onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>VKU Study Room</Text>
        <Text style={styles.subtitle}>Find a room for your study</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search room, building..."
          placeholderTextColor={Colors.textMuted}
          value={localSearch}
          onChangeText={setLocalSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterChip
            label="Available Now"
            isSelected={onlyAvailable}
            onPress={() => setOnlyAvailable(!onlyAvailable)}
          />
          <View style={styles.divider} />
          
          {/* Capacity Filters */}
          <FilterChip
            label="≤10"
            isSelected={capacityFilter === 'small'}
            onPress={() => setCapacityFilter(capacityFilter === 'small' ? 'all' : 'small')}
          />
          <FilterChip
            label="11-30"
            isSelected={capacityFilter === 'medium'}
            onPress={() => setCapacityFilter(capacityFilter === 'medium' ? 'all' : 'medium')}
          />
          <FilterChip
            label="30+"
            isSelected={capacityFilter === 'large'}
            onPress={() => setCapacityFilter(capacityFilter === 'large' ? 'all' : 'large')}
          />
          <View style={styles.divider} />

          {/* Building Filters */}
          {BUILDINGS.map(b => (
            <FilterChip
              key={b}
              label={b.replace('Building ', 'Tòa ')}
              isSelected={selectedBuilding === b}
              onPress={() => setBuilding(selectedBuilding === b ? null : b)}
            />
          ))}
          <View style={styles.divider} />

          {/* Room Type Filters */}
          {ROOM_TYPES.map(type => (
            <FilterChip
              key={type}
              label={type}
              isSelected={selectedTypes.includes(type)}
              onPress={() => toggleType(type)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeader}>Rooms ({rooms.length})</Text>
        {(localSearch || selectedTypes.length > 0 || selectedBuilding || capacityFilter !== 'all' || onlyAvailable) && (
          <Text style={styles.clearFilters} onPress={() => { setLocalSearch(''); resetFilters(); }}>
            Clear all
          </Text>
        )}
      </View>

      <FlatList
        key={numColumns} // Force re-render when columns change
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={[styles.listContent, rooms.length === 0 && styles.listContentEmpty]}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <EmptyState 
            title="No rooms found" 
            message="Try changing your search or filters." 
            actionLabel="Clear Filters"
            onAction={() => { setLocalSearch(''); resetFilters(); }}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    ...Shadow.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  filtersWrapper: {
    height: 44, // Fixed height for horizontal scroll
    marginBottom: Spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  listHeader: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  clearFilters: {
    fontSize: Typography.sm,
    color: Colors.accent,
    fontWeight: Typography.medium,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
});
