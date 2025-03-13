<script setup lang="ts">
const isCollapse = ref<boolean>(true)
const toggleCollapse = () => isCollapse.value = !isCollapse.value
</script>
<template>
  <div class="flex-1 flex flex-col">
    <slot name="activator" :is-collapse="isCollapse" :toggle-collapse="toggleCollapse"/>
    <p-collapse v-model="isCollapse">
      <slot />
    </p-collapse>
  </div>
</template>
<style lang="scss" scoped></style>
