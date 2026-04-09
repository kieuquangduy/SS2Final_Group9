<template>
    <div class="h-3000">
        heloooo
        {{ user }}
    </div>
</template>
<script setup lang="ts">
const supabase = useSupabaseClient()
const { data : { user }} = await supabase.auth.getUser()
</script>