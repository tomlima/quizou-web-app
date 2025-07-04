<template>
  <UModal
    :dismissible="false"
    v-model:open="tagStore.showNewTagModal"
    :ui="{ footer: 'justify-end' }"
    class="h-[400px]"
  >
    <template #body>
      <div class="flex items-center justify-center flex-col">
        <p class="text-2xl">
          Criar nova tag          
        </p>
      </div>
      <USeparator class="p-10" color="primary" size="lg" icon="i-simple-icons-nuxtdotjs" />
      
      <div class="flex items-center justify-center">
        <UInput
          placeholder="Nome da tag"
          v-model="tag"
          :maxlength="maxLength"
          aria-describedby="character-count"
          :ui="{ trailing: 'pointer-events-none' }"
        >
          <template #trailing>
            <div
              id="character-count"
              class="text-xs text-muted tabular-nums"
              aria-live="polite"
              role="status"
            >
              {{ tag?.length }}/{{ maxLength }}
            </div>
          </template>
        </UInput>
      </div>
    
    </template>

    <template #footer>
      <UButton @click="saveTag()" color="primary">Salvar</UButton>     
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useTagStore } from "@/stores/tag";
import { ref, watch } from "vue";
import { useToastMessage } from '@/composables/useToastMessage'
const tagStore = useTagStore();
const tag = ref('');
const maxLength = 25;

async function saveTag() {
  await tagStore.createTag(tag.value);  
}

</script>
