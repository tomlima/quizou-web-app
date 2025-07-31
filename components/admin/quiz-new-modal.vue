<template>
  <UModal
    fullscreen
    title="Criar novo quiz"
    description=""
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
                  <URadioGroup v-model="quizDifficulty" size="md" orientation="horizontal" variant="list" default-value="1" :items="difficulties" />
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
            <UCard class="w-full">
              <AdminQuestionBuilder :quizId="quizId" :tags="selectedTags" :difficulty="quizDifficulty" v-if="quizId" />
            </UCard>
          </template>

          <template #publish={item}>
            <UCard class="w-full">
            
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
          Anterior 
        </UButton>
        <UButton
          trailing-icon="i-lucide-arrow-right"
          :disabled="!stepper?.hasNext"
          @click="!editMode ? saveQuizDraft() : editQuiz()"
        >
          Próximo
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {QuizStatus, Difficulty} from "@/types/unums/enum"
import type { RadioGroupItem, RadioGroupValue, StepperItem } from '@nuxt/ui'
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

/* The Quiz is composed by three steps:
 *
 * 1- Basic informations (Title, Description, Duration, etc.. )
 * 2- Questions and answers.
 * 3- Publish stuffs
 **/
const steps: StepperItem[] = [
  {
    title: 'Quiz',
    icon: 'i-lucide-house',
    slot: 'quiz' as const  
  }, {
    title: 'Perguntas',
    icon: 'i-lucide-circle-question-mark',
    slot: 'questions' as const 
  },
  {
    title: 'Publicar',
    icon: 'i-lucide-package-check',
    slot: 'publish' as const
  }
]

/* Quiz fields */
const quizId = ref<null | number>(null);
const quizTitle = ref<string>('Crawling in my skin');
const quizDescription = ref<string>('These wounds, they will not heal');
const quizTime = ref<number>(5);
const quizDifficulty = ref<RadioGroupValue>(Difficulty.Easy);
const category = ref<string>("Filmes"); 
const selectedTags = ref<string[]>(["Harry Potter"]); 
const thumb = ref<string>("thumb_placeholder.png");
const quizStatus = ref<QuizStatus>(QuizStatus.Draft)
const editMode = ref<boolean>(false);

/* Populate quiz selection fields:
 *
 * difficulties list
 * all categories names from db: ['filmes','series'...n]  
 * all tags names from db: ['harry potter', 'mario'...n]
 * */
const difficulties = ref<RadioGroupItem[]>([
  { label: 'Fácil', value: Difficulty.Easy },
  { label: 'Moderado', value: Difficulty.Moderate },
  { label: 'Difícil', value: Difficulty.Hard },
])

const categories = computed(() =>
  categoryStore.categories.map(category => category.name)
);

const tags = computed(() => 
  tagStore.tags?.items.map(tag => tag.name)
)


/* This method handle the quiz editing:
 * Load the payload based on reactive values.
 * Send payload to the quiz store.
 * Send user to next step.
 *
 * @returns {void}
 * */
async function editQuiz(){
  const payload: QuizDTO = buildPayload();
  quizStore.edit(payload);
  stepper?.value.next();
}

/* This method build a payload object 
 * to create and edit a quiz.
 *
 * 1- Load the payload based on reactive values.
 * 2- Send payload to the quiz store.
 * 3- Send user to next step (questions).
 *
 * @returns {void}
 * */

function buildPayload():QuizDTO {
  // The category selected object.
  const categoryObject: Category = categoryStore.getCategoryByName(category.value);

  // A list with all tags ids selected by the user.
  const tagsIds:Number[] = tagStore.buildSelectedTagIdList(selectedTags.value); 
  
  // Quiz object
  const payload:QuizDTO = {
    Title: quizTitle.value, 
    Difficulty : quizDifficulty.value,
    Description: quizDescription.value, 
    Time: quizTime.value, 
    Status: quizStatus.value,
    CategoryId: categoryObject?.id,
    Tags: tagsIds,
    Image: thumb.value 
  };

  // If the user is editing, we need to pass 
  // the quiz id as property of payload.
  if(editMode.value){
    payload.Id = quizId.value;
  }

  return payload;
} 

/* Save the quiz as draft */
async function saveQuizDraft(){


  // The category selected object. 
  const categoryObject: Category = categoryStore.getCategoryByName(category.value);

  // A list with all tags ids selected by the user. 
  const tagsIds:Number[] = tagStore.buildSelectedTagIdList(selectedTags.value); 
  
  // The final quizObj 
  const payload:QuizDTO = buildPayload(); 
  console.info(payload);
  const idOfCreatedQuiz:string | null =  await quizStore.createQuiz(payload);

  if(idOfCreatedQuiz !== null){
    quizId.value = idOfCreatedQuiz; 
    editMode.value = true; 
    stepper?.value.next();
  }
}
</script>

