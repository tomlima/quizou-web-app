<template>
  <UModal
    :dismissible="false"
    v-model:open="tagStore.showEditTagModal"
    :ui="{ footer: 'justify-end' }"
    class="h-[400px]"
  >
    <template #body>
      <div class="flex items-center justify-center flex-col">
        <p class="text-2xl">
          Editar tag           
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
      <UButton @click="editTag()" color="primary">Editar</UButton>     
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useTagStore } from "@/stores/tag";
import { ref, watch } from "vue";
import { useToastMessage } from '@/composables/useToastMessage'
const tagStore = useTagStore();
const showToast = useToastMessage(); 
const tag = ref('');
const maxLength = 25;
const toast = useToast(); 
const config = useRuntimeConfig(); 
const { tagBeingEdited } = storeToRefs(tagStore)


watch(tagBeingEdited, (newValue) => {
  if (newValue) {
    tag.value = newValue.name;
  }
}, { immediate: true });

async function editTag() {
  await tagStore.editTag(tagBeingEdited.value?.id, tag.value);
}

</script>
