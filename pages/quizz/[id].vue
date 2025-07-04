<template>
  <UContainer class="mt-10">
    <UCard v-if="loadingQuiz" class="h-[400px] mx-auto w-full md:w-7/10 flex items-center justify-center">
      <div class="flex items-center gap-4">
        <USkeleton class="h-12 w-12 rounded-full" />
        <div class="grid gap-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
          <USkeleton class="h-4 w-[280px]" />
        </div> 
      </div>
    </UCard>
    <UCard v-if="!loadingQuiz && quiz" class="p-10 w-full md:w-7/10 mx-auto">
      <div>
        <h1>{{ quiz?.title }}</h1>
        <p class="mt-5">{{ quiz?.description }}</p>
      </div>
      <USeparator class="mb-5 mt-5" color="primary" size="lg" icon="i-simple-icons-nuxtdotjs" />
      <Disclaimer />
      <div class="flex justify-between flex-col md:flex-row">
        <UAlert
          class="mt-10 w-full md:w-[30%]"
          title="Tempo"
          color="primary"
          variant="subtle"
          :description="quiz?.time?.toString() + ' minutos'"
          icon="i-lucide-timer"
          :ui="{
            icon: 'size-10',
          }"
        />
        <UAlert
          class="mt-10 w-full md:w-[30%]"
          title="Dificuldade"
          color="primary"
          variant="subtle"
          :description="quiz?.difficulty?.toString()"
          icon="i-lucide-biceps-flexed"
          :ui="{
            icon: 'size-10',
          }"
        />
        <UAlert
          class="mt-10 w-full md:w-[30%]"
          title="Perguntas"
          color="primary"
          variant="subtle"
          :description="quiz?.questions.length?.toString()"
          icon="i-lucide-circle-help"
          :ui="{
            icon: 'size-10',
          }"
        />
      </div>
      <UButton
        class="mt-10"
        color="primary"
        trailing-icon="i-lucide-play"
        size="xl"
        @click="handleStart"
        >Começar</UButton
      >
      
    </UCard>
    <Quiz />
    <ResultModal />
  </UContainer>
</template>

<script setup lang="ts">
import type { Quiz } from "../../types/entity/quiz";
import { useRoute } from "vue-router";
import { decrypt } from "@/common/decrypt";
import { useQuizStore } from "../../stores/quiz";
const store = useQuizStore();

const route = useRoute();
const quizId = route.params.id as string;

function handleStart() {
  if (quiz.value) {
    store.startQuiz(quiz.value);
  }
}

const { data: encryptedData, pending: loadingQuiz } =
  await useFetch<string>(`http://localhost:5035/api/v1/quizzes/${quizId}`, {
    server: false,
    key: `quiz-${route.fullPath}`
  });


// Decrypt the response
const quiz = computed<Quiz | null>(() => {
  if (!encryptedData.value) return null;
  try {
    return decrypt<Quiz>(encryptedData.value);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
});
</script>

<style scoped style="scss">
.card {
  width: 100%;
  padding: 40px;
  h1 {
    font-size: 25px;
    text-align: center;
  }
}
</style>
