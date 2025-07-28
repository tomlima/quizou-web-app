import { defineStore } from "pinia";
import type { Question } from '@/types/entity/question'
import type { CreateQuestionDto } from "@/types/dto/createQuestionDto";
import type { ReorderQuestionDto } from "@/types/dto/reorder-question-dto";

export const useQuestionStore = defineStore("question", {
  state: () => ({
    questions: [] as Question[],
    loading: false as boolean,
    showEditModal: false as boolean,
    questionBeingEdited: null as Question | null
  }),
  actions: {
    /**
     * This method fetch all questions  
     * from specific Quiz.  
     * 
     * @param { number } quizId - Quiz ID 
     * @returns { Promise<void> }
    */
    async getByQuiz(quizId: number): Promise<void> {
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
     * @returns { Promise<void> }
    */
    async create(questionDto: CreateQuestionDto): Promise<number | null> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              Text: questionDto.Text?.trim(),
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

    /**
     * This method delete a question
     *
     * @param {number} id - Question id  
     * @returns { Promise<void> }
    */
    async delete(id: number): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();
      try {
        const response: Response = await fetch(`${config.public.apiBase}/questions/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        toast("success", "Pergunta deletada com sucesso");
      } catch (error) {
        toast('error', 'Erro ao deletar pergunta');
      }
    },

    /**
     * This method reorder a list of questions.
     *
     * @param {ReorderQuestionDto[]} payload - A list of reorder object.
     * @returns { Promise<void> }
    */
    async reorder(payload: ReorderQuestionDto[]): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/questions/reorder`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error();
        }

      } catch (error) {
        toast('error', 'Erro ao reordenar perguntas');
      }
    },

    /**
     * This method open a modal   
     * to edit a question.
     * @param {Question} question - Question object 
     * @returns {void}
    */
    openEditModal(question: Question): void {
      this.questionBeingEdited = question;
      this.showEditModal = true;
    },

    /**
    * This method edit a question.
    * 
    * @param {number} questionId - The id of the question that will be edited 
    * @param {string} newQuestion - New question text  
    * @returns { Void }
    */
    async edit(questionId: number, newQuestion: string): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/questions`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ questionId: questionId, newQuestion: newQuestion }),
        });

        // If something wrong happen 
        if (!response.ok) {
          throw new Error(`Erro ao editar: ${response.status} ${response.statusText}`);
        }

        // If all worked 
        toast('success', 'Pergunta editada com sucesso')
        this.showEditModal = false;

      } catch (err) {
        toast('error', 'Erro ao editar a pergunta');
      }
    }

  }
});
