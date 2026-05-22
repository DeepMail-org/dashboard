import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("deepmail_token") : null,
  setToken: (token) => {
    if (token) localStorage.setItem("deepmail_token", token);
    else localStorage.removeItem("deepmail_token");
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem("deepmail_token");
    set({ token: null });
  },
}));
