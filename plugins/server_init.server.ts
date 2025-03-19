import type { Pinia } from "pinia";

export default defineNuxtPlugin(async ({ $pinia }) => {
  if (!process.server) return

  const { status, data } = useAuth()
  const { checkCredentials } = useAuthStore($pinia as Pinia)

  if (status.value === 'authenticated') {
    await checkCredentials(data.value?.accessToken as string)
  }
})
