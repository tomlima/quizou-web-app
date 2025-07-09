import { defineStore } from "pinia";
import type { QuizDTO } from "@/types/dto/quizDTO";

export const useQuizAdminStore = defineStore("quiz-admin", {
  state: () => ({
    showNewQuizModal: false as boolean,
    loading: false as boolean
  }),
  actions: {
    /**
     * This method add a new Quiz 
     *  
     * @param {QuizDTO} quiz - Quiz dto object 
     * @returns { Promise<string | null> }    
     **/

    async createQuiz(quiz: QuizDTO): Promise<number | null> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      // Get only image name 
      // E.g: From this string: https://provider.com/bucket/image.png 
      // we'll gonna extract only the string image.png 
      const image: string | undefined = quiz?.image?.split("/").pop();

      if (!quiz.title.trim() || !quiz.description.trim()) {
        toast('error', 'Preencha todos os campos! ');
        return null;
      }

      try {
        const response: Response = await fetch(`${config.public.apiBase}/quizzes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              title: quiz?.title.trim(),
              description: quiz?.description.trim(),
              time: quiz?.time,
              difficulty: Number(quiz?.difficulty),
              categoryId: quiz?.categoryId,
              tags: quiz?.tags,
              image: image,
              status: Number(quiz?.status)
            }
          ),
        });

        // If something wrong happen
        if (!response.ok) {
          if (response.status == 409) {
            toast('warning', "Esse quiz já existe");
          } else {
            throw new Error(`Erro ao criar matéria: ${response.status} ${response.statusText}`);
          }
          return null;
        }

        const result = await response.json();
        toast('success', 'Quiz create successfully');
        return result.id;

      } catch (error) {
        toast('error', 'Erro ao salvar o quiz');
        return null;
      }

    },

    /**
     * This method open the 
     * modal for create a new quiz. 
     *
     * @returns { void }
    */
    openNewQuizModal(): void {
      this.showNewQuizModal = true;
    },
  }
})
