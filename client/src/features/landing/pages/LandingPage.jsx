import React from 'react';
import Hero from '../components/Hero';
import PlatformIntro from '../components/PlatformIntro';
import PopularCategories from '../components/PopularCategories';
import FeaturedFreelancers from '../components/FeaturedFreelancers';
import TrendingJobs from '../components/TrendingJobs';
import MarketplaceWorkflow from '../components/MarketplaceWorkflow';
import StatsSection from '../components/StatsSection';
import SuccessStories from '../components/SuccessStories';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-[#080B12] min-h-screen text-slate-900 dark:text-[#F5F9FF] selection:bg-[#0A84FF] selection:text-white transition-colors duration-300">
      {/* 1. Hero / Banner Section with Large Search & Live Stats */}
      <Hero />

      {/* 2. Platform Introduction: Why Choose Workstation (4 feature cards) */}
      <PlatformIntro />

      {/* 3. Popular Categories (8 core categories with live counts) */}
      <PopularCategories />

      {/* 4. Featured Freelancers (6 verified specialist cards with Hire Now) */}
      <FeaturedFreelancers />

      {/* 5. Featured Projects (Trending projects with budget & apply) */}
      <TrendingJobs />

      {/* 6. Marketplace Workflow: How Workstation Works (6 animated steps) */}
      <MarketplaceWorkflow />

      {/* 7. Success Metrics (Workstation in Numbers with animated counters) */}
      <StatsSection />

      {/* 8. Testimonials (Loved by Builders & Creators) */}
      <SuccessStories />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* 9. Final Call-to-Action (Ready to Build Your Next Success Story?) */}
      <CTASection />
    </div>
  );
}
