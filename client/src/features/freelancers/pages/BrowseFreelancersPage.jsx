import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw,
  Sparkles, Database, Check, Star, IndianRupee, UserCheck,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import FreelancerCard from '../components/FreelancerCard';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import FilterChip from '@/components/common/FilterChip';
import { useDebounce } from '@/hooks/useDebounce';
import userService from '@/services/userService';

// Feature 6: Expertise Level Filter Chips
const EXPERTISE_LEVELS = [
  { id: 'All', label: 'All Levels', query: '' },
  { id: 'Beginner', label: 'Beginner', query: 'entry' },
  { id: 'Intermediate', label: 'Intermediate', query: 'intermediate' },
  { id: 'Expert', label: 'Expert', query: 'expert' },
];

const SORT_OPTIONS = [
  { label: 'Highest Rated', value: 'rating_desc' },
  { label: 'Most Projects Done', value: 'completed_projects' },
  { label: 'Hourly Rate: Low to High', value: 'rate_asc' },
  { label: 'Hourly Rate: High to Low', value: 'rate_desc' },
];

// Internal WorkStation support & operations leads to exclude from the public /freelancers marketplace
const EXCLUDED_SUPPORT_NAMES = [
  'abhishek nayak',
  'aditi hegde',
  'aarav desai',
  'ananya iyer',
];

const EXCLUDED_SUPPORT_TITLES = [
  'lead support engineer & architect',
  'platform architecture & escrow',
  'client success & escrow specialist',
  'talent experience lead',
  'enterprise solutions director',
];

const isSupportTeamMember = (freelancer) => {
  if (!freelancer) return false;
  const name = (freelancer.name || '').toLowerCase().trim();
  const title = (
    freelancer.profile?.title ||
    freelancer.title ||
    freelancer.profession ||
    freelancer.role ||
    ''
  ).toLowerCase().trim();
  const specialty = (freelancer.specialty || '').toLowerCase().trim();

  if (EXCLUDED_SUPPORT_NAMES.includes(name)) return true;
  if (EXCLUDED_SUPPORT_TITLES.some((t) => title.includes(t) || specialty.includes(t))) return true;

  return false;
};

export default function BrowseFreelancersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search by skill state (debounced by 300ms)
  const initialSkill = searchParams.get('skill') || searchParams.get('skills') || searchParams.get('search') || searchParams.get('q') || '';
  const [skillSearch, setSkillSearch] = useState(initialSkill);
  const debouncedSkill = useDebounce(skillSearch, 300);

  // Filter states
  const [level, setLevel] = useState(searchParams.get('level') || searchParams.get('expertiseLevel') || '');
  const [minRate, setMinRate] = useState(searchParams.get('minRate') || '');
  const [maxRate, setMaxRate] = useState(searchParams.get('maxRate') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '0');
  const [availability, setAvailability] = useState(searchParams.get('availability') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating_desc');

  // UI States
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination Configuration: Exactly 2 Freelancer Cards Per Page
  const FREELANCERS_PER_PAGE = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const freelancerGridRef = useRef(null);

  // Derived client-side pagination values
  const totalFreelancers = freelancers.length;
  const totalPages = Math.max(1, Math.ceil(totalFreelancers / FREELANCERS_PER_PAGE));
  const startIndex = (currentPage - 1) * FREELANCERS_PER_PAGE;
  const endIndex = Math.min(startIndex + FREELANCERS_PER_PAGE, totalFreelancers);
  const currentFreelancers = useMemo(() => {
    return freelancers.slice(startIndex, endIndex);
  }, [freelancers, startIndex, endIndex]);

  // Reset pagination to page 1 whenever search, filters, or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSkill, level, minRate, maxRate, minRating, availability, sort]);

  // Page change handler with smooth scrolling to top of freelancer grid
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    if (freelancerGridRef.current) {
      const yOffset = -90;
      const y = freelancerGridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
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

  // Fetch freelancers from backend API
  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 100, // Fetch full matching set to enable seamless client-side pagination
        skill: debouncedSkill,
        skills: debouncedSkill,
        level: level && level !== 'All' ? level : undefined,
        minRate: minRate || undefined,
        maxRate: maxRate || undefined,
        minRating: minRating !== '0' ? minRating : undefined,
        availability: availability || undefined,
        sort,
      };

      const res = await userService.getFreelancers(params);
      const data = res.data?.data?.freelancers || res.data?.data || [];
      const rawList = Array.isArray(data) ? data : [];
      // Separate internal support team from public marketplace freelancer profiles
      const actualFreelancers = rawList.filter((f) => !isSupportTeamMember(f));
      setFreelancers(actualFreelancers);
    } catch (error) {
      console.error('Failed to fetch freelancers from API:', error.message);
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  };

  // Synchronize URL search parameters for back button and bookmarks
  useEffect(() => {
    fetchFreelancers();

    const params = new URLSearchParams();
    if (debouncedSkill) params.set('skill', debouncedSkill);
    if (level && level !== 'All') params.set('level', level);
    if (minRate) params.set('minRate', minRate);
    if (maxRate) params.set('maxRate', maxRate);
    if (minRating && minRating !== '0') params.set('minRating', minRating);
    if (availability) params.set('availability', availability);
    if (sort && sort !== 'rating_desc') params.set('sort', sort);

    setSearchParams(params, { replace: true });
  }, [debouncedSkill, level, minRate, maxRate, minRating, availability, sort]);

  // Clear all filters
  const clearFilters = () => {
    setSkillSearch('');
    setLevel('');
    setMinRate('');
    setMaxRate('');
    setMinRating('0');
    setAvailability('');
    setSort('rating_desc');
    setCurrentPage(1);
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (level && level !== 'All') count++;
    if (minRate || maxRate) count++;
    if (minRating !== '0') count++;
    if (availability) count++;
    return count;
  }, [level, minRate, maxRate, minRating, availability]);

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#080B12] blueprint-grid text-slate-900 dark:text-[#F5F9FF] pt-24 pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-[#0A84FF]" />
              Verified Talent Network
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">
              Find & Hire Freelancers
            </h1>
            <p className="text-[#5B6B7A] dark:text-[#A8C0D8] text-sm mt-1">
              Search vetted specialists by technical skills, frameworks, and experience levels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
              <Database size={13} />
              <span>MongoDB Real-Time Sync</span>
            </span>

            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden border-[#D6EFFF] dark:border-[#22324A]"
              icon={SlidersHorizontal}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>
        </div>

        {/* Feature 5: Search Freelancers by Skills Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] backdrop-blur-xl shadow-workstation-card dark:shadow-workstation-dark mb-8">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 text-[#0A84FF] flex-shrink-0" size={20} />
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Search freelancers by skills..."
              className="w-full pl-12 pr-12 py-3 rounded-2xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#A8C0D8]/60 text-sm sm:text-base focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/20 transition-all"
            />
            {skillSearch && (
              <button
                type="button"
                onClick={() => setSkillSearch('')}
                className="absolute right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-[#EAF6FF] dark:hover:bg-[#162235] transition-colors"
                title="Clear skill search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Skill Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 px-1 text-xs text-[#5B6B7A] dark:text-[#A8C0D8]">
            <span className="font-semibold text-slate-400 mr-1">Popular Skills:</span>
            {['React', 'Node.js', 'Python', 'Flutter', 'UI/UX', 'Figma', 'MongoDB', 'AWS', 'Docker'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSkillSearch(tag)}
                className={`px-2.5 py-0.5 rounded-lg border transition-all ${
                  skillSearch.toLowerCase() === tag.toLowerCase()
                    ? 'bg-[#0A84FF] text-white border-[#0A84FF] shadow-sm'
                    : 'bg-[#EAF6FF] dark:bg-[#162235] border-[#D6EFFF] dark:border-[#22324A] text-[#002366] dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Feature 6: Expertise Level Filter Chips */}
          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#D6EFFF] dark:border-[#22324A] overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-[#5B6B7A] dark:text-[#A8C0D8] mr-1 flex-shrink-0">Expertise Level:</span>
            {EXPERTISE_LEVELS.map((lvl) => {
              const isSelected = (level === '' && lvl.id === 'All') || level.toLowerCase() === lvl.label.toLowerCase() || level.toLowerCase() === lvl.query.toLowerCase();
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevel(lvl.id === 'All' ? '' : lvl.label)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#0A84FF] text-white shadow-glow shadow-[#0A84FF]/40 ring-2 ring-[#2FA8FF]'
                      : 'bg-[#EAF6FF] dark:bg-[#162235] text-[#002366] dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-white border border-[#D6EFFF] dark:border-[#22324A]'
                  }`}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Chips & Clear All */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-800/60">
              <span className="text-xs text-slate-400 font-medium">Applied Filters:</span>
              {level && (
                <FilterChip label={`Level: ${level}`} onRemove={() => setLevel('')} />
              )}
              {(minRate || maxRate) && (
                <FilterChip
                  label={`Rate: ₹${minRate || '0'} - ₹${maxRate || 'Any'}/hr`}
                  onRemove={() => {
                    setMinRate('');
                    setMaxRate('');
                  }}
                />
              )}
              {minRating !== '0' && (
                <FilterChip label={`Rating: ${minRating}+ Stars`} onRemove={() => setMinRating('0')} />
              )}
              {availability && (
                <FilterChip label={`Status: ${availability}`} onRemove={() => setAvailability('')} />
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold ml-2 hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Responsive Layout: Filter Sidebar + Freelancers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 p-6 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] backdrop-blur-xl shadow-workstation-card dark:shadow-workstation-dark space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6EFFF] dark:border-[#22324A]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <SlidersHorizontal size={16} className="text-[#0A84FF]" />
                Filter Talent
              </h3>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] hover:text-rose-500 transition-colors font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Hourly Rate Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-[#A8C0D8] block mb-2">Hourly Rate (₹/hr)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  placeholder="Min ₹"
                  className="px-3 py-2 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0A84FF] font-mono"
                />
                <input
                  type="number"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  placeholder="Max ₹"
                  className="px-3 py-2 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0A84FF] font-mono"
                />
              </div>
            </div>

            {/* Minimum Client Rating */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-[#A8C0D8]">Minimum Rating</label>
                <span className="text-xs font-mono font-bold text-amber-500 flex items-center">
                  <Star size={12} className="fill-current mr-1" />
                  {minRating === '0' ? 'Any' : `${minRating} ★`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full accent-[#0A84FF] bg-slate-200 dark:bg-slate-800 cursor-pointer h-2 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#5B6B7A] dark:text-[#A8C0D8]/60 mt-1">
                <span>Any</span>
                <span>3.0★</span>
                <span>4.0★</span>
                <span>5.0★</span>
              </div>
            </div>

            {/* Availability Status */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-[#A8C0D8] block mb-2">Availability Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0A84FF]"
              >
                <option value="">Any Status</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy with Project</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-[#A8C0D8] block mb-2">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0A84FF]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#101826]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Right Column: Freelancer Cards Grid */}
          <main className="lg:col-span-9">
            {/* Header info */}
            <div className="flex items-center justify-between mb-6 px-1 text-xs text-[#5B6B7A] dark:text-[#A8C0D8]">
              <span>
                Found <strong className="text-slate-900 dark:text-white font-bold">{totalFreelancers}</strong> verified professionals
              </span>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-slate-500">Sorted by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8] text-xs focus:outline-none focus:border-[#0A84FF]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#101826]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading Skeleton State: 2 Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark space-y-4 animate-pulse">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-[#101826]" />
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-[#101826]" />
                    </div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200 dark:bg-[#101826] mx-auto mb-3" />
                    <div className="h-5 w-3/4 mx-auto rounded bg-slate-200 dark:bg-[#101826]" />
                    <div className="h-4 w-1/2 mx-auto rounded bg-slate-200 dark:bg-[#101826]" />
                    <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-[#101826]" />
                    <div className="flex justify-center gap-1.5 pt-2">
                      <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-[#101826]" />
                      <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-[#101826]" />
                      <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-[#101826]" />
                    </div>
                    <div className="h-11 w-full rounded-2xl bg-slate-200 dark:bg-[#101826] mt-4" />
                  </div>
                ))}
              </div>
            ) : freelancers.length === 0 ? (
              /* Empty State */
              <div className="text-center py-20 px-6 rounded-3xl bg-white/90 dark:bg-[#162235]/90 border border-[#D6EFFF] dark:border-[#22324A] backdrop-blur-xl shadow-workstation-card dark:shadow-workstation-dark">
                <div className="w-16 h-16 rounded-3xl bg-[#0A84FF]/10 text-[#0A84FF] flex items-center justify-center mx-auto mb-4 border border-[#0A84FF]/20">
                  <UserCheck size={28} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">No matching freelancers found.</h3>
                <p className="text-sm text-[#5B6B7A] dark:text-[#A8C0D8] max-w-md mx-auto mb-6">
                  Try searching for broader skills like React, Python, or UI/UX, or clearing the selected expertise level.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="primary" onClick={clearFilters} icon={RotateCcw}>
                    Clear Filters
                  </Button>
                  <Button variant="secondary" onClick={clearFilters}>
                    Browse All Freelancers
                  </Button>
                </div>
              </div>
            ) : (
              /* Responsive Grid: 2 cards per page (Desktop: 2, Tablet: 2, Mobile: 1 per row) */
              <div ref={freelancerGridRef} className="space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
                  >
                    {currentFreelancers.map((freelancer) => (
                      <FreelancerCard key={freelancer._id || freelancer.id} freelancer={freelancer} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Premium WorkStation Pagination UI (2 Cards Per Page) */}
                {totalPages > 1 && (
                  <div className="pt-6 pb-2 border-t border-[#D6EFFF] dark:border-[#22324A] flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Showing Results Summary */}
                    <div className="text-xs sm:text-sm font-medium text-[#5B6B7A] dark:text-[#A8C0D8]">
                      Showing <strong className="text-slate-900 dark:text-white font-bold">{startIndex + 1}–{endIndex}</strong> of{' '}
                      <strong className="text-slate-900 dark:text-white font-bold">{totalFreelancers}</strong> freelancers
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
      </div>

      {/* Mobile Bottom Sheet / Drawer for Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
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
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D6EFFF] dark:border-[#22324A]">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                    <SlidersHorizontal size={18} className="text-[#0A84FF]" />
                    Filter Specialists
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Expertise Levels */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#A8C0D8] block mb-2">Expertise Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERTISE_LEVELS.map((lvl) => {
                      const isSelected = (level === '' && lvl.id === 'All') || level.toLowerCase() === lvl.label.toLowerCase();
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setLevel(lvl.id === 'All' ? '' : lvl.label)}
                          className={`p-2.5 rounded-xl text-xs text-center border transition-all ${
                            isSelected
                              ? 'bg-[#0A84FF] border-[#0A84FF] text-white font-semibold shadow-sm'
                              : 'bg-[#F8FBFF] dark:bg-[#080B12] border-[#D6EFFF] dark:border-[#22324A] text-slate-700 dark:text-[#A8C0D8]'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Rate */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#A8C0D8] block mb-2">Hourly Rate Range (₹)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={minRate}
                      onChange={(e) => setMinRate(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs text-slate-900 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={maxRate}
                      onChange={(e) => setMaxRate(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Mobile Rating */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#A8C0D8] block mb-2">
                    Min Rating: {minRating === '0' ? 'Any' : `${minRating} Stars +`}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full accent-[#0A84FF] bg-slate-200 dark:bg-slate-800 h-2 rounded-lg"
                  />
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
                  className="flex-1 justify-center border-[#D6EFFF] dark:border-[#22324A] text-xs"
                >
                  Clear Filters
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 justify-center text-xs shadow-lg shadow-[#0A84FF]/25"
                >
                  Apply Filters ({freelancers.length})
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
