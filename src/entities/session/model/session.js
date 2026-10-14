import { useSyncExternalStore } from 'react'

export const USERS = {
  docflow: { id: 'user-docflow', name: 'Сергеева Анна', role: 'docflow', roleLabel: 'Документооборот' },
  reader: { id: 'user-reader', name: 'Морозов Илья', role: 'reader', roleLabel: 'Сотрудник' },
}

const STORAGE_KEY = 'vnd-kb-session'
const listeners = new Set()

function readUser() {
  try {
    const role = localStorage.getItem(STORAGE_KEY)
    if (role && USERS[role]) return USERS[role]
  } catch {
    return USERS.docflow
  }
  return USERS.docflow
}

let currentUser = typeof localStorage === 'undefined' ? USERS.docflow : readUser()

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit(user) {
  currentUser = user
  try {
    localStorage.setItem(STORAGE_KEY, user.role)
  } catch {
    // Роль останется в памяти вкладки.
  }
  listeners.forEach((listener) => listener())
}

export function getCurrentUser() {
  return currentUser
}

export function setRole(role) {
  emit(USERS[role] ?? USERS.docflow)
}

export function resetSession() {
  emit(USERS.docflow)
}

export function useSession() {
  return useSyncExternalStore(subscribe, getCurrentUser, getCurrentUser)
}
