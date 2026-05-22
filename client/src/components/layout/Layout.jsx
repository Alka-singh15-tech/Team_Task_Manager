import React, { useState } from 'react';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="p-4 sm:ml-64 pt-20">
        <div className="p-4 rounded-lg bg-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
