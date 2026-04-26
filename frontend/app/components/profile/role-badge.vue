<template>
  <UBadge
    :label="badgeInfo.label"
    :color="badgeInfo.color"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  role: string
}>()

const badgeInfo = computed(() => {
  if (props.role === 'ADMIN') return { label: 'Admin', color: 'info' }
  if (props.role === 'ORGANIZER') return { label: 'Organizer', color: 'success' }
  return { label: 'Student', color: 'neutral' }
})
</script>
