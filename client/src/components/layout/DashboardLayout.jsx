import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from '../common/ThemeToggle';
import Avatar from '../common/Avatar';
import BrandLogo from '../common/BrandLogo';
import ScrollProgress from '../common/ScrollProgress';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

const DashboardLayout = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  const isMessagesPage = location.pathname.includes('/dashboard/messages');

  return (
    <div className="flex h-screen bg-[#F8FBFF] dark:bg-[#080B12] text-slate-900 dark:text-white transition-colors duration-300">
      <ScrollProgress />

      {/* Sidebar for Desktop & Mobile Drawer */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        role={user?.role}
        user={user}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Sticky Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-[#080B12]/80 backdrop-blur-md border-b border-[#D6EFFF] dark:border-[#22324A] z-30 transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 mr-1 text-slate-500 hover:bg-[#EAF6FF] dark:hover:bg-[#162235] rounded-xl"
              aria-label="Open mobile menu"
            >
              <Menu size={22} />
            </button>
            <div className="md:hidden">
              <BrandLogo size="xs" showText={false} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate font-display">
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <button
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-[#0A84FF] hover:bg-[#EAF6FF] dark:hover:bg-[#162235] rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#0A84FF] rounded-full border border-white dark:border-[#101826]"></span>
            </button>
            <div className="hidden sm:block">
              <Avatar
                src={user?.avatar?.url || user?.avatar || (user?.role === 'freelancer' ? '/freelancers/aarav-desai.webp' : null)}
                name={user?.name || 'User'}
                size="dashboard"
                online
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main data-dashboard-main className={cn(
          "flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FBFF] dark:bg-[#080B12] blueprint-grid",
          isMessagesPage ? "" : "p-4 sm:p-6 lg:p-8"
        )}>
          <div className={cn(
            isMessagesPage ? "w-full h-full" : "max-w-7xl mx-auto"
          )}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
