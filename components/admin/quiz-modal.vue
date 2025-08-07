<template>
  <UModal
    fullscreen
    title="Quiz"
    :description="`Modo de ${modeMessage}`"
    :dismissible="true"
    v-model:open="quizStore.showQuizModal"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="w-[100%] flex justify-center">
        <UStepper ref="stepper" :items="steps">
          <template #quiz="{ item }">
              <UCard class="w-full md:w-[700px]">
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
                <Upload :imagePreview="thumb" v-model:returnedFileName="thumb" />
                </UFormField>
              </UCard>
          </template>

          <template #questions="{item}">
            <UCard class="w-full md:w-[700px]">
              <AdminQuestionBuilder :quizId="quizId" :tags="selectedTags" :difficulty="quizDifficulty" v-if="quizId" />
            </UCard>
          </template>

          <template #publish={item} v-if="!wasPublished"> 
            <div class="w-full md:w-[700px]">
              <UAlert variant="subtle" class="p-15 mt-15" color="neutral">
                <template #description>
                  <h2 class="primary">Ufa! voce finalmente chegou na última etapa!</h2>
                  <p>Agora basta publicar seu quiz. Lembrando que após a publicação, o mesmo já estará disponível para todos os usuários.</p>
                  
                  <div class="mt-10">
                    <UButton @click="publish()" icon="i-lucide-rocket" class="mt-10" size="xl" color="primary">Publicar</UButton>
                  </div>
                </template>
              </UAlert>
            </div>
          </template>

          <template #publish={item} v-else>
            <div class="w-full md:w-[700px]">
              <UAlert variant="subtle" class="p-15 mt-15" color="neutral">
                <template #description>
                  <h2 class="primary">O Quiz foi editado com sucesso!</h2>
                  <p>A jenela já pode ser fechada.</p>
                </template>
              </UAlert>
            </div>
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
          @click="!wasCreated ? saveQuizDraft() : editQuiz()"
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
const config = useRuntimeConfig();
const toast = useToastMessage();

// Quiz fields declaration
let quizId = ref<null | number>(null);
let quizTitle = ref<string>('Crawling in my skin');
let quizDescription = ref<string>('These wounds, they will not heal');
let quizTime = ref<number>(5);
let quizDifficulty = ref<RadioGroupValue>(Difficulty.Easy);
let category = ref<string>("Filmes"); 
let selectedTags = ref<string[]>([]); 
let thumb = ref<string>(`${config.public.imageBase}/thumb_placeholder.png`);
let quizStatus = ref<QuizStatus>(QuizStatus.Draft);
let publishedAt = ref<null | Date>(null);

let wasCreated = ref<boolean>(false);
let wasPublished = ref<boolean>(false);

watch(() => quizStore.quizBeingEdited,(quiz)=>{
  /* If the value of quizBeingEdited is null
   * it means that we are creating a new one.
   * */
  
  if(quiz == null){
    setDefaultValues();
    return;
  }

  if(quiz.publishedAt == null){
    wasPublished.value = false;
  }else{
    wasPublished.value = true;
  }

  //extract tags
  let tags = [];
  if(quiz?.tags && quiz?.tags.length > 0){
    tags = quiz.tags.map(t => t.name);
  }

  wasCreated.value = true;
  quizId.value = quiz.id;
  quizTitle.value = quiz.title;
  quizDescription.value = quiz.description;
  quizDifficulty.value = quiz.difficulty; 
  quizTime.value = quiz.time;
  publishedAt.value = quiz.publishedAt;
  thumb.value = `${config.public.imageBase}/${quiz.image}`;
  category.value = quiz.category.name;
  selectedTags.value = tags;
});

/* Fetch categories and tags */
onMounted(async () => {
  await categoryStore.fetchCategories(); 
  await tagStore.fetchTags();
}); 

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

const modeMessage = computed( ()=>{
  return wasCreated.value ? 'edição' : 'criação';
})

const lastStepMessage = computed(()=>{
  return wasPublished.value ? 'Editar' : 'Publicar'
})

const categories = computed(() =>
  categoryStore.categories.map(category => category.name)
);

const tags = computed(() => 
  tagStore.tags?.items.map(tag => tag.name)
)

/*The Quiz is composed by three steps:
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
    title: lastStepMessage,
    icon: 'i-lucide-package-check',
    slot: 'publish' as const
  }
]


/* This method set default values for Quiz:
 *
 * @returns {void}
 * */
function setDefaultValues(): void{
  quizId.value = null;
  quizTitle.value = "Crawling in my skin";
  quizDescription.value = "These wounds, they will not heal";
  quizTime.value = 5;
  quizDifficulty.value = Difficulty.Easy;
  category.value = "Filmes"; 
  selectedTags.value = []; 
  thumb.value = `${config.public.imageBase}/thumb_placeholder.png`;
  quizStatus.value = QuizStatus.Draft;
  publishedAt.value = null;
  wasCreated.value = false;
  wasPublished.value = false;
}


/* This method handle the quiz editing:
 * Load the payload based on reactive values.
 * Send payload to the quiz store.
 * Send user to next step.
 *
 * @returns {void}
 * */
async function editQuiz():void{
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
  console.info(publishedAt.value);
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
    Image: thumb.value,
    PublishedAt: publishedAt.value
  };

  // If the user is editing, we need to pass 
  // the quiz id as property of payload.
  if(wasCreated.value){
    payload.Id = quizId.value;
  }

  return payload;
} 

/* This method handles the creation of a quiz as draft. 
 *
 * 1- Get the payload object.
 * 2- Send the paylod to store.
 * 3- Check if we get a quiz id from creation 
 *    and move on with flow.
 *
 * @returns {void}
 * */

async function saveQuizDraft():void{ 
  const payload:QuizDTO = buildPayload(); 
  const idOfCreatedQuiz:string | null =  await quizStore.createQuiz(payload);

  if(idOfCreatedQuiz !== null){
    quizId.value = idOfCreatedQuiz; 
    wasCreated.value = true; 
    stepper?.value.next();
  }
}

/* This method publish a quiz.
 *
 * 1- Set status as Active.
 * 2- Get the payload object.
 * 3- Send objeto to store.
 *
 * @returns {void}
 * */

async function publish():void{ 
  quizStatus.value = QuizStatus.Active;
  publishedAt.value = new Date();
  const payload:QuizDTO = buildPayload();
  await quizStore.edit(payload);
  await quizStore.get();
  quizStore.closeNewQuizModal();
  toast("success", "Quiz publicado com sucesso!");
}

</script>

