<template>
  <div class="w-full inline-flex flex-col items-center justify-center gap-10">    
    <draggable  @end="reorder" class="w-full flex flex-col gap-8" v-if="questionStore.questions.length > 0" v-model="questionStore.questions" item-key="id">
      <template #item="{element}">
        <UCollapsible  class="flex flex-col gap-2 w-full cursor-move">
          <div class="flex gap-5">
            <UBadge
              :label="element.text"
              color="neutral"
              variant="outline"
              block
              size="lg"
              class="cursor-move w-[250px] md:w-[800px]"
            />

            <div class="flex gap-2">
              <UButton
                @click.stop="deleteQuestion(element.id)"
                icon="i-lucide-trash"
                color="error"
                variant="subtle"
              />
              <UButton
                @click.stop="openEditModal(element)"
                icon="i-lucide-edit"
                color="primary"
                variant="subtle"
              />
            </div>
          </div>
          <template #content>
            <div class="p-10">
              <AdminAnswerBuilder :questionId="element.id" v-if="element.id" />
            </div>
          </template>
        </UCollapsible>
      </template>
    </draggable>
    <UButton @click="createQuestion()" size="md" icon="i-lucide-plus"  color="primary">Adicionar nova pergunta</UButton>
    <AdminQuestionEditModal :quizId="quizId" />
  </div>
</template>


<script setup lang="ts">
import draggable from 'vuedraggable'
import { useQuestionStore } from "@/stores/question"
import type { CreateQuestionDto } from "@/types/dto/createQuestionDto"
import type { ReorderQuestionDto } from "@/types/dto/reorder-question-dto"
import {useTagStore} from "@/stores/tag"

const toast = useToast()
const questionStore = useQuestionStore();
const tagStore = useTagStore();

var questionOrder:number = 1;

const props = defineProps<{
  quizId: number;
  tags: array;
  difficulty: number;
}>();


/* Fetch  all questions */
onMounted(async () => {
  await questionStore.getByQuiz(props.quizId); 
});

/*
 * Reorder the list of questions.
 * @returns {void}
 * */
function reorder(){
  const payload: ReorderQuestionDto[] = questionStore.questions.map((q, index) => ({
    id: q.id,
    order: index + 1,
  })); 

  questionStore.reorder(payload);
}

/*
 * This method create a question DTO 
 * and send this object to the 
 * question store.
 * @returns {void}
 * */
async function createQuestion(){
  // A list with all tags ids selected by the user. 
  const tagsIds:Number[] = tagStore.buildSelectedTagIdList(props.tags);

  const questionObj:CreateQuestionDto = {
    Text: `New question ${questionOrder}`,
    Difficulty : props.difficulty,
    Order: questionOrder,
    QuizId: props.quizId,
    Tags: tagsIds
  };

  await questionStore.create(questionObj);
  await questionStore.getByQuiz(props.quizId); // Update questions list
  questionOrder++; 
}

/*
 * This method just open 
 * the modal for question editing.
 * @returns {void}
 * */
async function openEditModal(question){
  questionStore.openEditModal(question);
}

/*
 * This method open a toast 
 * asking if the user must procced
 * with question delete. If so, the method 
 * call the store to operate the instruction.
 *
 * */
async function deleteQuestion(questionId){
   toast.add({
    title: "Cuidado! tem certeza que deseja deletar esta pergunta?",
    description: "Todas as respostas relacionadas a esta pergunta também serão excluídas.",
    color: "warning",
    duration: 0,
    actions: [{
      icon: 'i-lucide-triangle-alert',
      label: "Sim, quero deletar",
      color: 'warning',
      variant: 'outline',
      onClick: async (e) => {
        e?.stopPropagation()
        await questionStore.delete(questionId);
        await questionStore.getByQuiz(props.quizId);
      }
    }]
  })
}
</script>


