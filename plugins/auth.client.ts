import { defineNuxtPlugin } from '#app'
import {jwtDecode } from 'jwt-decode'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Inicializa estado com token do localStorage
  const token = localStorage.getItem('jwt')
  if (token) {
    authStore.setToken(token)
    authStore.setUser(jwtDecode(token))
  }

  // Escuta mudanças no store e sincroniza localStorage
  authStore.$subscribe((mutation, state) => {
    if (state.token) {
      localStorage.setItem('jwt', state.token)
    } else {
      localStorage.removeItem('jwt')
    }
  })
})
