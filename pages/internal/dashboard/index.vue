<script setup lang="ts">
useHead({
  title: 'Dashboard'
})
</script>
<template>
  <section class="px-4 lg:px-8 space-y-4 max-sm:my-8">
    <div class="mb-8">
      <p-heading element="h5">Dashboard Menu</p-heading>
      <hr class="w-14 border-t-4 border-base-black mt-2"/>
    </div>
    <!-- Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="flex flex-row items-center gap-8 border p-4 px-8 rounded-xl">
        <pi-user-groups-32 />
        <div>
          <p-subheading>Total User</p-subheading>
          <p-heading element="h5" weight="extrabold">60</p-heading>
        </div>
      </div>
      <div class="flex flex-row items-center gap-8 border p-4 px-8 rounded-xl">
        <pi-user-groups-32 />
        <div>
          <p-subheading>Total Kelas</p-subheading>
          <p-heading element="h5" weight="extrabold">3</p-heading>
        </div>
      </div>
    </div>

    <!-- Quote -->
    <div class="rounded-xl border p-8">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, maxime dolor minus sint repellat officiis quasi. Itaque possimus animi ducimus, iure, facilis natus vitae, laudantium corrupti at explicabo eum repudiandae!
    </div>

  </section>
</template>
<style lang="scss" scoped></style>
