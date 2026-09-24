import { create } from 'zustand';

export type CapacityFilter = 'all' | 'small' | 'medium' | 'large';

interface FilterState {
  searchQuery: string;
  selectedTypes: string[];
  selectedBuilding: string | null;
  capacityFilter: CapacityFilter;
  onlyAvailable: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  toggleType: (type: string) => void;
  setBuilding: (building: string | null) => void;
  setCapacityFilter: (filter: CapacityFilter) => void;
  setOnlyAvailable: (value: boolean) => void;
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  selectedTypes: [] as string[],
  selectedBuilding: null as string | null,
  capacityFilter: 'all' as CapacityFilter,
  onlyAvailable: false,
};

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleType: (type) =>
    set((state) => ({
      selectedTypes: state.selectedTypes.includes(type)
        ? state.selectedTypes.filter((t) => t !== type)
        : [...state.selectedTypes, type],
    })),

  setBuilding: (building) => set({ selectedBuilding: building }),

  setCapacityFilter: (filter) => set({ capacityFilter: filter }),

  setOnlyAvailable: (value) => set({ onlyAvailable: value }),

  resetFilters: () => set(initialState),
}));
