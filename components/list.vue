<template>
  <div class="list flex flex-wrap gap-10">
    <div
      class="card shadow-indigo-400 shadow-sm"
      v-for="(quiz, index) in quizzes"
    >
      <div class="card__thumb">
        <img
          :src="'/quiz/' + quiz.image"
          width="234"
          height="234"
          class="rounded-lg"
        />
      </div>
      <div class="card__content">
        <h3>{{ quiz.title }}</h3>
        <div class="flex gap-5">
          <UButton
            :to="`/quizz/${quiz.id}`"
            color="primary"
            trailing-icon="i-lucide-play"
            size="md"
            >Jogar</UButton
          >
          <UTooltip
            v-if="!isAuthenticated"
            :delay-duration="0"
            text="Faça login para desafiar alguém"
            color="primary"
            arrow
          >
            <UButton
              disabled
              color="error"
              trailing-icon="i-lucide-lock"
              size="md"
              variant="outline"
              >Desafiar amigo</UButton
            >
          </UTooltip>

          <UButton
            v-else
            color="success"
            trailing-icon="i-lucide-swords"
            size="md"
            >Desafiar amigo</UButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quiz } from "../types/entity/quiz";
import { useAuthStore } from "~/stores/auth";
const auth = useAuthStore();
const isAuthenticated = computed(() => auth.isAuthenticated);

defineProps<{
  quizzes: Quiz[];
}>();
</script>

<style scoped style="scss">
.bg-inverted {
  background-color: #ff7043 !important;
}
.card {
  width: 350px;
}
</style>
