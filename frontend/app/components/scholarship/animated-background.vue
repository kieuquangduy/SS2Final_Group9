<template>
  <div class="w-full rounded-lg shadow-xl relative overflow-hidden bg-info-300 flex justify-center items-center h-100">
    <div class="absolute size-full -inset-0 animate-background-pan select-none">
      <div
        v-for="row in 5"
        :key="row"
        class="flex gap-[124px]"
        :class="row % 2 != 0 && 'ml-[96px] bg-red-0'"
      >
        <span
          v-for="icon in 10"
          :key="icon"
          class="text-[96px] text-info-200"
          :class="icon % 2 != 0 && 'rotate-45'"
        > + </span>
      </div>
    </div>
    <div class="bg-white/80 rounded-lg z-2 px-10 md:px-20 py-10 flex flex-col items-center gap-4 font-bold">
      <h1 class="text-4xl md:text-5xl text-info ">
        XÉT HỌC BỔNG
      </h1>
      <UBadge
        class="text-lg"
        color="neutral"
        label="Kỳ 1, Năm học 2025 - 2026"
        variant="subtle"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes diagonal-pan {
    0% {
        transform: translate(-380px, -288px)
    }
    100% {
        transform: translate(0, 0);
    }
}

.animate-background-pan {
    animation: diagonal-pan 7s linear infinite
}
</style>
