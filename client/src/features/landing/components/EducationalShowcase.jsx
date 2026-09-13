import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key, Shield, Server, Database, MessageSquare,
  Cloud, CreditCard, BarChart3, Search, Layout,
  Check, Copy, Terminal, ExternalLink
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const learningOutcomes = [
  {
    icon: Key,
    title: 'JWT Auth & Cookie Rotation',
    desc: 'Short-lived access tokens stored in Redux memory with automated HTTP-only refresh cookie rotation.',
    tag: 'Security',
    color: 'text-indigo-400 bg-indigo-500/10'
  },
  {
    icon: Shield,
    title: 'Role-Based Authorization (RBAC)',
    desc: 'Route middleware strictly guarding endpoints across Client, Freelancer, Admin, and Guest privileges.',
    tag: 'Access Control',
    color: 'text-purple-400 bg-purple-500/10'
  },
  {
    icon: Server,
    title: 'Modular REST API Architecture',
    desc: 'Decoupled controllers, service layer abstractions, Zod/Joi validation, and centralized API error formatting.',
    tag: 'Backend',
    color: 'text-blue-400 bg-blue-500/10'
  },
  {
    icon: Database,
    title: 'Mongoose Schemas & Indexing',
    desc: 'Compound unique indexes, pre-save middleware hooks, virtuals, and aggregation pipelines.',
    tag: 'Database',
    color: 'text-emerald-400 bg-emerald-500/10'
  },
  {
    icon: MessageSquare,
    title: 'Socket.io Real-Time Engine',
    desc: 'JWT handshake verification, room-based private chats, typing indicators, and live event broadcasts.',
    tag: 'WebSockets',
    color: 'text-pink-400 bg-pink-500/10'
  },
  {
    icon: Cloud,
    title: 'Cloudinary Asset Pipeline',
    desc: 'Streaming file uploads, avatar compression, multi-file proposal attachments, and portfolio galleries.',
    tag: 'Cloud Storage',
    color: 'text-cyan-400 bg-cyan-500/10'
  },
  {
    icon: CreditCard,
    title: 'Razorpay Escrow Workflows',
    desc: 'Order creation, webhook signature verification, milestone payment hold, and verified fund releases.',
    tag: 'FinTech',
    color: 'text-amber-400 bg-amber-500/10'
  },
  {
    icon: BarChart3,
    title: 'Data Visualization & Analytics',
    desc: 'Interactive Recharts area charts, bar graphs, and donut charts showing revenue, work hours, and growth.',
    tag: 'Analytics',
    color: 'text-rose-400 bg-rose-500/10'
  },
  {
    icon: Search,
    title: 'Debounced Multi-Filter Search',
    desc: 'Custom hooks for debounced input queries combined with multi-category and budget faceted filtering.',
    tag: 'Performance',
    color: 'text-teal-400 bg-teal-500/10'
  },
  {
    icon: Layout,
    title: 'Modern Responsive SaaS UI',
    desc: 'Tailwind CSS utility styling, glassmorphism cards, dark/light themes, and fluid Framer Motion animations.',
    tag: 'Frontend',
    color: 'text-violet-400 bg-violet-500/10'
  }
];

export default function EducationalShowcase() {
  const [copiedRole, setCopiedRole] = useState(null);

  const copyCreds = (role, email, pass) => {
    navigator.clipboard.writeText(`${email} | ${pass}`);
    setCopiedRole(role);
    toast.success(`Copied ${role} credentials to clipboard!`);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  return (
    <section className="py-24 bg-slate-900/90 relative overflow-hidden border-t border-slate-800">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Portfolio & Curriculum Showcase
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Workstation</span>?
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Built as a benchmark full-stack project demonstrating how production marketplace platforms handle authentication, complex state management, data integrity, and asynchronous financial workflows.
          </p>
        </div>

        {/* 10 Learning Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto mb-16">
          {learningOutcomes.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/70 hover:border-emerald-500/40 transition-all hover:bg-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Demo Credentials Bar for Evaluators */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-emerald-400" />
                <h4 className="font-bold text-white text-base">Interactive Testing & Demo Accounts</h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-seeded with realistic data across all three platform roles for immediate evaluation.
              </p>
            </div>
            <Link to="/login">
              <Button variant="primary" size="sm">Go to Login</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Admin */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Admin Role</span>
                <p className="font-mono text-xs text-white">punittak2005@gmail.com</p>
                <p className="font-mono text-[11px] text-slate-400">Pass: admin123</p>
              </div>
              <button
                onClick={() => copyCreds('Admin', 'punittak2005@gmail.com', 'admin123')}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy Admin Credentials"
              >
                {copiedRole === 'Admin' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Client */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Client Role</span>
                <p className="font-mono text-xs text-white">rajesh.sharma@email.com</p>
                <p className="font-mono text-[11px] text-slate-400">Pass: password123</p>
              </div>
              <button
                onClick={() => copyCreds('Client', 'rajesh.sharma@email.com', 'password123')}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy Client Credentials"
              >
                {copiedRole === 'Client' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Freelancer */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Freelancer Role</span>
                <p className="font-mono text-xs text-white">aarav.desai@email.com</p>
                <p className="font-mono text-[11px] text-slate-400">Pass: password123</p>
              </div>
              <button
                onClick={() => copyCreds('Freelancer', 'aarav.desai@email.com', 'password123')}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy Freelancer Credentials"
              >
                {copiedRole === 'Freelancer' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
