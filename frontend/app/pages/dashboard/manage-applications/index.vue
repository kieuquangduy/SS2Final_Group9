<template>
  <div class="flex flex-col gap-10">
    <CommonPageSection title="Manage Applications">
      <div class="flex gap-8">
        <div class="flex items-center gap-4">
          <CommonPageToggle
            v-if="curUser?.role != 'STUDENT'"
            label="Sort By"
            :options="sortOptions"
          />
        </div>
      </div>
    </CommonPageSection>
    <CommonPageSection>
      <UTable
        ref="table"
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
          <div class="flex justify-end">
            <UButton
              icon="i-heroicons-eye"
              color="info"
              label="Select"
              class="cursor-pointer"
              @click="() => { navigateTo(`manage-applications/${row.original.id}`) }"
            />
          </div>
        </template>
      </UTable>
    </CommonPageSection>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useApplicationList } from '~/composables/application/useApplicationList'
import type { Tables } from '~/types/database.types'

const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail') 

const router = useRouter()

const { data } = await useApplicationList()

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
</script>
