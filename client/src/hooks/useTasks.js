import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axiosInstance';

export const useTasks = (filters = {}) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const { data } = await axios.get('/tasks', { params: filters });
      return data.data;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const { data } = await axios.post('/tasks', newTask);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await axios.put(`/tasks/${id}`, updateData);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.projectId] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
};
