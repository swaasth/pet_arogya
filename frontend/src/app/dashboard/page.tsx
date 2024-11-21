import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Dashboard from '@/components/dashboard/Dashboard';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <Dashboard user={user} />;
} 