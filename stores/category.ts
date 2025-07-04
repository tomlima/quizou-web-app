import { defineStore } from "pinia";
import type { PagedResult } from '@/types/entity/paged-result'
import type { Tag } from '@/types/entity/tag'
import type { Category } from "@/types/entity/category";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    showNewTagModal: false as boolean,
    showEditTagModal: false as boolean,
    tags: null as PagedResult<Tag> | null,
    categories: null as Category[] | null,
    tagBeingEdited: null as Tag | null,
    loading: false as boolean
  }),
  actions: {
    /**
     * This method try to find a category object 
     * that have a specific name. 
     * @param {string} name - The category name 
     * @returns { Category | null } 
    */
    getCategoryByName(name: string): Category | null {
      // Check the category list 
      if (!this.categories || this.categories.length < 1) {
        return null;
      }

      // Try to find the matched category 
      const category = this.categories.find((cat: Category) => cat.name == name);
      if (category) {
        return category;
      }
      return null;
    },
    /**
     * This method open the 
     * modal for edit a tag. 
     * @param {Tag} tag - The tag object
     * @returns { Void }
    */
    openEditTagModal(tag: Tag): void {
      this.tagBeingEdited = tag;
      this.showEditTagModal = true;
    },

    /**
     * This method open the 
     * modal for create a new  tag. 
     *
     * @returns { Void }
    */
    openNewTagModal(): void {
      this.showNewTagModal = true;
    },

    /**
     * This method close the 
     * modal for edit a tag. 
     * 
     * @returns { Void }
    */
    closeEditTagModal(): void {
      this.showEditTagModal = false;
    },

    /**
     * This method close the 
     * modal for create a new tag.  
     *
     * @returns { Void }
    */
    closeNewTagModal(): void {
      this.showNewTagModal = false;
    },

    /**
     * This method fetch all tags 
     * from the API.  
     * 
     * @returns { Promise<void> }
    */

    async fetchCategories(): Promise<void> {
      this.loading = true;
      const config = useRuntimeConfig();
      const toast = useToastMessage();

      try {
        const response: Response = await fetch(`${config.public.apiBase}/categories`);

        if (!response.ok) {
          throw new Error(`Erro ao carregar categorias: ${response.status} ${response.statusText}`);
        }

        const result: Category[] = await response.json();
        this.categories = result;
      } catch (error) {
        toast('error', 'Erro ao carregar as categorias');
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
