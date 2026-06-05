<template>
  <div class="flex flex-col gap-10">
    <ScholarshipDetailBanner
      :banner="application?.scholarship_banner_url"
      :icon="application?.scholarship_icon_url"
      :title="application?.scholarship_title ?? ''"
    />
    <div class="flex gap-10 flex-col xl:flex-row">
      <CommonPageSection
        class="shrink-0 w-full xl:w-50"
        inner-class="flex flex-row xl:flex-col h-full items-start gap-8"
      >
        <div class="grid grid-cols-2 xl:grid-cols-1 gap-4 w-full">
          <div
            v-for="field in overviewFields"
            :key="field.label"
          >
            <p class="font-bold">
              {{ field.label }}:
            </p>
            <p>{{ field.value }}</p>
          </div>
          <div>
            <p class="font-bold">
              Status
            </p>
            <ApplicationStatusBadge :status="application?.status" />
          </div>
        </div>
      </CommonPageSection>
      <CommonPageSection
        class="w-full"
        title="Scholarship Overview"
        title-icon="i-heroicons-cube-solid"
      >
        <p>{{ application?.scholarship_description }}</p>
      </CommonPageSection>
    </div>
    <CommonPageSection
      title="Applicant Overview"
      title-icon="i-heroicons-user-solid"
    >
      <div class="flex flex-wrap gap-y-2">
        <div
          v-for="info in studentOverviewInfo"
          :key="info.label"
          class="w-1/2 grid grid-cols-1 md:grid-cols-[30%_auto]"
        >
          <h3 class="font-bold text-info">
            {{ info.label }}:
          </h3>
          <p>
            {{ info.value }}
          </p>
        </div>
        <div class="flex flex-col md:flex-row md:gap-2">
          <h3 class="font-bold text-info">
            Residence:
          </h3>
          <p>
            {{ application?.applicant_residence_type?.detail }}, {{ application?.applicant_residence_type?.district }}, {{ application?.applicant_residence_type?.province }}
          </p>
        </div>
      </div>
    </CommonPageSection>
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
          :model-value="application?.academic_info?.gpa"
          class="w-full"
          :min="0"
          :max="10"
          disabled
        />
      </UFormField>
      <UFormField
        label="Accumulated Credits"
        name="accumulated_credits"
        description="Across all years"
        class="w-full"
      >
        <UInputNumber
          :model-value="application?.academic_info?.accumulated_credits"
          class="w-full"
          :min="0"
          disabled
        />
      </UFormField>
    </CommonPageSection>
    <CommonPageSection
      title="Extracurricular Information"
      title-icon="i-heroicons-cube-solid"
      inner-class="flex flex-col gap-4"
    >
      <div
        v-for="(info, idx) in application?.extracurricular_info"
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
            disabled
          />
        </UFormField>
        <UFormField
          label="Time Active"
          class="w-full"
        >
          <UInput
            v-model="info.time_active!"
            class="w-full"
            disabled
          />
        </UFormField>
        <UFormField
          label="Role"
          class="w-full"
        >
          <UInput
            v-model="info.role!"
            class="w-full"
            disabled
          />
        </UFormField>
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
          :model-value="application?.background_info?.father_occupation"
          class="w-full"
          disabled
        />
      </UFormField>
      <UFormField
        label="Mother's Occupation"
        name="father_occupation"
        class="w-full"
      >
        <UInput
          :model-value="application?.background_info?.mother_occupation"
          class="w-full"
          disabled
        />
      </UFormField>
      <UFormField
        label="Family Average Income"
        name="family_average_income"
        class="w-full"
      >
        <UInput
          :model-value="application?.background_info?.family_average_income"
          class="w-full"
          disabled
        />
      </UFormField>
    </CommonPageSection>
    <CommonPageSection
      title="Awards, Certifications & Extra"
      title-icon="i-heroicons-trophy-solid"
      inner-class="flex flex-col gap-4"
    >
      <div
        v-for="(info, idx) in documents"
        :key="idx"
        class="flex gap-4 w-full border-t pt-2"
      >
        <UFormField
          label="Name"
          class="w-full h-16"
        >
          <UInput
            v-model="info.display_name!"
            class="w-full h-full"
            disabled
          />
        </UFormField>
        <UButton
          label="View File"
          class="h-16"
          :to="info.file_url"
          target="_blank"
        />
      </div>
    </CommonPageSection>
  </div>
</template>

<script setup lang="ts">
import { useApplicationDetail } from '~/composables/application/useApplicationDetail'
import { useApplicationDocument } from '~/composables/application/useApplicationDocument'
import type { Tables } from '~/types/database.types'

const route = useRoute()

const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

const applicationId = route.params.id?.toString()
const { data: application } = await useApplicationDetail(route.params.id?.toString())
const { documents } = await useApplicationDocument({ applicationId: applicationId })

const overviewFields = ref([
  {
    label: 'Deadline',
    value: formatDate(application.value?.scholarship_deadline),
  },
  {
    label: 'Award',
    value: application.value?.scholarship_award,
  },
  {
    label: 'Tier',
    value: application.value?.scholarship_tier,
  },
])

const studentOverviewInfo = [
  {
    label: 'Full Name',
    value: application.value?.applicant_full_name,
  },
  {
    label: 'Student Code',
    value: application.value?.applicant_student_code,
  },
  {
    label: 'Gender',
    value: formatGender[application.value?.applicant_gender ?? 'OTHER'],
  },
  {
    label: 'Field of Study',
    value: application.value?.applicant_field_of_study,
  },
  {
    label: 'Date of Birth',
    value: formatDate(application.value?.applicant_dob),
  },
  {
    label: 'University',
    value: application.value?.applicant_university,
  },
  {
    label: 'Class',
    value: application.value?.applicant_class,
  },
]
</script>
