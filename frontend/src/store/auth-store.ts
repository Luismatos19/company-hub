"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Company } from "@/types";

interface AuthState {
  user: User | null;
  activeCompany: Company | null;
  companies: Company[];
  setUser: (user: User | null) => void;
  setActiveCompany: (company: Company | null) => void;
  setCompanies: (companies: Company[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      activeCompany: null,
      companies: [],
      setUser: (user) => set({ user }),
      setActiveCompany: (activeCompany) => set({ activeCompany }),
      setCompanies: (companies) => set({ companies }),
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
        set({
          user: null,
          activeCompany: null,
          companies: [],
        });
      },
    }),
    {
      name: "auth-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);
