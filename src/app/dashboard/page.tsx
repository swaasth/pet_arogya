import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard/Dashboard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  try {
    // Only fetch basic user data needed for the dashboard
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true
      }
    });

    if (!user) {
      redirect('/auth/login');
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Dashboard user={user} />
      </div>
    );
  } catch (error) {
    console.error('Error in DashboardPage:', error);
    throw error;
  }
} 