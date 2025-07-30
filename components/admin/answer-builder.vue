<template>
  <div class="w-full inline-flex flex-col items-center justify-center gap-10 border border-purple-500 border-dashed border-[1px] p-10">    
    <draggable  @end="reorder" class="w-full flex flex-col gap-8" v-if="answerStore.answers.length > 0" v-model="answerStore.answers" item-key="id">
      <template #item="{element}">
        <div class="flex gap-5">
            <UBadge color="neutral" class="w-full" variant="outline">{{element.text}}</UBadge>
            <div class="flex gap-2">
              <UButton
                @click.stop="deleteAnswer(element.id)"
                icon="i-lucide-trash"
                color="error"
                variant="subtle"
                size="sm"
              />
              <UButton
                @click.stop="openEditModal(element)"
                icon="i-lucide-edit"
                color="primary"
                variant="subtle"
                size="sm"
              />
              <UTooltip :delay-duration="0" text="Clique para definir a resposta correta">
                <UButton
                  @click.stop="setCorrectStatus(element)"
                  :icon="element.correct ? 'i-lucide-file-check-2' : 'i-lucide-file-x-2'"
                  :color="element.correct ? 'success' : 'neutral'"
                  variant="subtle"
                  size="sm"
                />
              </UTooltip>
            </div>
        </div>
      </template>
    </draggable>
    <UButton @click="createAnswer()" size="sm" variant="subtle" icon="i-lucide-plus"  color="success">Adicionar nova resposta</UButton>
    <AdminAnswerEditModal :questionId="questionId" />
  </div>
</template>


<script setup lang="ts">
import draggable from 'vuedraggable'
import { useAnswerStore } from "@/stores/answer"
import type {CreateAnswerDto } from "@/types/dto/create-answer-dto"
import type { ReorderDto } from "@/types/dto/reorder-dto"
import type { EditAnswerDto } from "@/types/dto/edit-answer-dto"

const toast = useToast()
const answerStore = useAnswerStore();

var order:number = 1;

const props = defineProps<{
  questionId: number;
}>();


/* Fetch  all answers */
onMounted(async () => {
  await answerStore.getByQuestion(props.questionId); 
});

/*
 * Reorder the list of answers.
 * @returns {void}
 * */
function reorder(){
  const payload: ReorderDto[] = answerStore.answers.map((a, index) => ({
    id: a.id,
    order: index + 1,
  })); 

  answerStore.reorder(payload);
}

/*
 * This method create a answer DTO 
 * and send this object to the 
 * answer store.
 * @returns {void}
 * */
async function createAnswer(){
 
  const payload:CreateAnswerDto = {
    Text: `Resposta ${order}`,
    Correct : false,
    Order: order,
    QuestionId: props.questionId
  };

  await answerStore.create(payload);
  await answerStore.getByQuestion(props.questionId); // Update answers list
  order++; 
}

/*
 * This method apply the Correct status of 
 * a answer. This can be a boolean.
 * @param {number} id - Answer id 
 * @param {boolean} correctStatus - If answer is correct or not 
 * 
 * @returns {void}
 * */
async function setCorrectStatus(answerObject){
  const payload:EditAnswerDto = {
    Id: answerObject.id,
    Correct: !answerObject.correct,
    Text: answerObject.text,
    QuestionId:props.questionId
  };

  await answerStore.edit(payload);
  await answerStore.getByQuestion(props.questionId); // Update answers list 
}

/*
 * This method just open 
 * the modal for answer editing.
 * @returns {void}
 * */
async function openEditModal(answer){
  answerStore.openEditModal(answer);
}

/*
 * This method open a toast 
 * asking if the user must procced
 * with answer delete. If so, the method 
 * call the store to operate the instruction.
 *
 * */
async function deleteAnswer(id){
   toast.add({
    title: "Cuidado! tem certeza que deseja deletar esta resposta?",
    color: "warning",
    duration: 0,
    actions: [{
      icon: 'i-lucide-triangle-alert',
      label: "Sim, quero deletar",
      color: 'warning',
      variant: 'outline',
      onClick: async (e) => {
        e?.stopPropagation()
        await answerStore.delete(id);
        await answerStore.getByQuestion(props.questionId);
      }
    }]
  })
}
</script>


