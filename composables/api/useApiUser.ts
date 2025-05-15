import { API_ENDPOINT } from "~/constants/api_endpoint";
import type { ApiResponse } from "~/types/responses/base_response_type";
import type { UserDetailResponse, UserListResponse } from "~/types/responses/user_response_type";
export type AccessAction = 'grant' | 'revoke';

export function useApiUser() {
  const getAll = (params?: Ref<Partial<{
    searchQuery: string
  }>>) => {
    return useApi<UserListResponse>(API_ENDPOINT.ADMIN.USER, {
      params
    })
  }

  const getUser = (userId: string) => {
    return useApi<UserDetailResponse>(`${API_ENDPOINT.ADMIN.USER}/${userId}`)
  }

  const onUserModifyAccessClass = (userId: string, classId: string, body: Partial<{ action: AccessAction, grantedByUserId: string }>, options?: Partial<ApiFetchOptions<ApiResponse<any>>>) => {
    return useApi(`${API_ENDPOINT.ADMIN.USER}/${userId}/class-access/${classId}`, {
      method: 'PATCH',
      lazy: false,
      body,
      ...options
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
    getUser,
    onUserModifyAccessClass,
    onUserPatchData
  }
}
