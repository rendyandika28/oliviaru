<script setup lang="ts">
import { useApiUser, type AccessAction } from '~/composables/api/useApiUser';
import { formatDistanceToNowStrict, format, parseISO, differenceInCalendarDays } from 'date-fns'
import { id } from 'date-fns/locale'
import { toast } from '@privyid/persona/core';


const fields = reactive<{ accessorKey: string, text: string }[]>([
  {
    accessorKey: 'title',
    text: 'Kelas'
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
const route = useRoute()

const searchQuery = ref<string>('')
const { user: loggedInUser } = storeToRefs(useAuthStore())
const { getUser, onUserModifyAccessClass } = useApiUser()
const { data, status, refresh } = await getUser(route.params.id as string)

const user = computed(() => data.value?.data)
const userJoinedAt = computed(() => `${formatDistanceToNowStrict(new Date(user.value?.createdAt as string), {
  addSuffix: true,
  locale: id,
})}`)
const classes = computed(() => data.value?.data.classes)

const getExpiredAtUser = (date: string) => {
  const targetDate = parseISO(date);
  const formattedDate = format(targetDate, 'dd MMMM yyyy', { locale: id });
  const daysRemaining = differenceInCalendarDays(targetDate, new Date());

  return `${formattedDate} (Tersisa ${daysRemaining} hari lagi)`;
};
const handleModifyAccessClass = async (classId: string, action: AccessAction) => {
  const response = await onUserModifyAccessClass(route.params.id as string, classId, {
    action,
    grantedByUserId: loggedInUser.value?.id
  })

  toast(response.data.value?.message as string)

  await refresh()
}
</script>
<template>
  <section class="px-4 lg:px-8 space-y-4 max-sm:my-8">
    <div class="flex mb-8">
      <p-button variant="link" class="text-base-black" href="/internal/user-management" icon><pi-chevron-left24
          class="font-bold" /></p-button>
      <div>
        <p-heading element="h5">Detail user</p-heading>
        <hr class="w-14 border-t-4 border-base-black mt-2" />
      </div>
    </div>

    <div class="p-5 flex flex-row items-center gap-4">
      <p-avatar class="size-28" square :src="user?.image" :name="user?.name" />
      <div class="space-y-1">
        <div class="flex flex-row items-center gap-2">
          <p-heading element="h5">
            {{ user?.name }}
          </p-heading>
          <p-badge>
            {{ user?.userStatus }}
          </p-badge>
        </div>
        <p-subheading>
          {{ user?.email }}
        </p-subheading>
        <p-subheading>
          Bergabung sejak: {{ userJoinedAt }}
        </p-subheading>
      </div>
    </div>

    <custom-table v-model:search-query="searchQuery" search-placeholder="Cari kelas" :status="status"
      title="Daftar Kelas" :fields="fields" :items="classes" :show-search="false">
      <template #cell(status)="{ item }">
        <p-badge v-if="!item.accessGranted" variant="light" color="danger">Belum Berlangganan</p-badge>
        <p-badge v-else-if="item.accessGranted && item.accessStatus === 'REVOKED'" variant="light" color="danger">Akses
          dicabut</p-badge>
        <p-badge v-else-if="item.accessStatus === 'EXPIRED'" variant="light" color="danger">Akses kelas telah expired</p-badge>
        <div v-else>
          <p-text variant="caption" class="block">Akses kelas sampai:</p-text>
          <p-badge variant="default">{{ getExpiredAtUser(item.accessExpiresAt) }}</p-badge>
        </div>

      </template>
      <template #cell(action)="{ item }">
        <div class="w-full flex justify-end items-center gap-2">
          <p-button v-if="item.accessStatus === 'ACTIVE'" @click="handleModifyAccessClass(item.id, 'revoke')" size="sm"
            color="danger"><pi-close-16 />Cabut Akses</p-button>
          <p-button v-else @click="handleModifyAccessClass(item.id, 'grant')" size="sm" color="success"><pi-checkmark-16 />{{item.accessStatus === 'EXPIRED' ? 'Re-aktivasi (12 Bulan)' : 'Aktivasi (12 Bulan)'}}</p-button>
        </div>
      </template>
    </custom-table>
  </section>
</template>
<style lang="scss"></style>
