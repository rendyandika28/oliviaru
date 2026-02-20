import type { UseFetchOptions } from 'nuxt/app';
import { defu } from 'defu';
import { toast } from '@privyid/persona/core';

export type ApiFetchOptions<T> = UseFetchOptions<T> & {
  excludeInterceptor?: number[];
  onSuccess?: (response: {
    status: number;
    body: T;
  }) => Promise<void> | void;
  onError?: (response: {
    status: number;
    body: {
      status: number;
      messages: string[];
    };
  }) => Promise<void> | void;
};

export async function useApi<T>(url: string, opts: ApiFetchOptions<T> = {}) {
  const { excludeInterceptor, ...options } = opts;

  const { signOut } = useAuth();

  const defaults: UseFetchOptions<T> = {
    async onRequest({ options }) {
      options.headers = new Headers(options.headers);
      options.headers.set('X-Requested-With', 'XMLHttpRequest');
    },
    async onResponse({ response }) {
      if (typeof opts.onSuccess === 'function' && response.status >= 200 && response.status < 300) {
        await opts.onSuccess({
          status: response.status,
          body: response._data,
        });
      }
    },
    async onResponseError(ctx) {
      const isExcluded = excludeInterceptor?.includes(ctx.response.status) ?? false;

      if (!isExcluded) {
        if (ctx.response.status === 401) {
          toast('Session Expired: Your session has expired, please log in.');
          return signOut({ redirect: true, callbackUrl: '/' });
        }

        if (ctx.response.status === 403) {
          toast('Access Forbidden: Your account is not permitted to access this resource.');
        }

        if (ctx.response.status >= 500) {
          toast("Error: We're sorry but we're having some technical difficulties.");
        }
      }

      if (typeof opts.onError === 'function') {
        await opts.onError({
          status: ctx.response.status,
          body: ctx.response._data,
        });
      }
    },
  };

  const params = defu(options, defaults);
  return await useFetch(url, params);
}
