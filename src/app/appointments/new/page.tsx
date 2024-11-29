import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import NewAppointmentForm from '@/components/appointments/NewAppointmentForm'

export default async function NewAppointmentPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's pets
  const pets = await prisma.dog.findMany({
    where: {
      owners: {
        some: {
          ownerId: user.id
        }
      }
    },
    select: {
      id: true,
      name: true,
      breed: true
    }
  })

  // Fetch available vets
  const vets = await prisma.user.findMany({
    where: {
      role: 'vet'
    },
    select: {
      id: true,
      full_name: true,
      specialization: true
    }
  })

  return <NewAppointmentForm pets={pets} vets={vets} />
} 