import 'next-auth';
import { User as PrismaUser } from '@prisma/client';

declare module 'next-auth' {
  interface User extends PrismaUser {
    profileId: string;
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      role: string;
      profileId: string;
    };
  }
} 