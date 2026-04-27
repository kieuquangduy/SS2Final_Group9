<template>
  <div class="sticky top-0 right-0 flex items-center p-2 h-12 bg-info-300 rounded-b-lg shadow-xl md:mr-2 z-99">
    <UButton
      color="info"
      class="relative h-full w-10 cursor-pointer overflow-hidden"
      :icon="sidebarOpen ? 'i-lucide-panel-right-open' : 'i-lucide-panel-left-open'"
      @click="toggleSidebarOpen"
    >
      <div class="absolute hidden md:block -bottom-2 -right-2 size-6 bg-white rounded-lg">
        <p class="text-black mr-1">
          k
        </p>
      </div>
    </UButton>
    <UInput
      color="neutral"
      class="ml-4 h-full w-50 md:w-70"
      placeholder="Tìm Kiếm..."
      icon="i-lucide-search"
      type="search"
      :ui="{ base: 'h-full' }"
    />
    <UDropdownMenu :items="profileActions">
      <UButton
        class="ml-auto cursor-pointer"
        color="info"
        variant="ghost"
      >
        <UUser
          :avatar="{ src: curUser?.avatar_url }"
          :ui="{ name: 'text-white', description: 'text-white' }"
        />
      </UButton>
      <template #user-profile>
        <div class="w-50">
          <p class="font-bold text-lg truncate mb-2">
            {{ studentProfile?.full_name ?? curUser?.username }}
          </p>
          <div class="flex gap-4">
            <ProfileRoleBadge
              :role="curUser!.role!"
            />
          </div>
        </div>
      </template>
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useProfileDetail } from '~/composables/profile/useProfileDetail'
import { useUser } from '~/composables/profile/useUser'
import type { Tables } from '~/types/database.types'

const { curUser } = await useUser()

const studentProfile = ref<Tables<'student_detail_view'> | null>()
if (curUser.value?.role === 'STUDENT') {
  const { data } = await useProfileDetail(curUser.value.id)
  studentProfile.value = data.value ?? null
}

const { logOut } = useAuth()

const handleLogOut = async () => {
  await logOut()
}

const profileActions: DropdownMenuItem[][] = [
  [
    {
      slot: 'user-profile' as const,
      type: 'label',
    },
  ],
  [
    {
      label: 'My Profile',
      icon: 'i-heroicons-user-solid',
      onSelect: () => navigateTo(`/dashboard/${curUser.value?.id}`),
    },
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-heroicons-arrow-left-start-on-rectangle',
      onSelect: handleLogOut,
    },
  ],
]

const { sidebarOpen, toggleSidebarOpen } = useSidebar()
</script>
