<script setup lang="ts">
import { useApiClass } from '~/composables/api/useApiClass';
import type { SubClassData } from '~/types/responses/class_response_type';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndLarger = breakpoints.greaterOrEqual('md') // md and larger

const route = useRoute()
const { isSuperAdmin } = storeToRefs(useAuthStore());
const { getSubclassBySlug } = useApiClass()
const { data } = await getSubclassBySlug(route.params.materiSlug as string)
const isOpenRecipe = ref<boolean>(false)

// if not accessible, navigate to home
if (!data.value?.data.isAccessible && !isSuperAdmin.value) {
  navigateTo('/')
}

const subClass = computed(() => data.value?.data) as unknown as Ref<SubClassData>

useHead({
  title: subClass.value.title,
})
</script>
<template>
  <section class="my-4 space-y-8">
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-row gap-4 items-center">
        <NuxtLink :to="`/class/${subClass.class?.slug}`">
          <p-button variant="link" class="text-base-black" size="xs" icon pill><pi-chevron-circle-left-24 /></p-button>
        </NuxtLink>
        <div class="flex flex-col">
          <p-subheading class="font-bold" element="h5">{{ subClass.class?.title }}</p-subheading>
          <p-heading class="font-bold" element="h5">{{ subClass.title }}</p-heading>
        </div>
      </div>
      <NuxtLink v-if="subClass?.nextSubClassSlug" :to="`/class/${subClass.class?.slug}/${subClass?.nextSubClassSlug}`">
        <p-button class="bg-base-black text-base-white mt-3">Kelas Selanjutnya</p-button>
      </NuxtLink>
    </div>
    <VideoPlayer :src="loadAssetStorage(subClass.videoUrl)" />
    <p-button v-if="subClass?.attachmentUrl" @click="isOpenRecipe = true" class="bg-base-black text-base-white"><pi-document-information-24 />Lihat
      Resep</p-button>
    <div class="flex flex-col gap-2">
      <p-heading transform="capitalize" weight="bold" element="h6">DESKRIPSI MATERI</p-heading>
      <hr class="border-2 border-base-black w-10" />
      <div class="text-sm mt-5" v-html="subClass.description" />
    </div>
  </section>
  <p-modal v-if="subClass?.attachmentUrl" v-model="isOpenRecipe" :title="`Resep ${subClass?.title}`" size="full" header-class="px-6">
    <template #body>
       <p-pdf-viewer :src="loadAssetStorage(subClass.attachmentUrl)" layout="fit" :scale="mdAndLarger ? 1 : 0.6"/>
    </template>
  </p-modal>
</template>
<style lang="scss" scoped></style>
