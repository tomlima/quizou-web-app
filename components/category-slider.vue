<template>
  <UCarousel
    v-slot="{ item }"
    loop
    arrows
    dots
    :autoplay="{ delay: 2000 }"
    :items="featuredQuizzes"
    :ui="{ item: 'basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3' }"
  >
    <div class="card">
      <div class="card__thumb">
        <img
          :src="'/quiz/' + item.image"
          width="234"
          height="234"
          class="rounded-lg"
        />
      </div>
      <div class="card__content">
        <h3>{{ item.title }}</h3>
      </div>
    </div>
  </UCarousel>
</template>

<script setup lang="ts">
import type { Quiz } from "../types/entity/quiz";

defineProps<{
  featuredQuizzes: Quiz[];
}>();
</script>

<style scoped style="scss">
.bg-inverted {
  background-color: #ff7043 !important;
}
</style>
