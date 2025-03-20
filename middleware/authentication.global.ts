// file: ~/middleware/authentication.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const { status } = useAuth()
  const { user } = storeToRefs(useAuthStore())

  // If authenticated user tries to access login page, redirect to home
  if (status.value === 'authenticated' && to.path === '/auth/login') {
    return navigateTo('/')
  }

  // Return immediately if user is already authenticated
  if (status.value === 'authenticated') {
    // Check if user is not SUPER_ADMIN and trying to access internal routes
    if (user.value && user.value?.role !== 'SUPER_ADMIN' && to.path.startsWith('/internal/')) {
      return navigateTo('/class')
    }
    return
  }

  // PROTECTED ROUTES
  // Define routes that require authentication
  const protectedRoutes = ['internal']
  const protectedRoutesName = ['class-slug-materiSlug']

  // Check if the current route starts with any of the protected route prefixes
  const isProtectedPath = protectedRoutes.some(route =>
    to.path.startsWith(`/${route}`)
  )

  // Check if the current named route is in the protected routes
  const isProtectedName = protectedRoutesName.includes(to.name as string);

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedPath || isProtectedName) {
    return navigateTo('/auth/login?error=Unauthorized')
  }
})
