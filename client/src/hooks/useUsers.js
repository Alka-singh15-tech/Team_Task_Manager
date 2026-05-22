import { useQuery } from '@tanstack/react-query';
import axios from '../api/axiosInstance';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('/users');
      return data.data;
    },
  });
};
