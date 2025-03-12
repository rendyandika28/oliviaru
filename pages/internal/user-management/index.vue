<script setup lang="ts">
import { toast } from '@privyid/persona/core';
import { useApiUser } from '~/composables/api/useApiUser';
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

const searchQueryRef = shallowRef('')
const searchQuery = refDebounced(searchQueryRef, 400)

const { getAll, onUserPatchData } = useApiUser()
const queryParams = ref({
  searchQuery,
  page: 1,
  limit: 1000,
})

const { data, status } = await getAll(queryParams)

const handleUserPatchData = (value: Ref<string>, userId: string, type: 'ROLE' | 'STATUS') => {
  const body: Partial<{ role: string; status: string }> = {};
  if (type === "ROLE") {
    body.role = value.value;
  } else if (type === "STATUS") {
    body.status = value.value;
  }

  onUserPatchData(userId, body, {
    onSuccess: res => {
      toast(res.body.message)
    }
  })
}
</script>
<template>
  <section class="px-4 lg:px-8 space-y-4 max-sm:my-8">
    <div class="mb-8">
      <p-heading element="h5">User Management</p-heading>
      <hr class="w-14 border-t-4 border-base-black mt-2" />
    </div>

    <custom-table title="Daftar user" sub-title="Data dibawah merupakan daftar user yang telah terdaftar di website"
      :fields="fields" :items="data?.data">
      <template #search>
        <p-input class="w-full" placeholder="Cari user dengan nama atau email" v-model="searchQueryRef">
          <template #append>
            <p-spinner v-if="status === 'pending'" />
            <pi-search20 v-else />
          </template>
        </p-input>
      </template>
      <template #cell(image)="{ item: user }">
        <img :src="user?.image" :alt="user?.name" referrerPolicy="no-referrer" class="size-10 rounded-full" />
      </template>
      <template #cell(role)="{ item: user }">
        <p-select @change="value => handleUserPatchData(value as string, user.id, 'ROLE')" :options="ROLES"
          v-model="user.role" />
      </template>
      <template #cell(status)="{ item: user }">
        <p-select @change="value => handleUserPatchData(value as string, user.id, 'STATUS')" :options="USER_STATUS"
          v-model="user.userStatus" />
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
