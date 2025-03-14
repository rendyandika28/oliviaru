import { getServerSession } from "#auth"; // Import from Nuxt Auth
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const requestUrl = getRequestURL(event)
  const isApiRouting = requestUrl.pathname.includes('/api/v1')

  // Check for authentication when accessing API
  if (isApiRouting) {
    // const requestedWith = getRequestHeader(event, 'x-requested-with')
    // if (requestedWith !== 'XMLHttpRequest') {
    //   throw createError({
    //     statusCode: 403,
    //     message: 'Forbidden Access',
    //   })
    // }

    // const session = await getServerSession(event);
    // if (!session) {
    //   throw createError({
    //     statusCode: 401,
    //     message: 'Unauthorized',
    //   })
    // }
  }
})
