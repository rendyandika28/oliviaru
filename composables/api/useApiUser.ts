import { API_ENDPOINT } from '~/constants/api_endpoint';
import type { ApiResponse } from '~/types/responses/base_response_type';
import type { UserData, UserDetailResponse, UserListResponse } from '~/types/responses/user_response_type';

export type AccessAction = 'grant' | 'revoke';

interface ClassAccessPayload {
  action: AccessAction;
  grantedByUserId?: string;
}

interface UserPatchPayload {
  role?: string;
  status?: string;
}

export function useApiUser() {
  const getAll = (params?: Ref<Partial<{ searchQuery: string }>>) => {
    return useApi<UserListResponse>(API_ENDPOINT.ADMIN.USER, { params });
  };

  const getUser = (userId: string) => {
    return useApi<UserDetailResponse>(`${API_ENDPOINT.ADMIN.USER}/${userId}`);
  };

  const modifyClassAccess = (
    userId: string,
    classId: string,
    body: ClassAccessPayload,
    options?: Partial<ApiFetchOptions<ApiResponse<UserData>>>
  ) => {
    return useApi<ApiResponse<UserData>>(
      `${API_ENDPOINT.ADMIN.USER}/${userId}/class-access/${classId}`,
      { method: 'PATCH', lazy: false, body, ...options }
    );
  };

  const patchUser = (
    userId: string,
    body: UserPatchPayload,
    options?: Partial<ApiFetchOptions<ApiResponse<UserData>>>
  ) => {
    return useApi<ApiResponse<UserData>>(
      `${API_ENDPOINT.ADMIN.USER}/${userId}`,
      { method: 'PATCH', lazy: false, body, ...options }
    );
  };

  return {
    getAll,
    getUser,
    modifyClassAccess,
    patchUser,
  };
}
