import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { USER_KEY } from "@/constants/config";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        // Mock login - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockUser: User = {
          id: "user-1",
          name: email.split("@")[0],
          email,
          phone: "+250 7XX XXX XXX",
          avatar: undefined,
          isSeller: false,
        };

        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      register: async (name, email, phone, _password) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          phone,
          avatar: undefined,
          isSeller: false,
        };

        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: USER_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
