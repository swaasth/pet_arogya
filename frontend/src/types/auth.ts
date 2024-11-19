import 'next-auth';

declare module 'next-auth' {
  interface User {
    role: 'pet_owner' | 'veterinary';
    profileId: string;
  }

  interface Session {
    user: User & {
      role: 'pet_owner' | 'veterinary';
      profileId: string;
    };
  }
} 