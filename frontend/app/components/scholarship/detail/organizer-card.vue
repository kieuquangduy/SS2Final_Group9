<template>
  <div v-if="organizer" class="w-full h-full p-2 flex gap-2 shadow-xl rounded-lg items-center justify-center bg-info-100">
    <div class="shrink-0">
      <NuxtImg
        :src="organizer.avatar_url || ''"
        alt="Scholarship Organizer"
        class="w-full h-36 object-cover rounded-lg"
      />
    </div>
    <div class="flex flex-col w-full h-full">
      <div>
        <ProfileRoleBadge
          v-if="organizer.host"
          class="mb-1"
          role="HOST"
          color="primary"
        />
      </div>
      <h3>{{ organizer.username }}</h3>
      <div class="mt-auto flex flex-col">
        <UButton
          icon="i-heroicons-eye-solid"
          color="info"
          label="View"
          class="justify-center"
          :to="`/dashboard/${organizer?.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types'

defineProps<{
  organizer: Tables<'organizer_list_view'> & { host: boolean } | null
}>()
</script>
