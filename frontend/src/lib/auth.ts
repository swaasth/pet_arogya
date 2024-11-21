import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth-options"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('User not found')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          profileId: user.id
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.profileId = user.profileId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.profileId = token.profileId as string
      }
      return session
    }
  }
} 

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return null
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        full_name: true,
        contact: true,
        address: true,
        license_no: true,
        specialization: true,
        created_at: true,
        updated_at: true,
        last_login: true,
      },
    })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser,
      emailVerified: null,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
} 