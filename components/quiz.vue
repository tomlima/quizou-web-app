<template>
  <UModal
    :dismissible="false"
    v-model:open="quizStore.showQuizModal"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="flex items-center justify-center gap-5">
        <UIcon name="i-lucide-clock-3" class="size-11" />
        <p class="self-center text-4xl" v-if="remainingTime !== null">
          {{ Math.floor(remainingTime / 60) }}m
          {{ remainingTime % 60 }}s
        </p>
      </div>
      <USeparator class="p-10" color="primary" size="lg" icon="i-simple-icons-nuxtdotjs" />

      <div> 
        <div class="flex items-center justify-center gap-5 mb-10">
          <UAvatar :text="currentQuestion.toString()" size="lg" color="primary" />
          <h2 class="text-2xl">{{quizStore.currentQuiz.questions[currentQuestion -1 ].text }} </h2>
        </div>

         
        <div class="flex flex-col gap-5 mb-10">
          <div class="radio" v-for="(answer, index ) in quizStore?.currentQuiz?.questions[currentQuestion - 1].answers ">
            <input
              @change="insertQuestionInQuizMapping(answer.id)"
              :id="`answer-${answer.id}`" 
              :name="`question-${quizStore.currentQuiz.questions[currentQuestion - 1].id}`" 
              type="radio"
              :value="answer.id"
              v-model="currentAnswer"
            >
             <label :for="`answer-${answer.id}`" class="radio-label">
                {{ answer.text }}
             </label>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-center w-full gap-15">         
        <UButton
          v-if="currentQuestion != 1"
          trailing-icon="i-lucide-arrow-left"
          label="Anterior"
          color="primary"
          variant="outline"
          @click="questionNavigation('prev')"
        />
        <UButton 
          v-if="quizStore.currentQuiz.questions.length > currentQuestion"
          trailing-icon="i-lucide-arrow-right"
          label="Próxima" 
          color="primary"
          variant="outline"
          @click="questionNavigation('next')"
        />
        <UButton
          @click="finishQuiz()"
          trailing-icon="i-lucide-flame"
          label="Finalizar"
          color="primary"
          v-if="quizStore.currentQuiz.questions.length == currentQuestion"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useQuizStore } from "@/stores/quiz";
import { useResultStore } from "@/stores/result";
import { ref, watch, onUnmounted } from "vue";
const quizStore = useQuizStore();
const resultStore = useResultStore(); 

const currentQuestion = ref<number>(1);
const currentAnswer = ref<number>(0);
const quizMapping = ref<Array<QuestionResponse>>([]);
const remainingTime = ref<number | null>(null);
let timerInterval: NodeJS.Timeout | null = null;



watch(
  () => quizStore.showQuizModal,
  (open) => {
    if (open && quizStore.currentQuiz?.time) {
      startTimer(quizStore.currentQuiz.time * 60); // minutes to seconds
    } else {
      stopTimer();
    }
  }
);

function finishQuiz(){
  const resultObj = {
    quiz: quizStore.currentQuiz,
    questionsResponses: quizMapping.value 
  } 
  resultStore.setResult(resultObj);
  quizStore.closeQuizModal();
  resultStore.openResultModal();

  resetQuizModalInformation();
}

function resetQuizModalInformation(){
  quizMapping.value = []; 
  currentAnswer.value = 0; 
  currentQuestion.value = 1;
}

function findQuestionAnswer(){
  const index = quizMapping.value.findIndex(item => item.question == currentQuestion.value);
  if(index == -1){
    return false
  }
  
  return quizMapping.value[index].userAnswer; 
}

function insertQuestionInQuizMapping(answerId){
  const questionObjectExist = quizMapping.value.some(item => item.question == currentQuestion.value);

  // If the question already exist in the quiz mapping 
  // object we remove this object from array. 
  if(questionObjectExist){
    quizMapping.value = quizMapping.value.filter(obj => obj.question != currentQuestion.value);
  }

  // Insert a question object with user  
  // answer inside the mapping array.  
   const obj = {
      question: currentQuestion.value,
      userAnswer: answerId 
   }
   quizMapping.value.push(obj);
}

function questionNavigation(direction:string){  
  if(direction == "next"){
    currentQuestion.value ++; 
  }else{
    currentQuestion.value --;
  }
  
  const answer = findQuestionAnswer()

  // Check if the answer already exist to this 
  // Question 
  if(answer){
    currentAnswer.value = answer;
  }else{
    currentAnswer.value = 0;
  }

}

function startTimer(seconds: number) {
  remainingTime.value = seconds;

  timerInterval = setInterval(() => {
    if (remainingTime.value !== null) {
      if (remainingTime.value > 0) {
        remainingTime.value--;
      } else {
        stopTimer();        
        finishQuiz();
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

onUnmounted(() => {
  stopTimer();
});
</script>
