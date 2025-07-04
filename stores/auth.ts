import { defineStore } from 'pinia'
import {jwtDecode} from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as any,
    isLoggedIn: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && state.isLoggedIn,
    userName: (state) => state.user?.name || "",
    userAvatar: (state) => state.user?.avatar || "", 
    userEmail: (state) => state.user?.email || "",
    userId: (state) => state.user?.id || null,
    userRole: (state) => state.user?.role || null
  },
  actions: {
    login(token: string) {
      this.token = token
      this.isLoggedIn = !!token
      this.user = jwtDecode(token)
    },
    logout() {
      this.token = null
      this.user = null
      this.isLoggedIn = false
    },
    setToken(token: string) {
      this.token = token
      this.isLoggedIn = !!token
    },
    setUser(user: any) {
      this.user = user
    },
  },
})
