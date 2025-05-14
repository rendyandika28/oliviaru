
import { API_ENDPOINT } from "~/constants/api_endpoint"
import type { UserData } from "~/types/responses/user_response_type"

interface AuthStorePropeties {
  user: UserData | null
}


export const useAuthStore = defineStore('auth', {
  state: (): AuthStorePropeties => {
    return {
      user: null,
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    isSuperAdmin: (state) => state.user?.role === 'SUPER_ADMIN'
  },
  actions: {
    setUser(user: UserData | null) {
      this.user = user
    },
    async checkCredentials(token: string) {
      const nuxtApp = useNuxtApp()
      try {
        const _fetch = useRequestFetch()
        const { data } = await _fetch<unknown>(API_ENDPOINT.AUTH.ME, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
          },
        })
        this.setUser(data);
      } catch (e) {
        this.setUser(null);
        nuxtApp.runWithContext(() => {
          const sessionToken = useCookie('next-auth.session-token')
          sessionToken.value = null
          navigateTo('/auth/login');
        })
      }
    },
  },
})
