'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PawPrintIcon, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const { status } = useSession()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        if (result.error === 'GoogleUser') {
          setError('This email is registered with Google. Please use "Continue with Google" to sign in.')
        } else {
          setError('Invalid email or password')
        }
      } else {
        router.push(callbackUrl)
      }
    } else {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (res.ok) {
          await signIn('credentials', {
            redirect: false,
            email,
            password,
          })
          router.push('/dashboard')
        } else {
          setError('Registration failed')
        }
      } catch (err) {
        setError('Something went wrong')
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const result = await signIn('google', {
        callbackUrl,
        redirect: true,
      })
      
      if (result?.error) {
        setError('Failed to sign in with Google')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <Link href="/" className="flex items-center mb-8 group">
        <motion.div
          whileHover={{ rotate: 10 }}
          className="bg-white/30 backdrop-blur-sm p-3 rounded-full"
        >
          <PawPrintIcon className="h-10 w-10 text-purple-600" />
        </motion.div>
        <span className="ml-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Pet Arogya
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Main Container */}
        <div className="relative bg-white/40 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50">
          {/* Sliding Background */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                x: isLogin ? '0%' : '100%',
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="absolute inset-0 w-1/2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm"
            />
          </div>

          {/* Content */}
          <div className="px-8 py-10 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back!' : 'Join Us!'}
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  {isLogin 
                    ? 'Your pets are waiting for you 🐾' 
                    : 'Start your pet care journey today 🌟'}
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 rounded-lg bg-red-50/50 backdrop-blur-sm border border-red-200 text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full mb-6 flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-300 bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all text-gray-700 font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <img src="/google.svg" alt="Google" className="w-5 h-5" />
                  )}
                  Continue with Google
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/50 backdrop-blur-sm text-gray-500">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full rounded-lg border-gray-200 bg-white/50 backdrop-blur-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 w-full rounded-lg border-gray-200 bg-white/50 backdrop-blur-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your password"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </form>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-purple-600 hover:text-purple-500"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>

            {isLogin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center"
              >
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-gray-600 hover:text-purple-500"
                >
                  Forgot your password?
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 inset-0 blur-3xl opacity-30">
          <div className="absolute right-1/2 bottom-0 w-[200px] h-[200px] bg-purple-400 rounded-full" />
          <div className="absolute left-1/2 top-0 w-[200px] h-[200px] bg-pink-400 rounded-full" />
        </div>
      </motion.div>
    </div>
  )
} 