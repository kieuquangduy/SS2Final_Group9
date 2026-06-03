<template>
  <div class="w-full h-full p-2 flex shadow-xl rounded-lg items-center justify-center bg-info-100">
    <div
      v-if="!isLoading"
      class="flex items-center gap-2 w-full h-full"
    >
      <div class="shrink-0">
        <NuxtImg
          :src="data?.avatar_url || ''"
          alt="Scholarship Organizer"
          class="w-full h-30 object-cover rounded-lg"
        />
      </div>
      <div class="flex flex-col w-full h-full">
        <h3>{{ data?.username }}</h3>
        <div class="mt-auto flex flex-col">
          <UButton
            icon="i-heroicons-eye-solid"
            color="info"
            label="View"
            class="justify-center"
          />
        </div>
      </div>
    </div>
    <UIcon
      v-else
      name="i-heroicons-arrow-path"
      class="text-3xl animate-spin text-gray-500"
    />
  </div>
</template>

<script setup lang="ts">
import { useOrganizerDetail } from '~/composables/organizer/useOrganizerDetail'

const props = defineProps<{
  organizerId: string
}>()

const { data, isLoading, fetchOrganizerDetail } = await useOrganizerDetail()
await fetchOrganizerDetail(props.organizerId)
</script>
