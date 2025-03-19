import { H3Event } from "h3";
import { getServerSession } from '#auth'
import { verifyAccessToken } from "~/utils/auth";
import { UserToken } from "../database/schema";

export default defineEventHandler(async (event: H3Event) => {
  const requestUrl = getRequestURL(event)
  const isApiRouting = requestUrl.pathname.includes('/api/v1')

  // Check for authentication when accessing API
  if (isApiRouting) {
    const { accessToken } = await getServerSession(event)
    if (!accessToken) {
      return sendError(event, {
        statusCode: 401,
        statusMessage: "Unauthorized: Missing token",
        name: "",
        message: ""
      });
    }

    const decoded = verifyAccessToken(accessToken);

    if (!decoded) {
      return sendError(event, {
        statusCode: 401,
        statusMessage: "Unauthorized: Invalid token",
        name: "",
        message: ""
      });
    }

    const existingToken = await useDrizzle().query.userToken.findFirst({
      where: eq(tables.userToken.token, accessToken)
    }) as unknown as UserToken

    if (!existingToken) {
      return sendError(event, {
        statusCode: 401,
        statusMessage: "Unauthorized: Token not found",
        name: "",
        message: ""
      });
    }

    if (new Date(existingToken?.expiresAt) < new Date()) {
      return sendError(event, {
        statusCode: 401,
        statusMessage: "Unauthorized: Token expired",
        name: "",
        message: ""
      });
    }
    event.context.auth = { userId: decoded.userId }; // Attach userId to context
  }
})
