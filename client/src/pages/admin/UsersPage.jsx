import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import { Badge, Spinner } from '../../components/common';
import { UserCircleIcon, EnvelopeIcon, ShieldCheckIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const UsersPage = () => {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Team Management</h1>
        <Badge color="purple">{users?.length} Total Users</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`h-14 w-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-inner ${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                 {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
                <Badge color={user.role === 'admin' ? 'purple' : 'blue'}>{user.role.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
               <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>{user.email}</span>
               </div>
               <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Status: Active</span>
               </div>
               <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
            
            <div className="mt-6 pt-6 border-t dark:border-gray-700 flex gap-2">
                <button className="flex-1 text-xs font-bold py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors">View Profile</button>
                {user.role !== 'admin' && (
                    <button className="flex-1 text-xs font-bold py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">Promote</button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
