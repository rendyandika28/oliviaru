import type { ApiResponse, ApiResponseMeta } from './base_response_type';

export interface ClassData {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  status: string;
  subClasses: SubClassData[];
  createdAt: string;
  updatedAt: string;
  accessExpiresAt?: string;
  accessGranted?: boolean;
  accessStatus?: string;
  isAccessible?: boolean;
}

export interface SubClassData {
  id: number;
  title: string;
  slug: string;
  description: string;
  orderIndex: number;
  videoUrl: string;
  videoStatus: string;
  thumbnailUrl: string;
  attachmentUrl: string;
  classId: number;
  createdAt: string;
  updatedAt: string;
  class?: ClassData;
  nextSubClassSlug: string;
  isAccessible?: boolean;
}

export type ClassDetailResponse = ApiResponse<ClassData>;
export type SubClassDetailResponse = ApiResponse<SubClassData>;
export type ClassListResponse = ApiResponseMeta<ClassData[]>;
