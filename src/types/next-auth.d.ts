import 'next-auth';
import { User as PrismaUser } from '@prisma/client';
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User extends PrismaUser {
    needsRoleSelection?: boolean
    role: string
    profileId: string
  }

  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
} 