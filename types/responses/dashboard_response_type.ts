import type { ApiResponseMeta } from "./base_response_type"

export interface DashboardInfo {
  user_count: number
}

export type DashboardInfoResponse = ApiResponseMeta<DashboardInfo>
