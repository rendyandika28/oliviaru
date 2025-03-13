<script setup lang="ts">
import type { InferType } from 'yup';
import formSchema from '~/form_schemas/create-class.formschema';

type FormData = InferType<typeof formSchema>

async function onSubmit(values: FormData, actions: any) {
  console.log({values});
}

const initialValues = ref<FormData>({
  title: '',
  description: '',
  status: 'PUBLISHED',
  thumbnail_url: '',
  subclasses: []
})
</script>
<template>
  <section class="px-4 lg:px-8 space-y-4 max-sm:my-8">
    <div class="flex flex-row items-start gap-2">
      <p-button variant="link" class="text-base-black" href="/internal/class-management" icon><pi-chevron-left24 class="font-bold"/></p-button>
      <div class="mb-8">
        <p-heading element="h5">Class Management</p-heading>
        <hr class="w-14 border-t-4 border-base-black mt-2" />
      </div>
    </div>

    <div class="space-y-8">
      <div class="flex flex-row items-center justify-between">
        <div>
          <p-heading element="h6">Tambah Kelas</p-heading>
          <p-subheading size="sm">Isi form dibawah ini untuk membuat kelas baru yang akan ditampilkan untuk
            user</p-subheading>
        </div>
      </div>
      <FormClass @submit="onSubmit" :initial-values="initialValues"/>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
