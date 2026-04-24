<template>
    <div class="flex flex-col gap-10">
        <CommonPageSection title="Manage Scholarships">
            <UButton class="ml-auto cursor-pointer" leading-icon="i-heroicons-plus-circle-solid"
                label="Create Scholarship" to="manage-scholarships/create" />
        </CommonPageSection>
        <CommonPageSection>
            <UTable class="w-full" :data="data!" :columns="columns">
                <template #index-cell="{ row }">
                    <span class="text-gray-500 font-medium">{{ row.index + 1 }}</span>
                </template>
                <template #avatar-cell="{ row }">
                    <div v-if="row.original.icon_url">
                        <NuxtImg :src="row.original.icon_url" class="size-8 rounded-lg" quality="50" format="webp" />
                    </div>
                </template>

                <template #actions-cell="{ row }">
                    <UDropdownMenu :items="rowActions(row.original)" class="flex justify-end">
                        <UButton icon="i-heroicons-bars-3" color="info" variant="ghost" />
                    </UDropdownMenu>
                </template>
            </UTable>
        </CommonPageSection>
    </div>
</template>
<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui';
import { z } from 'zod'
import { useScholarshipCreate } from '~/composables/scholarship/useScholarshipCreate';
import { useScholarshipList } from '~/composables/scholarship/useScholarshipList';
import { scholarship_tier } from '~/constants/scholarship';
import type { Enums, Tables } from '~/types/database.types';


const { createScholarship, isLoading: isCreating } = await useScholarshipCreate()

const createScholarshipOpen = shallowRef<boolean>(false)
const createScholarshipPayloadState = ref({ 
    title: '', 
    description: '', 
    tier: 'VENUE' as Enums<'scholarship_tier'>
})
const schema = z.object({ 
    title: z.string().min(1, 'Title is required!'), 
    description: z.string().optional(),

})
const handleCreateProfile = () => {
    createScholarship(createScholarshipPayloadState.value)
}

const { data } = await useScholarshipList()

const columns: TableColumn<Tables<'scholarship_list_view'>>[] = [
    {
        id: 'index',
        header: '#'
    },
    {
        accessorKey: 'title',
        header: 'Title'
    },
    {
        accessorKey: 'tier',
        header: 'Tier'
    },
    {
        accessorKey: 'deadline',
        header: 'Deadline'
    },
    {
        accessorKey: 'created_at',
        header: 'Created At'
    },
    {
        id: 'actions',
        header: ''
    }
]

const rowActions = (row: Tables<'scholarship_list_view'>) => [
    {
        label: 'View',
        icon: 'i-heroicons-eye-solid',
        to: `/dashboard/scholarships/${row.id}`
    }
]
</script>