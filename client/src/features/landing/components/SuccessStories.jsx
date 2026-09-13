import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, ShieldCheck, MessageSquare } from 'lucide-react';
import reviewService from '@/services/reviewService';

export default function SuccessStories() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // Fetch real reviews from MongoDB
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const res = await reviewService.getPublicReviews({ limit: 12 });
        const list = res.data?.data?.reviews || res.data?.data || [];
        if (isMounted && Array.isArray(list)) {
          // Deduplicate so there is strictly ONE testimonial for Priya Patel and no repeated IDs
          const seenIds = new Set();
          let seenPriya = false;

          const uniqueList = list.filter((r) => {
            if (!r || !r._id) return false;
            if (seenIds.has(r._id.toString())) return false;
            seenIds.add(r._id.toString());

            const reviewerName = (r.reviewer?.name || '').trim().toLowerCase();
            if (reviewerName.includes('priya patel')) {
              if (seenPriya) return false;
              seenPriya = true;
            }
            return true;
          });

          const formatted = uniqueList.map((r) => {
            const reviewerName = r.reviewer?.name || 'Verified Client';
            const role = r.reviewer?.title || r.reviewer?.company || 'Enterprise Client';
            const avatar = r.reviewer?.avatar?.url || r.reviewer?.fullAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=002366&color=fff`;
            return {
              id: r._id,
              name: reviewerName,
              role: role,
              text: r.comment || 'Outstanding experience working on WorkStation. Exceptional delivery and communication.',
              rating: r.rating?.overall || 5,
              image: avatar,
            };
          });
          setTestimonials(formatted);
        }
      } catch (err) {
        if (isMounted) setTestimonials([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Responsive items count calculation
  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(testimonials.length / cardsPerPage));

  // Ensure currentIndex stays within bounds if cards count changes
  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(Math.max(0, totalSlides - 1));
    }
  }, [totalSlides, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Visible items window
  const visibleTestimonials = testimonials.slice(
    currentIndex * cardsPerPage,
    currentIndex * cardsPerPage + cardsPerPage
  );

  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC] dark:bg-[#080B12] relative overflow-hidden border-t border-[#D6EFFF] dark:border-[#22324A] transition-colors duration-300">
      {/* 1. Subtle Blueprint Grid & Brand Atmosphere */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.06] dark:opacity-[0.04] pointer-events-none" />

      {/* Radial Blue Gradients matching WorkStation identity */}
      <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] bg-gradient-to-tr from-[#002366]/25 via-[#0A84FF]/15 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-gradient-to-bl from-[#2FA8FF]/20 via-[#0A84FF]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      {/* Circular Logo Rings Motif from WorkStation Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[880px] h-[880px] rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1180px] h-[1180px] rounded-full border border-dashed border-[#2FA8FF]/5 dark:border-[#2FA8FF]/10 pointer-events-none" />

      {/* Floating Decorative UI Badges behind section */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="hidden xl:flex absolute top-24 left-12 items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/80 dark:bg-[#101826]/80 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] shadow-lg shadow-blue-500/10 pointer-events-none z-0"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
          ⭐
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">4.9 / 5.0 Rating</p>
          <p className="text-[10px] text-[#5B6B7A] dark:text-[#A8C0D8]">From 2,400+ reviews</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
        className="hidden xl:flex absolute top-32 right-12 items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/80 dark:bg-[#101826]/80 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] shadow-lg shadow-blue-500/10 pointer-events-none z-0"
      >
        <div className="w-8 h-8 rounded-xl bg-[#0A84FF]/10 text-[#0A84FF] flex items-center justify-center">
          <ShieldCheck size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">100% Escrow Protected</p>
          <p className="text-[10px] text-[#5B6B7A] dark:text-[#A8C0D8]">Zero risk delivery</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          {/* Badge: Client & Talent Stories */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#002366] dark:text-[#2FA8FF] text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm shadow-blue-500/10">
            <span className="w-2 h-2 rounded-full bg-[#0A84FF] animate-pulse" />
            Client & Talent Stories
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 font-display tracking-tight leading-tight">
            Loved by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]">
              Builders & Creators
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-[#5B6B7A] dark:text-[#A8C0D8] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Discover how founders, product leaders, and independent professionals achieve meaningful milestones through trusted collaboration on WorkStation.
          </p>
        </div>

        {/* Carousel & Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] animate-pulse h-64" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-10 sm:p-14 text-center rounded-3xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark max-w-xl mx-auto backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[3px] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#101826] flex items-center justify-center">
                <MessageSquare size={26} className="text-[#0A84FF]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-2">
              No reviews available yet.
            </h3>
            <p className="text-sm text-[#5B6B7A] dark:text-[#A8C0D8] mb-0 max-w-md mx-auto">
              Completed milestone contracts and verified reviews from clients will appear here.
            </p>
          </div>
        ) : (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={
                  visibleTestimonials.length === 1
                    ? 'grid grid-cols-1 max-w-lg mx-auto gap-6 sm:gap-8'
                    : visibleTestimonials.length === 2
                    ? 'grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 sm:gap-8'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
                }
              >
                {visibleTestimonials.map((t, idx) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.25 }}
                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    className="h-full select-none"
                  >
                    <div className="relative p-7 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#162235]/95 border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF] transition-all duration-300 shadow-workstation-card dark:shadow-workstation-dark hover:shadow-glow flex flex-col justify-between h-full group backdrop-blur-xl overflow-hidden">
                      
                      {/* Subtle Corner Accent Ring from WorkStation logo */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/20 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                      <div>
                        {/* Top Row: Star Rating & Verified Shield */}
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className="fill-amber-400 text-amber-400 drop-shadow-[0_1px_4px_rgba(251,191,36,0.4)] transition-transform duration-200 group-hover:scale-110"
                              />
                            ))}
                          </div>

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#EAF6FF] dark:bg-[#0A84FF]/15 border border-[#D6EFFF] dark:border-[#0A84FF]/30 text-[#002366] dark:text-[#2FA8FF]">
                            <ShieldCheck size={11} className="text-[#0A84FF]" />
                            Verified
                          </span>
                        </div>

                        {/* Oversized Stylized Quotation Mark */}
                        <span className="block text-4xl sm:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#002366]/40 via-[#0A84FF]/50 to-[#2FA8FF]/40 dark:from-[#0A84FF]/40 dark:to-[#2FA8FF]/40 leading-none mb-1 select-none pointer-events-none">
                          “
                        </span>

                        {/* Quote Body */}
                        <p className="text-slate-800 dark:text-[#C5D7EA] text-sm sm:text-[15px] leading-relaxed font-normal mb-6">
                          {t.text}
                        </p>
                      </div>

                      {/* Bottom Author Section with WorkStation Gradient Ring Avatar */}
                      <div className="pt-5 border-t border-[#E2EEF8] dark:border-[#22324A] flex items-center gap-3.5">
                        {/* Exact WorkStation Avatar Circular Gradient Ring */}
                        <div className="relative flex-shrink-0">
                          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[2.5px] sm:p-[3px] shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={t.image}
                              alt={t.name}
                              loading="lazy"
                              className="h-full w-full rounded-full object-cover object-center bg-white dark:bg-[#101826]"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=002366&color=fff`;
                              }}
                            />
                          </div>
                        </div>

                        {/* Author Details: Name & Role (strictly NO company name) */}
                        <div className="min-w-0 flex-1 text-left">
                          <h4 className="text-slate-900 dark:text-white font-black text-sm sm:text-base group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors truncate font-display">
                            {t.name}
                          </h4>
                          <p className="text-xs sm:text-[13px] font-medium text-[#5B6B7A] dark:text-[#A8C0D8] truncate mt-0.5">
                            {t.role}
                          </p>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls: Previous and Next Buttons */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-between mt-10 sm:mt-12">
                {/* Slide Indicator Dots */}
                <div className="flex items-center gap-2">
                  {[...Array(totalSlides)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentIndex === i
                          ? 'w-8 bg-gradient-to-r from-[#002366] to-[#0A84FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]'
                          : 'w-2.5 bg-slate-300 dark:bg-[#22324A] hover:bg-slate-400 dark:hover:bg-slate-600'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous testimonials"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] text-slate-700 dark:text-slate-200 hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-all shadow-sm active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next testimonials"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] text-slate-700 dark:text-slate-200 hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-all shadow-sm active:scale-95"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
