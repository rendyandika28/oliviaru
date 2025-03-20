<script setup lang="ts">
import { useApiClass } from '~/composables/api/useApiClass';
import type { SubClassData } from '~/types/responses/class_response_type';

const route = useRoute()
const { getSubclassBySlug } = useApiClass()
const { data } = await getSubclassBySlug(route.params.materiSlug as string)

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
    <VideoPlayer :src="subClass.videoUrl" />
    <div class="flex flex-col gap-2">
      <p-heading transform="capitalize" weight="bold" element="h6">DESKRIPSI MATERI</p-heading>
      <hr class="border-2 border-base-black w-10" />
      <div class="text-sm mt-5" v-html="subClass.description" />
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
