<script setup lang="ts">
const model = ref(false)
const { status, signOut, data } = useAuth()
const isAuthenticated = computed(() => status.value === 'authenticated')

const profile = computed(() => data.value?.user)

const handleSignOut = () => {
  signOut({
    redirect: true,
    callbackUrl: '/'
  })
}
</script>
<template>
  <img :src="profile?.image" alt="asdasd">
  <p-dropdown v-if="isAuthenticated" no-caret placement="bottom-end">
    <template #activator="{ open }">
      <p-button variant="ghost" size="sm" @click="open" class="flex flex-row items-center gap-2 h-fit"
        :class="{ 'hidden': model }">
        <p-avatar :src="profile?.image" :name="profile?.name" :alt="profile?.name" />
        <div class="text-left flex flex-col">
          <p-text variant="formlabel" v-text="profile?.name"></p-text>
          <p-caption class="text-alpha-black-50">Super Admin</p-caption>
        </div>
      </p-button>
    </template>
    <p-dropdown-item href="/internal/dashboard" class="flex flex-row gap-2 items-center"><pi-home-16 /> Internal
      Dashboard</p-dropdown-item>
    <p-dropdown-item href="/class" class="flex flex-row gap-2 items-center"><pi-list-view-16 /> Daftar Kelas </p-dropdown-item>
    <p-dropdown-item @click="handleSignOut"
      class="flex flex-row gap-2 items-center text-danger"><pi-sign-out-16 />Logout</p-dropdown-item>
  </p-dropdown>
</template>
<style lang="scss" scoped></style>
