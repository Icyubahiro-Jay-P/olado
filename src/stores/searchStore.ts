import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchFilter } from "@/types";
import { RECENT_SEARCHES_KEY } from "@/constants/config";

interface SearchStore {
  recentSearches: string[];
  currentFilter: SearchFilter;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setFilter: (filter: Partial<SearchFilter>) => void;
  resetFilter: () => void;
}

const defaultFilter: SearchFilter = {
  query: "",
  sortBy: "latest",
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      currentFilter: defaultFilter,

      addRecentSearch: (query) => {
        if (!query.trim()) return;
        set((state) => {
          const searches = [
            query,
            ...state.recentSearches.filter((s) => s !== query),
          ].slice(0, 10);
          return { recentSearches: searches };
        });
      },

      removeRecentSearch: (query) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      setFilter: (filter) => {
        set((state) => ({
          currentFilter: { ...state.currentFilter, ...filter },
        }));
      },

      resetFilter: () => set({ currentFilter: defaultFilter }),
    }),
    {
      name: RECENT_SEARCHES_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
