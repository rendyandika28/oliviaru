<script setup lang="ts">
const { application: { title } } = useAppConfig()

useHead({
    titleTemplate: titleChunk =>
        titleChunk ? `${titleChunk} - ${title}` : title,
})
</script>

<template>
    <slot />
</template>
