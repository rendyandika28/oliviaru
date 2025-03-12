export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

export type ApiResponseMeta<T = unknown> = ApiResponse<T> & {
  meta: PaginationMeta
}
