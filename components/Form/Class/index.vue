<script setup lang="ts">
import formSchema from '@/form_schemas/create-class.formschema';
import draggable from 'vuedraggable';
import { ClassStatus } from '~/constants/class';

const emit = defineEmits(['submit'])
const props = defineProps({
  initialValues: {
    type: Object,
    required: true
  }
})

const { handleReset, isSubmitting, values, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: props.initialValues
})

const { fields, push, remove, replace } = useFieldArray('subclasses')

const modelValue = computed({
  get() {
    return fields.value
  },
  set(val) {
    const _modelValue = val.map(v => v.value)
    replace(_modelValue)
  }
})
const onSubmit = handleSubmit(finalValues => emit('submit', finalValues))
</script>
<template>
  <form @submit.prevent="onSubmit" autocomplete="off">
    <!-- Kelas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div>
        <app-text-input label="Judul Kelas" name="title" />
        <app-select label="Status Kelas" name="status" :options="ClassStatus" />
        <app-rich-text label="Deskripsi Kelas" name="description" />
      </div>
      <div>
        <app-input-file label="Thumbnail Kelas" name="thumbnail_url" type="image/*" />
      </div>
    </div>

    <!-- Materi Kelas -->
    <fieldset class="space-y-2">
      <div class="flex flex-row items-center justify-between">
        <legend>
          Materi Kelas
        </legend>
        <div>
          <p-button size="md" icon @click="push({ title: '', description: '', video_url: '' })">Tambah Materi
            <pi-add-plus16 /></p-button>
        </div>
      </div>
      <div v-if="fields.length" class="space-y-2">
        <draggable v-model="modelValue" item-key="id">
          <template #item="{ index }">
            <div :key="`subclass_${index}`" class="flex flex-row items-baseline gap-4 grabbable">
              <app-collapsible>
                <template #activator="{ toggleCollapse, isCollapse }">
                  <div @click="toggleCollapse"
                    class="flex-1 border p-2 px-4 rounded w-full flex flex-row justify-between items-center"
                    :class="{ 'border-b-0 rounded-bl-none rounded-br-none': isCollapse }">
                    <div>
                      <p-text class="text-base-black/60">Materi {{ index + 1 }}: <span class="text-base-black"> {{
                        values.subclasses?.[index]?.title }}</span></p-text>
                    </div>
                    <p-button color="danger" size="md" icon @click="remove(index)"><pi-trash16 /></p-button>
                  </div>
                </template>

                <div class="p-2 px-4 border border-t-0 rounded-bl rounded-br grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <app-text-input label="Judul Materi" :name="`subclasses[${index}].title`" />
                    <app-rich-text label="Deskripsi Materi" :name="`subclasses[${index}].description`" />
                  </div>
                  <div class="space-y-4">
                    <app-text-input label="URL Video" :name="`subclasses[${index}].video_url`" type="video" />
                    <app-input-file label="File Resep" :name="`subclasses[${index}].attachment_url`" type="application/pdf"/>
                  </div>
                </div>
              </app-collapsible>
            </div>
          </template>
        </draggable>
      </div>
      <div v-else class="flex-1 border p-2 px-4 rounded w-full text-danger text-center">
        Minimal mengunggah 1 materi
      </div>
    </fieldset>

    <div class="flex flex-row items-center justify-end gap-2 mt-4">
      <p-button :disabled="isSubmitting" @click="handleReset" variant="outline" size="md">Reset</p-button>
      <p-button :loading="isSubmitting" type="submit" class="bg-red-70 text-base-white" size="md">Simpan</p-button>
    </div>
  </form>
</template>
<style lang="scss" scoped>
.grabbable {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

 /* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}
</style>
