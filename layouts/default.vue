<script setup lang="ts">
const { application: { title } } = useAppConfig()
useHead({
  titleTemplate: titleChunk =>
    titleChunk ? `${titleChunk} • ${title}` : title,
})
const { status } = useAuth()
const isAuthenticated = computed(() => status.value === 'authenticated')
</script>

<template>
  <main class="max-w-7xl m-auto flex flex-col px-4">
    <div class="flex flex-row justify-between items-center">
      <header class="py-4">
        <NuxtLink to="/">
          <NuxtImg src="/assets/logo.png" class="w-24 md:w-32" />
        </NuxtLink>
      </header>
      <Profile v-if="isAuthenticated"/>
      <p-button v-else href="/auth/login" color="primary"><pi-sign-in-16 />Login</p-button>
    </div>
    <slot />
    <p-divider class="my-8" />
    <footer class="flex flex-col md:flex-row items-start md:items-end pb-16 max-sm:gap-8">
      <div class="flex flex-col gap-8 flex-1">
        <NuxtImg src="/assets/logo.png" class="w-24 md:w-32" />
        <p-text variant="subheading2">
          Perumahan Dalem Maguwo Asri no.C1, Demangan, Maguwoharjo, Kec. Depok, Kabupaten Sleman, Daerah Istimewa
          Yogyakarta 55282
        </p-text>
        <div class="flex flex-row gap-4">
          <NuxtLink href="https://www.instagram.com/dapur_oliviaru/" target="_blank">
            <p-button variant="ghost" icon><pi-instagram-16 /></p-button>
          </NuxtLink>
          <NuxtLink href="https://www.facebook.com/profile.php?id=100054398762969&locale=sr_RS&_rdr" target="_blank">
            <p-button variant="ghost" icon><pi-facebook-16 /></p-button>
          </NuxtLink>
        </div>
      </div>
      <small class="text-gray-50 flex-1 md:text-right">&copy;2025 Oliviaru, All rights reserved.</small>
    </footer>
  </main>
</template>
