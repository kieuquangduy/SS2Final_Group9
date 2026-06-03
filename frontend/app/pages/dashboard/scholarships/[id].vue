<template>
  <div class="flex flex-col gap-10">
    <ScholarshipDetailBanner
      :banner="scholarship?.banner_url"
      :icon="scholarship?.icon_url"
      :title="scholarship?.title ?? ''"
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
        </div>
        <ScholarshipDetailForm
          v-if="curUser?.role === 'STUDENT'"
          class="w-40 xl:w-full my-auto"
        />
      </CommonPageSection>
      <CommonPageSection
        class="w-full"
        title="Tổng quan"
        title-icon="i-heroicons-cube-solid"
      >
        <p>{{ scholarship?.description }}</p>
      </CommonPageSection>
    </div>
    <div v-if="scholarship?.organizers">
      <CommonPageSection
        v-if="scholarship.organizers.length"
        title="Organizers"
        title-icon="i-heroicons-users-solid"
        inner-class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-16 gap-y-8 w-full"
      >
        <ScholarshipDetailOrganizerCard
          v-for="organizer in scholarship.organizers"
          :key="organizer!.id!"
          :organizer="organizer"
        />
      </CommonPageSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScholarshipDetail } from '~/composables/scholarship/useScholarshipDetail'
import type { Tables } from '~/types/database.types'

const route = useRoute()

const { data: curUser } = useNuxtData<Tables<'profiles'>>('user-detail')

const { data: scholarship } = await useScholarshipDetail(route.params.id?.toString())

const overviewFields = ref([
  {
    label: 'Deadline',
    value: formatDate(scholarship.value?.deadline),
  },
  {
    label: 'Award',
    value: scholarship.value?.award,
  },
  {
    label: 'Tier',
    value: scholarship.value?.tier,
  },
])
</script>
