import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Projects', path: '/projects', icon: FolderIcon },
    { name: 'My Tasks', path: '/tasks', icon: ClipboardDocumentListIcon },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Users', path: '/admin/users', icon: UsersIcon });
  }

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg transition-colors group ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                  }`
                }
                onClick={() => window.innerWidth < 640 && toggleSidebar()}
              >
                <item.icon className="w-5 h-5 transition duration-75" />
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
          <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
             <button
                onClick={logout}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                <span className="ml-3">Logout</span>
              </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
