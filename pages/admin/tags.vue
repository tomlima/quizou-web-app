<template>
  <UContainer>
    <div class="flex flex-col gap-10 w-full mt-10">
      <AdminNav />
      <UCard class="w-full">
        <template #header>
          <div class="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
            <div class="flex items-center gap-5">
              <img class="w-[50px]" src="/icons/tag.png">
              <h1> Minhas tags </h1>
            </div>
            <UInput
              :model-value="table?.tableApi?.getColumn('name')?.getFilterValue() as string"
              class="max-w-sm"
              icon="i-lucide-search"
              placeholder="Buscar por nome..."
              @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
            />
          </div>
        </template>
      
        <div v-if="data && data.length > 0">
          <UTable 
            ref="table"
            :data="data" 
            :columns="columns"
            v-model:column-filters="columnFilters"
            v-model:pagination="pagination"
            class="flex-1" 
            :pagination-options="{getPaginationRowModel: getPaginationRowModel()}"
          >
          <!-- Aqui o slot para a coluna de ações -->
            <template #action-cell="{ row }">
              <UDropdownMenu :items="getDropdownActions(row.original)">
                <UButton
                  icon="i-lucide-ellipsis-vertical"
                  color="neutral"
                  variant="ghost"
                  aria-label="Ações"
                />
              </UDropdownMenu>
            </template>
          </UTable>

          <div class="flex justify-center border-t border-default pt-4">
            <UPagination
              :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
              :items-per-page="table?.tableApi?.getState().pagination.pageSize"
              :total="table?.tableApi?.getFilteredRowModel().rows.length"
              @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
            />
          </div>
        </div>

        <div class="flex w-full items-center justify-center" v-else>
          <NotFound />
        </div>
      </UCard>
    </div>
    <AdminTagEditModal />
  </UContainer>
</template>

<script setup lang="ts" async>
import { ref,onMounted,computed } from "vue"
import { useTagStore } from "@/stores/tag"
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { Tag } from  '@types/entity/tag'

const config = useRuntimeConfig()

const tagStore = useTagStore()
const showToast = useToastMessage();

const table = useTemplateRef('table')
const data = computed(() => tagStore.tags?.items || [])
tagStore.fetchTags();

const columns: TableColumn<Tag>[] = [
  {
    accessorKey: 'id',
    header: '#'
  },
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString('pt-BR')
  },
  {
    id: 'action' 
  }
]

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})

const columnFilters = ref([
  {
    id: 'name',
    value: ''
  }
])





function getDropdownActions(tag:Tag): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Editar',
        icon: 'i-lucide-edit',
        onSelect: () => handleEdit(tag)
      },
      {
        label: 'Excluir',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => handleDelete(tag)
      }
    ]
  ]
}

function handleEdit(tag: Tag) {
  tagStore.openEditTagModal(tag); 
}

async function handleDelete(tag: Tag) {
  await tagStore.deleteTag(tag);  
}
</script>


