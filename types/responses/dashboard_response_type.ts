import type { ApiResponse } from './base_response_type';

export interface DashboardInfo {
  userCount: number;
  classCount: number;
  activeAccessCount: number;
}

export type DashboardInfoResponse = ApiResponse<DashboardInfo>;
