import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, BrainCircuit } from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Panel */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between h-20 px-6 border-b border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-300"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-brand-500 rounded-lg text-white">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <span className="font-outfit font-bold text-slate-800 dark:text-slate-200">
                ATS Analyzer
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
