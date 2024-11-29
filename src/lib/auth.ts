import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { getServerSession } from 'next-auth/next'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        // If user doesn't exist, create one
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              full_name: user.name || '',
              role: 'pet_owner',
              password_hash: '', // Empty for Google auth users
            },
          })
        }
      }
      return true
    },
  },
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

// Type declarations
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      email: string
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    role: string
    email: string
    name?: string | null
    image?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
} 

async function authorize(credentials: Record<string, string> | undefined) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Invalid credentials')
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  })

  if (!user) {
    throw new Error('InvalidCredentials')
  }

  // Check if this is a Google-authenticated user
  if (user.provider === 'google') {
    throw new Error('GoogleUser')
  }

  // Only verify password if it exists
  if (!user.password_hash) {
    throw new Error('GoogleUser')
  }

  const isValidPassword = await bcrypt.compare(
    credentials.password,
    user.password_hash
  )

  if (!isValidPassword) {
    throw new Error('InvalidCredentials')
  }

  return user
} 