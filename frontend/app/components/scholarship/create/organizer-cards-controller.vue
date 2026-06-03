<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-16 gap-y-8 w-full">
    <div
      v-for="organizer in selected"
      :key="organizer.organizer.id!"
      class="w-full h-full p-2 flex gap-2 shadow-xl rounded-lg items-center justify-center bg-info-100"
    >
      <div class="shrink-0">
        <NuxtImg
          :src="organizer.organizer.avatar_url || ''"
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
        <h3>{{ organizer.organizer.username }}</h3>
        <div class="mt-auto flex flex-col gap-2">
          <UButton
            icon="i-heroicons-eye-solid"
            color="info"
            label="View"
            class="justify-center"
            :to="`/dashboard/${organizer.organizer.id}`"
          />
          <UButton
            v-if="!organizer.host "
            icon="i-heroicons-x-circle-solid"
            color="error"
            label="Remove"
            class="justify-center"
            @click="handleRemoveOrganizer(organizer.organizer.id!)"
          />
        </div>
      </div>
    </div>
    <div
      class="flex w-full h-full justify-center items-center border-2 border-dashed text-dimmed cursor-pointer py-2 bg-gray-100 rounded-lg"
      @click="(() => { modalsOpen = true })"
    >
      <UIcon name="i-heroicons-plus" />
      <p class="pointer-events-none ml-2">
        Add Organizer Info
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types'

const selected = defineModel<{ organizer: Tables<'organizer_list_view'>, host: boolean }[]>('selected', {
  default: () => [],
})
const modalsOpen = defineModel<boolean>('addOrganizerOpen', {
  default: () => false,
})

const handleRemoveOrganizer = (organizerId: string) => {
  selected.value = selected.value!.filter(org => org.organizer.id !== organizerId)
}
</script>
