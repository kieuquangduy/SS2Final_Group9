<template>
  <div class="w-full h-full overflow-y-auto">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
      <UInput
        :model-value="table?.tableApi?.getColumn('username')?.getFilterValue() as string"
        placeholder="Search Organizers..."
        @update:model-value="table?.tableApi?.getColumn('username')?.setFilterValue($event)"
      />
      <p class="self-start">
        {{ `Showing ${data?.length ?? 0} / ${all!.count ?? 0} rows` }}
      </p>
    </div>
    <UTable
      ref="table"
      class="w-full"
      :data="data!"
      :columns="columns"
    >
      <template #index-cell="{ row }">
        <span class="text-gray-500 font-medium">{{ row.index + 1 }}</span>
      </template>
      <template #avatar-cell="{ row }">
        <div v-if="row.original.avatar_url">
          <NuxtImg
            :src="row.original.avatar_url"
            class="size-8 rounded-lg"
            quality="50"
            format="webp"
          />
        </div>
      </template>

      <template #created_at-cell="{ row }">
        <NuxtTime
          v-if="row.original.created_at"
          :datetime="row.original.created_at"
          month="numeric"
          day="numeric"
          year="numeric"
          hour="numeric"
          minute="numeric"
          locale="vi-VN"
        />
      </template>

      <template #actions-cell="{ row }">
        <UButton
          label="Add"
          icon="i-heroicons-plus-circle-solid"
          color="info"
          variant="solid"
          @click="() => handleAddOrganizer(row.original)"
        />
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useOrganizerList } from '~/composables/organizer/useOrganizerList'
import type { Tables } from '~/types/database.types'

const selected = defineModel<{ organizer: Tables<'organizer_list_view'>, host: boolean }[]>('selected', {
  default: () => [],
})

const table = useTemplateRef('table')
const UButton = resolveComponent('UButton')

const { data: all } = await useOrganizerList()
const data = computed(() => {
  if (!all.value || !all.value.data) return undefined
  return all.value.data.filter(org => {
    const isAlreadySelected = selected.value.some(
      (selectedOrg) => selectedOrg.organizer.id === org.id,
    )
    return !isAlreadySelected
  })
})

const columns: TableColumn<Tables<'organizer_list_view'>>[] = [
  {
    id: 'index',
    header: '#',
  },
  {
    id: 'avatar',
    accessorKey: 'avatar_url',
    header: '',
  },
  {
    accessorKey: 'username',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Registered Date',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-heroicons-bars-arrow-down'
            : 'i-heroicons-bars-arrow-up'
          : 'i-heroicons-arrows-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    id: 'actions',
    header: '',
  },
]

const handleAddOrganizer = (organizer: Tables<'organizer_list_view'>) => {
  selected.value = [...selected!.value!, { organizer, host: false }]
}
</script>
