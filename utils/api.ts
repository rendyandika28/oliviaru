import type { PaginationMeta } from "~/types/responses/base_response_type"

export const ApiResponseFormatter = <T>(status: number, message: string, data?: T, meta?: PaginationMeta) => {
  return {
    status,
    message,
    data,
    meta
  }
}
