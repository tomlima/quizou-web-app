import { defineStore } from "pinia";
import type { Quiz } from "@/types/entity/quiz"
import type { EditQuizDto } from "@/types/dto/edit-quiz-dto";
import type { CreateQuizDto } from "@/types/dto/create-quiz-dto";
import type { PagedResult } from "@/types/entity/paged-result";

export const useQuizAdminStore = defineStore("quiz-admin", {
  state: () => ({
    showQuizModal: false as boolean,
    loading: false as boolean,
    quizzes: null as PagedResult<Quiz> | null,
  }),
  actions: {
    /**
    * This method fetch all quizzes
    * from the API.
    * 
    * @returns { Promise<Void> }
    */
    async get(): Promise<void> {
      const config = useRuntimeConfig();
      this.loading = true;
      const toast = useToastMessage();
      try {
        const response: Response = await fetch(`${config.public.apiBase}/quizzes`);
        if (!response.ok) {
          throw new Error();
        }
        const result: PagedResult<Quiz> = await response.json();
        this.quizzes = result;
      } catch (error) {
        toast('error', 'Erro ao carregar os quizzes');
      } finally {
        this.loading = false;
      }
    },

    /**
     * This method add a new Quiz
     *
     * @param {CreateQuizDto} quiz - Quiz dto object 
     * @returns { Promise<string | null> }
     **/
    async createQuiz(payload: CreateQuizDto): Promise<number | null> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      // Get only image name 
      // E.g: From this string: https://provider.com/bucket/image.png 
      // we'll gonna extract only the string image.png 
      const image: string | undefined = payload?.Image?.split("/").pop();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/quizzes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              Title: payload?.Title.trim(),
              Description: payload?.Description.trim(),
              Time: payload?.Time,
              Difficulty: Number(payload?.Difficulty),
              CategoryId: payload?.CategoryId,
              Tags: payload?.Tags,
              Image: image,
              Status: Number(payload?.Status)
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
        return result.id;

      } catch (error) {
        toast('error', 'Erro ao salvar o quiz');
        return null;
      }
    },

    /**
     * This method edit a Quiz 
     *  
     * @param {EditQuizDto} quiz - Quiz dto object 
     * @returns { Promise<void> }
     **/
    async edit(quiz: EditQuizDto): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      // Get only image name 
      // E.g: From this string: https://provider.com/bucket/image.png 
      // we'll gonna extract only the string image.png 
      const image: string | undefined = quiz?.Image?.split("/").pop();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/quizzes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              Id: quiz.Id,
              Title: quiz?.Title.trim(),
              Description: quiz?.Description.trim(),
              Time: quiz?.Time,
              Difficulty: Number(quiz?.Difficulty),
              CategoryId: quiz?.CategoryId,
              Tags: quiz?.Tags,
              Image: image,
              Status: Number(quiz?.Status)
            }
          ),
        });

        // If something wrong happen
        if (!response.ok) {
          throw new Error();
        }
      } catch (error) {
        toast('error', 'Erro ao editar o quiz');
      }
    },
    /**
     * This method delete a Quiz 
     *  
     * @param {number} id - Quiz id
     * @returns { Promise<void> }
     **/
    async delete(id: number): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/quizzes/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // If something wrong happen
        if (!response.ok) {
          throw new Error();
        }
      } catch (error) {
        toast('error', 'Erro ao editar o quiz');
      }
    },

    /**
     * This method open the 
     * modal for create a new quiz. 
     *
     * @returns { void }
    */
    openNewQuizModal(): void {
      this.showQuizModal = true;
    },
  }
})
