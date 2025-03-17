<script setup lang="ts">
import { toast } from '@privyid/persona/core';
import type { InferType } from 'yup';
import { useApiClass } from '~/composables/api/useApiClass';
import formSchema from '~/form_schemas/create-class.formschema';

type FormData = InferType<typeof formSchema>
const { updateClass, getBySlug } = useApiClass()
const router = useRouter()
const route = useRoute()

const { data } = await getBySlug(route.params.slug as string)

async function onSubmit(values: FormData) {
  await updateClass(values, route.params.slug as string, {
    onSuccess: res => {
      toast(res.body.message)
      router.push('/internal/class-management')
    }
  })
}

const rawValue = computed<FormData>(() => {
  return {
    ...data.value?.data,
    thumbnail_url: data.value?.data.thumbnailUrl,
    subclasses: data.value?.data.subClasses?.map(sub => ({
      id: sub.id,
      title: sub.title,
      description: sub.description,
      video_url: sub.videoUrl
    })),
  };
})

const initialValues = ref<FormData>({
  title: rawValue.value.title,
  description: rawValue.value.description,
  status: rawValue.value.status,
  thumbnail_url: rawValue.value?.thumbnail_url,
  subclasses: rawValue.value?.subclasses
})

</script>
<template>
  <section class="px-4 lg:px-8 space-y-4 max-sm:my-8">
    <div class="flex flex-row items-start gap-2">
      <p-button variant="link" class="text-base-black" href="/internal/class-management" icon><pi-chevron-left24
          class="font-bold" /></p-button>
      <div class="mb-8">
        <p-heading element="h5">Class Management</p-heading>
        <hr class="w-14 border-t-4 border-base-black mt-2" />
      </div>
    </div>

    <div class="space-y-8">
      <div class="flex flex-row items-center justify-between">
        <div>
          <p-heading element="h6">Update Kelas</p-heading>
          <p-subheading size="sm">Update form dibawah ini untuk mengubah informasi kelas yang akan ditampilkan untuk
            user</p-subheading>
        </div>
      </div>
      <FormClass @submit="onSubmit" :initial-values="initialValues" />
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
