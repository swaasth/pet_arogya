import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HealthMetrics from '@/components/HealthMetrics';
import DogList from '@/components/dogs/DogList';
import { Suspense } from 'react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back, {user.name || user.email}
          </h2>
        </div>
      </div>

      <Suspense fallback={<div>Loading health metrics...</div>}>
        <HealthMetrics />
      </Suspense>

      <div className="mt-8">
        <Suspense fallback={<div>Loading dogs...</div>}>
          <DogList />
        </Suspense>
      </div>
    </div>
  );
} 