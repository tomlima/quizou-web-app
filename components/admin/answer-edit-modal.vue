<template>
  <UModal
    :dismissible="false"
    v-model:open="answerStore.showEditModal"
    :ui="{ footer: 'justify-end' }"
    class="h-[400px]"
  >
    <template #body>
      <div class="flex items-center justify-center flex-col">
        <p class="text-2xl">
          Editar resposta
        </p>
      </div>
      <USeparator class="p-10" color="primary" size="lg" icon="i-simple-icons-nuxtdotjs" />
      
      <div class="flex items-center justify-center">
        <UTextarea 
          placeholder="Nome da tag"
          v-model="answer"
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
              {{ answer?.length }}/{{ maxLength }}
            </div>
          </template>
        </UTextarea>
      </div>
    
    </template>

    <template #footer>
      <UButton @click="editAnswer()" color="primary">Editar</UButton>     
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useAnswerStore } from "@/stores/answer";
import type { EditAnswerDto } from "@/types/dto/edit-answer-dto"
import { ref, watch } from "vue";
import { useToastMessage } from '@/composables/useToastMessage'
const answerStore = useAnswerStore();
const showToast = useToastMessage(); 
const answer = ref('');
const maxLength = 250;
const toast = useToast(); 
const config = useRuntimeConfig();
const { answerBeingEdited } = storeToRefs(answerStore)

const props = defineProps<{
  questionId: number;
}>();


watch(answerBeingEdited, (newValue) => {
  if (newValue) {
    answer.value = newValue.text;
  }
}, { immediate: true });

async function editAnswer() {
  const payload: EditAnswerDto = {
    Id: answerBeingEdited.value.id, 
    Correct: answerBeingEdited.value.correct,
    Text: answer.value,
    QuestionId: props.questionId
  };

  await answerStore.edit(payload);
  await answerStore.getByQuestion(props.questionId);
}

</script>

