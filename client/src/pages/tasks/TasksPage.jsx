import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { Badge, Spinner } from '../../components/common';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const TasksPage = () => {
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const { tasks, isLoading, updateTask } = useTasks(filters);
  const { isAdmin, user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask({ id: taskId, status: newStatus });
  };

  const statusColors = {
    todo: 'blue',
    'in-progress': 'yellow',
    done: 'green',
    overdue: 'red'
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold dark:text-white">My Tasks</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-10 pr-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="flex gap-2">
              <select 
                className="px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="overdue">Overdue</option>
              </select>
              
              <select 
                className="px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                value={filters.priority}
                onChange={e => setFilters({...filters, priority: e.target.value})}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Task Title</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Project</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {filteredTasks.map((task) => (
              <tr key={task.id} className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${task.status === 'overdue' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white">{task.title}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                    {task.project?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'blue'}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">
                   <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none border-none ${
                        task.status === 'done' ? 'bg-green-100 text-green-800' : 
                        task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}
                    disabled={!isAdmin && task.assigneeId !== currentUser?.id}
                  >
                    <option value="todo">TODO</option>
                    <option value="in-progress">IN PROGRESS</option>
                    <option value="done">DONE</option>
                    <option value="overdue">OVERDUE</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTasks.length === 0 && (
          <div className="text-center py-20">
             <ClipboardDocumentListIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-500">No tasks match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
