import type { ApiResponseMeta } from "./base_response_type"
import type { ClassData } from "./class_response_type"

export interface UserData {
  createdAt: string
  email: string
  id: string
  image: string
  name: string
  password: string
  provider: string
  providerAccountId: string
  role: string
  updatedAt: string
  userStatus: string
  classes: ClassData[]
}

export type UserListResponse = ApiResponseMeta<UserData[]>
export type UserDetailResponse = ApiResponseMeta<UserData>
