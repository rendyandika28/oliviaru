<script setup lang="ts">
import PilPadlockSpot from '@privyid/persona-ilustration/vue/padlock/spot.vue';
import { useApiClass } from "~/composables/api/useApiClass";
import type { ClassData } from "~/types/responses/class_response_type";

const route = useRoute();
const router = useRouter();

const goBack = () => {
  router.back()
}

const { user, isSuperAdmin } = storeToRefs(useAuthStore());
const { getBySlug } = useApiClass();
const { adminPhonenumber } = useRuntimeConfig().public
const { data } = await getBySlug(route.params.slug as string);
const classItem = computed(() => data.value?.data) as unknown as Ref<ClassData>;

const isModalOpen = ref<boolean>(false);

const handleMessageAdmin = () => {
  if (user.value) {
    const message = encodeURIComponent(`Hai admin Oliviaru, saya ingin melakukan pembelian kelas '${data.value?.data?.title}' di website Oliviaru Baking Studio. Berikut adalah email saya ${user.value?.email}`);
    window.open(`https://wa.me/${adminPhonenumber}?text=${message}`, '_blank');
  }
}

const handleRoutingWatchVideo = (slug: string) => {
  const isAccessible = data.value?.data?.isAccessible;
  if (isSuperAdmin.value || isAccessible || !user.value) {
    router.push(`/class/${route.params.slug}/${slug}`);
  } else {
    isModalOpen.value = true
  }
};

useHead({
  title: classItem.value.title,
});
</script>
<template>
  <section class="my-4 space-y-8">
    <div class="flex flex-row gap-4 items-center">
      <p-button icon variant="link" @click="goBack">
        <p-button variant="link" class="text-base-black" size="xs" icon pill><pi-chevron-circle-left-24 /></p-button>
      </p-button>
      <p-heading class="font-bold" element="h5">{{
        classItem?.title
      }}</p-heading>
      <p-divider class="border-2 border-base-black w-10 hidden md:block" />
    </div>

    <img :src="loadAssetStorage(classItem?.thumbnailUrl)" alt="class-banner" class="h-72 rounded w-full object-cover" />

    <div class="flex flex-col gap-2">
      <p-heading transform="capitalize" weight="bold" element="h6">DESKRIPSI KELAS</p-heading>
      <hr class="border-2 border-base-black w-10" />
      <div class="text-sm mt-5" v-html="classItem.description" />
    </div>

    <div class="flex flex-col justify-center gap-2 items-center">
      <p-heading transform="capitalize" weight="bold" element="h6">MATERI KELAS</p-heading>
      <hr class="border-2 border-base-black w-14" />

      <p-list-group class="rounded w-full mt-4">
        <p-list-group-item v-for="subClasses in classItem.subClasses"
          class="flex flex-row justify-between p-6 gap-8 items-center md:px-8" element="link"
          @click="handleRoutingWatchVideo(subClasses.slug)">
          <div class="flex flex-row gap-4 items-center">
            <pi-video-camera-24 />
            <div class="flex flex-1 flex-col">
              <p-text transform="uppercase" weight="extrabold">{{
                subClasses.title
              }}</p-text>
              <div class="text-sm truncate-html" v-html="subClasses.description" />
            </div>
          </div>
          <pi-play-24 />
        </p-list-group-item>
      </p-list-group>
    </div>
  </section>
  <p-modal v-model="isModalOpen" :dismissable="false" banner centered>
    <div class="p-4 flex flex-col items-center">
      <pil-padlock-spot />
      <div class="p-4 text-center space-y-2">
        <p-heading element="h6">Ups! kamu tidak bisa mengakses kelas ini!</p-heading>
        <p-divider />
        <p-text variant="subheading2">Untuk mengakses kelas ini kamu bisa menghubungi Admin dengan mengklik tombol
          dibawah ini</p-text>
        <div class="block">
          <p-button @click="handleMessageAdmin"><pi-call-solid-16 /> Hubungi admin</p-button>
        </div>
      </div>
    </div>
  </p-modal>
</template>
<style lang="scss" scoped></style>
