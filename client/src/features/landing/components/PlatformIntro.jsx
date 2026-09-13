import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, MessageSquare, Award, ArrowUpRight } from 'lucide-react';
import Card from '@/components/common/Card';

const features = [
  {
    icon: Award,
    title: 'Verified Professionals',
    desc: 'Access pre-vetted specialists with verified skill assessments, authentic client reviews, and verified portfolios.',
    color: 'from-blue-500 to-indigo-600',
    iconColor: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'hover:border-indigo-500/50',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    desc: 'Automated escrow milestone releases protect both parties. Funds are safely held and released only when work is approved.',
    color: 'from-emerald-500 to-teal-600',
    iconColor: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'hover:border-emerald-500/50',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Collaboration',
    desc: 'Instant messaging powered by Socket.io with file sharing, typing indicators, read receipts, and live notification sync.',
    color: 'from-purple-500 to-pink-600',
    iconColor: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/50',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Hiring',
    desc: 'Clear milestone schedules, zero hidden markups, dispute arbitration, and binding digital contracts for complete peace of mind.',
    color: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'hover:border-amber-500/50',
  },
];

export default function PlatformIntro() {
  return (
    <section className="py-24 bg-[#F8FBFF] dark:bg-[#080B12] relative overflow-hidden transition-colors duration-300">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0A84FF]/5 dark:bg-[#0A84FF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-semibold uppercase tracking-wider mb-3">
            Enterprise Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 font-display tracking-tight">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]">
              WorkStation?
            </span>
          </h2>
          <p className="text-[#5B6B7A] dark:text-[#A8C0D8] text-sm sm:text-base leading-relaxed">
            Built from the ground up to eliminate the transparency, security, and communication friction common in traditional freelance marketplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <div
                className="p-6 sm:p-8 h-full flex flex-col justify-between transition-all duration-300 rounded-3xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/70 dark:hover:border-[#0A84FF]/70 shadow-workstation-card dark:shadow-workstation-dark hover:shadow-glow-soft group relative overflow-hidden"
              >
                {/* Circular motif in corner */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/20 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF6FF] dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] flex items-center justify-center mb-6 text-[#0A84FF] dark:text-[#2FA8FF] shadow-sm group-hover:scale-110 transition-transform">
                    <feature.icon size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors font-display">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5B6B7A] dark:text-[#A8C0D8] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D6EFFF] dark:border-[#22324A] flex items-center justify-between text-xs font-semibold text-[#0A84FF] dark:text-[#2FA8FF]">
                  <span>WorkStation Core</span>
                  <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
