import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ShieldCheck, Star, Briefcase, Sparkles, ArrowRight,
  CheckCircle2, Users, Building, IndianRupee
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import WorkspaceHeroIllustration from './WorkspaceHeroIllustration';
export default function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden bg-white dark:bg-[#080B12] blueprint-grid transition-colors duration-300">
      {/* Brand Radial Glows */}
      <div className="absolute top-10 right-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#0A84FF]/10 dark:bg-[#0A84FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#002366]/10 dark:bg-[#002366]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Blueprint concentric ring decoration in background */}
      <div className="hidden sm:block absolute top-20 right-10 w-96 h-96 rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/20 pointer-events-none" />
      <div className="hidden sm:block absolute -bottom-20 left-1/3 w-[600px] h-[600px] rounded-full border border-[#2FA8FF]/5 dark:border-[#2FA8FF]/10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Bold Brand Headline, Subtitle, Search, CTAs */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-8 text-center lg:text-left">
            {/* Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#002366] dark:text-[#2FA8FF] text-[11px] sm:text-xs font-semibold tracking-wide shadow-sm mx-auto lg:mx-0 max-w-full truncate">
              <span className="w-2 h-2 rounded-full bg-[#0A84FF] animate-ping flex-shrink-0" />
              <span className="truncate">Next-Gen WorkStation Marketplace • Verified Escrow</span>
            </div>

            {/* Headline matching prompt: Find. Hire. Build. (text-3xl to 4xl mobile, text-6xl to 7xl desktop) */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] sm:leading-[1.08] font-display">
                Find. Hire.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#2FA8FF]">
                  Build.
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#5B6B7A] dark:text-[#A8C0D8] max-w-xl font-normal leading-relaxed mx-auto lg:mx-0 pt-1 sm:pt-2">
                Connect talented freelancers with ambitious clients through a modern collaborative workspace.
              </p>
            </div>

            {/* Floating Search Bar with Pill Filter Highlights */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0">
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 sm:p-2 rounded-2xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl focus-within:border-[#0A84FF] focus-within:ring-2 focus-within:ring-[#0A84FF]/20 transition-all gap-2 sm:gap-0">
                <div className="flex items-center flex-1">
                  <Search className="ml-3 text-[#0A84FF] flex-shrink-0" size={19} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects, skills, or experts..."
                    className="w-full px-3 py-2 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#A8C0D8]/60 text-sm focus:outline-none min-h-[44px]"
                  />
                </div>
                <Button type="submit" variant="primary" size="md" className="rounded-xl flex-shrink-0 shadow-md w-full sm:w-auto min-h-[44px]">
                  <span>Search</span>
                  <ArrowRight size={16} className="ml-1.5" />
                </Button>
              </div>

              {/* Quick Trending Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-3 px-2 text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Popular:</span>
                {['Web Development', 'UI/UX Design', 'AI & ML', 'Mobile Apps'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => navigate(`/jobs?category=${encodeURIComponent(term)}`)}
                    className="px-2.5 py-0.5 rounded-full bg-[#EAF6FF] dark:bg-[#162235] text-[#002366] dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-white border border-[#D6EFFF]/80 dark:border-[#22324A] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>

            {/* Primary (Get Started) & Secondary (Browse Projects) Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full">
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full justify-center min-h-[48px] px-8 text-base shadow-lg shadow-[#0A84FF]/25">
                  <span>Get Started</span>
                  <ArrowRight size={17} className="ml-2" />
                </Button>
              </Link>
              <Link to="/jobs" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full justify-center min-h-[48px] px-7 text-base">
                  <Briefcase size={17} className="mr-2 text-[#0A84FF]" />
                  <span>Browse Projects</span>
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#D6EFFF] dark:border-[#22324A] flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-500 dark:text-[#A8C0D8]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#0A84FF] flex-shrink-0" />
                <span>100% Escrow Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                <span>Top 3% Vetted Talent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#2FA8FF] flex-shrink-0" />
                <span>Collaborative Workstation Hub</span>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Workspace Scene Illustration matching the logo */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <WorkspaceHeroIllustration />
          </div>
        </div>
      </div>

      {/* Curved Section Divider Wave */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 sm:h-16 text-[#F8FBFF] dark:text-[#080B12] fill-current">
          <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" opacity="0.6" />
          <path d="M0,30 C300,100 600,0 900,70 C1050,105 1150,50 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
