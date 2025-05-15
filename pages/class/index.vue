<script setup lang="ts">
import ClassBannerImg from '~/assets/images/class.jpg'
import { useApiClass } from '~/composables/api/useApiClass'

useHead({
  title: 'Kelas',
})

const { getAll } = useApiClass()
const queryParams = ref({
  searchQuery: '',
  page: 1,
  limit: 1000,
})

const { data } = await getAll(queryParams)
</script>
<template>
  <section class="flex flex-col gap-4">
    <div class="rounded-lg overflow-hidden relative">
      <img :src="ClassBannerImg" alt="class-banner" class="aspect-video h-96 w-full object-cover" />
      <div
        class="bg-gradient-to-t from-base-black to-base-black/0 inset-0 absolute grid place-items-center max-sm:px-4 max-sm:text-center">
        <h4 style="font-family: 'Playfair Display', serif;" class="text-base-white text-2xl sm:text-4xl">Baking is a
          work of heart
        </h4>
      </div>
    </div>

    <div class="mt-5 flex flex-col gap-4">
      <div>
        <p-heading element="h5">
          Kelas Tersedia
        </p-heading>
        <hr class="w-11 border-2 border-base-black" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in data?.data"
          class="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-4 rounded flex flex-col gap-3">
          <img :src="loadAssetStorage(item.thumbnailUrl)" alt="class-banner" class="aspect-video object-cover" />
          <p-heading element="h6" class="font-bold">{{ item.title }}</p-heading>
          <div class="truncate-html" v-html="item.description" />
          <NuxtLink :to="`/class/${item.slug}`">
            <p-button class="mt-3 bg-base-black text-base-white">Lihat Kelas</p-button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
