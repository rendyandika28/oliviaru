<script setup lang="ts">
const isCollapse = ref<boolean>(false)
const toggleCollapse = () => isCollapse.value = !isCollapse.value
</script>
<template>
  <div class="flex flex-1 flex-col">
    <slot name="activator" :is-collapse="isCollapse" :toggle-collapse="toggleCollapse"/>
    <p-collapse v-model="isCollapse">
      <slot />
    </p-collapse>
  </div>
</template>
<style lang="scss" scoped></style>
