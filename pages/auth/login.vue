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
const { adminPhonenumber } = useRuntimeConfig().public
useHead({
  title: `Masuk • ${title}`
})

const { query } = useRoute()

const errorMessages = {
  Unauthorized: 'Masuk terlebih dulu sebelum mengakses kelas',
  userUnauthorized: 'Masuk terlebih dulu sebelum mengakses kelas',
  newUserPending: 'Akun anda akan didaftarkan terlebih dahulu, silahkan hubungi admin',
  userPending: `Status akun anda masih PENDING`,
  multipleLogin: 'Dilarang login menggunakan lebih dari 1 device'
};
const isPendingUser = computed(() => query.error === 'userPending' || query.error === 'newUserPending')

const errorMessage = query?.error ? errorMessages[query.error] : null;

if (errorMessage) {
  toast(errorMessage);
}

const handleMessageAdmin = () => {
  const message = encodeURIComponent(`Hai admin Oliviaru, saya baru saja melakukan registrasi dengan email ${query.email} pada website Oliviaru Baking Studio, mohon untuk direview, terima kasih.`);
  window.open(`https://wa.me/${adminPhonenumber}?text=${message}`, '_blank');
}

const { signIn } = useAuth()
</script>
<template>
  <div class="grid h-dvh place-items-center">
    <div class="flex flex-col gap-2 lg:max-w-[30%] max-md:px-8">
      <NuxtLink to="/">
        <NuxtImg src="/assets/logo.png" class="m-auto w-24 md:w-32" />
      </NuxtLink>

      <p-text class="font-bold" variant="h5">Login 👋</p-text>
      <p-text>Masuk sekarang dan mulai perjalanan Anda sebagai baker!</p-text>
      <p-banner v-if="errorMessage" variant="danger">
        <div v-html="errorMessage"></div>
        <div v-if="isPendingUser" class="mt-1 space-y-2">
          <span>Klik tombol dibawah untuk hubungi admin atau WA langsung ke <a :href="`tel:+${adminPhonenumber}`">+{{ adminPhonenumber }}</a></span>
          <p-button class="block" @click="handleMessageAdmin" color="primary" size="xs">Hubungi admin</p-button>
        </div>
      </p-banner>
      <div class="flex flex-col gap-2 mb-20 my-4">
        <p-button @click="signIn('google')"><pi-google-16 /> Masuk dengan Google</p-button>
      </div>
      <small class="text-center text-gray-50">&copy;2025 Oliviaru, All rights reserved.</small>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
