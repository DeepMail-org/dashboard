import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isHydrated: boolean;
  setToken: (token: string | null) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isHydrated: false,
      setToken: (token) => set({ token }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "deepmail_auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
