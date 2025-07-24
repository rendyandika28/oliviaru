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
  accessExpiresAt?: string
  accessGranted?: boolean
  accessStatus?: string
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
  attachmentUrl: string
  classId: number
  createdAt: string
  updatedAt: string
  class?: ClassData
  nextSubClassSlug:string
}

export type ClassListResponse = ApiResponseMeta<ClassData[]>
