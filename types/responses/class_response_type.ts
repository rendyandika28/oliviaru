import type { ApiResponseMeta } from "./base_response_type"

export interface ClassData {
  id: number,
  title: string
  slug: string
  description: string
  thumbnailUrl: string
  status: string
  subclasses: SubClassData[]
  createdAt: string
  updateAt: string
}

export interface SubClassData {
  id: number
  title: string
  slug: string
  description: string
  orderIndex: number
  videoUrl: string
  videoStatus: string
  thumbnailUrl: string
  classId: number
  createdAt: string
  updatedAt: string
  class?: ClassData
}

export type ClassListResponse = ApiResponseMeta<ClassData[]>
