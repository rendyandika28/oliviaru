<script setup>
import IconDashboard from '@privyid/persona-icon/vue/dashboard/20.vue'
import IconDocument from '@privyid/persona-icon/vue/document-filled/20.vue'
import IconMenu from '@privyid/persona-icon/vue/menu-burger/20.vue'
import { defineMenu } from '@privyid/persona/core'
const { application: { title } } = useAppConfig()

useHead({
  titleTemplate: titleChunk =>
    titleChunk ? `${titleChunk} - ${title}` : title,
})
const model = ref(false)

const menu = defineMenu([
  {
    condensed: true,
    title: 'Application Menu',
    items: [
      {
        name: 'dashboard',
        label: 'Dashboard',
        url: '/internal/dashboard',
        icon: IconDashboard
      },
      {
        name: 'user-management',
        label: 'User Management',
        url: '/internal/user-management',
        icon: IconDocument
      },
    ]
  }
])
</script>

<template>
  <p-sidebar-menu  :menus="menu" fixed toggleable="lg" v-model="model">
    <p-sidebar-brand>
      <img src="/assets/logo.png" alt="logo" class="h-20" />
    </p-sidebar-brand>
  </p-sidebar-menu>
  <p-page expand="lg" v-model="model">
    <div class="flex flex-row items-center justify-between gap-2 p-2 lg:p-4">
      <div>
        <div class="block lg:hidden">
          <p-checkbox appearance="none" v-model="model">
            <template #default>
              <p-card element="div" class="p-4 duration-200 ease-in-out hover:shadow-md hover:border-subtle border-none"
                sectioned>
                <span class="flex items-center">
                  <IconMenu />
                </span>
              </p-card>
            </template>
          </p-checkbox>
        </div>
        <!-- <div class="px-4 hidden lg:block">
          <p-breadcrumb>
            <p-breadcrumb-item href="#dashboard">
              Dashboard
            </p-breadcrumb-item>
            <p-breadcrumb-item active="">
              User Profile
            </p-breadcrumb-item>
          </p-breadcrumb>
        </div> -->
      </div>
      <Profile />
    </div>
    <slot />
  </p-page>
</template>

<style lang="scss" scoped>
:deep(div.sidebar__menus ul.nav .nav__item .nav__link) {
  @apply py-3 text-sm
}
:deep(div.sidebar__menus ul.nav .nav__item .nav__link.router-link-exact-active) {
  @apply bg-gray-5
}
</style>
