'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import AuthLayout from './AuthLayout';

export default function AuthForms() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'pet_owner' | 'veterinary'>('pet_owner');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      role,
      profileData: {
        fullName: formData.get('fullName'),
        contactNumber: formData.get('contactNumber'),
        ...(role === 'veterinary' && {
          licenseNumber: formData.get('licenseNumber'),
          specialization: formData.get('specialization'),
          clinicAddress: formData.get('clinicAddress'),
        }),
      },
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success('Registration successful!');
      setIsLogin(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 mb-8">
          <button
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

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {isLogin ? 'Welcome Back! 🐾' : 'Create Account 🐾'}
            </h2>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors mb-6"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              <div className="space-y-4">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Email address"
                />

                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Password"
                />

                {!isLogin && (
                  <>
                    <select
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'pet_owner' | 'veterinary')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="pet_owner">Pet Owner</option>
                      <option value="veterinary">Veterinarian</option>
                    </select>

                    <input
                      name="fullName"
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Full Name"
                    />

                    <input
                      name="contactNumber"
                      type="tel"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Contact Number"
                    />

                    {role === 'veterinary' && (
                      <>
                        <input
                          name="licenseNumber"
                          type="text"
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="License Number"
                        />
                        <input
                          name="specialization"
                          type="text"
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Specialization"
                        />
                        <textarea
                          name="clinicAddress"
                          required
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Clinic Address"
                          rows={3}
                        />
                      </>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {isLoading
                    ? isLogin
                      ? 'Signing in...'
                      : 'Creating account...'
                    : isLogin
                    ? 'Sign in'
                    : 'Create account'}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
} 