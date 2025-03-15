<script setup lang="ts">
defineProps({
  items: {
    type: Object as PropType<any[]>,
    required: true,
  },
  fields: {
    type: Object as PropType<{ accessorKey: string, text: string }[]>,
    required: true,
  },
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: ''
  },
  addDataUrl: {
    type: String,
    default: ''
  }
})

const searchQueryModel = defineModel('searchQuery')
const searchQueryRef = shallowRef('')
const searchQuery = refDebounced(searchQueryRef, 400)

watch(searchQuery, value => {
  searchQueryModel.value = value
})
</script>
<template>
  <div class="table-header">
    <div>
      <p-heading v-if="title" element="h6">{{ title }}</p-heading>
      <p-subheading v-if="subTitle" size="sm">{{ subTitle }}</p-subheading>
    </div>
    <div class="table-header__search">
      <p-input class="w-full" :placeholder="searchPlaceholder" v-model="searchQueryRef">
        <template #append>
          <p-spinner v-if="status === 'pending'" />
          <pi-search20 v-else />
        </template>
      </p-input>
      <p-button v-if="addDataUrl !== ''" color="default" :href="addDataUrl" icon><pi-add-plus20 /></p-button>
    </div>
  </div>

  <div class="table-content">
    <table>
      <thead>
        <tr>
          <th v-for="field in fields" :key="field.text">
            <p-subheading size="sm">{{ field.text }}</p-subheading>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, itemIdx) in items" :key="`data-${itemIdx}`"
          class="hover:bg-slate-50 border-b border-slate-200">
          <td v-for="field in fields" :key="field.text" class="p-4 py-5">
            <slot :name="`cell(${field.accessorKey})`" v-bind="{ item }">
              <p-subheading size="sm">{{ item[field.accessorKey] ?? '' }}</p-subheading>
            </slot>
          </td>
        </tr>
        <tr v-if="!items.length">
          <td :colspan="fields.length" class="text-center py-10">Tidak ada data tersedia</td>
        </tr>
      </tbody>
    </table>

    <!-- <div class="flex justify-between items-center px-4 py-3">
      <p-pagination v-model="model" v-model:per-page="perPage" :total="total" :per-page-options="perPageOptions"
        show-detail />
    </div> -->
  </div>
</template>
<style lang="scss" scoped>
.table {
  &-header {
    @apply w-full flex flex-col items-start lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-10;

    &__search {
      @apply w-full lg:w-1/3 flex flex-row gap-2;
    }
  }

  &-content {
    @apply relative flex flex-col size-full overflow-scroll bg-base-white border rounded-lg bg-clip-border;

    table {
      @apply w-full text-left table-auto min-w-max;

      thead {
        th {
          @apply p-4 border-b
        }
      }

      tbody {
        tr {
          td {
            @apply p-4 py-5 whitespace-nowrap;
          }
        }
      }
    }
  }
}
</style>
