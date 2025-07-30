import { defineStore } from "pinia";
import type { Answer } from '@/types/entity/answer'
import type { CreateAnswerDto } from "@/types/dto/create-answer-dto";
import type { ReorderDto } from "@/types/dto/reorder-dto";
import type { EditAnswerDto } from "@/types/dto/edit-answer-dto";

export const useAnswerStore = defineStore("answer", {
  state: () => ({
    answers: [] as Answer[],
    loading: false as boolean,
    showEditModal: false as boolean,
    answerBeingEdited: null as Answer | null
  }),
  actions: {
    /**
     * This method fetch all answers 
     * from specific Question.
     * 
     * @param { number } questionId - Question ID 
     * @returns { Promise<void> }
    */
    async getByQuestion(questionId: number): Promise<void> {
      this.loading = true;
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/answers/question/${questionId}`);

        if (!response.ok) {
          throw new Error();
        }

        const result: Answer[] = await response.json();
        this.answers = result;
      } catch (error) {
        toast('error', `Erro ao carregar as respostas da pergunta: ${questionId}`);
      } finally {
        this.loading = false;
      }
    },

    /**
     * This method create a new answer. 
     *
     * @param {CreateAnswerDto} payload - The answer DTO object 
     * @returns { Promise<void> }
    */
    async create(payload: CreateAnswerDto): Promise<number | null> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              Text: payload.Text?.trim(),
              Correct: payload.Correct,
              Order: payload.Order,
              QuestionId: payload.QuestionId
            }
          ),
        });

        // If something wrong happen
        if (!response.ok) {
          throw new Error();
        }

        const result = await response.json();
        return result.id;

      } catch (error) {
        toast('error', 'Erro ao salvar a resposta');
        return null;
      }
    },

    /**
     * This method delete a answer 
     *
     * @param {number} id - Answer id  
     * @returns { Promise<void> }
    */
    async delete(id: number): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();
      try {
        const response: Response = await fetch(`${config.public.apiBase}/answers/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        toast("success", "Resposta deletada com sucesso");
      } catch (error) {
        toast('error', 'Erro ao deletar resposta');
      }
    },

    /**
     * This method reorder a list of answers.
     *
     * @param {ReorderDto[]} payload - A list of reorder object.
     * @returns { Promise<void> }
    */
    async reorder(payload: ReorderDto[]): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/answers/reorder`, {
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
     * to edit a answer.
     * @param {Answer} answer - Answer object 
     * @returns {void}
    */
    openEditModal(answer: Answer): void {
      this.answerBeingEdited = answer;
      this.showEditModal = true;
    },

    /**
    * This method edit a answer.
    *  
    * @param {EditAnswerDto} payload - A answer dto object 
    * @returns { Void }
    */
    async edit(payload: EditAnswerDto): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/answers`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {
              Id: payload.Id,
              NewAnswer: payload.Text,
              Correct: payload.Correct,
              QuestionId: payload.QuestionId
            }
          ),
        });

        // If something wrong happen 
        if (!response.ok) {
          if (response.status === 403) {
            toast("error", "Cada pergunta pode ter somente uma resposta correta")
          } else {
            throw new Error();
          }
        }

        // If all worked 
        this.showEditModal = false;

      } catch (err) {
        toast('error', "Um erro inesperado aconteceu");
      }
    }

  }
});

