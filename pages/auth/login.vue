<script setup lang="ts">
import { toast } from '@privyid/persona/core'

definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

const { application: { title } } = useAppConfig()
useHead({
  title: `Masuk • ${title}`
})

const { query } = useRoute()

const errorMessages = {
  userUnauthorized: 'Masuk terlebih dulu sebelum mengakses kelas',
  newUserPending: 'Akun anda akan didaftarkan terlebih dahulu, silahkan hubungi admin',
  userPending: 'Status akun anda masih PENDING, silahkan hubungi admin',
  multipleLogin: 'Dilarang login menggunakan lebih dari 1 device'
};

const errorMessage = query?.error ? errorMessages[query.error] : null;

if (errorMessage) {
  toast(errorMessage);
}

const { signIn } = useAuth()
</script>
<template>
  <div class="grid place-items-center h-dvh">
    <div class="max-md:px-8 lg:max-w-[30%] flex flex-col gap-2">
      <NuxtImg src="/assets/logo.png" class="w-24 md:w-32 m-auto" />

      <p-text class="font-bold" variant="h5">Login 👋</p-text>
      <p-text>Masuk sekarang dan mulai perjalanan Anda sebagai baker!</p-text>

      <div class="my-4 flex flex-col mb-20 gap-2">
        <p-button @click="signIn('google')"><pi-google-16 /> Masuk dengan Google</p-button>
      </div>
      <small class="text-gray-50 text-center">&copy;2025 Oliviaru, All rights reserved.</small>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
