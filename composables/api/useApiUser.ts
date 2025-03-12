import { API_ENDPOINT } from "~/constants/api_endpoint"
import type { ApiResponse } from "~/types/responses/base_response_type"
import type { UserListResponse } from "~/types/responses/user_response_type"

export function useApiUser() {
  const getAll = (params?: Ref<Partial<{
    searchQuery: string
  }>>) => {
    return useApi<UserListResponse>(API_ENDPOINT.ADMIN.USER, {
      params
    })
  }

  const onUserPatchData = (userId: string, body: Partial<{ role: string; status: string }>, options?: Partial<ApiFetchOptions<ApiResponse<any>>>) => {
    return useApi(`${API_ENDPOINT.ADMIN.USER}/${userId}`, {
      method: 'PATCH',
      lazy: false,
      body,
      ...options
    })
  }

  return {
    getAll,
    onUserPatchData
  }
}
