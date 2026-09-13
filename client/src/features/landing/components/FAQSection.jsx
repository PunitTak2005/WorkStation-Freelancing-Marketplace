import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import FAQIllustration from './FAQIllustration';

// Categorized WorkStation FAQs
const faqs = [
  {
    id: 1,
    q: 'How do I get started as a freelancer?',
    a: 'Simply sign up, complete your profile with your skills and portfolio, and start browsing available jobs. You can submit proposals immediately with zero upfront charges.',
    category: 'Freelancers',
  },
  {
    id: 2,
    q: 'How do payments and escrow work on WorkStation?',
    a: 'We use a 100% escrow protection model. Clients fund each project milestone before work begins. Once deliverables are reviewed and approved, funds are instantly released to the specialist.',
    category: 'Payments',
  },
  {
    id: 3,
    q: 'What fees does WorkStation charge?',
    a: 'WorkStation charges a transparent flat 10% service fee on completed milestones—significantly lower than conventional 20% industry rates, ensuring more value stays with creators and clients.',
    category: 'Payments',
  },
  {
    id: 4,
    q: 'Can I be both a client and a freelancer on one account?',
    a: 'Yes! You can seamlessly switch between client mode (to post projects and hire talent) and freelancer mode (to submit proposals and get hired) using your single unified account.',
    category: 'Clients',
  },
  {
    id: 5,
    q: 'Is my personal and payment information secure?',
    a: 'Absolutely. We enforce bank-grade 256-bit SSL encryption, strict zero-knowledge authentication protocols, and PCI-DSS compliant payment gateways with escrow dispute safeguards.',
    category: 'Security',
  },
  {
    id: 6,
    q: 'What happens if there is a project milestone dispute?',
    a: 'Our dedicated WorkStation Resolution Center provides impartial mediation. Because funds remain safely locked in escrow until milestone deliverables are verified, both parties are fully protected.',
    category: 'Projects',
  },
  {
    id: 7,
    q: 'How are freelancer skills and identities verified?',
    a: 'Freelancers undergo multi-stage profile vetting including portfolio authentication, identity verification, skill assessments, and verified client reviews on completed milestones.',
    category: 'Freelancers',
  }
];

const categories = ['All', 'Freelancers', 'Payments', 'Clients', 'Projects', 'Security'];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // Open first FAQ by default
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter((item) => item.category === activeCategory);

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'Payments':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Freelancers':
        return 'bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] border-[#0A84FF]/30';
      case 'Clients':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      case 'Security':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'Projects':
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    }
  };

  return (
    <section className="py-24 bg-[#F8FBFF] dark:bg-[#080B12] relative overflow-hidden border-t border-[#D6EFFF] dark:border-[#22324A] transition-colors duration-300">
      {/* Subtle Background Blueprint Grid (Opacity < 6%) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0A84FF 1px, transparent 1px),
            linear-gradient(to bottom, #0A84FF 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Ambient Blue Radial Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#0A84FF]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#002366]/10 dark:bg-[#0A84FF]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Premium Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#002366] dark:text-[#2FA8FF] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0A84FF] animate-pulse" />
            Help Center
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight mb-4">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]">
              Questions
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5B6B7A] dark:text-[#A8C0D8] max-w-2xl mx-auto leading-relaxed">
            Find quick answers about projects, proposals, payments, and hiring—all in one place.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-250 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#002366] to-[#0A84FF] text-white shadow-md shadow-[#0A84FF]/25 border-transparent'
                    : 'bg-white dark:bg-[#101826] text-[#5B6B7A] dark:text-[#A8C0D8] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Two-Column Layout (Desktop: Illustration Left, Accordion Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start max-w-7xl mx-auto">
          
          {/* Left Column: WorkStation Interactive Illustration & Support Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <FAQIllustration />

            {/* Quick Support Card below the Illustration */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full border border-[#0A84FF]/15 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-[#0A84FF]/10 text-[#0A84FF] flex items-center justify-center flex-shrink-0">
                  <Headphones size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    Still need help?
                  </h4>
                  <p className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8]">
                    Our team is here to help you build faster.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Link to="/contact" className="flex-1">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center text-xs font-bold shadow-md shadow-[#0A84FF]/20"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Contact Support
                  </Button>
                </Link>
                <Link to="/jobs" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-xs font-bold"
                  >
                    Browse Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Accordion Cards */}
          <div className="lg:col-span-7 space-y-3.5">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i;

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-[#162235] border-2 border-[#0A84FF] shadow-glow shadow-blue-500/20'
                      : 'bg-white/90 dark:bg-[#162235]/90 border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/60 dark:hover:border-[#0A84FF]/60 shadow-workstation-card dark:shadow-workstation-dark'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none group focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      {/* Category Badge */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border self-start ${getCategoryBadgeColor(
                          faq.category
                        )}`}
                      >
                        {faq.category}
                      </span>

                      {/* Question Text */}
                      <span
                        className={`text-base sm:text-lg font-bold transition-colors font-display ${
                          isOpen
                            ? 'text-[#0A84FF] dark:text-[#2FA8FF]'
                            : 'text-slate-900 dark:text-white group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF]'
                        }`}
                      >
                        {faq.q}
                      </span>
                    </div>

                    {/* Circular Action Icon (Smooth Morphing Plus to Minus) */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-gradient-to-br from-[#002366] to-[#0A84FF] text-white shadow-md shadow-[#0A84FF]/30 rotate-180'
                          : 'bg-[#EAF6FF] dark:bg-[#101826] text-[#002366] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A] group-hover:border-[#0A84FF]'
                      }`}
                    >
                      {isOpen ? <Minus size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                    </div>
                  </button>

                  {/* Smooth Framer Motion Animated Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#D6EFFF]/60 dark:border-[#22324A]/60">
                          <p className="text-sm sm:text-base text-[#5B6B7A] dark:text-[#A8C0D8] leading-7 font-normal">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
