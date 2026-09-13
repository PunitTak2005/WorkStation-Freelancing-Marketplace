import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from '@/components/common/ScrollProgress';
import BackToTop from '@/components/common/BackToTop';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow pt-20 sm:pt-24 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default MainLayout;
