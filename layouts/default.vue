<script setup lang="ts">
const model = ref(false)
const { status, signOut } = useAuth()
const isAuthenticated = computed(() => status.value === 'authenticated')
const { application: { title } } = useAppConfig()

useHead({
  titleTemplate: titleChunk =>
    titleChunk ? `${titleChunk} • ${title}` : title,
})

const handleSignOut = () => {
  signOut({
    redirect: true,
    callbackUrl: '/'
  })
}
</script>

<template>
  <main class="max-w-7xl m-auto flex flex-col px-4">
    <div class="flex flex-row justify-between items-center">
      <header class="py-4">
        <NuxtLink to="/">
          <NuxtImg src="/assets/logo.png" class="w-24 md:w-32" />
        </NuxtLink>
      </header>
      <Profile />
    </div>
    <slot />
  </main>
</template>
