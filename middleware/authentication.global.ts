const PROTECTED_PATH_PREFIXES = ['internal'] as const;
const PROTECTED_ROUTE_NAMES = ['class-slug-materiSlug'] as const;

export default defineNuxtRouteMiddleware(async (to) => {
  const { status } = useAuth();
  const { user } = storeToRefs(useAuthStore());

  if (status.value === 'authenticated' && to.path === '/auth/login') {
    return navigateTo('/');
  }

  if (status.value === 'authenticated') {
    if (user.value && user.value.role !== 'SUPER_ADMIN' && to.path.startsWith('/internal/')) {
      return navigateTo('/class');
    }
    return;
  }

  const isProtectedPath = PROTECTED_PATH_PREFIXES.some((route) =>
    to.path.startsWith(`/${route}`)
  );
  const isProtectedName = PROTECTED_ROUTE_NAMES.includes(
    to.name as (typeof PROTECTED_ROUTE_NAMES)[number]
  );

  if (isProtectedPath || isProtectedName) {
    return navigateTo('/auth/login?error=Unauthorized');
  }
});
