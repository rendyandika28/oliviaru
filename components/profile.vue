<script setup lang="ts">
const model = ref(false)
const { signOut } = useAuth()
const { user } = storeToRefs(useAuthStore())
const userRole = computed(() => user.value?.role.replace('_', ' '))

const handleSignOut = () => {
  signOut({
    redirect: true,
    callbackUrl: '/'
  })
}
</script>
<template>
  <p-dropdown no-caret placement="bottom-end">
    <template #activator="{ open }">
      <p-button variant="ghost" size="sm" @click="open" class="flex flex-row items-center gap-2 h-fit"
        :class="{ 'hidden': model }">
        <img :src="user?.image" :alt="user?.name" referrerPolicy="no-referrer" class="size-10 rounded-full" />
        <div class="text-left flex flex-col">
          <p-text variant="formlabel">{{ user?.name }}</p-text>
          <p-caption class="text-alpha-black-50">{{ userRole }}</p-caption>
        </div>
      </p-button>
    </template>
    <p-dropdown-item v-if="user?.role === 'SUPER_ADMIN'">
      <NuxtLink class="flex flex-row gap-2 items-center" to="/internal/dashboard"><pi-home-16 />Internal Dashboard</NuxtLink>
    </p-dropdown-item>
    <p-dropdown-item>
      <NuxtLink class="flex flex-row gap-2 items-center" to="/class"><pi-list-view-16 /> Daftar Semua Kelas</NuxtLink>
    </p-dropdown-item>
    <p-divider class="my-0"/>
    <p-dropdown-item v-if="user?.role === 'USER'">
      <NuxtLink class="flex flex-row gap-2 items-center" to="/class/me"><pi-video-camera-16 /> Kelas Saya</NuxtLink>
    </p-dropdown-item>
    <p-dropdown-item @click="handleSignOut"
      class="flex flex-row gap-2 items-center text-danger"><pi-sign-out-16 />Logout</p-dropdown-item>
  </p-dropdown>
</template>
<style lang="scss" scoped></style>
