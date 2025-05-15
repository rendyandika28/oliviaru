<script setup lang="ts">
import { dialog } from '@privyid/persona/core';
import { useApiClass } from '~/composables/api/useApiClass';

const fields = reactive<{ accessorKey: string, text: string }[]>([
  {
    accessorKey: 'thumbnailUrl',
    text: 'Thumbnail'
  },
  {
    accessorKey: 'title',
    text: 'Title'
  },
  {
    accessorKey: 'status',
    text: 'Status'
  },
  {
    accessorKey: 'action',
    text: ''
  },
])

const searchQuery = ref<string>('')
const { getAll, deleteClass } = useApiClass()
const queryParams = ref({
  searchQuery,
  page: 1,
  limit: 1000,
})

const { data, status, refresh } = await getAll(queryParams)

const onDelete = (slug: string) => {
  dialog.confirm({
    title: 'Delete Confirmation',
    text: 'Are you sure?',
    size: 'sm',
  }).then(async (value) => {
    if (value === true) {
      await deleteClass(slug, {
        onSuccess: () => {
          dialog.alert({
            title: 'Info',
            text: 'Deleted',
          })

          refresh()
        }
      })
    }
  })
}
</script>
<template>
  <section class="px-4 lg:px-8 space-y-4 max-sm:my-8">
    <div class="mb-8">
      <p-heading element="h5">Class Management</p-heading>
      <hr class="w-14 border-t-4 border-base-black mt-2" />
    </div>

    <custom-table v-model:search-query="searchQuery" search-placeholder="Cari kelas" :status="status"
      add-data-url="/internal/class-management/add" title="Daftar kelas"
      sub-title="Data dibawah merupakan daftar kelas yang telah terdaftar di website" :fields="fields"
      :items="data?.data">
      <template #cell(thumbnailUrl)="{ item }">
        <img :src="loadAssetStorage(item?.thumbnailUrl)" :alt="item?.title" referrerPolicy="no-referrer"
          class="size-20 object-cover" />
      </template>
      <template #cell(status)="{ item }">
        <p-label :color="item?.status === 'PUBLISHED' ? 'success' : 'warning'" variant="light">{{ item?.status
          }}</p-label>
      </template>
      <template #cell(action)="{ item }">
        <p-dropdown icon no-caret>
          <template #button-content>
            <pi-menu-vertical-16 />
          </template>
          <p-dropdown-item>
            <NuxtLink class="flex flex-row items-center gap-3" :to="`/internal/class-management/${item.slug}`">
              <pi-view16 />
              <span>Detail</span>
            </NuxtLink>
          </p-dropdown-item>
          <p-dropdown-item @click="onDelete(item.slug)" class="text-danger flex flex-row items-center gap-3">
            <pi-trash16 />
            <span>Delete</span>
          </p-dropdown-item>
        </p-dropdown>
      </template>
    </custom-table>
  </section>
</template>
<style lang="scss">
.table {
  @apply w-full rounded border;

  table {
    @apply w-full;

    tr {
      @apply text-left;
    }

    td,
    th {
      @apply p-4;
    }
  }
}
</style>
