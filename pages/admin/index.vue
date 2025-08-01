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

        <div v-if="quizStore.quizzes && !quizStore.loading && quizStore.quizzes.items.length > 0">
          <div class="flex gap-5">
            <div class="border border-gray-200 p-5 w-full md:w-[300px]" v-for="(quiz,index) in quizStore.quizzes.items">
              <div class="w-full h-[150px]" >
                <img class="w-full h-full object-cover object-center" :src="`${config.public.imageBase}${quiz.image}`">
              </div>
              <div class="my-3">
                <h3 class="block">{{quiz.title}}</h3> 
              </div>
              <div class="flex gap-2">
                <UButton icon="i-lucide-edit" size="md" color="primary" variant="solid" />
                <UButton @click="handleDelete(quiz)" icon="i-lucide-trash" size="md" color="error" variant="solid" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex w-full items-center justify-center" v-else>
          <NotFound />
        </div>

      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { Quiz } from "@/types/entity/quiz";
import type { PagedResult } from "@/types/entity/paged-result"
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useQuizAdminStore } from "@/stores/quiz-admin"

const toast = useToast();
const route = useRoute();
const slug = route.params.slug as string;
const page = ref(5);
const config = useRuntimeConfig();
const quizStore = useQuizAdminStore();

onMounted(() => {
  quizStore.get();
})

/*
 * This method handles quiz deletion.
 *
 * 1- Ask user if hes sure about it.
 * 2- If so, we call the store.
 *
 * @params {Quiz} quiz - Quiz Object
 * @returns {void}
 * */
function handleDelete(quiz:Quiz):void{
  toast.add({
    title: `Cuidado! tem certeza que deseja deletar o quiz: ${quiz.title}?`,
    duration: 0,
    actions: [{
      icon: 'i-lucide-triangle-alert',
      label: "Sim, quero deletar",
      color: 'error',
      variant: 'outline',
      onClick: async (e) => {
        e?.stopPropagation()
        await quizStore.delete(quiz.id);
        await quizStore.get();
      }
    }]
  })

}

</script>


