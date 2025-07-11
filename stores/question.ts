import { defineStore } from "pinia";
import type { Question } from '@/types/entity/question'
import type { CreateQuestionDto } from "@/types/dto/createQuestionDto";

export const useQuestionStore = defineStore("question", {
  state: () => ({
    questions: [] as Question[],
    loading: false as boolean
  }),
  actions: {
    /**
     * This method fetch all questions  
     * from specific Quiz.  
     * 
     * @param { number } quizId - Quiz ID 
     * @returns { Promise<void> }
    */

    async fetchQuestionsByQuiz(quizId: number): Promise<void> {
      this.loading = true;
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/questions/quiz/${quizId}`);

        if (!response.ok) {
          throw new Error();
        }

        const result: Question[] = await response.json();
        this.questions = result;
      } catch (error) {
        toast('error', `Erro ao carregar as perguntas do quiz: ${quizId}`);
      } finally {
        this.loading = false;
      }
    },

    /**
     * This method add a new question
     *  
     * @param {CreateQuestionDto} questionDto - The question DTO object 
     * @returns { Void }
    */

    async createQuestion(questionDto: CreateQuestionDto): Promise<number | null> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      if (!questionDto.Text.trim()) {
        toast('error', 'Preencha todos os campos! ');
        return null;
      }

      try {
        const response: Response = await fetch(`${config.public.apiBase}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              Title: questionDto.Text?.trim(),
              Difficulty: Number(questionDto?.Difficulty),
              Order: questionDto?.Order,
              QuizId: questionDto?.QuizId,
              Tags: questionDto?.Tags,
            }
          ),
        });

        // If something wrong happen
        if (!response.ok) {
          throw new Error();
        }

        const result = await response.json();
        toast('success', 'Question create successfully');
        return result.id;

      } catch (error) {
        toast('error', 'Erro ao salvar a pergunta');
        return null;
      }
    },

  }
})
