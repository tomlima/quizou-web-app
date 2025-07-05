import { defineStore } from "pinia";
import type { PagedResult } from '@/types/entity/paged-result'
import type { Tag } from '@/types/entity/tag'
import type { QuizDTO } from "@/types/dto/quizDTO";

export const useQuizAdminStore = defineStore("quiz-admin", {
  state: () => ({
    showNewQuizModal: false as boolean,
    showNewTagModal: false as boolean,
    showEditTagModal: false as boolean,
    tags: null as PagedResult<Tag> | null,
    tagBeingEdited: null as Tag | null,
    loading: false as boolean
  }),
  actions: {
    /**
     * This method add a new Quiz 
     *  
     * @param {QuizDTO} quiz - Quiz dto object 
     * @returns { Promise<string | null> }    
     **/

    async createQuiz(quiz: QuizDTO): Promise<string | null> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      console.info(quiz)

      if (!quiz.title.trim() || !quiz.description.trim()) {
        toast('error', 'Você precisa preencher o campo "Título" ');
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
              time: quiz.time,
              difficult: quiz.difficulty,
              category: quiz.category,
              tag: quiz.tag,
              thumb: quiz.thumb,
              status: quiz.status
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

        const resultText = await response.text();
        toast('success', "Quiz criado com sucesso!");
        return resultText;

      } catch (error) {
        console.error(error);
        toast('error', 'Erro ao salvar o quiz');
        return null;
      }

    },

    /**
     * This method open the 
     * modal for edit a tag. 
     * @param {Tag} tag - The tag object
     * @returns { Void }
    */
    openEditTagModal(tag: Tag) {
      this.tagBeingEdited = tag;
      this.showEditTagModal = true;
    },

    /**
     * This method open the 
     * modal for create a new  tag. 
     *
     * @returns { Void }
    */
    openNewQuizModal() {
      this.showNewQuizModal = true;

      // Create a draft quiz 

    },

    /**
     * This method close the 
     * modal for edit a tag. 
     * 
     * @returns { Void }
    */
    closeEditTagModal() {
      this.showEditTagModal = false;
    },

    /**
     * This method close the 
     * modal for create a new tag.  
     *
     * @returns { Void }
    */
    closeNewTagModal() {
      this.showNewTagModal = false;
    },

    /**
     * This method fetch all tags 
     * from the API.  
     * 
     * @returns { Void }
    */

    async fetchTags() {
      const config = useRuntimeConfig();
      this.loading = true;
      const toast = useToastMessage();
      try {
        const response: Response = await fetch(`${config.public.apiBase}/tags`);

        if (!response.ok) {
          throw new Error(`Erro ao carregar tags: ${response.status} ${response.statusText}`);
        }

        const result: PagedResult<Tag> = await response.json();
        this.tags = result;
      } catch (error) {
        toast('error', 'Erro ao carregar as tags');
      } finally {
        this.loading = false;
      }
    },

    /**
     * This method add a new tag 
     *  
     * @param {string} tagName - Name of the tag 
     * @returns { Void }
    */

    async createTag(tagName: string) {
      const config = useRuntimeConfig();
      const toast = useToastMessage();
      if (!tagName.trim()) {
        toast('error', 'Você precisa preencher o campo "tag".');
        return;
      }

      try {
        const response: Response = await fetch(`${config.public.apiBase}/tags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: tagName.trim() }),
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
        this.showNewTagModal = false;
        if (this.tags) {
          this.tags.items.unshift(savedTag);
        }

      } catch (error) {
        toast('error', 'Erro ao salvar a tag');
      }

    },

    /**
     * This method delete a tag  
     * modal for edit a tag. 
     * @param {Tag} tag - The tag object
     * @returns { Void }
    */

    async deleteTag(tag: Tag) {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/tags?tagId=${tag.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // If something wrong happen 
        if (!response.ok) {
          if (response.status === 404) {
            toast('error', 'Tag não encontrada ou já deletada.');
          } else {
            throw new Error(`Erro ao deletar: ${response.status} ${response.statusText}`);
          }
          return;
        }

        //  If all worked 
        const message = await response.text();
        toast('success', message);

        if (this.tags) {
          this.tags.items = this.tags.items.filter(t => t.id !== tag.id)
        }

      } catch (error) {
        toast('error', 'Erro ao deletar  a tag');
      }
    },

    /**
     * This method edit a tag  
     * modal for edit a tag. 
     * @param {number} tagId - The id of the tag thaw will be edited 
     * @param {string} newTagName = The new name of the tag 
     * @returns { Void }
    */

    async editTag(tagId: number, newTagName: string): Promise<void> {
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/tags`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tagId: tagId, name: newTagName.trim() }),
        });

        // If something wrong happen 
        if (!response.ok) {
          throw new Error(`Erro ao editar: ${response.status} ${response.statusText}`);
        }

        // If all worked 
        toast('success', 'Tag editada com sucesso')
        this.showEditTagModal = false;

      } catch (err) {
        toast('error', 'Erro ao editar a tag');
      }
    }
  }
})
