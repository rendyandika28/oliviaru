import { NuxtAuthHandler } from '#auth';
import GoogleProvider from 'next-auth/providers/google';
import type { GoogleAuthResponse } from '~/types/type.auth';
import { upsertUserToken } from '~/server/services/auth-token.service';

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecretKey,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientID,
      clientSecret: useRuntimeConfig().googleClientSecret,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { provider, providerAccountId } = account as GoogleAuthResponse;

        const existingUser = await useDrizzle().query.user.findFirst({
          where: and(
            eq(tables.user.provider, provider),
            eq(tables.user.providerAccountId, providerAccountId),
          ),
        });

        if (!existingUser) {
          await useDrizzle().insert(tables.user).values({
            email: user.email as string,
            image: user.image,
            name: user.name,
            provider,
            providerAccountId,
          });
          return `/auth/login?error=newUserPending&email=${user.email}`;
        }

        if (existingUser.userStatus === 'PENDING') {
          return `/auth/login?error=userPending&email=${user.email}`;
        }

        user.id = existingUser.id;
        user.role = existingUser.role;
      }
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      if (token?.error === 'RefreshAccessTokenError') {
        return null;
      }

      if (token?.accessTokenExpires && Date.now() > (token.accessTokenExpires as number)) {
        return null;
      }

      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        token.role = user.role;
        const result = await upsertUserToken(user.id);
        token.accessToken = result.token;
        token.accessTokenExpires = result.expiresAt.getTime();
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
