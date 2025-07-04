<template>
  <div class="flex flex-col ">
    <UNavigationMenu 
        color="primary"
        orientation="horizontal" 
        arrow 
        :items="items" 
        class="w-full justify-center" 
        content-orientation="vertical"
    >
      <template #item="{item}">
        <div class="flex items-center gap-2">
          <UIcon :name="item.icon"/>
          {{item.label}}
        </div>
      </template>
    </UNavigationMenu>
    <AdminTagNewModal />
    <AdminQuizNewModal />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'; 
import { useTagStore } from "@/stores/tag";
import {useQuizAdminStore } from "@/stores/quiz-admin"; 
const tagStore = useTagStore();
const quizStore = useQuizAdminStore(); 


const handleClick = (item) => {
  console.info(item); 
  if(item.label == "Criar nova tag"){
    tagStore.openNewTagModal(); 
  }

  if(item.label == "Criar novo quiz"){
    quizStore.openNewQuizModal();
  }
}

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Quizzes',
      icon: 'i-lucide-book-open',
      defaultOpen: true,
      children: [
        {
          label: 'Meus quizzes',
          icon: 'i-lucide-hexagon',
          to: "/admin"
        },
        {
          label: 'Criar novo quiz',
          icon: 'i-lucide-plus',
          onClick: () => quizStore.openNewQuizModal()
        },
      ]
    },
    {
      label: 'Tags',
      icon: 'i-lucide-tag',
      defaultOpen: true,
      children: [
        {
          label: 'Minhas tags',
          icon: 'i-lucide-hexagon',
          to: "/admin/tags"
        },
        {
          label: 'Criar nova tag',
          icon: 'i-lucide-plus',
          onClick: () => tagStore.openNewTagModal()
        },
      ]
    },
    {
      label: 'Destaques',
      icon: 'i-lucide-flame',
      children: [
        {
          label: 'Meus destaques',
          icon: 'i-lucide-scroll-text',
          description: 'Use NuxtLink with superpowers.'
        },
      ]
    }
  ],
])
</script>
