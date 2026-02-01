import { useQuery } from '@tanstack/react-query';
import axios from '../api/axios';
import type { Restaurant } from '../../types';

export function useRestaurantsQuery(isLoggedIn: boolean) {
  return useQuery<Restaurant[]>({
    queryKey: ['restaurants', isLoggedIn],
    queryFn: async () => {
      if (isLoggedIn) {
        const { data } = await axios.get('/api/resto/recommended');
        return data?.data?.recommendations ?? [];
      } else {
        const { data } = await axios.get('/api/resto/best-seller?page=1&limit=20');
        return data?.data?.restaurants ?? [];
      }
    },
    staleTime: 60_000,
  });
}