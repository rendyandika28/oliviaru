import { API_ENDPOINT } from '~/constants/api_endpoint';
import type { UserData } from '~/types/responses/user_response_type';

interface AuthStoreProperties {
  user: UserData | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreProperties => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isSuperAdmin: (state) => state.user?.role === 'SUPER_ADMIN',
  },
  actions: {
    setUser(user: UserData | null) {
      this.user = user;
    },
    async checkCredentials(token: string) {
      const nuxtApp = useNuxtApp();
      try {
        const _fetch = useRequestFetch();
        const response = await _fetch<{ data: UserData }>(API_ENDPOINT.USER.ME, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        this.setUser(response.data);
      } catch (error) {
        console.warn('[AuthStore] checkCredentials failed:', error);
        this.setUser(null);
        nuxtApp.runWithContext(() => {
          const { signOut } = useAuth();
          signOut({ redirect: true, callbackUrl: '/auth/login' });
        });
      }
    },
  },
});
