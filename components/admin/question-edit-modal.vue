<template>
  <UModal
    :dismissible="false"
    v-model:open="questionStore.showEditModal"
    :ui="{ footer: 'justify-end' }"
    class="h-[400px]"
  >
    <template #body>
      <div class="flex items-center justify-center flex-col">
        <p class="text-2xl">
          Editar pergunta
        </p>
      </div>
      <USeparator class="p-10" color="primary" size="lg" icon="i-simple-icons-nuxtdotjs" />
      
      <div class="flex items-center justify-center">
        <UTextarea 
          placeholder="Nome da tag"
          v-model="question"
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
              {{ question?.length }}/{{ maxLength }}
            </div>
          </template>
        </UTextarea>
      </div>
    
    </template>

    <template #footer>
      <UButton @click="editQuestion()" color="primary">Editar</UButton>     
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useQuestionStore } from "@/stores/question";
import { ref, watch } from "vue";
import { useToastMessage } from '@/composables/useToastMessage'
const questionStore = useQuestionStore();
const showToast = useToastMessage(); 
const question = ref('');
const maxLength = 250;
const toast = useToast(); 
const config = useRuntimeConfig();
const { questionBeingEdited } = storeToRefs(questionStore)

const props = defineProps<{
  quizId: number;
}>();


watch(questionBeingEdited, (newValue) => {
  if (newValue) {
    question.value = newValue.text;
  }
}, { immediate: true });

async function editQuestion() {
  await questionStore.edit(questionBeingEdited.value.id,question.value);
  await questionStore.getByQuiz(props.quizId);
}

</script>
