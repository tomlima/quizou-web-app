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
                  <URadioGroup v-model="quizDifficult" size="md" orientation="horizontal" variant="list" default-value="1" :items="difficulties" />
                </UFormField>
                <UFormField label="Categoria" class="mt-5">
                  <USelectMenu selected-icon="i-lucide-pin" color="primary" size="md" v-model="category" :loading=categoryStore?.loading :items="categories" class="w-48" />
                </UFormField>
                <UFormField label="Tags" class="mt-5">
                  <USelectMenu selected-icon="i-lucide-pin" v-model="selectedTags" multiple size="md" :loading=tagStore?.loading :items="tags" class="w-48" />
                </UFormField>
                <UFormField label="Imagem" class="mt-5">
                  <Upload v-model:returnedFileName="thumb" />
                </UFormField>
              </UCard>
          </template>

          <template #questions="{item}">
            <UCard class="w-full md:w-[600px]">
              {{quizId}}
              <AdminQuestionBuilder :quizId="quizId" v-if="quizId" />
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
          @click="saveQuizDraft()"
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
import type { Category } from "@/types/entity/category"
import type { Tag } from "@/types/entity/tag"
import type { QuizDTO } from "@/types/dto/quizDTO"
import { useQuizAdminStore } from "@/stores/quiz-admin"
import { useCategoryStore } from "@/stores/category"
import {useTagStore} from "@/stores/tag"
import { ref, watch } from "vue";
const quizStore = useQuizAdminStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore(); 
const stepper = useTemplateRef('stepper');

/* Fetch categories and tags */
onMounted(async () => {
  await categoryStore.fetchCategories(); 
  await tagStore.fetchTags(); 
}); 

/* Quiz Seteps */
const steps: StepperItem[] = [
  {
    title: 'Quiz',
    icon: 'i-lucide-house',
    slot: 'quiz' as const  
  }, {
    title: 'Questions',
    icon: 'i-lucide-circle-question-mark',
    slot: 'questions' as const 
  }
]

/* Quiz fields */
const quizId = ref(null);  
const quizTitle = ref(''); 
const quizDescription = ref(''); 
const quizTime = ref(5); 
const quizDifficult = ref(2); 
const category = ref("Filmes"); 
const selectedTags = ref(["Harry Potter"]); 
const thumb = ref("thumb_placeholder.png");
const quizSaved = ref(false); 

/* List of: 
 *
 * difficulties: 0 = easy | 1 = moderate | 2 = hard 
 * all categories names from db: ['filmes','series'...n]  
 * all tags names from db: ['harry potter', 'mario'...n]
 * */
const difficulties = ref<RadioGroupItem[]>([0, 1, 2]);

const categories = computed(() =>
  categoryStore.categories.map(category => category.name)
);

const tags = computed(() => 
  tagStore.tags?.items.map(tag => tag.name)
)

/* Save the quiz as draft */
async function saveQuizDraft(){

  // The category selected object. 
  const categoryObject: Category = categoryStore.getCategoryByName(category.value);

  // A list with all tags ids selected by the user. 
  const tagsIds:Number[] = tagStore.buildSelectedTagIdList(selectedTags.value); 
  
  // The final quizObj 
  const quizObj:QuizDTO = {
    title: quizTitle.value, 
    difficulty : quizDifficult.value,
    description: quizDescription.value, 
    time: quizTime.value, 
    status: 0, // Draft
    categoryId: categoryObject?.id,
    tags: tagsIds,  
    image: thumb.value 
  };

  const idOfCreatedQuiz:string | null =  await quizStore.createQuiz(quizObj);

  if(idOfCreatedQuiz !== null){
    quizId.value = idOfCreatedQuiz; 
    quizSaved.value = true; 
    stepper?.value.next();
  }
}
</script>

