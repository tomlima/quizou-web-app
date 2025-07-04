import { defineStore } from "pinia";
import type { Quiz } from "@/types/entity/quiz";
import type { Category } from "@/types/entity/category";
import type { PagedResult } from "@/types/entity/paged-result";
import type { Tag } from "@/types/entity/tag";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    quizzes: null as PagedResult<Quiz> | null,
    showQuizModal: false,
    currentQuiz: null as Quiz | null,
  }),
  actions: {
    startQuiz(quiz: Quiz) {
      this.currentQuiz = quiz;
      this.showQuizModal = true;
    },
    closeQuizModal() {
      this.showQuizModal = false;
    },
    /**
     * This method add a new Quiz 
     *  
     * @param {string} title - Quiz title 
     * @param {string} description - Quiz description 
     * @param {Number} time - Quiz time 
     * @param {string} difficult = Quiz difficult
     * @param {Category} category - The quiz category
     * @param {Tag} tag - The quiz tag 
     * @param {string} thumb - Quiz thumbnail
     * @param {string} status - Draft | Active | Deleted | Archived
    */

    async createQuiz(
      title: string = "Unknow title",
      description: string = "Unknow description",
      time: number = 5,
      difficult: string = "Easy",
      category: Category,
      tag: Tag,
      thumb: string = "https://quizou.s3.us-east-1.amazonaws.com/placeholder/thumb_placeholder.png",
      status: string
    ) {
      const config = useRuntimeConfig();
      const toast = useToastMessage();
      if (!title.trim()) {
        toast('error', 'Você precisa preencher o campo "tag".');
        return;
      }

      try {
        const response: Response = await fetch(`${config.public.apiBase}/quizzes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              title: title.trim(),
              description: description.trim(),
              time: time,
              difficult: difficult,
              category: category,
              tag: tag,
              thumb: thumb
            }
          ),
        });

        // If something wrong happen
        if (!response.ok) {
          if (response.status == 409) {
            toast('warning', "Essa tag já existe");
          } else {
            throw new Error(`Erro ao criar matéria: ${response.status} ${response.statusText}`);
          }
          return;
        }

        // If all is worked 
        const savedTag = await response.json();
        toast('success', `Tag "${savedTag.name}" criada com sucesso!`);

      } catch (error) {
        toast('error', 'Erro ao salvar a tag');
      }

    },

  }
});
