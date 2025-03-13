<script setup lang="ts">
import formSchema from '@/form_schemas/create-class.formschema';
import type { InferType } from 'yup';
import { ClassStatus } from '~/constants/class';

type FormData = InferType<typeof formSchema>
type Subclass = {
  title: string;
  description: string;
  video_url: string;
};

const props = defineProps({
  initialValues: {
    type: Object as PropType<FormData>,
    required: true
  }
})

const { handleSubmit, handleReset } = useForm<FormData>({
  validationSchema: formSchema,
  initialValues: props.initialValues,
})

const { fields, push, remove } = useFieldArray<Subclass>('subclasses')

const addSubclass = () => {
  push({
    title: '',
    description: '',
    video_url: ''
  })
}

const onSubmit = handleSubmit(async (values) => {
  try {
    // Replace alert with API call or other logic
    console.log('Submitting data:', values);
  } catch (error) {
    console.error('Submission error:', error);
  }
});

</script>
<template>
  <form @submit.prevent="onSubmit">
    <!-- Kelas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div>
        <app-text-input label="Judul Kelas" name="title" />
        <app-select label="Status Kelas" name="status" :options="ClassStatus" />
        <app-rich-text label="Deskripsi Kelas" name="description" />
      </div>
      <div>
        <app-input-file label="Thumbnail Kelas" name="thumbnail_url" type="image" />
      </div>
    </div>

    <!-- Materi Kelas -->
    <fieldset class="space-y-2">
      <div class="flex flex-row items-center justify-between">
        <legend>
          Materi Kelas
        </legend>
        <div>
          <p-button size="md" icon @click="addSubclass">Tambah Materi <pi-add-plus16 /></p-button>
        </div>
      </div>
      <div v-if="fields.length" class="space-y-2">
        <div v-for="(field, index) in fields" :key="`subclass_${index}`" class="flex flex-row items-baseline gap-4">
          <app-collapsible>
            <template #activator="{ toggleCollapse, isCollapse }">
              <div @click="toggleCollapse" class="flex-1 border p-2 px-4 rounded w-full flex flex-row justify-between items-center"
                :class="{ 'border-b-0 rounded-bl-none rounded-br-none': isCollapse }">
                <div>
                  <p-text>Materi 1</p-text>
                </div>
                <p-button color="danger" size="md" icon @click="remove(index)"><pi-trash16 /></p-button>
              </div>
            </template>

            <div class="p-2 px-4 border border-t-0 rounded-bl rounded-br grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <app-text-input label="Judul Materi" :name="`subclasses[${index}].title`" />
                <app-rich-text label="Deskripsi Materi" :name="`subclasses[${index}].description`" />
              </div>
              <div>
                <app-text-input label="URL Video" :name="`subclasses[${index}].video_url`" type="video" />
              </div>
            </div>
          </app-collapsible>
        </div>
      </div>
      <div v-else class="flex-1 border p-2 px-4 rounded w-full text-danger text-center">
        Minimal mengunggah 1 materi
      </div>
    </fieldset>

    <div class="flex flex-row items-center justify-end gap-2 mt-4">
      <p-button @click="handleReset" variant="outline" size="md">Reset</p-button>
      <p-button type="submit" class="bg-red-70 text-base-white" size="md">Simpan</p-button>
    </div>
  </form>
</template>
<style lang="scss" scoped></style>
