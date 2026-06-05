<template>
  <div class="flex flex-col lg:flex-row-reverse gap-10 h-full">
    <div class="w-full lg:w-80 lg:sticky shrink-0 top-16 self-start">
      <CommonPageSection inner-class="flex-col gap-4 w-full">
        <div class="relative">
          <NuxtImg
            :src="curUser?.avatar_url"
            class="size-40 rounded-full object-cover shadow-xl border-white border-4"
            format="webp"
            quality="70"
          />
        </div>
        <div class="flex flex-col items-center gap-2">
          <h3 class="text-2xl font-bold">
            {{ profile!.full_name }}
          </h3>
          <ProfileRoleBadge :role="profile!.role!" />
        </div>
      </CommonPageSection>
    </div>
    <UForm
      :state="formState"
      :schema="schema"
      class="w-full flex flex-col gap-10"
      @submit="onSubmit"
    >
      <CommonPageSection
        title="Academic Information"
        title-icon="i-heroicons-book-open-solid"
        inner-class="grid grid-cols-2 gap-4"
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
      </CommonPageSection>
      <CommonPageSection
        title="Extracurricular Information"
        title-icon="i-heroicons-cube-solid"
        inner-class="flex flex-col gap-4"
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
      </CommonPageSection>

      <CommonPageSection
        title="Background Information"
        title-icon="i-heroicons-home-solid"
        inner-class="grid grid-cols-2 lg:grid-cols-3 gap-4"
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
      </CommonPageSection>
      <div class="flex justify-end gap-4">
        <UButton
          color="neutral"
          :to="`/dashboard/${curUser!.id}`"
          size="lg"
          label="Cancel"
        />
        <UButton
          type="submit"
          color="info"
          class="cursor-pointer"
          icon="i-heroicons-check"
          size="lg"
          label="Save"
          :loading="isLoading"
          :ui="{ label: ['mx-auto text-lg', isLoading && 'hidden'], leadingIcon: 'mx-auto' }"
        />
      </div>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import { useProfileDetail } from '~/composables/profile/useProfileDetail'
import type { Tables } from '~/types/database.types'
import { useApplicationProfile } from '~/composables/application/useApplicationProfile'

const route = useRoute()
const id = route.params.id as string

const { data: profile } = await useProfileDetail(id)
const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

const { isLoading, updateProfile } = await useApplicationProfile()

const formState = reactive({
  gpa: profile.value?.academic_info?.gpa ?? 0,
  accumulated_credits: profile.value?.academic_info?.accumulated_credits ?? 0,

  extracurricular_info: profile.value?.extracurricular_info ?? [],

  father_occupation: profile.value?.background_info?.father_occupation ?? '',
  mother_occupation: profile.value?.background_info?.mother_occupation ?? '',
  family_average_income: profile.value?.background_info?.family_average_income ?? 0,
})

const schema = z.object({
  // Academic Info
  gpa: z.number('GPA is required!')
    .min(0, 'GPA cannot be less than 0')
    .max(10, 'GPA cannot exceed 10'), // Assuming a 0-10 scale based on your previous UI

  accumulated_credits: z.number('Credits are required!')
    .int('Credits must be a whole number')
    .nonnegative('Credits cannot be negative'),

  father_occupation: z.string()
    .min(2, 'Father\'s occupation must be at least 2 characters')
    .max(50, 'Keep it under 50 characters'),

  mother_occupation: z.string()
    .min(2, 'Mother\'s occupation must be at least 2 characters')
    .max(50, 'Keep it under 50 characters'),

  family_average_income: z.number('Must be a valid number')
    .nonnegative('Income cannot be negative'),
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

const onSubmit = async () => {
  updateProfile(formState)
}
</script>
