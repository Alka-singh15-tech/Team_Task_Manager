import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { Button, Badge, Spinner } from '../../components/common';
import Modal from '../../components/common/Modal';
import { 
  ClipboardDocumentListIcon, 
  UsersIcon, 
  PlusIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { data: project, isLoading: projectLoading } = useProject(id);
  const { createTask, updateTask, deleteTask } = useTasks();
  const { isAdmin, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });

  if (projectLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!project) return <div>Project not found.</div>;

  const handleCreateTask = async (e) => {
    e.preventDefault();
    await createTask({ ...taskForm, projectId: id });
    setIsTaskModalOpen(false);
    setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask({ id: taskId, status: newStatus });
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{project.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{project.description}</p>
          </div>
          <Badge color={project.status === 'completed' ? 'green' : 'blue'}>{project.status.toUpperCase()}</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t dark:border-gray-700">
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Deadline</p>
                <p className="text-sm font-semibold dark:text-gray-200">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</p>
              </div>
           </div>
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
                <TagIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Owner</p>
                <p className="text-sm font-semibold dark:text-gray-200">{project.owner?.name}</p>
              </div>
           </div>
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
                <UsersIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Team Size</p>
                <p className="text-sm font-semibold dark:text-gray-200">{project.members?.length} Members</p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex space-x-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'tasks' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-600' : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          <ClipboardDocumentListIcon className="h-5 w-5" />
          <span>Tasks</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'members' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-600' : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          <UsersIcon className="h-5 w-5" />
          <span>Members</span>
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">Project Tasks</h2>
            {isAdmin && (
              <Button onClick={() => setIsTaskModalOpen(true)} className="flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Add Task</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {project.tasks?.map((task) => (
              <div key={task.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`h-12 w-1 border-l-4 ${task.status === 'done' ? 'border-green-500' : 'border-indigo-500'} rounded-full`}></div>
                  <div>
                    <h4 className={`font-bold dark:text-white ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>{task.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.assignee?.name || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="hidden md:block">
                    <Badge color={getPriorityColor(task.priority)}>{task.priority.toUpperCase()}</Badge>
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="text-sm border-none bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={!isAdmin && task.assigneeId !== currentUser?.id}
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            ))}
            {project.tasks?.length === 0 && (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl">
                 <p className="text-gray-500 italic">No tasks created yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {project.members?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 dark:text-gray-200 font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{member.email}</td>
                  <td className="px-6 py-4"><Badge color={member.role === 'admin' ? 'purple' : 'blue'}>{member.role}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Add Project Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
           <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Task Title</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={taskForm.title}
              onChange={e => setTaskForm({...taskForm, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Description</label>
            <textarea 
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              value={taskForm.description}
              onChange={e => setTaskForm({...taskForm, description: e.target.value})}
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Priority</label>
                <select 
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                  value={taskForm.priority}
                  onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Due Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                  value={taskForm.dueDate}
                  onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})}
                />
             </div>
          </div>
          <Button type="submit" className="w-full">Create Task</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
