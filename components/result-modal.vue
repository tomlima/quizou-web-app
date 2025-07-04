<template>
  <UModal
    :dismissible="false"
    v-model:open="resultStore.resultModal"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="flex items-center justify-center flex-col">
        <UIcon v-if="getThePercentOfSuccess() < 50" name="i-lucide-frown"  class="size-15 mb-5 text-error" />
        <UIcon v-if="getThePercentOfSuccess() > 50 && getThePercentOfSuccess() < 90" name="i-lucide-annoyed"  class="size-15 mb-5 text-warning" />
        <UIcon v-if="getThePercentOfSuccess() > 90" name="i-lucide-laugh"  class="size-15 mb-5 text-success" />
        <p class="text-2xl">
          Você acertou {{getTheNumberOfCorrectAnswers()}}
          de {{resultStore.result.quiz.questions.length}} questoes
        </p>
      </div>
      <USeparator class="p-10" color="success" size="lg" icon="i-simple-icons-nuxtdotjs" />

      <div v-if="showAnswers" class="h-[400px] overflow-y-scroll">
        <div v-for="(question, index) in resultStore?.result?.quiz?.questions"  class="flex items-start flex-col justify-center gap-5 mb-10">
          <div class="flex items-center justify-center gap-5 mb-2">
            <UAvatar :text="index + 1" size="lg" color="primary" />
            <h2 class="text-xl">{{ question.text }}</h2>
          </div>
          <div class="flex gap-5 items-center">
            <UBadge color="success">R:</UBadge>
            <p>{{ getCorrectAnswerFromAGivenQuestion(question) }}</p>
          </div>
        </div>

      </div>
    </template>

    <template v-if="!showAnswers" #footer>
      <div class="flex items-center justify-center w-full gap-15">         
        <UButton
            @click="() => showAnswers = true"
          color="success"
          icon="i-lucide-eye"
        > 
        Ver respostas
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useResultStore } from "@/stores/result";
import { ref, watch } from "vue";
const resultStore = useResultStore();
const showAnswers = ref<boolean>(false)

function getCorrectAnswerFromAGivenQuestion(question:Question){
  const correctAnswer = question.answers.find(a => a.correct === true);
  return correctAnswer.text || null; 
}

function getTheNumberOfCorrectAnswers(){
  const { quiz, questionsResponses } = resultStore.result; 
  let correctCount = 0;

  for (const response of questionsResponses) {
    const question = quiz.questions.find(q => q.id === response.question);
    if (!question) continue;

    const correctAnswer = question.answers.find(a => a.correct);
    if (correctAnswer && response.userAnswer === correctAnswer.id) {
      correctCount++;
    }
  }

  return correctCount;
}

function getThePercentOfSuccess(){
  const totalQuestion = parseInt(resultStore?.result?.quiz?.questions?.length); 
  const totalOfCorrectAnswers = parseInt(getTheNumberOfCorrectAnswers()); 
    
  console.log(totalQuestion)
  console.log(totalOfCorrectAnswers)
  const percent = (100 * totalOfCorrectAnswers) / totalQuestion;
  return percent;
}

</script>
