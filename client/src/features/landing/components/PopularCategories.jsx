import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import jobService from '@/services/jobService';

const categories = [
  {
    name: 'Web Development',
    pattern: (
      <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
        <rect x="20" y="20" width="120" height="70" rx="8" stroke="#0A84FF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
        <path d="M45 45 L32 55 L45 65" stroke="#0A84FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M65 40 L55 70" stroke="#2FA8FF" strokeWidth="2" strokeLinecap="round" />
        <path d="M75 45 L88 55 L75 65" stroke="#0A84FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="115" cy="55" r="5" fill="#0A84FF" opacity="0.8" />
      </svg>
    ),
  },
  {
    name: 'UI/UX Design',
    pattern: (
      <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
        <circle cx="80" cy="50" rx="35" ry="35" stroke="#2FA8FF" strokeWidth="1.5" opacity="0.3" />
        <rect x="50" y="30" width="60" height="40" rx="6" stroke="#0A84FF" strokeWidth="2" />
        <path d="M60 45 C75 25, 85 75, 100 55" stroke="#2FA8FF" strokeWidth="2" fill="none" />
        <circle cx="60" cy="45" r="3" fill="#0A84FF" />
        <circle cx="100" cy="55" r="3" fill="#2FA8FF" />
      </svg>
    ),
  },
  {
    name: 'Mobile Apps',
    pattern: (
      <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
        <rect x="60" y="15" width="40" height="70" rx="8" stroke="#0A84FF" strokeWidth="2" />
        <line x1="72" y1="22" x2="88" y2="22" stroke="#2FA8FF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="74" r="3.5" fill="#0A84FF" />
        <rect x="66" y="30" width="28" height="34" rx="2" fill="#0A84FF" opacity="0.15" />
      </svg>
    ),
  },
  {
    name: 'AI & Machine Learning',
    pattern: (
      <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
        <circle cx="45" cy="50" r="6" fill="#002366" stroke="#0A84FF" strokeWidth="2" />
        <circle cx="80" cy="25" r="6" fill="#002366" stroke="#2FA8FF" strokeWidth="2" />
        <circle cx="80" cy="75" r="6" fill="#002366" stroke="#0A84FF" strokeWidth="2" />
        <circle cx="115" cy="50" r="7" fill="#0A84FF" />
        <line x1="49" y1="46" x2="76" y2="29" stroke="#0A84FF" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="49" y1="54" x2="76" y2="71" stroke="#0A84FF" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="84" y1="29" x2="111" y2="46" stroke="#2FA8FF" strokeWidth="2" />
        <line x1="84" y1="71" x2="111" y2="54" stroke="#2FA8FF" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Digital Marketing',
    pattern: (
      <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
        <rect x="35" y="60" width="12" height="25" rx="2" fill="#0A84FF" opacity="0.4" />
        <rect x="55" y="45" width="12" height="40" rx="2" fill="#0A84FF" opacity="0.7" />
        <rect x="75" y="30" width="12" height="55" rx="2" fill="#2FA8FF" />
        <rect x="95" y="18" width="12" height="67" rx="2" fill="#002366" stroke="#0A84FF" strokeWidth="1.5" />
        <path d="M35 55 Q 65 35, 115 15" stroke="#2FA8FF" strokeWidth="2" fill="none" />
        <polygon points="115,10 122,17 112,20" fill="#2FA8FF" />
      </svg>
    ),
  },
  {
    name: 'Content Writing',
    pattern: (
      <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
        <rect x="45" y="20" width="50" height="65" rx="4" stroke="#0A84FF" strokeWidth="2" />
        <line x1="55" y1="32" x2="85" y2="32" stroke="#2FA8FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="55" y1="42" x2="85" y2="42" stroke="#0A84FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="55" y1="52" x2="75" y2="52" stroke="#0A84FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M105 50 L115 40 L120 45 L110 55 Z" fill="#2FA8FF" />
        <polygon points="105,50 103,57 110,55" fill="#002366" />
      </svg>
    ),
  },
  {
    name: 'Graphic Design',
    pattern: (
      <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
        <path d="M50 65 A 15 15 0 0 1 60 40 A 25 25 0 0 1 100 35 A 20 20 0 0 1 120 60 A 12 12 0 0 1 115 65 Z" stroke="#0A84FF" strokeWidth="2" fill="#0A84FF" fillOpacity="0.1" />
        <line x1="70" y1="55" x2="90" y2="55" stroke="#2FA8FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="48" x2="80" y2="62" stroke="#2FA8FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Video Editing',
    pattern: (
      <svg className="w-full h-full" viewBox="0 0 160 100" fill="none">
        <rect x="35" y="25" width="70" height="50" rx="8" stroke="#0A84FF" strokeWidth="2" />
        <polygon points="65,40 85,50 65,60" fill="#2FA8FF" />
        <polygon points="105,40 125,30 125,70 105,60" fill="#0A84FF" opacity="0.6" />
      </svg>
    ),
  },
];

export default function PopularCategories() {
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const res = await jobService.getJobCategories();
        const cats = res.data?.data?.categories || [];
        if (isMounted && Array.isArray(cats)) {
          const map = {};
          cats.forEach((c) => {
            if (c.name) map[c.name.toLowerCase()] = c.count;
          });
          setCategoryCounts(map);
        }
      } catch (err) {
        // Fallback to empty map
      }
    };
    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <section className="py-24 bg-[#F8FBFF] dark:bg-[#080B12] relative overflow-hidden border-t border-[#D6EFFF] dark:border-[#22324A] transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-semibold uppercase tracking-wider mb-3">
            In-Demand Domains
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 font-display tracking-tight">
            Explore Specialized{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]">
              Categories
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#5B6B7A] dark:text-[#A8C0D8]">
            Curated talent domains featuring unique workspace expertise, guaranteed escrow, and immediate availability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const count = categoryCounts[cat.name.toLowerCase()] ?? 0;
            const countText = count > 0 ? `${count} ${count === 1 ? 'Open Project' : 'Open Projects'}` : 'Explore Projects';
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="group block p-6 rounded-2xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF] shadow-workstation-card dark:shadow-workstation-dark hover:shadow-glow-soft transition-all duration-300 h-full relative overflow-hidden"
                >
                  {/* Visual Category Illustration / Blueprint Art */}
                  <div className="h-24 w-full mb-4 flex items-center justify-center rounded-xl bg-[#F8FBFF] dark:bg-[#080B12]/80 border border-[#D6EFFF]/60 dark:border-[#22324A] overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    {cat.pattern}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors line-clamp-1 font-display">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-[#A8C0D8] flex items-center justify-between mt-3 pt-3 border-t border-[#D6EFFF] dark:border-[#22324A]">
                    <span className="font-semibold text-[#0A84FF] dark:text-[#2FA8FF]">{countText}</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform text-[#0A84FF]" />
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
