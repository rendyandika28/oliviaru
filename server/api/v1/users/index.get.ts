import { H3Event } from 'h3';
import { ApiResponseFormatter } from '~/utils/api';
import { getUserList } from '~/server/services/user.service';

export default defineEventHandler(async (event: H3Event) => {
  await requireAdmin(event);
  const { page, limit, offset, search } = parsePagination(event);
  const { users, total } = await getUserList({ page, limit, offset, search });
  return ApiResponseFormatter(200, 'Success', users, buildPaginationMeta(total, page, limit));
});
