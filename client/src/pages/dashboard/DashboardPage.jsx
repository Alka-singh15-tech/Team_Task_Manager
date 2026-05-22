import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { 
  BriefcaseIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Badge } from '../../components/common';

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="h-8 w-8 text-white" />
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;

  const chartData = [
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#6366f1' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#f59e0b' },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#10b981' },
    { name: 'Overdue', value: tasks.filter(t => t.status === 'overdue').length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <Badge color="purple">{user?.role.toUpperCase()}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Projects" value={totalProjects} icon={BriefcaseIcon} color="bg-blue-500" />
        <StatsCard title="Total Tasks" value={totalTasks} icon={ClockIcon} color="bg-indigo-500" />
        <StatsCard title="Completed" value={completedTasks} icon={CheckCircleIcon} color="bg-green-500" />
        <StatsCard title="Overdue" value={overdueTasks} icon={ExclamationCircleIcon} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6 dark:text-white">Task Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-lg font-semibold mb-6 dark:text-white">Recent Activities</h3>
           <div className="space-y-4">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className={`mt-1 h-2.5 w-2.5 rounded-full ${task.status === 'done' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.project?.name}</p>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No tasks found.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
