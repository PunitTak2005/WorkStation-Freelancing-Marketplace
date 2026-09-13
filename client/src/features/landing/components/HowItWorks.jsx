import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck, Users, ShieldCheck, Award,
  UserPlus, Search, Send, Wallet, CheckCircle2
} from 'lucide-react';

const clientSteps = [
  {
    icon: FileCheck,
    title: 'Post a Project',
    desc: 'Describe your requirements, define milestone budgets, and specify the skills you need in minutes.',
    badge: 'Step 1'
  },
  {
    icon: Users,
    title: 'Review Proposals',
    desc: 'Receive tailored bids from verified professionals. Compare reviews, portfolios, and chat in real time.',
    badge: 'Step 2'
  },
  {
    icon: ShieldCheck,
    title: 'Fund Secure Escrow',
    desc: 'Deposit milestone funds safely into Workstation Escrow. Funds are protected until work is approved.',
    badge: 'Step 3'
  },
  {
    icon: Award,
    title: 'Approve & Release',
    desc: 'Review deliverables, request revisions if needed, and release payments once completely satisfied.',
    badge: 'Step 4'
  }
];

const freelancerSteps = [
  {
    icon: UserPlus,
    title: 'Build Your Profile',
    desc: 'Highlight your expertise, upload past portfolio projects, set your hourly rate, and verify skills.',
    badge: 'Step 1'
  },
  {
    icon: Search,
    title: 'Explore Opportunities',
    desc: 'Filter hundreds of high-value client listings across web development, design, AI, marketing, and more.',
    badge: 'Step 2'
  },
  {
    icon: Send,
    title: 'Submit Custom Bids',
    desc: 'Pitch your unique approach, proposal milestones, and delivery timeline directly to hiring managers.',
    badge: 'Step 3'
  },
  {
    icon: Wallet,
    title: 'Get Paid on Time',
    desc: 'Receive seamless milestone payouts directly to your bank account with complete payment protection.',
    badge: 'Step 4'
  }
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('clients');
  const currentSteps = activeTab === 'clients' ? clientSteps : freelancerSteps;

  return (
    <section className="py-24 bg-slate-900/80 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Simple & Transparent
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Workstation Works</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            From initial proposal to final milestone payout, Workstation provides end-to-end security and clarity.
          </p>

          {/* Toggle Tabs */}
          <div className="inline-flex p-1.5 rounded-xl bg-slate-800 border border-slate-700 mt-8">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'clients'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Hiring Clients
            </button>
            <button
              onClick={() => setActiveTab('freelancers')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'freelancers'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Skilled Freelancers
            </button>
          </div>
        </div>

        {/* Steps Grid with Animated Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {currentSteps.map((step, i) => (
              <div
                key={step.title}
                className="relative p-6 rounded-2xl bg-slate-800/40 border border-slate-700/70 flex flex-col items-center text-center hover:border-indigo-500/50 transition-all hover:bg-slate-800/80 group"
              >
                <span className="absolute top-4 right-4 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                  {step.badge}
                </span>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400 group-hover:scale-110 transition-transform group-hover:text-white group-hover:border-indigo-400">
                  <step.icon size={28} />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Over 60,000 contracts successfully completed with 100% escrow protection.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
