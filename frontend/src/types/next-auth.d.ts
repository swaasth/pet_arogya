import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role: 'pet_owner' | 'veterinary';
    profileId: string;
    name?: string;
  }

  interface Session {
    user: User;
  }
} 