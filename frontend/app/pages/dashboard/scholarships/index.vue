<template>
  <div class="flex flex-col gap-10">
    <ScholarshipAnimatedBackground />
    <div class="sticky z-2 top-14 rounded-lg shadow-xl flex bg-white w-max mx-auto">
      <div class="hidden md:flex">
        <UButton
          v-for="option in tierOptions"
          :key="option.label"
          class="w-36 md:w-48 h-16 justify-center md:text-lg cursor-pointer transition-all"
          :class="route.hash === option.hash && 'scale-110'"
          :variant="route.hash === option.hash ? 'solid' : 'ghost'"
          color="info"
          :label="option.label"
          @click="toggleTier(option.hash)"
        />
      </div>
      <UDropdownMenu
        class="md:hidden"
        :items="tierOptions"
      >
        <UButton
          icon="i-heroicons-bars-3"
          :label="route.hash.slice(1).toUpperCase() || 'TIER'"
          color="info"
          variant="solid"
          class="w-48 h-16 rounded-lg font-bold text-xl justify-center"
        />
      </UDropdownMenu>
    </div>
    <CommonPageSection
      v-if="scholarships?.length"
      inner-class="flex flex-col gap-8 px-6"
    >
      <ScholarshipCard
        v-for="scholarship in scholarships"
        :key="scholarship.id!"
        :scholarship="scholarship"
      />
      <CommonTableTrigger
        :on-load="fetchPage"
        :can-load-more="canLoadMore.all"
        :is-loading="isLoading"
      />
    </CommonPageSection>
    <CommonPageEmpty v-else />
  </div>
</template>

<script setup lang="ts">
import { useScholarshipList } from '~/composables/scholarship/useScholarshipList'

const route = useRoute()
const router = useRouter()

const { all, fetchPage, isLoading, canLoadMore, filterByTier } = await useScholarshipList({ limit: 3 })
const scholarships = computed(() => {
  if (route.hash) return filterByTier(all.value, route.hash.slice(1))
  return all.value
})

const tierOptions = computed(() => [
  {
    label: 'Gold',
    hash: '#gold',
    onClick: () => toggleTier('#gold'),
  },
  {
    label: 'Silver',
    hash: '#silver',
    onClick: () => toggleTier('#silver'),
  },
  {
    label: 'Venue',
    hash: '#venue',
    onClick: () => toggleTier('#venue'),
  },
])

const toggleTier = (tier: string) => {
  if (route.hash === tier) router.push({ hash: '' })
  else router.push({ hash: tier })
}
</script>
