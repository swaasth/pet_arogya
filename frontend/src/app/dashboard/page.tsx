import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user.full_name || user.email}</p>
      <div>
        <h2>Your Profile</h2>
        <p>Role: {user.role}</p>
        {user.contact && <p>Contact: {user.contact}</p>}
        {user.address && <p>Address: {user.address}</p>}
        {user.role === 'veterinary' && (
          <>
            {user.license_no && <p>License: {user.license_no}</p>}
            {user.specialization && <p>Specialization: {user.specialization}</p>}
          </>
        )}
      </div>
    </div>
  );
} 