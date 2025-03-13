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
</script>
<template>
  <p-form-group :error="errorMessage" :required="required">
    <template #label>
      <span>{{ label }}</span>
    </template>
    <p-richtext :readonly="readonly" :error="!!errors.length" :disabled="disabled" v-model="value" />
  </p-form-group>
</template>
<style lang="scss" scoped></style>
