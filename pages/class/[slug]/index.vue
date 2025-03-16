<script setup lang="ts">
import ClassBannerImg from '~/assets/images/class.jpg';
import { useApiClass } from '~/composables/api/useApiClass';
import type { ClassData } from '~/types/responses/class_response_type';

const route = useRoute()
const { getBySlug } = useApiClass()
const { data } = await getBySlug(route.params.slug as string)

const classItem = computed(() => data.value?.data) as unknown as Ref<ClassData>

useHead({
  title: classItem.value.title,
})
</script>
<template>
  <section class="space-y-8 my-4">
    <div class="flex flex-row items-center gap-4">
      <NuxtLink to="/class">
        <p-button variant="link" class="text-base-black" size="xs" icon pill><pi-chevron-circle-left-24 /></p-button>
      </NuxtLink>
      <p-heading class="font-bold" element="h5">{{ classItem?.title }}</p-heading>
      <p-divider class="border-2 hidden md:block w-10 border-base-black" />
    </div>

    <img :src="ClassBannerImg" alt="class-banner" class="h-72 w-full object-cover rounded" />

    <div class="flex flex-col gap-2">
      <p-heading transform="capitalize" weight="bold" element="h6">DESKRIPSI KELAS</p-heading>
      <hr class="border-2 border-base-black w-10" />
      <div class="text-sm mt-5" v-html="classItem.description" />
    </div>

    <div class="flex flex-col justify-center items-center gap-2">
      <p-heading transform="capitalize" weight="bold" element="h6">MATERI KELAS</p-heading>
      <hr class="border-2 border-base-black w-14" />

      <p-list-group class="mt-4 w-full rounded">
        <p-list-group-item v-for="subClasses in classItem.subClasses"
          class="flex flex-row items-center justify-between p-6 md:px-8" element="link"
          :href="`/class/${route.params.slug}/${subClasses.slug}`">
          <div class="flex flex-row items-center gap-4">
            <pi-video-camera-24 />
            <div class="flex flex-col">
              <p-text transform="uppercase" weight="extrabold">{{ subClasses.title }}</p-text>
              <div class="truncate-html text-sm" v-html="subClasses.description" />
            </div>
          </div>
          <pi-play-16 />
        </p-list-group-item>
      </p-list-group>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
