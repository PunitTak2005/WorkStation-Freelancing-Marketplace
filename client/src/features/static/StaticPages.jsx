import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Award, Users, Globe, Lock, HelpCircle,
  FileText, CheckCircle2, ChevronDown, ChevronUp, Search,
  ArrowRight, Sparkles, Zap, MessageSquare
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import dashboardService from '@/services/dashboardService';

// 1. ABOUT PAGE
export function AboutPage() {
  const [stats, setStats] = useState({
    activeProjects: '0',
    totalFreelancers: '0',
    totalVolume: '₹0',
    satisfactionRate: '99%',
  });

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        const res = await dashboardService.getPublicStats();
        const d = res.data?.data;
        if (mounted && d) {
          const vol = d.totalVolume
            ? d.totalVolume >= 10000000
              ? `₹${(d.totalVolume / 10000000).toFixed(1)} Cr+`
              : `₹${(d.totalVolume / 100000).toFixed(0)} Lakh+`
            : '₹0';

          setStats({
            activeProjects: `${d.activeProjects ?? 0}`,
            totalFreelancers: `${(d.totalFreelancers || 0).toLocaleString()}+`,
            totalVolume: vol,
            satisfactionRate: d.satisfactionRate ? `${d.satisfactionRate}%` : '99%',
          });
        }
      } catch (e) {
        // keep clean default
      }
    };
    loadStats();
    window.addEventListener('project:count_changed', loadStats);
    return () => {
      mounted = false;
      window.removeEventListener('project:count_changed', loadStats);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display leading-tight">
            Find. Hire. Build.
          </h1>
          <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
            WorkStation is designed to unite world-class clients and top-tier independent professionals through transparent milestone escrow, real-time collaboration, and verified credentials.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Active Projects', value: `${stats.activeProjects} Active` },
            { label: 'Verified Specialists', value: stats.totalFreelancers },
            { label: 'Escrow Secured (INR)', value: stats.totalVolume },
            { label: 'Client Satisfaction', value: stats.satisfactionRate },
          ].map((stat, idx) => (
            <Card key={idx} glass className="p-6 text-center border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card glass className="p-6 rounded-3xl border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Escrow Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every client deposit is safely held in milestone escrow and only released when deliverables meet high standards.
            </p>
          </Card>

          <Card glass className="p-6 rounded-3xl border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Speed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant Socket.io communication, live bid notifications, and quick milestone dispatch eliminate friction.
            </p>
          </Card>

          <Card glass className="p-6 rounded-3xl border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Verified Excellence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent client reviews, verified portfolios, and algorithmic skill matching guarantee trusted results.
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to transform how you work?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Join thousands of businesses and skilled freelancers on WorkStation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg">Get Started Free</Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="lg" className="border-slate-700">Explore Projects</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. PRIVACY POLICY PAGE
export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Lock size={13} />
            <span>Data Security & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            WorkStation Privacy Policy
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Last Updated: January 2026 • Compliant with Indian DPDP Act & Global Privacy Frameworks
          </p>
        </div>

        <Card glass className="p-6 sm:p-10 rounded-3xl border-slate-800 space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              When you register on WorkStation, we collect basic account credentials including your name, verified email address, optional contact phone number, and account profile details (such as portfolio items, skills, and rates).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Financial & Milestone Escrow Data</h2>
            <p>
              All milestone transactions and escrow operations are handled using encrypted payment gateway channels. WorkStation does not store raw credit card numbers or sensitive CVV codes on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. How We Use Your Data</h2>
            <p>
              Your data is utilized solely to facilitate project matchmaking, proposal evaluation, client communications, milestone payout settlements, and fraud prevention. We never sell your personal data to third-party brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. User Rights & Account Control</h2>
            <p>
              You maintain full control to update your profile information, edit skills, adjust visibility preferences, or request account data erasure anytime through your account settings or by emailing <a href="mailto:punittak2005@gmail.com" className="text-indigo-400 underline">punittak2005@gmail.com</a>.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}

// 3. TERMS & CONDITIONS PAGE
export function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText size={13} />
            <span>Legal Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Terms of Service & Escrow Agreement
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Effective Date: January 1, 2026 • WorkStation Marketplace Terms
          </p>
        </div>

        <Card glass className="p-6 sm:p-10 rounded-3xl border-slate-800 space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Platform Agreement</h2>
            <p>
              By accessing WorkStation, creating a client or freelancer account, or submitting proposals, you agree to be bound by these Terms of Service. WorkStation provides the marketplace technology uniting independent contractors with clients.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Escrow Funding & Milestone Release</h2>
            <p>
              Clients agree to fund project milestones prior to freelancer work commencement. Funds are held in escrow and released upon client acceptance of agreed deliverables. If a dispute occurs, WorkStation arbitration procedures apply.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Code Ownership & Intellectual Property</h2>
            <p>
              Upon full release of milestone payment escrow, the client receives full commercial intellectual property rights for all custom code, design assets, and deliverables created under that contract.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Fair Marketplace Conduct</h2>
            <p>
              Users agree to conduct professional communications, honor milestone commitments, refrain from circumventing platform escrow, and avoid harassment or abuse.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}

// 4. HELP CENTER PAGE
export function HelpCenterPage() {
  const categories = [
    { title: 'Getting Started', desc: 'Account setup, profile creation, and verification', icon: Users },
    { title: 'Milestone Escrow', desc: 'Funding projects, releasing payments, and invoices', icon: ShieldCheck },
    { title: 'Proposals & Bidding', desc: 'Submitting winning proposals and rate guidance', icon: Award },
    { title: 'Dispute Resolution', desc: 'Mediation processes and milestone arbitration', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle size={13} />
            <span>Support & Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">
            How can we help you today?
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Search our guides or browse categories to get fast answers.
          </p>

          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search help topics (e.g. escrow, withdraw bid, milestones)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Card key={idx} glass className="p-6 rounded-3xl border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400">{cat.desc}</p>
              </Card>
            );
          })}
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Need personal assistance?</h4>
            <p className="text-xs text-slate-400">Our customer engineering support team is online 24/7.</p>
          </div>
          <Link to="/contact">
            <Button variant="primary" size="sm">
              <span>Contact Support</span>
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 5. FAQ PAGE
export function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'How does WorkStation Milestone Escrow work?',
      a: 'When a client hires a freelancer, they deposit the milestone amount into WorkStation Escrow. The funds remain locked until the freelancer delivers the work and the client approves the deliverables.',
    },
    {
      q: 'Is WorkStation free for clients and freelancers?',
      a: 'Registering, browsing projects, and viewing talent is free. Clients only pay the agreed project milestone costs. We charge a transparent, low platform service fee on completed contracts.',
    },
    {
      q: 'How can freelancers apply to live projects?',
      a: 'Navigate to Browse Projects, select any opportunity matching your skills, and click "Submit Proposal". You can specify your expected budget, delivery timeline, and a tailored pitch.',
    },
    {
      q: 'Can clients manage proposals and project states in real time?',
      a: 'Yes! The Client Dashboard provides a Kanban board, bid comparison tools, and real-time Socket.io chat to coordinate with applicants directly.',
    },
    {
      q: 'Where is WorkStation headquartered?',
      a: 'WorkStation operates globally with engineering headquarters located at 184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India.',
    },
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle size={13} />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Common Inquiries & Guidance
          </h1>
          <p className="mt-3 text-slate-400 text-sm">
            Everything you need to know about working on WorkStation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={idx}
                glass
                className="rounded-2xl border-slate-800 overflow-hidden cursor-pointer transition-colors hover:border-slate-700"
                onClick={() => toggle(idx)}
              >
                <div className="p-5 flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    {faq.q}
                  </h3>
                  <div className="p-1 rounded-lg bg-slate-800 text-slate-400 flex-shrink-0">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400 mb-3">Still have questions?</p>
          <Link to="/contact">
            <Button variant="outline" size="sm" className="border-slate-700">
              Speak with our Support Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
