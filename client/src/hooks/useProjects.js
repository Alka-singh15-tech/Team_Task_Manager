import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axiosInstance';

export const useProjects = () => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await axios.get('/projects');
      return data.data;
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (newProject) => {
      const { data } = await axios.post('/projects', newProject);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await axios.put(`/projects/${id}`, updateData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
  };
};

export const useProject = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await axios.get(`/projects/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
