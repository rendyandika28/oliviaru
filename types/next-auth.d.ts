import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      email: string
      id: string
      image: string
      name: string
      role: string
    },
    accessToken: string
  }
}
