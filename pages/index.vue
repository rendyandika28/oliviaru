<script setup lang="ts">
definePageMeta({
  layout: false
})
useHead({
  title: 'Home'
})
</script>
<template>
  <section>
    <div class="fixed inset-0 size-full overflow-hidden -z-20">
      <video autoplay muted loop class="absolute top-[50%] left-[50%] min-w-full min-h-full size-auto object-cover"
        style="transform: translate(-50%, -50%);">
        <source src="/assets/background.mp4" type="video/mp4">
      </video>
    </div>
    <div class="bg-base-black/60 absolute inset-0 -z-10 size-full"></div>
    <main class="max-w-7xl m-auto z-1 h-dvh flex flex-col max-lg:px-4">
      <header class="py-4">
        <NuxtImg src="/assets/logo.png" class="w-24 md:w-32 brightness-0 invert" />
      </header>

      <div class="flex-1 grid place-items-center -mt-20">
        <div class="flex flex-col items-center gap-2 text-center text-base-white">
          <p-heading class="md:!text-7xl" style="font-family: 'Playfair Display', serif">
            Oliviaru Baking Studio
          </p-heading>
          <p-text>Mulai perjalanan baking Anda hari ini, daftar sekarang
            dan pelajari semua kue kesukaanmu!</p-text>
          <p-button href="/auth/login" variant="outline" class="w-fit mt-8 !text-base-white">Mulai Belajar
            Sekarang</p-button>
        </div>
      </div>
    </main>
  </section>
</template>
<style lang="scss">
body {
  overscroll-behavior: none;
}
</style>
