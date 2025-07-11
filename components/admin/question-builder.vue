<template>
  <div class="w-full flex justify-center">
    <UButton  size="md" icon="i-lucide-plus" color="primary">Adicionar nova pergunta</UButton>
    <div v-if="questionStore.questions.length > 0">
      <div v-for="(question,index) in questionStore.questions" :index=index>
        {{question}}
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useQuestionStore } from "@/stores/question"
import { ref, watch } from "vue";
import { QuestionDto } from "@/types/dto/questionDto"

const questionStore = useQuestionStore();

defineProps({
  quizId: Number,
  tags: Number[]
})

/* Fetch  all questions */
onMounted(async () => {
  await questionStore.fetchQuestions(); 
}); 

async function createNewQuestion(){
  const questionObj:QuestionDto = {
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
