<template>
  <div class="flex flex-col gap-10">
    <ScholarshipDetailBanner
      :banner="scholarship?.banner_url"
      :title="scholarship?.title"
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
