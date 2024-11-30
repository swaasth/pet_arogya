import { NextAuthOptions, User as NextAuthUser } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { User } from "@prisma/client"

interface CustomUser extends Omit<NextAuthUser, 'name'> {
  role: string
  needsRoleSelection?: boolean
  full_name: string | null
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _req): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password_hash) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.password_hash)

        if (!isValid) {
          return null
        }

        return user
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as CustomUser).role
        token.name = (user as CustomUser).full_name
        token.needsRoleSelection = (user as CustomUser).needsRoleSelection
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name
        session.user.needsRoleSelection = token.needsRoleSelection as boolean
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  }
} 