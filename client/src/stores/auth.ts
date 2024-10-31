import type { User } from '@/types/types'
import { defineStore } from 'pinia'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    loading: false,
    error: null
  }),
  actions: {
    loginStart() {
      this.loading = true
      this.error = null
    },
    loginSuccess(user: User) {
      this.user = user
      this.loading = false
      this.error = null
      localStorage.setItem('user', JSON.stringify(user))
    },
    loginFailure(error: string) {
      this.user = null
      this.loading = false
      this.error = error
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    }
  },
  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    isAdmin: (state): boolean | undefined => state.user?.isAdmin
  }
})
