<template>
    <div class="h-3000">
        heloooo
        {{ curUser }}
        {{ user }}
    </div>
</template>
<script setup lang="ts">
const { curUser } = await useUser()
const user = useSupabaseUser()
</script>