<template>
  <div class="w-full inline-flex flex-col items-center justify-center gap-10">
    <div v-if="questionStore.questions.length > 0">
      <div v-for="(question,index) in questionStore.questions" :key="index">
       {{question}}
      </div>
    </div>
    <UButton @click="createNewQuestion()" size="md" icon="i-lucide-plus"  color="primary">Adicionar nova pergunta</UButton>
  </div>
</template>


<script setup lang="ts">
import { useQuestionStore } from "@/stores/question"
import type { CreateQuestionDto } from "@/types/dto/createQuestionDto"
import {useTagStore} from "@/stores/tag"

const questionStore = useQuestionStore();
const tagStore = useTagStore();

var questionOrder = 0;

const props = defineProps<{
  quizId: number;
  tags: array;
  difficulty: number;
}>();

/* Fetch  all questions */
onMounted(async () => {
  await questionStore.fetchQuestionsByQuiz(props.quizId); 
});

async function createNewQuestion(){
  // A list with all tags ids selected by the user. 
  const tagsIds:Number[] = tagStore.buildSelectedTagIdList(props.tags);

  const questionObj:CreateQuestionDto = {
    Text: "New question",
    Difficulty : props.difficulty,
    Order: questionOrder,
    QuizId: props.quizId,
    Tags: tagsIds
  };
  await questionStore.createQuestion(questionObj);
  await questionStore.fetchQuestionsByQuiz(props.quizId); 
}

</script>
