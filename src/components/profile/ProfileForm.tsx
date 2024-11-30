'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { 
  UserIcon, 
  KeyIcon,
  SaveIcon,
  ShieldIcon,
} from 'lucide-react'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  contact: z.string().min(10, 'Please enter a valid contact number'),
  address: z.string().min(5, 'Please enter a valid address'),
  specialization: z.string().optional(),
  license_no: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

interface ProfileFormProps {
  user: {
    id: string
    email: string
    full_name: string | null
    contact: string | null
    address: string | null
    role: string
    license_no: string | null
    specialization: string | null
  } | null
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      contact: user?.contact || '',
      address: user?.address || '',
      specialization: user?.specialization || '',
      license_no: user?.license_no || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update profile')
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPasswordSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update password')
      toast.success('Password updated successfully')
      resetPassword()
      setIsChangingPassword(false)
    } catch {
      toast.error('Failed to update password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
        </div>
        
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                {...registerProfile('full_name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              {profileErrors.full_name && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                {...registerProfile('contact')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              {profileErrors.contact && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.contact.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                {...registerProfile('address')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              {profileErrors.address && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.address.message}</p>
              )}
            </div>

            {user?.role === 'vet' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    License Number
                  </label>
                  <input
                    type="text"
                    {...registerProfile('license_no')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    {...registerProfile('specialization')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <ShieldIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Security</h2>
        </div>

        {!isChangingPassword ? (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <KeyIcon className="h-4 w-4 mr-2" />
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  {...registerPassword('currentPassword')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.currentPassword?.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  {...registerPassword('newPassword')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.newPassword?.message?.toString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...registerPassword('confirmPassword')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.confirmPassword?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  )
} 