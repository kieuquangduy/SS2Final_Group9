<template>
  <div class="flex flex-col gap-10">
    <CommonPageSection title="Manage Applications">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
        <UInput
          v-model="tableFilter"
          placeholder="Search..."
        />
      </div>
      <UButton
        v-if="curUser?.role === 'STUDENT'"
        class="ml-auto cursor-pointer"
        leading-icon="i-heroicons-plus-circle-solid"
        label="Manage Applicant Profile"
        :to="`/dashboard/${curUser.id}/applicant`"
      />
      <CommonPageModal
        v-model:is-open="deleteApplicationOpen"
        title="Delete Application"
        inner-class="flex-col justify-center gap-8"
      >
        <p class="text-dimmed">
          Are you sure you want to delete this application? This action cannot be undone.
        </p>
        <UButton
          class="cursor-pointer"
          label="Delete Application"
          :ui="{ label: ['mx-auto text-lg', isDeleting && 'hidden'], leadingIcon: 'mx-auto' }"
          :loading="isDeleting"
          color="error"
          @click="handleDelete(deleteApplicationId)"
        />
      </CommonPageModal>
    </CommonPageSection>
    <CommonPageSection inner-class="flex-col">
      <p class="self-start">
        {{ `Showing ${data?.data?.length ?? 0} / ${data?.count ?? 0} rows` }}
      </p>
      <UTable
        ref="table"
        v-model:global-filter="tableFilter"
        :columns="columns"
        :data="data?.data"
        class="w-full"
      >
        <template #index-cell="{ row }">
          <span class="text-gray-500 font-medium">{{ row.index + 1 }}</span>
        </template>

        <template #scholarship_tier-cell="{ row }">
          <ScholarshipTierBadge :tier="row.original.scholarship_tier ?? 'venue'" />
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

        <template #status-cell="{ row }">
          <ApplicationStatusBadge :status="row.original.status ?? 'APPLIED'" />
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu
            :items="rowActions(row.original)"
            class="flex justify-end"
          >
            <UButton
              icon="i-heroicons-bars-3"
              color="info"
              variant="ghost"
            />
          </UDropdownMenu>
        </template>
      </UTable>
    </CommonPageSection>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useApplicationDelete } from '~/composables/application/useApplicationDelete'
import { useApplicationList } from '~/composables/application/useApplicationList'
import { useApplicationUpdate } from '~/composables/application/useApplicationUpdate'
import { application_status } from '~/constants/application'
import type { Enums, Tables } from '~/types/database.types'

const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

const { data, refresh } = await useApplicationList()
const { isDeleting, deleteApplication } = await useApplicationDelete()
const { isUpdating, updateApplication } = await useApplicationUpdate()

const tableFilter = ref<string>('')

const deleteApplicationOpen = shallowRef<boolean>(false)
const deleteApplicationId = shallowRef<string>('')

const table = useTemplateRef('table')
const UButton = resolveComponent('UButton')

const columns: TableColumn<Tables<'application_list_view'>>[] = [
  {
    id: 'index',
    header: '#',
  },
  {
    accessorKey: 'student_name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Applicant',
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
    accessorKey: 'scholarship_title',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Scholarship',
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
    accessorKey: 'scholarship_tier',
    header: 'Tier',
  },
  {
    accessorKey: 'scholarship_deadline',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Deadline',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-heroicons-bars-arrow-down'
            : 'i-heroicons-bars-arrow-up'
          : 'i-heroicons-arrows-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => {
      return h('p', formatDate(row.getValue('scholarship_deadline')))
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Apply Time',
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
    accessorKey: 'status',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Status',
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

const handleDelete = async (id: string) => {
  await deleteApplication(id)
  deleteApplicationOpen.value = false
  deleteApplicationId.value = ''
  await refresh()
}

const handleStatusUpdate = async (id: string, status: Enums<'application_status'>) => {
  await updateApplication(id, status)
  await refresh()
}

const rowActions = (row: Tables<'application_list_view'>) => [
  {
    label: 'View',
    icon: 'i-heroicons-eye-solid',
    to: `/dashboard/manage-applications/${row.id}`,
  },
  {
    label: 'Status',
    icon: 'i-heroicons-scale-solid',
    class: (curUser.value?.role === 'ORGANIZER') ? '' : 'hidden',
    children:
      application_status.map(status => ({
        label: status,
        onClick: async () => handleStatusUpdate(row.id!, status),
      })),
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash-solid',
    onClick: async () => {
      deleteApplicationOpen.value = true
      deleteApplicationId.value = row.id!
    },
    color: 'error',
    class: (row.student_id === curUser.value?.id || curUser.value?.role === 'ADMIN' || curUser.value?.role === 'ORGANIZER') ? '' : 'hidden',
  },
]
</script>
