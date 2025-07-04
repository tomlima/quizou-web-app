<template>
  <UContainer>
    <div class="flex flex-col gap-10 w-full mt-10">
      <AdminNav />
      <UCard class="w-full">
        <template #header>
          <div class="flex items-center gap-5">
            <img class="w-[50px]" src="/icons/quiz.png" alt="Quizzes">
            <h1> Meus quizzes </h1>
          </div>
        </template>

        <div v-if="quizzes && !loadingQuizzes && quizzes.items.length > 0">
            Quizzes 
        </div>

        <div class="flex w-full items-center justify-center" v-else>
          <NotFound />
        </div>

      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { Quiz } from "../../types/entity/quiz";
import { ref } from "vue";
import { useRoute } from "vue-router";
import type { BreadcrumbItem } from "@nuxt/ui";
const route = useRoute();
const slug = route.params.slug as string;
const page = ref(5);


const { data: quizzes, pending: loadingQuizzes } =
  await useFetch<Quiz[]>("http://localhost:5035/api/v1/quiz", {
    server: true,
    key: `quizzes-${route.fullPath}`, // garante nova chamada
  });

</script>


