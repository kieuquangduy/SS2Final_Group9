<template>
    <div>
        <Transition 
            enter-from-class="opacity-0" enter-active-class="transition-opacity duration-300 ease-out"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300 ease-in"
            leave-to-class="opacity-0">
            <div v-if="isOpen" class="fixed inset-0 size-full z-50 flex justify-center items-center">
                <CommonPageSection class="h-5/6 mt-10 z-51 w-100 md:ml-20 lg:w-150 xl:w-200" title-icon="i-heroicons-user-solid" title="Register Information" inner-class="overflow-y-auto items-start">
                    <template #titleTrailing>
                        <UButton icon="i-heroicons-x-mark-solid" color="info" variant="ghost" class="ml-auto cursor-pointer" :ui="{base: 'p-0', leadingIcon: 'bg-white size-10'}" @click="() => {isOpen = false}" />
                    </template>
                    <UForm :state="formState" class="flex flex-col gap-8 w-full" @submit="handleSubmit">
                        <div v-for="section in formSections" :key="section.title" class="w-full flex flex-col">
                            <h3 class="text-info font-bold text-lg mb-4">{{ section.title }}</h3>
                            <div class="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-4 w-full">
                            <UFormField v-for="field in section.fields" :key="field.label" :label="field.label" class="w-full">
                                <UInput v-model="formState[section.key][field.key]" class="w-full" />
                            </UFormField>
                            </div>
                        </div>
                        <UButton label="Submit" class="w-max ml-auto cursor-pointer" color="info" size="xl" type="submit" />
                    </UForm>
                </CommonPageSection>
                <div class="absolute bg-black/60 size-full inset-0 bg-black-60" @click="() => {isOpen = false}" />
            </div>
        </Transition>
        <UButton class="justify-center cursor-pointer h-10 w-full" color="info" label="Register" @click="handleOpen" />
    </div>
</template>
<script setup lang="ts">
import { useScholarshipApply } from '~/composables/scholarship/useScholarshipApply';

const route = useRoute()
const toast = useToast()

const { isLoading, isUnique, scholarshipApply } = await useScholarshipApply(route.params.id!.toString())

const isOpen = ref<boolean>(false)
const handleOpen = () => {
    if (!isUnique.data.value) {
        isOpen.value = false
        toastNotUnique()
        return
    }
    isOpen.value = !isOpen.value   
}

const handleSubmit = async () => {
    if (!isUnique) {
        return
    }
    await scholarshipApply(formState)
    isOpen.value = false
}

const toastNotUnique = () => {
    toast.add({
        title: 'Account already applied for this scholarship',
        description: 'Contact admin for further information!',
        color: 'error'
    })
}

const formState = reactive({
    study_info: {
        gpa: '',
        accumulated_credits: '',
    },
    extra_curricular: {
        club_activity: '',
        time_active: '',
        role: '',
    },
    family_backgr_info: {
        father_job: '',
        mother_job: '',
        avg_income: ''
    }
})

const formSections = ref([
    {
        title: 'Study Information',
        key: 'study_info',
        fields: [
            {
                label: 'GPA',
                key: 'gpa',
            },
            {
                label: 'Accumulated Credits',
                key: 'accumulated_credits',
            }
        ]
    },
    {
        title: 'Extra Curricular',
        key: 'extra_curricular',
        fields: [
            {
                label: 'Club',
                key: 'club_activity',
            },
            {
                label: 'Time Active',
                key: 'time_active',
            },
            {
                label: 'Role',
                key: 'role',
            },
        ]
    },
    {
        title: 'Family Background',
        key: 'family_backgr_info',
        fields: [
            {
                label: `Father's Occupation`,
                key: 'father_job',
            },
            {
                label: `Mother's Occupation`,
                key: 'mother_job',
            },
            {
                label: 'Average Income',
                key: 'avg_income',
            },
        ]
    },
])
</script>