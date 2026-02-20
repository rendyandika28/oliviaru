import { H3Event } from 'h3';
import { getServerSession } from '#auth';
import { verifyAccessToken } from '~/utils/auth';

const PUBLIC_ROUTES: Array<{ path: string; methods?: string[] }> = [
  { path: '/api/v1/class', methods: ['GET'] },
  { path: '/api/v1/subclass', methods: ['GET'] },
];

function isPublicRoute(pathname: string, method: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    const pathMatch = pathname === route.path || pathname.startsWith(route.path + '/');
    const methodMatch = !route.methods || route.methods.includes(method.toUpperCase());
    return pathMatch && methodMatch;
  });
}

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event);
  const method = getMethod(event);

  if (!url.pathname.startsWith('/api/v1')) return;

  const session = await getServerSession(event);
  const accessToken = session?.accessToken;

  if (accessToken) {
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Invalid or expired token' });
    }
    event.context.auth = { userId: decoded.userId };
    return;
  }

  if (!isPublicRoute(url.pathname, method)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Authentication required' });
  }
});
