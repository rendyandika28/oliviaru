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
  Unauthorized: 'Masuk terlebih dulu sebelum mengakses kelas',
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
  <div class="grid h-dvh place-items-center">
    <div class="flex flex-col gap-2 lg:max-w-[30%] max-md:px-8">
      <NuxtImg src="/assets/logo.png" class="m-auto w-24 md:w-32" />

      <p-text class="font-bold" variant="h5">Login 👋</p-text>
      <p-text>Masuk sekarang dan mulai perjalanan Anda sebagai baker!</p-text>

      <div class="flex flex-col gap-2 mb-20 my-4">
        <p-button @click="signIn('google')"><pi-google-16 /> Masuk dengan Google</p-button>
      </div>
      <small class="text-center text-gray-50">&copy;2025 Oliviaru, All rights reserved.</small>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
