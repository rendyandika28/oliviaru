import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';
import { getClassList } from '~/server/services/class.service';

export default defineEventHandler(async (event: H3Event) => {
  const { page, limit, offset, search } = parsePagination(event);
  const { classes, total } = await getClassList({ page, limit, offset, search });
  return ApiResponseFormatter(200, 'Success', classes, buildPaginationMeta(total, page, limit));
});
