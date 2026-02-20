import type { ApiResponse, ApiResponseMeta } from './base_response_type';
import type { ClassData } from './class_response_type';
import type { UserRole, UserStatus } from '~/shared/enums';

export interface UserData {
  createdAt: string;
  email: string;
  id: string;
  image: string;
  name: string;
  password: string;
  provider: string;
  providerAccountId: string;
  role: UserRole;
  updatedAt: string;
  userStatus: UserStatus;
  classes: ClassData[];
}

export type UserListResponse = ApiResponseMeta<UserData[]>;
export type UserDetailResponse = ApiResponse<UserData>;
