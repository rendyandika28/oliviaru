<script setup lang="ts">
import { useApiClass } from '~/composables/api/useApiClass'

useHead({
  title: 'Kelas',
})

const { getAllByUser } = useApiClass()
const queryParams = ref({
  searchQuery: '',
  page: 1,
  limit: 1000,
})

const { data } = await getAllByUser(queryParams)
</script>
<template>
  <section class="flex flex-col gap-4">
    <div class="mt-5 flex flex-col gap-4">
      <div>
        <p-heading element="h5">
          Kelas Saya
        </p-heading>
        <hr class="w-11 border-2 border-base-black" />
      </div>
      <div v-if="data?.data && data?.data.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div else class="grid place-items-center h-60">
        <div class="space-y-4 text-center">
          <p-subheading>Kamu belum memiliki kelas, lihat daftar kelas untuk mulai belajar.</p-subheading>
          <p-button href="/class">Daftar kelas</p-button>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
