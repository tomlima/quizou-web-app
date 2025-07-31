<template>
  <header class="flex items-center">
    <UContainer>
      <div class="flex justify-between items-center">
        <NuxtLink to="/">
          <div class="flex gap-1 items-center logo">
            <img src="/logo.png" alt="Logo" />
            <h1>Quizou</h1>
          </div>
        </NuxtLink>

        <div class="flex gap-10">
          <div class="hidden md:block">
            <ClientOnly>
              <UNavigationMenu
                arrow
                content-orientation="vertical"
                :items="items"
                class="w-full justify-end"
              />
            </ClientOnly>
          </div>

          <ClientOnly>
            <ULink to="/perfil" v-if="isAuthenticated">
              <UChip inset>
                <UAvatar
                  size="2xl"
                  :src="`/avatar/${userAvatar}`"
                  alt="Benjamin Canac"
                />
              </UChip>
            </ULink>
          </ClientOnly>

          <div class="block md:hidden">
            <USlideover
              title="Slideover with close button"
              :close="{
                color: 'primary',
                variant: 'outline',
                class: 'rounded-full',
              }"
            >
              <UIcon
                label="Open"
                color="neutral"
                variant="subtle"
                name="i-lucide-menu"
                class="size-10 block md:hidden"
              />
              <template #body>
                <UNavigationMenu
                  orientation="vertical"
                  :items="items"
                  class="data-[orientation=vertical]:w-48"
                />
              </template>
            </USlideover>
          </div>
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useAuthStore } from "~/stores/auth";
const auth = useAuthStore();
const isAuthenticated = computed(() => auth.isAuthenticated);
const userAvatar = computed(() => auth.userAvatar);
const userRole = computed(() =>  auth.userRole);

const items = computed<NavigationMenuItem[][]>(() => {
  const menu = [
    {
      label: "Categorias",
      icon: "i-lucide-box",
      children: [
        { label: "Filmes", icon: "i-lucide-popcorn", to: "/categoria/filmes" },
        {
          label: "Séries",
          icon: "i-lucide-tv-minimal-play",
          to: "/categoria/series",
        },
        { label: "Jogos", icon: "i-lucide-gamepad-2", to: "/categoria/jogos" },
        {
          label: "Novelas",
          icon: "i-lucide-tv",
          to: "/categoria/novelas"
        }
      ],
    }
  ];

  if(auth.isAuthenticated){
    menu.push(
      {
        label: "Sair",
        icon: "i-lucide-log-out",
        to: "/logout",
        meta: { customClass: "logout" },
      },
    )
  }else{
    menu.push(
      {
        label: "Login",
        icon: "i-lucide-key-round",
        to: "/login",
      },
    )
  }

  if(auth.isAuthenticated && userRole.value == "Admin" ){
    menu.push(
      {
        label: "Admin",
        icon: "i-lucide-app-window",
        to: "/admin"
      }
    )
  }
  

  return [menu];
});
</script>

<style scoped lang="scss">
header {
  z-index: 100;
  height: 100px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 100%;
  position: relative;
}

.logo {
  h1{
    font-family: "Rowdies", sans-serif;
    font-size: 2rem;
    color:   #615fff; 
  }
  img{
    width:40px;
  }
}
</style>
