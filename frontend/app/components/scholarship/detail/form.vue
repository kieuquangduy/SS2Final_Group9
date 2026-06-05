<template>
  <div>
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 size-full z-50 flex justify-center items-center"
      >
        <CommonPageSection
          class="h-5/6 mt-10 z-51 w-100 md:ml-20 lg:w-150 xl:w-200"
          title-icon="i-heroicons-user-solid"
          title="Applicant Information"
          inner-class="overflow-y-auto items-start"
        >
          <template #titleTrailing>
            <UButton
              icon="i-heroicons-x-mark-solid"
              color="info"
              variant="ghost"
              class="ml-auto cursor-pointer"
              :ui="{ base: 'p-0', leadingIcon: 'bg-white size-10' }"
              @click="() => { isOpen = false }"
            />
          </template>
          <UForm
            :state="formState"
            class="flex flex-col gap-8 w-full"
            @submit="handleSubmit"
          >
            <h2 class="text-info text-2xl">
              Academic Information
            </h2>
            <div
              class="grid grid-cols-2 gap-4"
            >
              <UFormField
                label="GPA"
                name="gpa"
                description="0 - 10 range"
                class="w-full"
              >
                <UInputNumber
                  v-model="formState.gpa"
                  class="w-full"
                  :min="0"
                  :max="10"
                />
              </UFormField>
              <UFormField
                label="Accumulated Credits"
                name="accumulated_credits"
                description="Across all years"
                class="w-full"
              >
                <UInputNumber
                  v-model="formState.accumulated_credits"
                  class="w-full"
                  :min="0"
                />
              </UFormField>
            </div>
            <h2 class="text-info text-2xl">
              Extracurricular Information
            </h2>
            <div
              class="flex flex-col gap-4"
            >
              <p class="text-muted self-start">
                Clubs / Volunteering / Events you have joined...
              </p>
              <div
                v-for="(info, idx) in formState?.extracurricular_info"
                :key="idx"
                class="flex gap-4 w-full border-t pt-2"
              >
                <UFormField
                  label="Name"
                  class="w-full"
                >
                  <UInput
                    v-model="info.club_name!"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="Time Active"
                  class="w-full"
                >
                  <UInput
                    v-model="info.time_active!"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  label="Role"
                  class="w-full"
                >
                  <UInput
                    v-model="info.role!"
                    class="w-full"
                  />
                </UFormField>
                <UButton
                  color="error"
                  leading-icon="i-heroicons-x-mark"
                  class="cursor-pointer"
                  @click="removeContactInfo(idx)"
                />
              </div>
              <div
                class="flex w-full justify-center items-center border-2 border-dashed text-dimmed col-span-full cursor-pointer py-2 bg-gray-100 rounded-lg"
                @click="addContactInfo"
              >
                <UIcon name="i-heroicons-plus" />
                <p class="pointer-events-none ml-2">
                  Add Extracurricular Info
                </p>
              </div>
            </div>

            <h2 class="text-info text-2xl">
              Background Information
            </h2>
            <div
              class="grid grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <UFormField
                label="Father's Occupation"
                name="father_occupation"
                class="w-full"
              >
                <UInput
                  v-model="formState.father_occupation"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Mother's Occupation"
                name="father_occupation"
                class="w-full"
              >
                <UInput
                  v-model="formState.mother_occupation"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Family Average Income"
                name="family_average_income"
                class="w-full"
              >
                <UInput
                  v-model="formState.family_average_income"
                  class="w-full"
                />
              </UFormField>
            </div>

            <h2 class="text-info text-2xl">
              Awards, Certifications & Extra"
            </h2>
            <div
              class="flex flex-col gap-4"
            >
              <div
                v-for="(info, idx) in selectedFiles"
                :key="idx"
                class="flex gap-4 w-full border-t pt-2"
              >
                <UFormField
                  label="Name"
                  class="w-full h-16"
                >
                  <UInput
                    v-model="info.fileName!"
                    class="w-full h-full"
                    placeholder="IELTs..."
                  />
                </UFormField>
                <UFileUpload
                  v-if="!info.fileUrl"
                  v-model="info.file"
                  class="h-16"
                  :ui="{
                    base: 'h-full',
                    description: 'text-xs',
                  }"
                  highlight
                  color="info"
                  description="PNG, JPG, DOC, DOCX, PDF"
                />
                <UButton
                  v-else
                  label="View File"
                  class="h-16"
                  :to="info.fileUrl"
                  target="_blank"
                />
                <UButton
                  color="error"
                  leading-icon="i-heroicons-x-mark"
                  class="cursor-pointer"
                  @click="removeFile(idx)"
                />
              </div>
              <div
                class="flex w-full justify-center items-center border-2 border-dashed text-dimmed col-span-full cursor-pointer py-2 bg-gray-100 rounded-lg"
                @click="addFile"
              >
                <UIcon name="i-heroicons-plus" />
                <p class="pointer-events-none ml-2">
                  Add File
                </p>
              </div>
            </div>
            <UButton
              label="Submit"
              class="w-max ml-auto cursor-pointer"
              color="info"
              size="xl"
              :ui="{ label: ['mx-auto text-lg', isLoading && 'hidden'], leadingIcon: 'mx-auto' }"
              :loading="isLoading"
              type="submit"
            />
          </UForm>
        </CommonPageSection>
        <div
          class="absolute bg-black/60 size-full inset-0 bg-black-60"
          @click="() => { isOpen = false }"
        />
      </div>
    </Transition>
    <UButton
      class="justify-center cursor-pointer h-10 w-full"
      color="info"
      :label="canApply ? 'Apply' : 'Already Applied'"
      :disabled="!canApply"
      @click="handleOpen"
    />
  </div>
</template>

<script setup lang="ts">
import { useApplicationDocument } from '~/composables/application/useApplicationDocument'
import { useProfileDetail } from '~/composables/profile/useProfileDetail'
import { useScholarshipApply } from '~/composables/scholarship/useScholarshipApply'
import type { Tables } from '~/types/database.types'

const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')
const { data: profile } = await useProfileDetail(curUser!.value!.id)

const toast = useToast()

const props = defineProps<{
  id: string
}>()

const { isLoading, canApply, scholarshipApply } = await useScholarshipApply(props.id)
const { documents } = await useApplicationDocument({ studentId: curUser.value?.id })

const isOpen = ref<boolean>(false)
const handleOpen = () => {
  if (!canApply) {
    isOpen.value = false
    toastNotUnique()
    return
  }
  isOpen.value = !isOpen.value
}

const handleSubmit = async () => {
  if (!canApply) {
    return
  }
  await scholarshipApply(formState, selectedFiles.value)
  isOpen.value = false
}

const toastNotUnique = () => {
  toast.add({
    title: 'Account already applied for this scholarship',
    description: 'Contact admin for further information!',
    color: 'error',
  })
}

const formState = reactive({
  gpa: profile.value?.academic_info?.gpa ?? 0,
  accumulated_credits: profile.value?.academic_info?.accumulated_credits ?? 0,

  extracurricular_info: profile.value?.extracurricular_info ?? [],

  father_occupation: profile.value?.background_info?.father_occupation ?? '',
  mother_occupation: profile.value?.background_info?.mother_occupation ?? '',
  family_average_income: profile.value?.background_info?.family_average_income ?? 0,
})

const addContactInfo = () => {
  formState.extracurricular_info.push({
    club_name: '',
    time_active: '',
    role: '',
  })
}
const removeContactInfo = (idx: number) => {
  formState.extracurricular_info.splice(idx, 1)
}

const selectedFiles = ref<{ fileName: string | null, file: File | null, fileUrl: string | null, fileId: number | null }[]>(
  documents.value?.map(e => ({
    fileName: e.display_name,
    file: null,
    fileUrl: e.file_url,
    fileId: e.id,
  })) || [],
)
const addFile = () => {
  selectedFiles.value.push({
    fileName: '',
    file: null,
    fileUrl: null,
    fileId: null,
  })
}
const removeFile = (idx: number) => {
  selectedFiles.value.splice(idx, 1)
}
</script>
