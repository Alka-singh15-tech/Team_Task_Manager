import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../context/AuthContext';
import { Button, Badge, Spinner } from '../../components/common';
import Modal from '../../components/common/Modal';
import { PlusIcon, CalendarIcon, UserGroupIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', deadline: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    await createProject(formData);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', deadline: '' });
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Projects</h1>
        {isAdmin && (
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>New Project</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{project.name}</h3>
                <Badge color={project.status === 'completed' ? 'green' : 'blue'}>{project.status}</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 h-10">{project.description || 'No description provided.'}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>{project.members?.length || 0} Members</span>
                </div>
              </div>

              {isAdmin && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                   <button onClick={(e) => handleDelete(project.id, e)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded">
                      <TrashIcon className="h-4 w-4" />
                   </button>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
           <FolderIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
           <p className="text-gray-500">No projects found. Create one to get started!</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Project Name</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Description</label>
            <textarea 
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Deadline</label>
            <input 
              type="date" 
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full">Create Project</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
