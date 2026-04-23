<template>
    <div class="flex flex-col gap-10">
        <CommonPageSection title="Manage Scholarships">
            <UButton class="ml-auto cursor-pointer" leading-icon="i-heroicons-plus-circle-solid"
                label="Create Scholarship" @click="() => { createScholarshipOpen = true }" />
            <CommonPageModal v-model:is-open="createScholarshipOpen" title="Scholarship Information" inner-class="flex-col justify-center gap-8">
                <UForm class="flex flex-col gap-6 w-full lg:px-20" :state="createScholarshipPayloadState"
                    :schema="schema" @submit="handleCreateProfile">
                    <UFormField label="Title" name="title" :ui="{ label: 'text-lg' }" required>
                        <UInput v-model="createScholarshipPayloadState.title" class="w-full"/>
                    </UFormField>
                    <UFormField label="Description" name="description" :ui="{ label: 'text-lg' }">
                        <UTextarea v-model="createScholarshipPayloadState.description" class="w-full"
                           autoresize />
                    </UFormField>
                    <UFormField label="Tier" name="tier" :ui="{ label: 'text-lg' }" required>
                        <USelect :items="scholarship_tier" v-model="createScholarshipPayloadState.tier" class="w-full"
                           autoresize />
                    </UFormField>
                    <UButton class="cursor-pointer" label="Create Scholarship"
                        :ui="{ label: ['mx-auto text-lg', isCreating && 'hidden'], leadingIcon: 'mx-auto' }"
                        :loading="isCreating" type="submit" />
                </UForm>
            </CommonPageModal>
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