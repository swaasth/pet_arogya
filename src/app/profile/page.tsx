import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const userWithDetails = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      full_name: true,
      contact: true,
      address: true,
      role: true,
      license_no: true,
      specialization: true,
    }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account settings
          </p>
        </div>
        <ProfileForm user={userWithDetails} />
      </div>
    </div>
  )
} 