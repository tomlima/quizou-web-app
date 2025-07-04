<template>
  <div>
    <UApp>
      <Header />
      <NuxtLayout />      
      <NuxtPage />         
      <NuxtRouteAnnouncer />
    </UApp>
  </div>
</template>


<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>
