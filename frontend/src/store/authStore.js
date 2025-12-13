import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    set({ user, token })
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user, token } }))
  },
  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('auth-storage')
  },
  // Initialize from localStorage
  init: () => {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      const { state } = JSON.parse(stored)
      set({ user: state.user, token: state.token })
    }
  }
}))

