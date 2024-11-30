import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password_hash) {
          throw new Error('No user found')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.role,
          image: user.image
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user with pending role status
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                full_name: user.name,
                image: user.image,
                role: "pending", // New status
                emailVerified: new Date(),
              },
            });
            
            // Add a flag to the token to indicate role selection is needed
            user.needsRoleSelection = true;
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, _account, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        // Pass the role selection flag to the token
        if (user.needsRoleSelection) {
          token.needsRoleSelection = true;
        }
      }
      return token;
    },
    // @ts-expect-error - NextAuth.js callback signature
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session({ session, _profile, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        // Pass the role selection flag to the session
        session.user.needsRoleSelection = token.needsRoleSelection as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    signOut: '/auth/signout',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
}; 