"use client"

import { useSyncExternalStore } from "react"

import { useAuthStore } from "@/stores/auth-store"

const subscribe = (onStoreChange: () => void) =>
  useAuthStore.persist.onFinishHydration(onStoreChange)

const getSnapshot = () => useAuthStore.persist.hasHydrated()

/** The server has no localStorage, so it always renders the pending branch. */
const getServerSnapshot = () => false

/**
 * True once the persisted session has been read back from localStorage.
 * Built on useSyncExternalStore because this project's lint rejects setting
 * state inside an effect.
 */
export function useAuthHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
