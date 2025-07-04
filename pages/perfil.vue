<template>
  <UContainer>
    <UTabs :items="items" variant="link" class="gap-4 w-full mt-10" :ui="{ trigger: 'grow' }">
      <template #account="{ item }">
        <ProfileAccount />
      </template>

      <template #password="{ item }">
        <p class="text-muted mb-4">
          {{ item.description }}
        </p>
      </template>

      <template #matches="{ item }">
        <h1>Teste</h1>
      </template>
    </UTabs>
  </UContainer>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items = [
  {
    label: 'Conta',
    description: 'Make changes to your account here. Click save when you\'re done.',
    icon: 'i-lucide-user',
    slot: 'account' as const
  },
  {
    label: 'Amigos',
    description: 'Change your password here. After saving, you\'ll be logged out.',
    icon: 'i-lucide-handshake',
    slot: 'password' as const
  },
  {
    label: 'Partidas',
    icon: 'i-lucide-swords',
    slot: 'matches' as const 
      
  }
] satisfies TabsItem[]

const state = reactive({
  name: 'Benjamin Canac',
  username: 'benjamincanac',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
</script>
