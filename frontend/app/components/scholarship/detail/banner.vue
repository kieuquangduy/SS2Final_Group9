<template>
  <div class="relative flex justify-center mb-50 lg:mb-10">
    <NuxtImg
      v-if="banner"
      preload
      format="webp"
      :src="banner"
      class="rounded-lg shadow-xl object-cover h-100 w-full"
    />
    <div
      v-else
      class="h-20"
    />
    <div class="absolute items-center -bottom-60 lg:-bottom-10 flex flex-col lg:flex-row gap-6 lg:gap-26 h-80 lg:h-30">
      <div
        v-if="icon"
        class="lg:h-full h-30 w-30 relative"
      >
        <NuxtImg
          format="webp"
          :src="icon"
          class="size-full rounded-lg shadow-xl object-cover"
        />
      </div>
      <div class="rounded-lg shadow-xl bg-white px-8 md:px-16 py-8 z-3 lg:h-full items-center flex">
        <h1 class="text-info text-2xl md:text-4xl font-bold">
          {{ title }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tables } from '~/types/database.types'

defineProps<{
  banner?: Tables<'scholarships'>['banner_url']
  icon?: Tables<'scholarships'>['icon_url']
  title?: Tables<'scholarships'>['title']
}>()
</script>
