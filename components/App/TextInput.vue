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
  type: {
    type: String as PropType<'text' | 'password' | 'url' | 'video'>,
    default: "text",
  },
  accept: {
    type: String as PropType<'numeric' | 'alpha' | 'alpha-numeric' | 'alpha-numeric-space-symbol'>,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  inputClass: {
    type: String,
    default: ''
  },
  maxlength: {
    type: String,
    default: null
  },
  autofocus: {
    type: Boolean,
    default: false
  }
})
const { value, errorMessage } = useField<string>(toRef(props, "name"), undefined);

const isVideoErrorLoaded = ref<boolean>(false)
const handleVideoLoad = () => {
  isVideoErrorLoaded.value = false
}
const handleVideoError = () => {
  isVideoErrorLoaded.value = true
}
</script>
<template>
  <p-form-group :error="errorMessage" :required="required">
    <template #label>
      <span>{{ label }}</span>
    </template>
    <p-input-password v-if="type === 'password'" :disabled="disabled" :autofocus="autofocus" v-model="value"
      :size="size" :class="inputClass" />
    <p-input v-else :readonly="readonly" :disabled="disabled" :autofocus="autofocus" :type="type" v-model="value"
      :size="size" :accept="accept" :class="inputClass" :maxlength="maxlength">
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend" />
      </template>
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
    </p-input>
  </p-form-group>

  <!-- Handle preview video -->
  <div v-if="type === 'video' && value">
    <p-banner v-if="isVideoErrorLoaded" variant="danger" :dismissable="false">URL Video Tidak ditemukan</p-banner>
    <video @canplay="handleVideoLoad" class="w-full" height="240" :key="value" controls controlsList="nodownload" oncontextmenu="return false;">
      <source @error="handleVideoError" :src="value" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</template>
<style lang="scss" scoped></style>
