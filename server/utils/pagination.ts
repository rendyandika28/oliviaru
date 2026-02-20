import { H3Event } from 'h3';
import type { PaginationMeta } from '~/types/responses/base_response_type';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  search: string | null;
}

export function parsePagination(event: H3Event): PaginationParams {
  const query = getQuery(event);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const offset = (page - 1) * limit;
  const rawSearch = typeof query.searchQuery === 'string' ? query.searchQuery.trim() : '';
  const search = rawSearch.length > 0 ? `%${rawSearch}%` : null;
  return { page, limit, offset, search };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    total,
    perPage: limit,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}
