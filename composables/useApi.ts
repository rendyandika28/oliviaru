import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'
import { toast } from '@privyid/persona/core'

export type ApiFetchOptions<T> = UseFetchOptions<T> & {
  excludeInterceptor?: number[]
  onSuccess?: (response: {
    status: number
    body: T
  }) => Promise<void> | void
  onError?: (response: {
    status: number
    body: {
      code: number
      messages: string[]
    }
  }) => Promise<void> | void
}

export async function useApi<T>(url: string, opts: ApiFetchOptions<T> = {}) {
  const { excludeInterceptor, ...options } = opts
  const defaults: UseFetchOptions<T> = {
    async onRequest({ options }) {
      options.headers = new Headers(options.headers)
      options.headers.set('X-Requested-With', 'XMLHttpRequest')
    },
    async onResponse({ response }) {
      if (typeof opts.onSuccess === 'function' && response.status >= 200 && response.status < 300) {
        await opts.onSuccess({
          status: response.status,
          body: response._data,
        })
      }
    },

    async onResponseError(ctx) {
      const excludedInterceptor = (statusCode: number): boolean => {
        if (!excludeInterceptor)
          return false

        return excludeInterceptor.includes(statusCode)
      }

      if (!excludedInterceptor(ctx.response.status)) {
        const { signOut } = useAuth()
        if (ctx.response.status === 401) {
          toast('Session Expired: your session has expired, please log in.')
          return signOut({
            redirect: true,
            callbackUrl: '/'
          })
        }

        if (ctx.response.status === 403) {
          toast('Access Forbiden: Your Account is not permitted to request to some endpoints.')
        }

        if (ctx.response.status >= 500) {
          toast('Error: We\'re sorry but we\'re having some technical difficulties.')
        }
      }

      if (typeof opts.onError === 'function') {
        await opts.onError({
          status: ctx.response.status,
          body: ctx.response._data,
        })
      }
    },
  }

  const params = defu(options, defaults)

  return await useFetch(url, params)
}
