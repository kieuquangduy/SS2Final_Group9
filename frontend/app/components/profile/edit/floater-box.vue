<template>
  <div>
    <CommonPageSection inner-class="flex-col gap-4 w-full">
      <div class="relative">
        <NuxtImg
          v-if="!tempUrl"
          :src="orgAvt"
          class="size-40 rounded-full object-cover shadow-xl border-white border-4"
          format="webp"
          quality="70"
        />
        <img
          v-else
          :src="tempUrl"
          class="size-40 rounded-full object-cover shadow-xl border-white border-4"
        >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileSelect"
        >
        <button
          class="absolute size-8 bottom-2 right-2 bg-info rounded-full p-2 z-3 cursor-pointer peer"
          @click="openFilePicker"
        >
          <UIcon
            name="i-heroicons-photo-solid"
            class="bg-white size-full"
          />
        </button>
        <button
          class="size-40 p-0 m-0 absolute inset-0 bg-black/60 rounded-full z-2 border-white border-4 text-white font-bold text-center opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-opacity cursor-pointer"
          @click="openFilePicker"
        >
          Upload Image
        </button>
      </div>
      <div class="flex flex-col items-center gap-2">
        <h3 class="text-2xl font-bold">
          {{ name }}
        </h3>
        <ProfileRoleBadge :role="role" />
      </div>
    </CommonPageSection>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name?: string | null
  role: string
  orgAvt: string
}>()

const imageFile = defineModel<{
  isChanged: boolean
  file?: File | null
}>({
  default: () => ({ isChanged: false, file: null }),
})

const fileInput = ref<HTMLInputElement | null>(null)
const openFilePicker = () => {
  fileInput.value?.click()
}

const tempUrl = ref<string>()

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0]
    tempUrl.value = URL.createObjectURL(selectedFile)
    imageFile.value = {
      isChanged: true,
      file: target.files[0],
    }
  }
}
</script>
