import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import type { AuthOptions } from "next-auth"


declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      image?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    image?: string
  }
}

export const authOptions: AuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: { scope: "identify" } },
            profile(p) {
                return {
                    id: p.id,
                    name: p.username,
                    image: p.avatar
                        ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png`
                        : null
                }
            }
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,

    session: { strategy: "jwt"},

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name!
                token.image = user.image!
            }
            return token
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name,
                image: token.image
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };