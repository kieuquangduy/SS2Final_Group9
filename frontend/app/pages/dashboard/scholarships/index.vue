<template>
  <div class="flex flex-col gap-10">
    <div class="relative flex justify-center">
      <ScholarshipAnimatedBackground />
    </div>
    <CommonPageSection v-if="scholarships?.length" inner-class="flex flex-col gap-8 px-6">
      <ScholarshipCard v-for="scholarship in scholarships" :key="scholarship.id" :scholarship="scholarship" />
    </CommonPageSection>
    <CommonPageEmpty v-else />
  </div>
</template>

<script setup lang="ts">
import { useScholarshipList } from '~/composables/scholarship/useScholarshipList';

const { data: scholarships } = await useScholarshipList()
</script>
