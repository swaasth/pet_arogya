'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const [role, setRole] = useState<'pet_owner' | 'veterinary'>('pet_owner');
  const [isLoading, setIsLoading] = useState(false);
  const [vetFields, setVetFields] = useState({
    license_no: '',
    specialization: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          ...(role === 'veterinary' ? vetFields : {}),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      toast.success('Role updated successfully');
      router.refresh();
      onClose();
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Complete Your Profile
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">I am a:</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="pet_owner"
                    checked={role === 'pet_owner'}
                    onChange={(e) => setRole(e.target.value as 'pet_owner')}
                    className="mr-2"
                  />
                  Pet Owner
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="veterinary"
                    checked={role === 'veterinary'}
                    onChange={(e) => setRole(e.target.value as 'veterinary')}
                    className="mr-2"
                  />
                  Veterinarian
                </label>
              </div>
            </div>

            {role === 'veterinary' && (
              <>
                <div>
                  <label className="block text-sm font-medium">License Number</label>
                  <input
                    type="text"
                    required
                    value={vetFields.license_no}
                    onChange={(e) => setVetFields(prev => ({
                      ...prev,
                      license_no: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Specialization</label>
                  <input
                    type="text"
                    value={vetFields.specialization}
                    onChange={(e) => setVetFields(prev => ({
                      ...prev,
                      specialization: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 