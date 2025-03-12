import { NuxtAuthHandler } from '#auth';
import GoogleProvider from 'next-auth/providers/google';
import { GoogleAuthResponse } from '~/types/type.auth';

async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000, // Expiry time in ms
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Keep the old refresh token if new one is not returned
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: useRuntimeConfig().authSecretKey,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientID,
      clientSecret: useRuntimeConfig().googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  ],
  pages: {
    signIn: "/auth/login",
  },
  // your authentication configuration here!
  callbacks: {
    /* on before signin */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { provider, providerAccountId } = account as GoogleAuthResponse;

        const existingUsers = await useDrizzle().select({ id: tables.user.id, role: tables.user.role, user_status: tables.user.userStatus }).from(tables.user).where(and(
          eq(tables.user.provider, provider),
          eq(tables.user.providerAccountId, providerAccountId),
        ))

        const _user = existingUsers[0];

        if (!_user) {
          // Create new user
          await useDrizzle().insert(tables.user).values({
            email: user.email as string,
            image: user.image,
            name: user.name,
            provider,
            providerAccountId,
            // Default values for role and userStatus will be applied as defined in the schema
          }).execute();

          return '/auth/login?error=newUserPending';
        }

        if (!_user || _user.user_status === 'PENDING') {
          return '/auth/login?error=userPending';
        }

        user.id = _user.id;
        user.role = _user.role;
      }
      return true;
    },
    /* on redirect to another url */
    async redirect({ baseUrl }) {
      return baseUrl
    },
    /* on session retrival */
    async session({ session, token }) {
      if (token?.error === "RefreshAccessTokenError") {
        return null;
      }

      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }

      return session
    },
    /* on JWT token creation or mutation */
    async jwt({ token, user, account }) {
      if (account) {
        token.id = account.providerAccountId;
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : null;
        token.refreshToken = account.refresh_token;
      }

      if (user) {
        token.id = user.id; // Attach id to JWT token
        token.role = user.role; // Attach role to JWT token
      }

      // If access token is expired, refresh it
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        return await refreshAccessToken(token);
      }

      return token
    }
  },
  session: {
    strategy: 'jwt'
  }
})
