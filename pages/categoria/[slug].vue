<template>
  <UContainer class="mt-10">
    <UBreadcrumb :items="breadCrumbItems" />
    <div class="pt-[30px] pb-[30px] px-[30px] md:px-0 mt-10 inner relative">
      <ParticleDark />
      <h1 class="mb-10">
        Destaques de <b class="text-primary">{{ slug }}</b> da semana
      </h1>

      <div v-if="loadingFeaturedQuizzes" class="flex items-center gap-4">
        <USkeleton class="h-[430px] w-full" />
      </div>

      <CategorySlider
        v-if="featuredQuizzes"
        :featured-quizzes="featuredQuizzes"
      />
    </div>
    <div class="w-full mt-20 mb-20">
      <img class="m-auto" src="/ads/ad-1.jpg" alt="" />
    </div>
    <List v-if="quizzes" :quizzes="quizzes" />
    <div class="w-full flex items-center justify-center mt-10 mb-10">
      <UPagination v-model:page="page" :total="100" />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { Quiz } from "../../types/entity/quiz";
import { ref } from "vue";
import { useRoute } from "vue-router";
import type { BreadcrumbItem } from "@nuxt/ui";
const route = useRoute();
const page = ref(5);
const config = useRuntimeConfig();
const slug = computed(() => route.params.slug as string)

const { data: featuredQuizzes, pending: loadingFeaturedQuizzes } = await useFetch<Quiz[]>(
  `${config.public.apiBase}/quizzes/featured`,
  { key: 'featured-quizzes', server: true }
)


const keySlug = computed(() => slug.value ? `quizzes-${slug.value}` : null)
const { data: quizzes, pending: loadingQuizzes, error: errorQuizzes } = useFetch<Quiz[]>(
  () => slug.value ? `${config.public.apiBase}/quizzes/category/${slug.value}` : null,
  { key: keySlug, server: false, default: () => [] }
)

if (errorQuizzes.value) {
  console.error('Erro ao buscar quizzes:', errorQuizzes.value)
}

const breadCrumbItems = ref<BreadcrumbItem[]>([
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/",
  },
  {
    label: "Categorias",
    icon: "i-lucide-box",
    to: "/",
  },
  {
    label: slug,
    icon: "i-lucide-link",
    to: `/categoria/${slug}`,
  },
]);
</script>

<style scoped style="scss">
.inner {
  background-color: #fff;
  border-radius: 15px;
  h1 {
    text-align: center;
    b {
      color: #ff7043;
    }
  }
}
</style>
