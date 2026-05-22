import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();
  const [dark, setDark] = React.useState(false);

  const toggleDark = () => {
    setDark(!dark);
    if (!dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 backdrop-blur-md bg-opacity-80">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {user && (
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            )}
            <Link to="/" className="flex ml-2 md:mr-24">
              <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap dark:text-white text-indigo-600">
                Ethara TaskManager
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDark}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            {user ? (
              <div className="flex items-center ml-3">
                <div className="flex items-center space-x-3">
                   <div className="text-right hidden md:block">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.role}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {user.name.charAt(0)}
                   </div>
                </div>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition-shadow">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
