import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw,
  Sparkles, Database, Check, ChevronDown, IndianRupee, Layers,
  Briefcase, ArrowRight, Lightbulb, TrendingUp, ShieldCheck, Flame, Users, CheckCircle2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectsHeroSection from '../components/ProjectsHeroSection';
import ProjectsHeroIllustration from '../components/ProjectsHeroIllustration';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import FilterChip from '@/components/common/FilterChip';
import { useDebounce } from '@/hooks/useDebounce';
import jobService from '@/services/jobService';

// Animated count component for category chips
function AnimatedCount({ value }) {
  const [count, setCount] = useState(value);

  useEffect(() => {
    const end = Number(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 500;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(end * ease));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <span className="font-mono">{count}</span>;
}

// Standard Fallback Categories
const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'All Categories', query: '', count: 0 },
  { id: 'Web Development', label: 'Web Development', query: 'Web Development', count: 0 },
  { id: 'Mobile Development', label: 'Mobile Development', query: 'Mobile Development', count: 0 },
  { id: 'AI & ML', label: 'AI & ML', query: 'AI & ML', count: 0 },
  { id: 'UI/UX Design', label: 'UI/UX Design', query: 'UI/UX Design', count: 0 },
  { id: 'Content Writing', label: 'Content Writing', query: 'Content Writing', count: 0 },
  { id: 'Digital Marketing', label: 'Digital Marketing', query: 'Digital Marketing', count: 0 },
  { id: 'Data Science', label: 'Data Science', query: 'Data Science', count: 0 },
];

const BUDGET_PRESETS = [
  { label: 'Any Budget', min: '', max: '' },
  { label: 'Under ₹10,000', min: '0', max: '10000' },
  { label: '₹10,000 – ₹30,000', min: '10000', max: '30000' },
  { label: '₹30,000 – ₹60,000', min: '30000', max: '60000' },
  { label: '₹60,000+', min: '60000', max: '' },
];

const SORT_OPTIONS = [
  { label: 'Newest Opportunities', value: 'newest' },
  { label: 'Highest Budget First', value: 'budget_desc' },
  { label: 'Lowest Budget First', value: 'budget_asc' },
  { label: 'Ending Soonest', value: 'deadline_asc' },
  { label: 'Most Proposals', value: 'proposals_desc' },
  { label: 'Oldest First', value: 'oldest' },
];

const EXPERIENCE_LEVELS = [
  { id: 'All', label: 'All Expertise Levels' },
  { id: 'entry', label: 'Entry Level' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'expert', label: 'Expert Specialist' },
];

const TRENDING_SEARCH_SKILLS = [
  'React', 'Next.js', 'AI / ML', 'UI/UX', 'Node.js', 'Figma', 'Python', 'Solidity'
];

export default function JobBoardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search state - debounced by 300ms
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);

  // Filters from URL
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [sliderMax, setSliderMax] = useState(Number(searchParams.get('maxBudget')) || 100000);
  const [experience, setExperience] = useState(searchParams.get('level') || searchParams.get('experience') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // UI States & Datasets
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Category Stats from MongoDB
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoriesTotal, setCategoriesTotal] = useState(0);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Fetch real category statistics dynamically from MongoDB
  const fetchCategoryStats = async () => {
    try {
      const res = await jobService.getJobCategories();
      const data = res.data?.data || {};
      setCategoriesTotal(data.total || 0);
      setCategoriesData(Array.isArray(data.categories) ? data.categories : []);
      setCategoriesLoaded(true);
    } catch (error) {
      console.error('Failed to fetch category counts from API:', error.message);
    }
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  // Build dynamic category list with real database counts
  const activeCategories = useMemo(() => {
    const totalCount = categoriesLoaded ? categoriesTotal : (jobs?.length || 0);
    const list = [
      { id: 'All', label: 'All Categories', query: '', count: totalCount }
    ];

    if (categoriesData.length > 0) {
      categoriesData.forEach((cat) => {
        list.push({
          id: cat.name,
          label: cat.name,
          query: cat.name,
          count: cat.count || 0,
        });
      });
    } else {
      DEFAULT_CATEGORIES.slice(1).forEach((cat) => {
        list.push(cat);
      });
    }

    return list;
  }, [categoriesData, categoriesTotal, categoriesLoaded, jobs]);

  // 4 Projects Per Page Client-Side Pagination (Page 1: 1–4, Page 2: 5–8, Page 3: 9–12)
  const PROJECTS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const projectGridRef = useRef(null);
  const searchSectionRef = useRef(null);

  // Smooth scroll to search and live projects grid
  const handleBrowseProjects = () => {
    if (searchSectionRef.current) {
      const yOffset = -90;
      const y = searchSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const totalProjects = jobs.length;
  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PROJECTS_PER_PAGE, totalProjects);
  const currentProjects = jobs.slice(startIndex, endIndex);

  // Reset pagination on search, filters, or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, minBudget, maxBudget, experience, sort]);

  // Page change handler with smooth scrolling
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    if (projectGridRef.current) {
      const yOffset = -90;
      const y = projectGridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Pagination helper for numbered buttons with smart ellipsis
  const getPaginationItems = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // Fetch jobs dynamically with MongoDB API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        search: debouncedSearch,
        q: debouncedSearch,
        sort,
        limit: 50,
      };

      if (category && category !== 'All') params.category = category;
      if (minBudget) params.minBudget = minBudget;
      if (maxBudget) params.maxBudget = maxBudget;
      if (experience && experience !== 'All') params.experienceLevel = experience;

      const res = await jobService.getJobs(params);
      const data = res.data?.data?.jobs || res.data?.data || [];
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch jobs from API:', error.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Synchronize state with URL search params
  useEffect(() => {
    fetchJobs();

    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category && category !== 'All') params.set('category', category);
    if (minBudget) params.set('minBudget', minBudget);
    if (maxBudget) params.set('maxBudget', maxBudget);
    if (experience && experience !== 'All') params.set('level', experience);
    if (sort && sort !== 'newest') params.set('sort', sort);

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, minBudget, maxBudget, experience, sort]);

  // Clear all filters handler
  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinBudget('');
    setMaxBudget('');
    setSliderMax(100000);
    setExperience('');
    setSort('newest');
    setCurrentPage(1);
  };

  // Preset budget selector
  const selectBudgetPreset = (min, max) => {
    setMinBudget(min);
    setMaxBudget(max);
    if (max) setSliderMax(Number(max));
    else setSliderMax(100000);
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category && category !== 'All') count++;
    if (minBudget || maxBudget) count++;
    if (experience && experience !== 'All') count++;
    return count;
  }, [category, minBudget, maxBudget, experience]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#080B12] blueprint-grid text-slate-900 dark:text-[#F5F9FF] pt-24 pb-24 transition-colors duration-300">
      
      {/* 1. BRAND HERO HEADER SECTION (Upwork × Linear × Stripe Aesthetic) */}
      <ProjectsHeroSection
        jobsCount={categoriesTotal || jobs.length}
        onBrowseProjects={handleBrowseProjects}
      />

      {/* 2. SEARCH BAR & FILTER PILL TRAY */}
      <section ref={searchSectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Floating Glassmorphic Search Bar */}
        <div className="relative p-2.5 sm:p-3 rounded-full bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl focus-within:border-[#0A84FF] focus-within:ring-4 focus-within:ring-[#0A84FF]/20 transition-all mb-6">
          <div className="flex items-center w-full">
            <div className="w-10 h-10 rounded-full bg-[#EAF6FF] dark:bg-[#162235] text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center ml-1 flex-shrink-0">
              <Search size={19} />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search React, UI/UX, AI, Mobile..."
              className="w-full px-4 py-2 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#A8C0D8]/60 text-sm sm:text-base font-normal focus:outline-none"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-[#EAF6FF] dark:hover:bg-[#162235] transition-colors mr-1 flex-shrink-0"
                title="Clear search"
              >
                <X size={18} />
              </button>
            )}

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden rounded-full mr-1 flex-shrink-0 text-xs px-3"
              icon={SlidersHorizontal}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>
        </div>

        {/* Quick Trending Keyword Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 px-2">
          <span className="text-xs font-semibold text-[#5B6B7A] dark:text-[#A8C0D8] mr-1 flex items-center gap-1">
            <TrendingUp size={14} className="text-[#0A84FF]" />
            Trending:
          </span>
          {TRENDING_SEARCH_SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => setSearch(skill)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                search.toLowerCase() === skill.toLowerCase()
                  ? 'bg-[#0A84FF] text-white shadow-glow ring-2 ring-[#2FA8FF]'
                  : 'bg-[#F8FBFF] dark:bg-[#101826] text-slate-700 dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-white border border-[#D6EFFF] dark:border-[#22324A]'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* 4. DYNAMIC HORIZONTAL CATEGORY CARDS (MongoDB Real-Time Data) */}
        <div className="flex gap-2.5 sm:gap-3 mb-10 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {activeCategories.map((cat) => {
            const isSelected = (category === '' && cat.id === 'All') || category.toLowerCase() === cat.query.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id === 'All' ? '' : cat.query)}
                className={`flex-shrink-0 min-w-[125px] sm:min-w-[135px] p-3 sm:p-3.5 rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white shadow-lg shadow-[#0A84FF]/30 ring-2 ring-[#2FA8FF]/40 scale-[1.02]'
                    : 'bg-white dark:bg-[#101826] text-slate-700 dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-white border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/50 shadow-sm hover:scale-[1.02]'
                }`}
              >
                <span className="text-xs font-bold block mb-1 truncate max-w-[140px] font-display">
                  {cat.label}
                </span>
                <span className={`text-[11px] font-mono font-semibold ${isSelected ? 'text-white/90' : 'text-slate-400 dark:text-slate-500'}`}>
                  <AnimatedCount value={cat.count} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Applied Filter Tags & Status Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3 rounded-2xl bg-[#F8FBFF] dark:bg-[#101826]/80 border border-[#D6EFFF] dark:border-[#22324A] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
              <Database size={13} />
              <span>MongoDB Real-Time Sync</span>
            </span>

            {activeFilterCount > 0 && (
              <>
                <span className="text-[#5B6B7A] dark:text-[#A8C0D8] font-medium ml-2">Active:</span>
                {category && (
                  <FilterChip
                    label={`Category: ${activeCategories.find((c) => c.query.toLowerCase() === category.toLowerCase())?.label || category}`}
                    onRemove={() => setCategory('')}
                  />
                )}
                {(minBudget || maxBudget) && (
                  <FilterChip
                    label={`Budget: ₹${minBudget || '0'} - ₹${maxBudget ? Number(maxBudget).toLocaleString() : '1,00,000+'}`}
                    onRemove={() => {
                      setMinBudget('');
                      setMaxBudget('');
                      setSliderMax(100000);
                    }}
                  />
                )}
                {experience && (
                  <FilterChip
                    label={`Level: ${experience}`}
                    onRemove={() => setExperience('')}
                  />
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold ml-1 underline"
                >
                  Clear All
                </button>
              </>
            )}
          </div>

          <div className="text-[#5B6B7A] dark:text-[#A8C0D8] font-mono text-xs">
            Showing <strong className="text-slate-900 dark:text-white font-bold">{totalProjects > 0 ? `${startIndex + 1}–${endIndex}` : 0}</strong> of <strong className="text-slate-900 dark:text-white font-bold">{totalProjects}</strong> matching projects
          </div>
        </div>

        {/* 5. MAIN 2-COLUMN MARKETPLACE LAYOUT (Filters & Sidebar Left, 3-Card Grid Center) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (col-span-3): Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            {/* Filter Controls Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6EFFF] dark:border-[#22324A]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#0A84FF]" />
                Filter Projects
              </h3>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-[#0A84FF] hover:text-[#2FA8FF] font-semibold transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Budget Filter: Range Slider & Presets */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Budget Range</label>
                <span className="text-xs font-mono font-bold text-[#0A84FF] dark:text-[#2FA8FF]">
                  Max: ₹{Number(sliderMax).toLocaleString()}
                </span>
              </div>

              {/* Range Slider with Blue Track */}
              <div className="space-y-2 mb-4">
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={sliderMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSliderMax(val);
                    setMaxBudget(val.toString());
                  }}
                  className="w-full accent-[#0A84FF] bg-[#EAF6FF] dark:bg-[#080B12] cursor-pointer h-2 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#5B6B7A] dark:text-[#A8C0D8]">
                  <span>₹5k</span>
                  <span>₹50k</span>
                  <span>₹1,00,000+</span>
                </div>
              </div>

              {/* Budget Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#5B6B7A] dark:text-[#A8C0D8] block">
                  Quick Presets:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {BUDGET_PRESETS.map((preset) => {
                    const isPresetActive = minBudget === preset.min && maxBudget === preset.max;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => selectBudgetPreset(preset.min, preset.max)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium text-left transition-all ${
                          isPresetActive
                            ? 'bg-[#0A84FF] text-white shadow-sm font-bold ring-1 ring-[#2FA8FF]'
                            : 'bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8] hover:border-[#0A84FF]/50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Expertise Level Options */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Expertise Level
              </label>
              <div className="space-y-1.5">
                {EXPERIENCE_LEVELS.map((level) => {
                  const isLevelActive = (experience === '' && level.id === 'All') || experience === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setExperience(level.id === 'All' ? '' : level.id)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-all ${
                        isLevelActive
                          ? 'bg-[#EAF6FF] dark:bg-[#162235] border border-[#0A84FF] text-[#0A84FF] dark:text-[#2FA8FF] font-bold'
                          : 'bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8] hover:border-[#0A84FF]/50'
                      }`}
                    >
                      <span>{level.label}</span>
                      {isLevelActive && <Check size={14} className="text-[#0A84FF]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Selector */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Sort Order
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#0A84FF]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#101826]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

            {/* Quick Tips Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D6EFFF] dark:border-[#22324A]">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Lightbulb size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Pro Freelancer Tips
                </h4>
              </div>

              <ul className="space-y-3 text-xs text-[#5B6B7A] dark:text-[#A8C0D8]">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAF6FF] dark:bg-[#162235] text-[#0A84FF] dark:text-[#2FA8FF] font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">1</span>
                  <span><strong>Complete your profile:</strong> Clients hire verified talent with detailed bios 3x faster.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAF6FF] dark:bg-[#162235] text-[#0A84FF] dark:text-[#2FA8FF] font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">2</span>
                  <span><strong>Apply within 24 hours:</strong> First 5 submitted proposals have an 82% higher review rate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAF6FF] dark:bg-[#162235] text-[#0A84FF] dark:text-[#2FA8FF] font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">3</span>
                  <span><strong>Add portfolio links:</strong> Always attach concrete code or design samples to your proposal.</span>
                </li>
              </ul>
            </div>

            {/* Trending High-Demand Skills */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display mb-3 flex items-center gap-2">
                <Flame size={16} className="text-[#0A84FF]" />
                Trending Skills in Demand
              </h4>
              <p className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] mb-3">
                Top requested technical skills across active client projects this week.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'Next.js', 'AI & ML', 'FastAPI', 'Figma', 'Node.js', 'Solidity', 'AWS'].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSearch(skill)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F8FBFF] dark:bg-[#080B12] text-slate-700 dark:text-[#A8C0D8] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] hover:text-[#0A84FF] transition-colors"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini Workspace Illustration Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#002366]/20 via-[#0A84FF]/10 to-transparent border border-[#D6EFFF] dark:border-[#22324A] text-center">
              <ProjectsHeroIllustration compact className="mb-2" />
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-2 font-display">
                WorkStation Verified Escrow
              </h5>
              <p className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] mt-1">
                Milestone payments are locked securely before project kick-off.
              </p>
            </div>
          </aside>

          {/* Center Column: Project Cards Grid (2x2 desktop, 2x2 tablet, 1x4 mobile) */}
          <main className="lg:col-span-9">
            
            {/* Loading Skeletons with WorkStation Shimmer */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-[20px] bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] flex flex-col justify-between h-full shadow-workstation-card dark:shadow-workstation-dark overflow-hidden animate-pulse"
                  >
                    {/* Banner Image Skeleton: 190px */}
                    <div className="h-[190px] w-full bg-slate-200 dark:bg-[#101826]" />

                    {/* Card Content Skeleton */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
                      {/* Header */}
                      <div className="space-y-2">
                        <div className="h-5 w-5/6 rounded-lg bg-slate-200 dark:bg-[#101826]" />
                        <div className="h-5 w-2/3 rounded-lg bg-slate-200 dark:bg-[#101826]" />
                        <div className="h-3.5 w-1/2 rounded bg-slate-200 dark:bg-[#101826]" />
                      </div>

                      {/* 2x2 Info Grid */}
                      <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#F8FBFF] dark:bg-[#101826] border border-[#D6EFFF]/80 dark:border-[#22324A]">
                        <div className="h-12 rounded-xl bg-slate-200 dark:bg-[#162235]" />
                        <div className="h-12 rounded-xl bg-slate-200 dark:bg-[#162235]" />
                        <div className="h-12 rounded-xl bg-slate-200 dark:bg-[#162235]" />
                        <div className="h-12 rounded-xl bg-slate-200 dark:bg-[#162235]" />
                      </div>

                      {/* Description Preview */}
                      <div className="space-y-2">
                        <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-[#101826]" />
                        <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-[#101826]" />
                        <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-[#101826]" />
                      </div>

                      {/* Skills */}
                      <div className="h-6 flex gap-1.5 items-center">
                        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-[#101826]" />
                        <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-[#101826]" />
                        <div className="h-6 w-14 rounded-full bg-slate-200 dark:bg-[#101826]" />
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-[#D6EFFF]/60 dark:border-[#22324A] space-y-3 mt-auto">
                        <div className="flex justify-between items-center">
                          <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-[#101826]" />
                          <div className="h-6 w-14 rounded-lg bg-slate-200 dark:bg-[#101826]" />
                        </div>
                        <div className="h-11 w-full rounded-xl bg-slate-200 dark:bg-[#101826]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              /* 13. Redesigned WorkStation Empty State */
              <div className="text-center py-20 px-6 rounded-3xl bg-white/90 dark:bg-[#162235]/90 border border-[#D6EFFF] dark:border-[#22324A] backdrop-blur-xl relative overflow-hidden shadow-workstation-card dark:shadow-workstation-dark">
                {/* Concentric rings & floating blue dots */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-72 h-72 rounded-full border border-[#0A84FF]/20" />
                  <div className="w-96 h-96 rounded-full border border-dashed border-[#2FA8FF]/15" />
                  <span className="absolute top-12 left-1/4 w-2 h-2 rounded-full bg-[#0A84FF]/30 animate-ping" />
                  <span className="absolute bottom-12 right-1/4 w-2 h-2 rounded-full bg-[#2FA8FF]/30 animate-pulse" />
                </div>

                {/* White Container WorkStation Logo Illustration */}
                <div className="relative mx-auto mb-6 w-20 h-20 rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center">
                  <img
                    src="/logo/workstation-logo.png"
                    alt="WorkStation"
                    className="h-12 w-auto object-contain"
                  />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 font-display relative z-10">
                  No projects match your filters.
                </h3>
                <p className="text-sm sm:text-base text-[#5B6B7A] dark:text-[#A8C0D8] max-w-md mx-auto mb-8 leading-relaxed relative z-10">
                  Try searching another keyword, adjusting your budget range, or clearing filters to discover more opportunities.
                </p>

                <div className="flex flex-wrap justify-center gap-3 relative z-10">
                  <Button
                    variant="primary"
                    onClick={clearFilters}
                    icon={RotateCcw}
                    className="shadow-lg shadow-[#0A84FF]/25 px-6 min-h-[44px] rounded-full"
                  >
                    Clear Filters
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={clearFilters}
                    className="px-6 min-h-[44px] rounded-full"
                  >
                    Explore All Projects
                  </Button>
                </div>
              </div>
            ) : (
              /* 14. Responsive Layout: 2 cols desktop (2x2), 2 cols tablet (2x2), 1 col mobile (1x4) */
              <div ref={projectGridRef} className="space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
                  >
                    {currentProjects.map((job, index) => (
                      <ProjectCard key={job._id || job.id} project={job} index={index} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* 3. Premium WorkStation Pagination UI (4 Projects Per Page: Page 1: 1–4, Page 2: 5–8, Page 3: 9–12) */}
                {totalPages > 1 && (
                  <div className="pt-6 pb-2 border-t border-[#D6EFFF] dark:border-[#22324A] flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Showing Results Summary */}
                    <div className="text-xs sm:text-sm font-medium text-[#5B6B7A] dark:text-[#A8C0D8]">
                      Showing <strong className="text-slate-900 dark:text-white font-bold">{startIndex + 1}–{endIndex}</strong> of{' '}
                      <strong className="text-slate-900 dark:text-white font-bold">{totalProjects}</strong> projects
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Previous Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full text-xs font-semibold bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8] hover:border-[#0A84FF] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#D6EFFF] dark:disabled:hover:border-[#22324A] disabled:hover:text-slate-700 dark:disabled:hover:text-[#A8C0D8] shadow-sm transition-all duration-200 select-none"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={16} />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      {/* Numbered Page Buttons */}
                      <div className="flex items-center gap-1">
                        {getPaginationItems().map((item, idx) => {
                          if (item === '...') {
                            return (
                              <span
                                key={`ellipsis-${idx}`}
                                className="min-w-[40px] h-[44px] flex items-center justify-center text-slate-400 text-sm font-bold select-none"
                              >
                                &hellip;
                              </span>
                            );
                          }
                          const pageNum = Number(item);
                          const isActive = currentPage === pageNum;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => handlePageChange(pageNum)}
                              className={`min-w-[44px] h-[44px] px-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center select-none ${
                                isActive
                                  ? 'bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white shadow-md shadow-[#0A84FF]/30 ring-2 ring-[#0A84FF]/30'
                                  : 'bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8] hover:border-[#0A84FF] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] hover:shadow-sm'
                              }`}
                              aria-current={isActive ? 'page' : undefined}
                              aria-label={`Page ${pageNum}`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full text-xs font-semibold bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8] hover:border-[#0A84FF] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#D6EFFF] dark:disabled:hover:border-[#22324A] disabled:hover:text-slate-700 dark:disabled:hover:text-[#A8C0D8] shadow-sm transition-all duration-200 select-none"
                        aria-label="Next page"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          

        </div>
      </section>

      {/* 6. MOBILE BOTTOM-SHEET FILTERS MODAL */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-[#101826] border-t border-[#D6EFFF] dark:border-[#22324A] rounded-t-3xl overflow-y-auto p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#D6EFFF] dark:border-[#22324A]">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                    <SlidersHorizontal size={18} className="text-[#0A84FF]" />
                    Filter Opportunities
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs text-slate-800 dark:text-white"
                  >
                    {activeCategories.map((cat) => (
                      <option key={cat.id} value={cat.id === 'All' ? '' : cat.query}>
                        {cat.label} ({cat.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Budget Slider */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Max Budget</label>
                    <span className="text-xs font-mono font-bold text-[#0A84FF] dark:text-[#2FA8FF]">
                      ₹{Number(sliderMax).toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={sliderMax}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSliderMax(val);
                      setMaxBudget(val.toString());
                    }}
                    className="w-full accent-[#0A84FF] bg-[#EAF6FF] dark:bg-[#080B12] h-2 rounded-lg mb-3"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGET_PRESETS.slice(1).map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => selectBudgetPreset(preset.min, preset.max)}
                        className={`p-2 rounded-lg text-xs text-center border ${
                          minBudget === preset.min && maxBudget === preset.max
                            ? 'bg-[#0A84FF] border-[#2FA8FF] text-white font-bold'
                            : 'bg-[#F8FBFF] dark:bg-[#080B12] border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Level */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Expertise Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setExperience(lvl.id === 'All' ? '' : lvl.id)}
                        className={`p-2 rounded-lg text-xs text-center border ${
                          (experience === '' && lvl.id === 'All') || experience === lvl.id
                            ? 'bg-[#EAF6FF] dark:bg-[#162235] border-[#0A84FF] text-[#0A84FF] dark:text-[#2FA8FF] font-bold'
                            : 'bg-[#F8FBFF] dark:bg-[#080B12] border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8]'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Sticky Action Bar */}
              <div className="sticky bottom-0 pt-4 border-t border-[#D6EFFF] dark:border-[#22324A] bg-white dark:bg-[#101826] flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    clearFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 justify-center text-xs"
                >
                  Clear Filters
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 justify-center text-xs shadow-md shadow-[#0A84FF]/25"
                >
                  Apply Filters ({jobs.length})
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
