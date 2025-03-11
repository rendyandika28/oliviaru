<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
<template>
  <div class="grid place-items-center h-dvh">
    <div class="max-w-[30%] flex flex-col gap-2">
      <NuxtImg src="/assets/logo.png" class="w-24 md:w-32 m-auto" />

      <p-text class="font-bold" variant="h5">Login 👋</p-text>
      <p-text>Masuk sekarang dan mulai perjalanan Anda sebagai baker!</p-text>

      <div class="my-4 flex flex-col mb-20 gap-2">
        <p-button><pi-google-16 /> Masuk dengan Google</p-button>
      </div>
      <small class="text-gray-50 text-center">&copy;2025 Oliviaru, All rights reserved.</small>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
