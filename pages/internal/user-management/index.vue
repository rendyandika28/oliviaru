<script setup lang="ts">
import { ROLES, USER_STATUS } from '~/constants/user';

const fields = reactive<{ accessorKey: string, text: string }[]>([
  {
    accessorKey: 'image',
    text: 'Image'
  },
  {
    accessorKey: 'name',
    text: 'Name'
  },
  {
    accessorKey: 'email',
    text: 'Email'
  },
  {
    accessorKey: 'role',
    text: 'Role'
  },
  {
    accessorKey: 'status',
    text: 'Status'
  },
])

const items = ref([
  {
    image: 'https://picsum.photos/id/50/50',
    name: 'Rendy Andika',
    email: 'rendyndika@gmail.com',
    status: 'REGISTERED',
    role: 'SUPER_ADMIN'
  },
  {
    image: 'https://picsum.photos/id/50/50',
    name: 'Nurul Amaliah',
    email: 'nurulamaliahh@gmail.com',
    status: 'REGISTERED',
    role: 'USER'
  },
])
</script>
<template>
  <section class="px-4 lg:px-8 space-y-4 max-sm:my-8">
    <div class="mb-8">
      <p-heading element="h5">User Management</p-heading>
      <hr class="w-14 border-t-4 border-base-black mt-2" />
    </div>

    <custom-table title="Daftar user" sub-title="Data dibawah merupakan daftar user yang telah terdaftar di website"
      :fields="fields" :items="items">
      <template #search>
        <p-input class="w-full" placeholder="Cari user dengan nama atau email">
          <template #append>
            <pi-search20 />
          </template>
        </p-input>
      </template>

      <template #cell(image)="{ item }">
        <p-avatar :src="item.image" />
      </template>
      <template #cell(role)="{ item }">
        <p-select :options="ROLES" v-model="item.role"/>
      </template>
      <template #cell(status)="{ item }">
        <p-select :options="USER_STATUS" v-model="item.status"/>
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
      @apply text-left
    }

    td, th {
      @apply p-4
    }
  }
}
</style>
