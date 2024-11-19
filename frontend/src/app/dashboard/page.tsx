import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome, {user.name || user.email}
      </h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Your Profile</h2>
          <p className="text-sm text-gray-500">
            Role: {user.role === 'pet_owner' ? 'Pet Owner' : 'Veterinarian'}
          </p>
        </div>

        {user.role === 'pet_owner' ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Pets</h3>
            {/* Add pet listing component here */}
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Add New Pet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Appointments</h3>
            {/* Add appointments listing component here */}
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              View Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 