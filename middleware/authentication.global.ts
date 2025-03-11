// file: ~/middleware/authentication.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()

  // If authenticated user tries to access login page, redirect to home
  if (status.value === 'authenticated' && to.path === '/auth/login') {
    return navigateTo('/')
  }

  // Return immediately if user is already authenticated
  if (status.value === 'authenticated') {
    return
  }

  // Define routes that require authentication
  const protectedRoutes = ['class', 'internal']

  // Check if the current route starts with any of the protected route prefixes
  const isProtectedRoute = protectedRoutes.some(route =>
    to.path.startsWith(`/${route}`)
  )

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute) {
    return navigateTo('/auth/login?error=Unauthorized')
  }
})
