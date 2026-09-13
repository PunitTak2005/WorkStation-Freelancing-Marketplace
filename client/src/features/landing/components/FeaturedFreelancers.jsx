import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle2, ArrowRight, Briefcase, Sparkles, ShieldCheck, Zap, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import userService from '@/services/userService';

export default function FeaturedFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTalent = async () => {
      try {
        const res = await userService.getFeaturedFreelancers();
        const data = res.data?.data?.freelancers || res.data?.data || [];
        if (isMounted && Array.isArray(data)) {
          setFreelancers(data.slice(0, 6));
        }
      } catch (err) {
        if (isMounted) setFreelancers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTalent();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-[#080B12] relative overflow-hidden border-t border-[#D6EFFF] dark:border-[#22324A] transition-colors duration-300">
      {/* Background Blueprint Grid & Futuristic Concentric Circles from WorkStation Logo */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.07] pointer-events-none" />
      
      {/* Radial brand gradients */}
      <div className="absolute top-1/4 -left-40 w-[550px] h-[550px] bg-gradient-to-tr from-[#002366]/20 via-[#0A84FF]/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-[#2FA8FF]/15 via-[#0A84FF]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-[#0A84FF]/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1150px] h-[1150px] rounded-full border border-dashed border-[#2FA8FF]/5 pointer-events-none" />

      {/* Floating Decorative Floating Cards behind section (slow float animation) */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:flex items-center gap-2.5 absolute top-20 left-10 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-[#162235]/80 backdrop-blur-md border border-[#0A84FF]/25 shadow-lg shadow-[#0A84FF]/10 z-0 pointer-events-none"
      >
        <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-500">
          <Star size={14} className="fill-current" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">⭐ 4.9 Rated</p>
          <p className="text-[10px] text-slate-500 dark:text-[#A8C0D8]">Top 1% Talent Pool</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hidden xl:flex items-center gap-2.5 absolute bottom-24 left-16 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-[#162235]/80 backdrop-blur-md border border-[#0A84FF]/25 shadow-lg shadow-[#0A84FF]/10 z-0 pointer-events-none"
      >
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
          <ShieldCheck size={14} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">Verified Talent</p>
          <p className="text-[10px] text-slate-500 dark:text-[#A8C0D8]">100% Escrow Protected</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="hidden xl:flex items-center gap-2.5 absolute top-36 right-12 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-[#162235]/80 backdrop-blur-md border border-[#0A84FF]/25 shadow-lg shadow-[#0A84FF]/10 z-0 pointer-events-none"
      >
        <div className="p-1.5 rounded-lg bg-[#0A84FF]/10 text-[#0A84FF]">
          <Zap size={14} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">₹25k+ Avg Earned</p>
          <p className="text-[10px] text-slate-500 dark:text-[#A8C0D8]">Direct Client Milestone</p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl">
            {/* Glowing Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF6FF] dark:bg-[#162235] border border-[#0A84FF]/30 text-[#002366] dark:text-[#2FA8FF] text-xs font-black uppercase tracking-wider mb-4 shadow-md shadow-[#0A84FF]/15">
              <Sparkles size={14} className="text-[#0A84FF] animate-pulse" />
              <span>Vetted Specialists</span>
            </div>

            {/* Main Headline with Poppins and text-5xl desktop / text-3xl mobile */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002366] dark:text-white font-display tracking-tight leading-tight">
              Featured{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]">
                Freelancers
              </span>
            </h2>

            {/* Redesigned Description */}
            <p className="text-sm sm:text-base text-[#5B6B7A] dark:text-[#A8C0D8] mt-3 font-normal leading-relaxed">
              Discover trusted professionals with verified credentials, proven project delivery, and secure collaboration—built for the modern WorkStation ecosystem.
            </p>
          </div>

          <Link to="/freelancers" className="flex-shrink-0">
            <Button
              variant="outline"
              icon={ArrowRight}
              iconPosition="right"
              className="font-bold group rounded-2xl px-6 py-3 border-[#0A84FF]/40 hover:border-[#0A84FF] hover:bg-[#EAF6FF]/50 dark:hover:bg-[#162235] text-slate-900 dark:text-white shadow-sm"
            >
              Explore All Talent
            </Button>
          </Link>
        </div>

        {/* Freelancers Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <div className="flex justify-center my-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                <Skeleton className="h-6 w-36 mx-auto rounded-lg" />
                <Skeleton className="h-4 w-48 mx-auto rounded-md" />
                <Skeleton className="h-10 w-full rounded-2xl" />
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex gap-2 pt-4 border-t border-[#D6EFFF] dark:border-[#22324A]">
                  <Skeleton className="h-9 flex-1 rounded-full" />
                  <Skeleton className="h-9 flex-1 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : freelancers.length === 0 ? (
          /* Clean Empty State */
          <div className="p-10 sm:p-14 text-center rounded-3xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark max-w-xl mx-auto backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[3px] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#101826] flex items-center justify-center">
                <Users size={26} className="text-[#0A84FF]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-2">
              No featured talent available.
            </h3>
            <p className="text-sm text-[#5B6B7A] dark:text-[#A8C0D8] mb-6 max-w-md mx-auto">
              Check back soon or explore the full freelancer directory to discover and hire skilled professionals.
            </p>
            <Link to="/freelancers">
              <Button variant="primary" icon={ArrowRight} iconPosition="right" className="font-bold">
                Explore All Freelancers
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {freelancers.map((freelancer, i) => {
              const avatarSrc =
                freelancer.name === 'Mayank Joshi'
                  ? '/freelancers/mayank-joshi.png'
                  : freelancer.name === 'Abhishek Nayak'
                  ? '/freelancers/abhishek-nayak.png'
                  : freelancer.name === 'Sakshi Rawat'
                  ? '/freelancers/sakshi-rawat.png'
                  : freelancer.name === 'Nisha Banerjee'
                  ? '/freelancers/nisha-banerjee.png'
                  : (freelancer.avatar?.url ||
                     freelancer.fullAvatarUrl ||
                     freelancer.avatar ||
                     freelancer.image ||
                     `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name || 'Talent')}&background=002366&color=fff`);

              return (
                <motion.div
                  key={freelancer._id || freelancer.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.25 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="h-full select-none"
                >
                  <div className="relative p-6 sm:p-7 bg-white dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF] transition-all duration-250 rounded-3xl h-full flex flex-col justify-between group shadow-workstation-card dark:shadow-workstation-dark hover:shadow-glow overflow-hidden text-center backdrop-blur-xl">
                    
                    {/* Corner Blueprint Circular Arc from Logo */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/20 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full border border-dashed border-[#2FA8FF]/10 pointer-events-none" />

                    <div>
                      {/* Top Row: Ribbon Badge & Hourly Rate */}
                      <div className="flex items-center justify-between w-full mb-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-[#002366]/10 to-[#0A84FF]/15 text-[#002366] dark:text-[#2FA8FF] dark:from-[#0A84FF]/20 dark:to-[#2FA8FF]/20 border border-[#0A84FF]/30 shadow-sm">
                          <Award size={13} className="text-[#0A84FF]" />
                          {freelancer.badge || 'Top Rated'}
                        </span>

                        <div className="text-right">
                          <span className="text-base sm:text-lg font-black text-[#002366] dark:text-white font-mono leading-none">
                            ₹{(freelancer.hourlyRate || 1800).toLocaleString()}
                          </span>
                          <span className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] font-sans font-normal ml-0.5">/hr</span>
                        </div>
                      </div>

                      {/* Centered Profile Avatar with WorkStation Brand Circular Ring */}
                      <div className="relative mx-auto mb-4 flex justify-center">
                        {/* Soft blue glowing ambient halo */}
                        <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-[#0A84FF]/20 blur-xl group-hover:bg-[#0A84FF]/40 transition-all duration-300 pointer-events-none" />
                        
                        {/* 96x96 desktop / 80x80 mobile circular ring */}
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[3px] shadow-lg shadow-blue-500/30 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={avatarSrc}
                            alt={freelancer.name}
                            loading="lazy"
                            className="h-full w-full rounded-full object-cover object-center bg-white dark:bg-[#101826]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name)}&background=002366&color=fff`;
                            }}
                          />
                          {/* Online Presence Indicator */}
                          <span
                            className="absolute bottom-0.5 right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#101826] shadow-sm"
                            title="Online & Available"
                          />
                        </div>
                      </div>

                      {/* Name & Verified Badge */}
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors font-display line-clamp-1">
                          {freelancer.name}
                        </h3>
                        <CheckCircle2
                          size={16}
                          className="text-[#0A84FF] dark:text-[#2FA8FF] fill-[#0A84FF]/20 flex-shrink-0"
                          title="Verified Professional"
                        />
                      </div>

                      {/* Profession / Role */}
                      <p className="text-[#5B6B7A] dark:text-[#A8C0D8] text-sm font-medium mb-4 line-clamp-1">
                        {freelancer.title || 'Full Stack Engineer'}
                      </p>

                      {/* Information Row: Rating & Projects */}
                      <div className="flex items-center justify-center gap-3 text-xs text-[#5B6B7A] dark:text-[#A8C0D8] mb-5 py-2.5 px-3 rounded-2xl bg-[#F8FBFF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A]">
                        <div className="flex items-center font-bold text-amber-500">
                          <Star size={13} className="fill-current mr-1 text-amber-400" />
                          <span>{freelancer.ratingsAverage || 4.9}</span>
                          <span className="text-slate-400 dark:text-slate-500 font-normal ml-0.5">
                            ({freelancer.ratingsCount || 84})
                          </span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <div className="flex items-center gap-1 font-medium">
                          <Briefcase size={12} className="text-[#0A84FF]" />
                          <span>{freelancer.completedProjects || 50}+ done</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <div className="flex items-center gap-1 font-medium">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="truncate max-w-[75px] sm:max-w-none">
                            {freelancer.location?.split(',')[0] || 'Remote'}
                          </span>
                        </div>
                      </div>

                      {/* Redesigned Skill Chips (Soft Blue, Navy Text) */}
                      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                        {(Array.isArray(freelancer.skills) ? freelancer.skills : []).slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF6FF] text-[#002366] dark:bg-[#22324A] dark:text-[#F5F9FF] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/50 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Actions: View Profile & Premium Hire Now Button */}
                    <div className="flex items-center gap-2 pt-4 border-t border-[#D6EFFF] dark:border-[#22324A]">
                      <Link
                        to={freelancer._id ? `/freelancers/${freelancer._id}` : '/freelancers'}
                        className="flex-1"
                      >
                        <Button
                          variant="secondary"
                          size="md"
                          className="w-full justify-center rounded-full text-xs font-semibold bg-[#F0F7FF] dark:bg-[#101826] hover:bg-[#EAF6FF] dark:hover:bg-[#162235] text-[#002366] dark:text-white border border-[#D6EFFF] dark:border-[#22324A]"
                        >
                          View Profile
                        </Button>
                      </Link>
                      <Link
                        to={freelancer._id ? `/freelancers/${freelancer._id}` : '/freelancers'}
                        className="flex-1"
                      >
                        <button
                          type="button"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] shadow-md shadow-[#0A84FF]/25 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn"
                        >
                          <span>Hire Now</span>
                          <ArrowRight size={13} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
