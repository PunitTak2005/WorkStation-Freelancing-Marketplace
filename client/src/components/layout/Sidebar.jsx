import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  CreditCard,
  User,
  Users,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';

const getLinksForRole = (role) => {
  const normalizedRole = role?.toUpperCase() || 'FREELANCER';

  switch (normalizedRole) {
    case 'CLIENT':
      return [
        { name: 'Dashboard', path: '/dashboard/client', icon: LayoutDashboard },
        { name: 'Projects', path: '/dashboard/projects', icon: Briefcase },
        { name: 'Post Project', path: '/dashboard/post-job', icon: FileText },
        { name: 'Payments', path: '/dashboard/payments', icon: CreditCard },
        { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
        { name: 'Profile', path: '/dashboard/profile', icon: User },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
      ];
    case 'ADMIN':
      return [
        { name: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Users', path: '/dashboard/admin/users', icon: Users },
        { name: 'Jobs', path: '/dashboard/admin/jobs', icon: Briefcase },
        { name: 'Reports', path: '/dashboard/admin/reports', icon: BarChart },
        { name: 'Payments', path: '/dashboard/admin/payments', icon: CreditCard },
        { name: 'Profile', path: '/dashboard/profile', icon: User },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
      ];
    case 'FREELANCER':
    default:
      return [
        { name: 'Dashboard', path: '/dashboard/freelancer', icon: LayoutDashboard },
        { name: 'Proposals', path: '/dashboard/proposals', icon: FileText },
        { name: 'Contracts', path: '/dashboard/contracts', icon: Briefcase },
        { name: 'Earnings', path: '/dashboard/earnings', icon: CreditCard },
        { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
        { name: 'Profile', path: '/dashboard/profile', icon: User },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
      ];
  }
};

const Sidebar = ({ isCollapsed, toggleCollapse, mobileOpen, setMobileOpen, role = 'FREELANCER', user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = getLinksForRole(role);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-[#080B12] border-r border-[#D6EFFF] dark:border-[#22324A] transition-colors duration-300">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#D6EFFF] dark:border-[#22324A]">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <BrandLogo
            size="sm"
            showText={!isCollapsed || mobileOpen}
          />
        </NavLink>
        <button
          onClick={toggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg bg-[#EAF6FF] dark:bg-[#162235] text-slate-500 hover:text-[#0A84FF] transition-colors"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/dashboard'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group border-l-4',
                  isActive
                    ? 'border-[#0A84FF] bg-[#EAF6FF] text-[#0A84FF] dark:bg-[#162235] dark:text-[#2FA8FF] dark:border-[#2FA8FF] font-semibold shadow-sm shadow-[#0A84FF]/10'
                    : 'border-transparent text-slate-600 hover:bg-[#F8FBFF] dark:text-[#A8C0D8] dark:hover:bg-[#101826] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF]'
                )
              }
              title={isCollapsed && !mobileOpen ? link.name : undefined}
            >
              <Icon className={cn('flex-shrink-0 w-5 h-5 transition-transform group-hover:scale-105', isCollapsed && !mobileOpen ? 'mx-auto' : 'mr-3')} />
              <span className={cn('whitespace-nowrap transition-all duration-300', isCollapsed && !mobileOpen ? 'opacity-0 w-0 hidden' : 'opacity-100')}>
                {link.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Mini Profile & Logout */}
      <div className="p-3 border-t border-[#D6EFFF] dark:border-[#22324A] space-y-2">
        <div className={cn('flex items-center p-2 rounded-xl bg-[#F8FBFF] dark:bg-[#101826] border border-[#D6EFFF]/80 dark:border-[#22324A]', isCollapsed && !mobileOpen ? 'justify-center' : 'space-x-3')}>
          <Avatar
            src={user?.avatar?.url || user?.avatar || (user?.role === 'freelancer' ? '/freelancers/aarav-desai.webp' : null)}
            name={user?.name || 'User'}
            size={isCollapsed && !mobileOpen ? 'sm' : 'dashboard'}
          />
          <div className={cn('flex-1 min-w-0 transition-all duration-300', isCollapsed && !mobileOpen ? 'hidden' : 'block')}>
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.name || 'Account'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-[#A8C0D8] capitalize">
                {user?.role || role}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors',
            isCollapsed && !mobileOpen ? 'justify-center' : 'gap-2.5'
          )}
          title="Sign out of Workstation"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className={cn('whitespace-nowrap transition-all duration-300', isCollapsed && !mobileOpen ? 'hidden' : 'block')}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:block h-screen sticky top-0 z-40 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
