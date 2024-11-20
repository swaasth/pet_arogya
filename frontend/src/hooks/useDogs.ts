import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dog } from '@prisma/client';

export function useDogs() {
  const queryClient = useQueryClient();

  const { data: dogs, isLoading, error } = useQuery<Dog[]>({
    queryKey: ['dogs'],
    queryFn: async () => {
      const response = await fetch('/api/dogs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.dogs;
    },
  });

  const createDog = useMutation({
    mutationFn: async (newDog: Omit<Dog, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch('/api/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDog),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] });
    },
  });

  return {
    dogs,
    isLoading,
    error,
    createDog,
  };
} 