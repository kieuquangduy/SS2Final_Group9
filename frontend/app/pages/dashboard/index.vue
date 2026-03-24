<template>
    <div class="h-3000">
logged in
<UButton label="logout" @click="async () => {await logOut}" />
    </div>
</template>
<script setup lang="ts">
const {logOut} = useAuth()
</script>