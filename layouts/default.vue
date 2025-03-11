<script setup lang="ts">
</script>

<template>
  <main class="max-w-7xl m-auto flex flex-col px-4">
    <header class="py-4">
      <NuxtLink href="/">
        <NuxtImg src="/assets/logo.png" class="w-24 md:w-32" />
      </NuxtLink>
    </header>
    <slot />
  </main>
</template>
