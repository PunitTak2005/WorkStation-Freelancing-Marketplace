import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Briefcase,
  Users,
  User,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
  PhoneCall,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Code2,
  Smartphone,
  Cpu,
  Palette,
  PenTool,
  TrendingUp,
  Bookmark,
  ArrowRight,
  Layers,
  Loader2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import Avatar from '../common/Avatar';
import BrandLogo from '../common/BrandLogo';
import NotificationDropdown from '@/features/notifications/components/NotificationDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import jobService from '@/services/jobService';

// Featured categories for the Desktop Projects Mega Menu & Mobile Drawer
const MEGA_MENU_CATEGORIES = [
  {
    name: 'Web & Full-Stack',
    desc: 'React, Node.js, Next.js & modern architectures',
    path: '/projects?category=Web%20Development',
    icon: Code2,
    gradient: 'from-blue-500/15 to-cyan-500/15 text-[#0A84FF]',
    hoverBg: 'group-hover:bg-[#0A84FF] group-hover:text-white',
  },
  {
    name: 'Mobile App Development',
    desc: 'iOS, Android, React Native & Flutter solutions',
    path: '/projects?category=Mobile%20Development',
    icon: Smartphone,
    gradient: 'from-indigo-500/15 to-purple-500/15 text-indigo-500',
    hoverBg: 'group-hover:bg-indigo-600 group-hover:text-white',
  },
  {
    name: 'AI & Machine Learning',
    desc: 'LLMs, Python, LangChain, embeddings & agents',
    path: '/projects?category=AI%20%26%20Machine%20Learning',
    icon: Cpu,
    gradient: 'from-purple-500/15 to-pink-500/15 text-purple-500',
    hoverBg: 'group-hover:bg-purple-600 group-hover:text-white',
  },
  {
    name: 'UI/UX & Product Design',
    desc: 'Figma design systems, UX research & prototypes',
    path: '/projects?category=UI%2FUX%20Design',
    icon: Palette,
    gradient: 'from-rose-500/15 to-orange-500/15 text-rose-500',
    hoverBg: 'group-hover:bg-rose-600 group-hover:text-white',
  },
  {
    name: 'Content & Copywriting',
    desc: 'Technical writing, SEO strategy & brand stories',
    path: '/projects?category=Content%20Writing',
    icon: PenTool,
    gradient: 'from-amber-500/15 to-yellow-500/15 text-amber-500',
    hoverBg: 'group-hover:bg-amber-600 group-hover:text-white',
  },
  {
    name: 'Digital Marketing & Growth',
    desc: 'SEO strategy, paid acquisition, funnels & analytics',
    path: '/projects?category=Digital%20Marketing',
    icon: TrendingUp,
    gradient: 'from-emerald-500/15 to-teal-500/15 text-emerald-500',
    hoverBg: 'group-hover:bg-emerald-600 group-hover:text-white',
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic active projects count from database
  const [activeProjectsCount, setActiveProjectsCount] = useState(null);
  const [loadingProjectsCount, setLoadingProjectsCount] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { on, off } = useSocket();

  const dropdownRef = useRef(null);
  const megaMenuRef = useRef(null);
  const megaMenuTimeoutRef = useRef(null);

  // Fetch live active projects count from backend
  const fetchProjectsCount = useCallback(async () => {
    try {
      setLoadingProjectsCount(true);
      const res = await jobService.getProjectsCount();
      const count =
        res?.data?.data?.count ??
        res?.data?.data?.activeProjects ??
        res?.data?.count ??
        0;
      setActiveProjectsCount(typeof count === 'number' ? count : Number(count) || 0);
    } catch (err) {
      console.error('Failed to fetch active projects count', err);
      setActiveProjectsCount(0); // If the API fails, display 0 Active Projects
    } finally {
      setLoadingProjectsCount(false);
    }
  }, []);

  // Fetch count on mount and register listeners for automatic real-time updates
  useEffect(() => {
    fetchProjectsCount();

    const handleCountChange = () => {
      fetchProjectsCount();
    };

    window.addEventListener('project:count_changed', handleCountChange);
    window.addEventListener('focus', handleCountChange);

    // Periodic sync every 30 seconds
    const interval = setInterval(fetchProjectsCount, 30000);

    return () => {
      window.removeEventListener('project:count_changed', handleCountChange);
      window.removeEventListener('focus', handleCountChange);
      clearInterval(interval);
    };
  }, [fetchProjectsCount]);

  // Real-time socket sync when projects are created, updated, or deleted
  useEffect(() => {
    if (on && off) {
      const handleSocketChange = () => {
        fetchProjectsCount();
      };
      on('project:count_changed', handleSocketChange);
      return () => {
        off('project:count_changed', handleSocketChange);
      };
    }
  }, [on, off, fetchProjectsCount]);

  // Re-verify count whenever projects mega menu is hovered/opened or route changes
  useEffect(() => {
    if (projectsMenuOpen) {
      fetchProjectsCount();
    }
  }, [projectsMenuOpen, fetchProjectsCount]);

  // Scroll detection for floating sticky navbar compression & glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatically close menus on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setProjectsMenuOpen(false);
    setMobileCategoriesOpen(false);
  }, [location.pathname]);

  // Click outside detection for user dropdown and mega menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setProjectsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mega menu hover delay management for smooth interaction
  const handleMegaMenuMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setProjectsMenuOpen(true);
  };

  const handleMegaMenuMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setProjectsMenuOpen(false);
    }, 180);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'client') return '/dashboard/client';
    return '/dashboard/freelancer';
  };

  // Nav Items: Home | Browse Projects | Freelancers | Dashboard | Contact
  const navItems = [
    {
      name: 'Home',
      shortName: 'Home',
      path: '/',
      icon: Home,
      isActive: location.pathname === '/',
    },
    {
      name: 'Browse Projects',
      shortName: 'Projects',
      path: '/projects',
      icon: Briefcase,
      hasMegaMenu: true,
      isActive: location.pathname.startsWith('/projects') || location.pathname.startsWith('/jobs'),
    },
    {
      name: 'Freelancers',
      shortName: 'Freelancers',
      path: '/freelancers',
      icon: Users,
      isActive: location.pathname.startsWith('/freelancers'),
    },
    {
      name: 'Dashboard',
      shortName: 'Dashboard',
      path: getDashboardPath(),
      icon: LayoutDashboard,
      isActive: location.pathname.startsWith('/dashboard'),
    },
    {
      name: 'Contact',
      shortName: 'Contact',
      path: '/contact',
      icon: PhoneCall,
      isActive: location.pathname === '/contact',
    },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300',
        isScrolled ? 'pt-2 sm:pt-2.5' : 'pt-3 sm:pt-3.5',
        'px-3 sm:px-6 lg:px-8'
      )}
    >
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Floating Rounded 24px Glass Container */}
        <div
          className={cn(
            'relative flex items-center justify-between rounded-[24px] px-3.5 sm:px-6 transition-all duration-300',
            isScrolled ? 'h-16 sm:h-[68px]' : 'h-16 sm:h-[74px]',
            'bg-white/85 dark:bg-[#080B12]/85 backdrop-blur-2xl',
            'border transition-all duration-300',
            isScrolled
              ? 'border-[#0A84FF]/30 dark:border-[#2FA8FF]/30 shadow-xl shadow-[#002366]/10 dark:shadow-black/70'
              : 'border-[#D6EFFF]/80 dark:border-[#22324A]/70 shadow-lg shadow-[#002366]/5 dark:shadow-black/30'
          )}
        >
          {/* ================= LEFT SIDE: BRAND LOGO & LIVE BEACON ================= */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              to="/"
              className="flex items-center focus:outline-none min-w-0 group"
              aria-label="WorkStation Home"
            >
              <BrandLogo
                size="sm"
                containerClassName="transition-transform duration-200 group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(10,132,255,0.35)]"
                className="transition-transform duration-200"
              />
            </Link>

            {/* Live Marketplace Status Beacon (Verified Escrow) */}
            <div
              className="hidden xl:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 select-none shadow-sm"
              title="Verified Escrow Marketplace Active"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-tight">Verified Marketplace</span>
            </div>
          </div>

          {/* ================= CENTER NAVIGATION: PILLS + MEGA MENU ================= */}
          <nav
            className="hidden lg:flex items-center space-x-1 relative"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const active = item.isActive;
              const hasMega = item.hasMegaMenu;

              if (hasMega) {
                return (
                  <div
                    key={item.name}
                    ref={megaMenuRef}
                    className="relative"
                    onMouseEnter={handleMegaMenuMouseEnter}
                    onMouseLeave={handleMegaMenuMouseLeave}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setProjectsMenuOpen(false)}
                      className={cn(
                        'relative py-2 px-3.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/40',
                        'hover:-translate-y-0.5',
                        active
                          ? 'text-[#0A84FF] dark:text-[#2FA8FF]'
                          : 'text-slate-600 dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                      )}
                    >
                      <span>{item.shortName}</span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-200 opacity-70',
                          projectsMenuOpen ? 'rotate-180 text-[#0A84FF] dark:text-[#2FA8FF]' : ''
                        )}
                      />

                      {/* Active Pill Highlight */}
                      {active && (
                        <motion.div
                          layoutId="navbar-active-pill"
                          className="absolute inset-0 bg-[#EAF6FF] dark:bg-[#101826] rounded-full -z-10 border border-[#D6EFFF] dark:border-[#22324A]/80 shadow-sm"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                    </Link>

                    {/* ================= DESKTOP PROJECTS MEGA MENU ================= */}
                    <AnimatePresence>
                      {projectsMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[620px] rounded-3xl bg-white/95 dark:bg-[#0A101D]/95 backdrop-blur-2xl border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl shadow-[#002366]/15 dark:shadow-black/80 p-5 z-50"
                        >
                          {/* Mega Menu Header */}
                          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#D6EFFF]/80 dark:border-[#22324A]">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-[#EAF6FF] dark:bg-[#101826] text-[#0A84FF]">
                                <Sparkles size={16} />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Marketplace Categories
                              </span>
                            </div>
                            {loadingProjectsCount && activeProjectsCount === null ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF6FF] dark:bg-[#101826] text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A] inline-flex items-center gap-1.5 animate-pulse">
                                <Loader2 size={11} className="animate-spin text-[#0A84FF]" />
                                <span>Loading projects...</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF6FF] dark:bg-[#101826] text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A] inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>
                                  {activeProjectsCount ?? 0} Active {activeProjectsCount === 1 ? 'Project' : 'Projects'}
                                </span>
                              </span>
                            )}
                          </div>

                          {/* 2-Column Category Grid */}
                          <div className="grid grid-cols-2 gap-2.5">
                            {MEGA_MENU_CATEGORIES.map((cat) => {
                              const CatIcon = cat.icon;
                              return (
                                <Link
                                  key={cat.name}
                                  to={cat.path}
                                  onClick={() => setProjectsMenuOpen(false)}
                                  className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-[#F0F7FF] dark:hover:bg-[#131D2E] border border-transparent hover:border-[#D6EFFF] dark:hover:border-[#22324A] transition-all duration-200"
                                >
                                  <div
                                    className={cn(
                                      'p-2.5 rounded-xl bg-gradient-to-br transition-all duration-200 flex-shrink-0',
                                      cat.gradient,
                                      cat.hoverBg
                                    )}
                                  >
                                    <CatIcon size={18} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors truncate">
                                        {cat.name}
                                      </h4>
                                      <ChevronRight
                                        size={12}
                                        className="text-slate-400 group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100"
                                      />
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                      {cat.desc}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Mega Menu Footer Banner */}
                          <div className="mt-4 pt-3.5 border-t border-[#D6EFFF]/80 dark:border-[#22324A] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck size={16} className="text-emerald-500" />
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                Protected by WorkStation Escrow
                              </span>
                            </div>
                            <Link
                              to="/projects"
                              onClick={() => setProjectsMenuOpen(false)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#0A84FF] dark:text-[#2FA8FF] hover:underline"
                            >
                              <span>Explore All Projects</span>
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'relative py-2 px-3.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/40',
                    'hover:-translate-y-0.5',
                    active
                      ? 'text-[#0A84FF] dark:text-[#2FA8FF]'
                      : 'text-slate-600 dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  )}
                >
                  <span>{item.shortName}</span>

                  {/* Active Pill Indicator */}
                  {active && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-[#EAF6FF] dark:bg-[#101826] rounded-full -z-10 border border-[#D6EFFF] dark:border-[#22324A]/80 shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ================= RIGHT CONTROLS: SEARCH, THEME, PROFILE, CTA ================= */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Desktop Rounded Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden xl:flex items-center w-44 lg:w-52 xl:w-60 focus-within:w-64 transition-all duration-300"
            >
              <Search
                size={14}
                className="absolute left-3.5 text-[#0A84FF] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or skills..."
                className="w-full pl-9 pr-8 py-1.5 rounded-full text-xs bg-slate-100/80 dark:bg-[#101826]/90 border border-slate-200/80 dark:border-[#22324A] text-slate-900 dark:text-[#F5F9FF] placeholder:text-slate-400 dark:placeholder:text-[#A8C0D8]/60 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/40 focus:border-[#0A84FF] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </form>

            {/* Theme Toggle Button (Pill Container) */}
            <div className="p-0.5 rounded-full hover:bg-[#EAF6FF]/80 dark:hover:bg-[#101826] transition-colors">
              <ThemeToggle className="hover:scale-105 transition-transform" />
            </div>

            {/* Authenticated User Controls */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Real-Time Notifications Dropdown */}
                <NotificationDropdown />

                {/* Quick Post Project Button for Client Role */}
                {user?.role === 'client' && (
                  <Link
                    to="/dashboard/post-job"
                    className="hidden 2xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] shadow-sm shadow-[#0A84FF]/25 hover:shadow-md hover:shadow-[#0A84FF]/40 hover:-translate-y-0.5 transition-all"
                  >
                    <PlusCircle size={14} />
                    <span>Post Project</span>
                  </Link>
                )}

                {/* Profile Trigger & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-slate-200/80 dark:border-[#22324A] bg-white/70 dark:bg-[#101826]/70 hover:border-[#0A84FF]/50 dark:hover:border-[#2FA8FF]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/40 min-h-[40px]"
                    aria-expanded={userDropdownOpen}
                    aria-label="User account menu"
                  >
                    <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[95px] truncate">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <Avatar
                      name={user?.name || 'User'}
                      src={user?.avatar?.url || user?.avatar}
                      size="sm"
                      online
                    />
                    <ChevronDown
                      size={13}
                      className={cn(
                        'text-slate-400 transition-transform duration-200 mr-1',
                        userDropdownOpen && 'rotate-180 text-[#0A84FF]'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-64 rounded-3xl bg-white/95 dark:bg-[#0A101D]/95 backdrop-blur-2xl shadow-2xl border border-[#D6EFFF] dark:border-[#22324A] py-2.5 z-50 text-sm overflow-hidden"
                      >
                        {/* User Identity Card */}
                        <div className="px-4 py-3 border-b border-[#D6EFFF]/80 dark:border-[#22324A] flex items-center gap-3 bg-slate-50/60 dark:bg-[#080B12]/60">
                          <Avatar
                            name={user?.name || 'User'}
                            src={user?.avatar?.url || user?.avatar}
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate text-sm">
                              {user?.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {user?.email || 'punittak2005@gmail.com'}
                            </p>
                            <span className="inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-extrabold bg-[#EAF6FF] dark:bg-[#101826] text-[#0A84FF] dark:text-[#2FA8FF] uppercase tracking-wider border border-[#D6EFFF] dark:border-[#22324A]">
                              {user?.role || 'Member'}
                            </span>
                          </div>
                        </div>

                        {/* Navigation Items in Dropdown */}
                        <div className="p-1.5 space-y-0.5">
                          <Link
                            to="/dashboard/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#EAF6FF] dark:hover:bg-[#131D2E] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors"
                          >
                            <User size={15} className="text-slate-400 group-hover:text-current" />
                            <span className="font-medium text-xs">My Profile</span>
                          </Link>

                          <Link
                            to={getDashboardPath()}
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#EAF6FF] dark:hover:bg-[#131D2E] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors"
                          >
                            <LayoutDashboard size={15} className="text-slate-400" />
                            <span className="font-medium text-xs">Dashboard</span>
                          </Link>

                          <Link
                            to="/dashboard/settings"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-[#EAF6FF] dark:hover:bg-[#131D2E] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors"
                          >
                            <Settings size={15} className="text-slate-400" />
                            <span className="font-medium text-xs">Settings</span>
                          </Link>

                          {user?.role === 'client' && (
                            <Link
                              to="/dashboard/post-job"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#0A84FF] dark:text-[#2FA8FF] font-semibold hover:bg-[#EAF6FF] dark:hover:bg-[#131D2E] transition-colors"
                            >
                              <PlusCircle size={15} />
                              <span className="text-xs">Post a Project</span>
                            </Link>
                          )}
                        </div>

                        {/* Logout Option */}
                        <div className="border-t border-[#D6EFFF]/80 dark:border-[#22324A] pt-1.5 px-1.5">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                              navigate('/');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors text-left font-semibold text-xs"
                          >
                            <LogOut size={15} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* ================= GUEST CONTROLS: LOG IN + GET STARTED ================= */
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 hover:border-[#0A84FF]/60 dark:hover:border-[#2FA8FF]/60 hover:bg-[#EAF6FF]/50 dark:hover:bg-[#101826] transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] shadow-md shadow-[#0A84FF]/25 hover:shadow-lg hover:shadow-[#0A84FF]/40 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* ================= MOBILE HAMBURGER BUTTON (MORPHING BARS) ================= */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-10 h-10 flex flex-col items-center justify-center rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-[#0A84FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/40"
                aria-label="Toggle mobile menu"
              >
                <span
                  className={cn(
                    'w-4 h-0.5 bg-current rounded-full transition-all duration-200',
                    mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  )}
                />
                <span
                  className={cn(
                    'w-4 h-0.5 bg-current rounded-full my-1 transition-all duration-150',
                    mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'w-4 h-0.5 bg-current rounded-full transition-all duration-200',
                    mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE SLIDE-IN GLASS DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md lg:hidden pointer-events-auto"
            />

            {/* Slide-In Drawer Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-88 max-w-sm bg-white/95 dark:bg-[#080B12]/95 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-[#D6EFFF] dark:border-[#22324A] lg:hidden pointer-events-auto"
            >
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-5 border-b border-[#D6EFFF]/80 dark:border-[#22324A] flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <BrandLogo size="xs" />
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800/80 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                {/* Search Bar in Mobile Drawer */}
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A84FF]"
                      size={15}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects or skills..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-slate-100 dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                    />
                  </div>
                </form>

                {/* Primary Navigation Links */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = item.isActive;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all border-l-4 min-h-[44px]',
                          active
                            ? 'border-[#0A84FF] bg-[#EAF6FF] dark:bg-[#101826] text-[#0A84FF] dark:text-[#2FA8FF]'
                            : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        )}
                      >
                        <Icon size={18} className="mr-3 flex-shrink-0 text-slate-400" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Categories Quick Accordion */}
                <div className="pt-2 border-t border-[#D6EFFF]/80 dark:border-[#22324A]">
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider focus:outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <span>Browse Categories</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF6FF] dark:bg-[#101826] text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A] inline-flex items-center gap-1">
                        {loadingProjectsCount && activeProjectsCount === null ? (
                          <Loader2 size={10} className="animate-spin text-[#0A84FF]" />
                        ) : (
                          <>
                            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                            <span>{activeProjectsCount ?? 0} Active</span>
                          </>
                        )}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-200',
                        mobileCategoriesOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileCategoriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1 mt-1 overflow-hidden"
                      >
                        {MEGA_MENU_CATEGORIES.map((cat) => {
                          const CatIcon = cat.icon;
                          return (
                            <Link
                              key={cat.name}
                              to={cat.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-[#EAF6FF] dark:hover:bg-[#101826] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors"
                            >
                              <CatIcon size={14} className="text-[#0A84FF]" />
                              <span className="truncate">{cat.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Drawer Footer with User Identity or Guest CTAs */}
              <div className="p-4 border-t border-[#D6EFFF]/80 dark:border-[#22324A] space-y-3 flex-shrink-0 bg-slate-50/70 dark:bg-[#080B12]/70">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A]">
                      <Avatar
                        name={user?.name || 'User'}
                        src={user?.avatar?.url || user?.avatar}
                        size="md"
                        online
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] text-xs font-bold text-slate-700 dark:text-slate-200 min-h-[40px]"
                      >
                        <User size={14} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] text-xs font-bold text-slate-700 dark:text-slate-200 min-h-[40px]"
                      >
                        <Settings size={14} />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors min-h-[40px]"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-full text-center text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-[#101826] transition-colors min-h-[42px] flex items-center justify-center"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-full text-center text-xs font-bold text-white bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] shadow-md shadow-[#0A84FF]/25 hover:shadow-lg transition-all min-h-[42px] flex items-center justify-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
