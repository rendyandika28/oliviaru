import { NuxtAuthHandler } from '#auth';
import GoogleProvider from 'next-auth/providers/google';
import { GoogleAuthResponse } from '~/types/type.auth';
import { generateAccessToken } from '~/utils/auth';

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

        const existingUser = await useDrizzle().query.user.findFirst({
          where: and(
            eq(tables.user.provider, provider),
            eq(tables.user.providerAccountId, providerAccountId),
          )
        })

        if (!existingUser) {
          // Create new user
          await useDrizzle().insert(tables.user).values({
            email: user.email as string,
            image: user.image,
            name: user.name,
            provider,
            providerAccountId,
          }).execute();

          return '/auth/login?error=newUserPending';
        }

        if (!existingUser || existingUser.userStatus === 'PENDING') {
          return '/auth/login?error=userPending';
        }

        user.id = existingUser.id;
        user.role = existingUser.role;
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
      if (account && user) {
        token.id = user.id;
        token.role = user.role;
        const accessToken = generateAccessToken(user.id); // Generate custom token
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days

        const existingToken = await useDrizzle()
          .select()
          .from(tables.userToken)
          .where(eq(tables.userToken.userId, user.id))
          .limit(1);

        if (existingToken.length > 0) {
          // Update existing token
          await useDrizzle()
            .update(tables.userToken)
            .set({ token: accessToken, expiresAt })
            .where(eq(tables.userToken.userId, user.id))
            .execute();
        } else {
          // Insert new token
          await useDrizzle()
            .insert(tables.userToken)
            .values({
              userId: user.id,
              token: accessToken,
              expiresAt,
            })
            .execute();
        }

        token.accessToken = accessToken; // Set custom token in JWT
        token.accessTokenExpires = expiresAt.getTime(); // Set custom token expiration
      }

      return token;
    }
  },
  session: {
    strategy: 'jwt'
  }
})
