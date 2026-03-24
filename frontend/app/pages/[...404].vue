<template>
    <div class="w-full h-screen relative flex flex-col gap-6 items-center justify-center">
        <video preload="auto" :src="VIDEO_404" autoplay loop muted class="object-contain w-full h-60 md:h-100" />
        <p class="text-xl md:text-4xl text-info-500 font-bold">Trang bạn đang cố truy cập không tồn tại!</p>
        <UButton class="h-10 px-10 py-6" color="info" label="Quay về" to="/" :ui="{ label: 'mx-auto text-lg' }" />
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout: false
})

const VIDEO_404 = '404.mp4'
</script>