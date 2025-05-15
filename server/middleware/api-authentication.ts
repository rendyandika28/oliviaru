import { H3Event } from "h3";
import { getServerSession } from '#auth';
import { verifyAccessToken } from "~/utils/auth";
import { UserToken } from "../database/schema";

export default defineEventHandler(async (event: H3Event) => {
  const requestUrl = getRequestURL(event);
  const isApiRouting = requestUrl.pathname.includes('/api/v1');
  const publicRouting = ['/api/v1/class'];

  // Only proceed if route is under /api/v1
  if (!isApiRouting) return;

  const session = await getServerSession(event);
  const accessToken = session?.accessToken

  // If user has accessToken, always verify it — even on public routes
  if (accessToken) {
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
    }) as unknown as UserToken;

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

    // Attach userId to event.context.auth
    event.context.auth = { userId: decoded.userId };
  }

  // If not a public route and no token, reject
  if (!accessToken && !publicRouting.some(route => requestUrl.pathname.startsWith(route))) {
    return sendError(event, {
      statusCode: 401,
      statusMessage: "Unauthorized: Missing token",
      name: "",
      message: ""
    });
  }
});
