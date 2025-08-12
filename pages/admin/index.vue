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

        <div v-if="quizStore.quizzes && !quizStore.loading && quizStore.quizzes?.items?.length > 0">
          <div class="flex gap-5">
            <div class="border border-gray-200 p-5 w-full md:w-[300px]" v-for="(quiz,index) in quizStore.quizzes.items">
              <UBadge class="mb-5" v-if="quiz.publishedAt !== null" icon="i-lucide-calendar" size="md" color="primary" variant="outline">
                Publicado em: {{new Date(quiz.publishedAt).toLocaleDateString('pt-BR')}}
              </UBadge>
              <UBadge class="mb-5" v-else icon="i-lucide-pencil" size="md" color="neutral" variant="outline">
                Rascunho 
              </UBadge>

              <div class="w-full h-[150px]" >
                <img class="w-full h-full object-cover object-center" :src="`${config.public.imageBase}/${quiz.image}`">
              </div>
              <div class="my-3">
                <h3 class="block">{{quiz.title}}</h3> 
              </div>
              <div class="flex gap-2">
                <UButton @click="handleEdit(quiz)" icon="i-lucide-edit" size="md" color="success" variant="soft" />
                <UButton @click="handleDelete(quiz)" icon="i-lucide-trash" size="md" color="error" variant="soft" />
                <UButton 
                  @click="handleFeatured(quiz)" 
                  :icon="quiz.featured ? 'i-lucide-eye' : 'i-lucide-eye-closed'" 
                  size="md" color="primary" 
                  :variant="quiz.featured ? 'solid' : 'soft'" 
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="quizStore.quizzes && !quizStore.loading && quizStore.quizzes?.items?.length == 0" class="flex w-full items-center justify-center">
          <NotFound />
        </div>

      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts" async>
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

await quizStore.get();


/*
 * This method handles quiz edition.
 *
 * 1- Set quiz object.
 * 2- Open quiz modal.
 *
 * @params {Quiz} quiz - Quiz Object
 * @returns {void}
 * */

function handleEdit(quiz:Quiz):void{
  quizStore.quizBeingEdited = quiz;
  quizStore.showQuizModal = true;
}

/*
 * This method handles the featured .
 *
 * 1- Set quiz object.
 * 2- Open quiz modal.
 *
 * @params {Quiz} quiz - Quiz Object
 * @returns {void}
 * */

async function handleFeatured(quiz:Quiz):Promise<void> {
  const payload: QuizDTO = {
    Id: quiz.id,
    Title: quiz.title,
    Difficulty:quiz.difficulty,
    Description:quiz.description,
    Time:quiz.time,
    Status:quiz.status,
    CategoryId:quiz.category.id,
    Image: quiz.image,
    PublishedAt: quiz.publishedAt,
    Tags: quiz.tags.map(tag => tag.id),
    Featured: !quiz.featured
  };
  
  // Update featured status on database
  await quizStore.edit(payload);

  // Update feature status on state
  const quizIndex = quizStore.quizzes.items.findIndex(q => q.id === quiz.id);
  quizStore.quizzes.items[quizIndex].featured = !quiz.featured;
}



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


