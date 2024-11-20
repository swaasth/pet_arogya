import 'next-auth';

declare module 'next-auth' {
  interface User {
    role: string;
    profileId: string;
  }

  interface Session {
    user: User & {
      role: string;
      profileId: string;
    };
  }
} 