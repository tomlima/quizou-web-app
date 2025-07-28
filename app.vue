<template>
  <div>
    <UApp :toaster="{ position: 'bottom-center', expand: true, duration: 5000 }">
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
