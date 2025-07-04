<template>
  <UModal
    fullscreen
    title="Criar novo quiz"
    :dismissible="false"
    v-model:open="quizStore.showNewQuizModal"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>     
      <div class="w-[100%] flex justify-center">
        <UStepper ref="stepper" :items="steps">

          <template #quiz="{ item }">
              <UCard class="w-full md:w-[600px]">
                <UForm>
                  <UFormField color="primary" label="Título" required>
                    <UInput size="md" class="w-full" v-model="quizTitle" placeholder="Tudo sobre o mundo de Harry Potter"/>
                  </UFormField>
                  <UFormField class="mt-5" label="Descrição" required>
                    <UTextarea class="w-full" v-model="quizDescription" />
                  </UFormField>
                  <UFormField required help="O tempo é em minutos" label="Tempo de duração" class="mt-5">
                      <UInput class="w-full" type="number" size="md" icon="i-lucide-clock-9" variant="outline" v-model="quizTime" />
                  </UFormField>
                  <UFormField required label="Dificuldade" class="mt-5">
                      <URadioGroup v-model="quizDifficult" size="md" orientation="horizontal" variant="list" default-value="System" :items="difficulties" />
                  </UFormField>
                  <UFormField label="Categoria" class="mt-5">
                      <USelectMenu selected-icon="i-lucide-pin" color="primary" size="md" v-model="category" :loading=categoryStore?.loading :items="categories" class="w-48" />
                  </UFormField>
                  <UFormField label="Tag" class="mt-5">
                      <USelectMenu selected-icon="i-lucide-pin" v-model="tag" size="md" :loading=tagStore?.loading :items="tags" class="w-48" />
                  </UFormField>
                  <UFormField label="Imagem" class="mt-5">
                    <Upload v-model:returnedFileName="thumb" />
                  </UFormField>
                </UForm>
              </UCard>
          </template>

        </UStepper> 
      </div>
    </template>

    <template #footer>
      <div class="w-full flex justify-between items-center">
        <UButton
          leading-icon="i-lucide-arrow-left"
          :disabled="!stepper?.hasPrev"
          @click="stepper?.prev()"
        >
          Prev
        </UButton>
        <UButton
          trailing-icon="i-lucide-arrow-right"
          :disabled="!stepper?.hasNext"
          @click="stepper?.next()"
        >
          Next
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import type { RadioGroupItem } from '@nuxt/ui'
import { useQuizAdminStore } from "@/stores/quiz-admin"
import { useCategoryStore } from "@/stores/category"
import {useTagStore} from "@/stores/tag"
import { ref, watch } from "vue";
const quizStore = useQuizAdminStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore(); 
const stepper = useTemplateRef('stepper'); 
const steps: StepperItem[] = [
  {
    title: 'Quiz',
    icon: 'i-lucide-house',
    slot: 'quiz' as const  
  }, {
    title: 'Questions',
    icon: 'i-lucide-truck',
    slot: 'questions' as const 
  }
]

// Quiz fields 
const quizTitle = ref(''); 
const quizDescription = ref(''); 
const quizTime = ref(1); 
const quizDifficult = ref("Easy"); 
const difficulties = ref<RadioGroupItem[]>(['Easy', 'Medium', 'Hard']); 
const category = ref("Filmes"); 
const tag= ref("Harry Potter"); 
const thumb = ref("https://quizou.s3.us-east-1.amazonaws.com/placeholder/thumb_placeholder.png");

onMounted(async () => {
  await categoryStore.fetchCategories(); 
  await tagStore.fetchTags(); 
}); 

const categories = computed(() =>
  categoryStore.categories.map(category => category.name)
);

const tags = computed(() => 
  tagStore.tags?.items.map(tag => tag.name)
)


async function saveQuizDraft(){
   
}
</script>

