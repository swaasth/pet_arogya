/* eslint-disable @typescript-eslint/no-empty-interface */
import { User as PrismaUser } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      name?: string | null
      image?: string | null
      needsRoleSelection?: boolean
    }
  }

  interface User extends PrismaUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    role: string
    name?: string | null
    image?: string | null
    needsRoleSelection?: boolean
  }
}

export {} 