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
})

const model = ref(1)
const total = ref(50)
const perPage = ref(10)
const perPageOptions = ref([5, 10, 15])
</script>
<template>
  <div class="table-header">
    <div>
      <p-heading v-if="title" element="h6">{{ title }}</p-heading>
      <p-subheading v-if="subTitle" size="sm">{{ subTitle }}</p-subheading>
    </div>
    <div class="table-header__search">
      <slot name="search" />
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
      @apply w-full lg:w-1/3;
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

      th:nth-child(2),
      td:nth-child(2) {
        @apply sticky left-0 bg-base-white shadow-md z-10; // Sticky first column
      }
    }
  }
}
</style>
