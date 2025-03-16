<script setup lang="ts">
import { useApiClass } from '~/composables/api/useApiClass';
import type { SubClassData } from '~/types/responses/class_response_type';

const route = useRoute()
const { getSubclassBySlug } = useApiClass()
const { data } = await getSubclassBySlug(route.params.materiSlug as string)

const subClass = computed(() => data.value?.data) as unknown as SubClassData

</script>
<template>
  <section class="space-y-8 my-4">
    <div class="flex flex-row items-center gap-4">
      <p-button variant="link" class="text-base-black" size="xs" icon pill><pi-chevron-circle-left-24 /></p-button>
      <div class="flex flex-col">
        <p-subheading class="font-bold" element="h5">{{ subClass.class?.title }}</p-subheading>
        <p-heading class="font-bold" element="h5">{{ subClass.title }}</p-heading>
      </div>
    </div>

    <video class="w-full" height="240" controls controlsList="nodownload" oncontextmenu="return false;">
      <source :src="subClass.videoUrl" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <div class="flex flex-col gap-2">
      <p-heading transform="capitalize" weight="bold" element="h6">DESKRIPSI MATERI</p-heading>
      <hr class="border-2 border-base-black w-10" />
      <div class="text-sm mt-5" v-html="subClass.description" />
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
