<template>
  <UBadge
    :label="badgeInfo.label"
    :color="badgeInfo.color"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  status: string
}>()

const badgeInfo = computed(() => {
  if (props.status === 'REVIEWING') return { label: 'Reviewing', color: 'warning' }
  if (props.status === 'PENDING') return { label: 'Pending', color: 'warning' }
  if (props.status === 'DENIED') return { label: 'Denied', color: 'error' }
  if (props.status === 'APPROVED') return { label: 'Approved', color: 'success' }
  if (props.status === 'CONTACT') return { label: 'Contact', color: 'info' }
  return { label: 'Applied', color: 'info' }
})
</script>
