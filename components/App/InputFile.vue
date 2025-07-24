<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    default: "image",
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
})
const { value, errorMessage, errors } = useField<string>(toRef(props, "name"), undefined);
const acceptFile = computed(() => props.type)
const fileUrl = computed(() => fileToUrl(value?.value))
</script>
<template>
  <p-form-group :error="errorMessage" :required="required">
    <template #label>
      <span>{{ label }}</span>
    </template>
    <p-input-file :error="!!errors.length" :readonly="readonly" :disabled="disabled" v-model="value"
      :accept="acceptFile" />
    <img v-if="type === 'image/*' && value" :src="loadAssetStorage(fileUrl)" class="mt-4" />
    <embed v-if="type === 'application/pdf' && value" :src="loadAssetStorage(fileUrl)" class="w-full h-[500px] mt-4"/>
  </p-form-group>
</template>
<style lang="scss" scoped></style>
