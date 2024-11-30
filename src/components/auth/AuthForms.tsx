'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc';
import AuthLayout from './AuthLayout';
import { authSchema } from '@/lib/validations/auth';

type FormData = {
  email: string;
  password: string;
  role?: 'pet_owner' | 'veterinary';
  full_name?: string;
  license_no?: string;
  specialization?: string;
};

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const form = useForm<FormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "pet_owner",
    },
  });

  const showVetFields = !isLogin && form.watch('role') === 'veterinary';

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      if (isLogin) {
        // Handle Login
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        router.push(callbackUrl);
      } else {
        // Handle Registration
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        // After successful registration, sign in automatically
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl,
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", {
        callbackUrl,
      });
    } catch {
      toast.error('Failed to sign in with Google')
    } finally {
      setIsGoogleLoading(false)
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 mb-8">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isLogin
                ? 'bg-purple-100 text-purple-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isLogin
                ? 'bg-purple-100 text-purple-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors mb-6"
        >
          <FcGoogle className="text-xl" />
          {isGoogleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <input
              {...form.register('email')}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <input
              {...form.register('password')}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {!isLogin && (
              <>
                <input
                  {...form.register('full_name')}
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="flex gap-2">
                  <label className="flex items-center">
                    <input
                      {...form.register('role')}
                      type="radio"
                      value="pet_owner"
                      className="mr-2"
                    />
                    Pet Owner
                  </label>
                  <label className="flex items-center">
                    <input
                      {...form.register('role')}
                      type="radio"
                      value="veterinary"
                      className="mr-2"
                    />
                    Veterinarian
                  </label>
                </div>

                {showVetFields && (
                  <>
                    <input
                      {...form.register('license_no')}
                      type="text"
                      placeholder="License Number"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      {...form.register('specialization')}
                      type="text"
                      placeholder="Specialization"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
} 