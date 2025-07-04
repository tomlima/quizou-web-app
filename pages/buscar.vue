<template>
  <UContainer class="mt-10">
    <UBreadcrumb :items="breadCrumbItems" />
    <div class="pt-[30px] pb-[30px] md:px-0 mt-10 inner relative">
      <h1>Resultados da busca:</h1>
    </div>
    <List
      v-if="Array.isArray(quizzes) && quizzes.length > 0"
      :quizzes="quizzes"
    />
    <UCard v-else class="flex w-full md:w-1/2 items-center justify-center">
      <NotFound />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { Quiz } from "../types/entity/quiz";
import { useRoute } from "vue-router";
import type { BreadcrumbItem } from "@nuxt/ui";

const route = useRoute();
const searchedTerm = computed(() => (route.query.term as string) ?? "");

const { data: quizzes } = await useFetch<Quiz[] | null>(
  () =>
    `http://localhost:5035/api/v1/quiz/search/${encodeURIComponent(searchedTerm.value)}`,
  {
    server: true, // só roda no client
    key: () => `quiz-${searchedTerm.value}`,
  }
);

const breadCrumbItems = ref<BreadcrumbItem[]>([
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/",
  },
  {
    label: "Buscar",
    icon: "i-lucide-search",
    to: "/",
  },
  {
    label: searchedTerm.value,
    icon: "i-lucide-link",
    to: `/`,
  },
]);
</script>
