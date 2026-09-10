import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { AuthUser, TokenResponse } from "@/shared/interfaces"

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  setUser: (user: AuthUser | null) => void
  setTokens: (tokens: TokenResponse) => void
  logout: () => void
}

/** localStorage key holding the session. */
export const AUTH_STORAGE_KEY = "homehub-cms-auth"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: ({ user, accessToken, refreshToken }) => ({
        user,
        accessToken,
        refreshToken,
      }),
    }
  )
)
