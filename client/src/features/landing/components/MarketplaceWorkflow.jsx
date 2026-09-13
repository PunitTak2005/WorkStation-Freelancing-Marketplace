import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck, Briefcase, Send, Handshake, CheckCircle2, Star, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

const workflowSteps = [
  {
    step: '01',
    title: 'Post a Project',
    desc: 'Describe your requirements, deliverables, and budget in minutes. Our AI matching finds top candidates immediately.',
    icon: Briefcase,
    tag: 'Step 1: Scoping',
  },
  {
    step: '02',
    title: 'Receive Proposals',
    desc: 'Review structured proposals with milestones, timelines, and tailored portfolios from pre-vetted specialists.',
    icon: Send,
    tag: 'Step 2: Selection',
  },
  {
    step: '03',
    title: 'Hire Talent',
    desc: 'Select the best match, secure payments in protected escrow, and coordinate work seamlessly inside the workstation.',
    icon: Handshake,
    tag: 'Step 3: Contract',
  },
  {
    step: '04',
    title: 'Deliver Successfully',
    desc: 'Review milestones, release payments automatically upon approval, and build lasting professional partnerships.',
    icon: CheckCircle2,
    tag: 'Step 4: Completion',
  },
];

export default function MarketplaceWorkflow() {
  return (
    <section className="py-24 bg-white dark:bg-[#080B12] relative overflow-hidden border-t border-[#D6EFFF] dark:border-[#22324A] transition-colors duration-300">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      {/* Ambient Blue Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0A84FF]/10 dark:bg-[#0A84FF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-semibold uppercase tracking-wider mb-3">
            Seamless Execution
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 font-display tracking-tight">
            How{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]">
              WorkStation Works
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#5B6B7A] dark:text-[#A8C0D8]">
            A curved, frictionless 4-step workflow connecting projects with world-class freelancers.
          </p>
        </div>

        {/* Timeline Container with Glowing Curved Connector on Desktop */}
        <div className="relative">
          {/* Glowing S-Curved SVG Connector Line across Steps */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-20 pointer-events-none z-0">
            <svg viewBox="0 0 1100 100" fill="none" className="w-full h-full">
              {/* Outer Glow Path */}
              <path
                d="M 50,50 Q 200,10 350,50 T 650,50 T 950,50"
                stroke="#0A84FF"
                strokeWidth="4"
                opacity="0.3"
                strokeDasharray="6 6"
              />
              {/* Inner Solid Line */}
              <path
                d="M 50,50 Q 200,10 350,50 T 650,50 T 950,50"
                stroke="url(#timelineGrad)"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="timelineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#002366" />
                  <stop offset="50%" stopColor="#0A84FF" />
                  <stop offset="100%" stopColor="#2FA8FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {workflowSteps.map((stage, i) => (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="relative group h-full"
              >
                <div className="h-full p-7 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark hover:border-[#0A84FF]/70 dark:hover:border-[#0A84FF]/70 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between">
                  <div>
                    {/* Top Node with Step Number and Glowing Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#002366] to-[#0A84FF] dark:from-[#0A84FF] dark:to-[#2FA8FF] flex items-center justify-center text-white shadow-lg shadow-[#0A84FF]/20 group-hover:scale-110 transition-transform">
                        <stage.icon size={26} />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2FA8FF] border-2 border-white dark:border-[#101826] animate-pulse" />
                      </div>
                      <span className="text-3xl font-black text-[#D6EFFF] dark:text-[#22324A] group-hover:text-[#0A84FF]/40 transition-colors font-display">
                        {stage.step}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-[#0A84FF] dark:text-[#2FA8FF] uppercase tracking-wider block mb-1.5">
                      {stage.tag}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors font-display">
                      {stage.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5B6B7A] dark:text-[#A8C0D8] leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D6EFFF] dark:border-[#22324A] flex items-center justify-between text-xs font-semibold text-[#0A84FF] dark:text-[#2FA8FF]">
                    <span>Stage {stage.step}</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/register">
            <Button variant="primary" size="lg" className="shadow-lg shadow-[#0A84FF]/25 px-8">
              <span>Start Your WorkStation Project</span>
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
