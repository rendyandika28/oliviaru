<script setup lang="ts">
interface ISelect {
  text: string;
  value: string | number;
  ref_value?: string;
  icon?: string;
}

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: ""
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  options: {
    type: Array as PropType<String[] | ISelect[] | undefined>,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: undefined
  },
  readonly: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits<{
  (e: 'on-change', payload: any): void
}>()

const onChange = (value: any) => {
  emit('on-change', value)
}

const { value, errorMessage } = useField(toRef(props, "name"), undefined);
</script>
<template>
  <p-form-group :error="errorMessage">
    <template #label>
      <span>{{ label }}</span>
    </template>
    <p-select @change="onChange" :options="options" v-model="value" :size="size" class="w-full" :disabled="disabled"
      :placeholder="placeholder" :readonly="readonly" :searchable="searchable" />
  </p-form-group>
</template>
