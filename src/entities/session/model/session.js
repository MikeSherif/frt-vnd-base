import { create } from 'zustand'
import { USERS } from './users.js'

const STORAGE_KEY = 'vnd-kb-session'

function readRole() {
  try {
    const role = localStorage.getItem(STORAGE_KEY)
    if (role && USERS[role]) return role
  } catch {
    return 'docflow'
  }
  return 'docflow'
}

export const useSessionStore = create((set) => ({
  role: typeof localStorage === 'undefined' ? 'docflow' : readRole(),
  setRole(role) {
    const next = USERS[role] ? role : 'docflow'
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Роль останется в памяти вкладки.
    }
    set({ role: next })
  },
}))

export function getCurrentUser() {
  const role = useSessionStore.getState().role
  return USERS[role] ?? USERS.docflow
}

export function setRole(role) {
  useSessionStore.getState().setRole(role)
}

export function resetSession() {
  setRole('docflow')
}

export function useSession() {
  const role = useSessionStore((state) => state.role)
  return USERS[role] ?? USERS.docflow
}
