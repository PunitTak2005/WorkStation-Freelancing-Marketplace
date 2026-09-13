import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  ChevronDown,
  Briefcase,
  CreditCard,
  Lock,
  Building,
  FileText,
  Layers,
  HelpCircle,
  Headphones,
  Check,
  Loader2,
  Building2,
  Globe,
  Zap,
  Star,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import toast from 'react-hot-toast';
import ContactHeroIllustration from './components/ContactHeroIllustration';

// Smooth Animated Counter for quick metrics
function AnimatedCounter({ to, duration = 1.8, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;
    const target = Number(to) || 0;

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(target * ease));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [to, duration]);

  return (
    <span className="font-mono">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Support Categories Definition
const SUPPORT_CATEGORIES = [
  {
    id: 'hiring',
    name: 'Hiring & Contracts',
    icon: Briefcase,
    color: 'from-blue-600 to-indigo-600',
    desc: 'Talent matchmaking, verified postings, milestone scopes, and contract agreements.',
  },
  {
    id: 'payments',
    name: 'Payments & Escrow',
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-600',
    desc: 'Escrow funding, milestone releases, payment methods, GST invoices, and dispute resolution.',
  },
  {
    id: 'account',
    name: 'Account & Security',
    icon: Lock,
    color: 'from-purple-600 to-indigo-600',
    desc: 'Profile verification, 2FA authentication, password recovery, and role switching.',
  },
  {
    id: 'freelancer',
    name: 'Freelancer Success',
    icon: Award,
    color: 'from-amber-500 to-orange-600',
    desc: 'Proposal scoring, skill badges, portfolio optimization, and payout schedules.',
  },
  {
    id: 'technical',
    name: 'Technical Issues',
    icon: Zap,
    color: 'from-rose-500 to-pink-600',
    desc: 'Bug reports, real-time messaging latency, platform notifications, and browser support.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Solutions',
    icon: Building2,
    color: 'from-sky-500 to-blue-600',
    desc: 'Dedicated account managers, custom enterprise SLAs, agency billing, and volume hiring.',
  },
];

// FAQs Data
const FAQS = [
  {
    question: 'How do I hire freelancers on WorkStation?',
    answer:
      'You can post a project within minutes specifying requirements, milestone deliverables, and budget. Pre-vetted specialists will submit proposals with their past verified portfolio and timeline. Alternatively, you can browse verified specialists directly in our Talent Directory and invite them to your job.',
  },
  {
    question: 'How does milestone escrow protection work?',
    answer:
      'When you start a contract, your milestone deposit is held safely in the WorkStation Escrow Vault. Funds are only released to the specialist once you review and approve the submitted deliverables. If any issues arise, our 24/7 dispute mediation team steps in to protect your deposit.',
  },
  {
    question: 'How do I submit proposals as a freelance specialist?',
    answer:
      'Search our live Projects Marketplace using filters for category, experience level, and budget. Click "Submit Proposal" on any open job, specify your milestone breakdown, delivery timeline, and cover letter. Clients review submissions and can initiate instant chat.',
  },
  {
    question: 'What payment methods are supported for deposits and payouts?',
    answer:
      'We support all major Credit/Debit cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, and international wire transfers with bank-grade 256-bit encryption through Stripe and Razorpay.',
  },
  {
    question: 'What happens if there is a dispute on a project milestone?',
    answer:
      'Both parties can request Escrow Mediation directly from the contract details page. Our dedicated Escrow Dispute Team reviews the agreed project scope, milestone files, and communication history to ensure a fair, impartial resolution within 48 business hours.',
  },
  {
    question: 'Can I switch between Client and Freelancer roles on the same account?',
    answer:
      'Yes! WorkStation provides dual-profile functionality. You can post hiring requirements as a Client and offer specialized freelance services under your Freelancer profile seamlessly from your dashboard.',
  },
];

// Team Members
const TEAM_MEMBERS = [
  {
    name: 'Abhishek Nayak',
    role: 'Lead Support Engineer & Architect',
    location: 'Udaipur, India',
    status: 'Available Now',
    avatar: '/freelancers/abhishek-nayak.png',
    specialty: 'Platform Architecture & Escrow',
  },
  {
    name: 'Aditi Hegde',
    role: 'Client Success & Escrow Specialist',
    location: 'Bengaluru, India',
    status: 'Online',
    avatar: '/freelancers/aditi-hegde.png',
    specialty: 'Contract Mediation & Billing',
  },
  {
    name: 'Aarav Desai',
    role: 'Talent Experience Lead',
    location: 'Mumbai, India',
    status: 'Available Now',
    avatar: '/freelancers/aarav-desai.jpg',
    specialty: 'Proposal Reviews & Onboarding',
  },
  {
    name: 'Ananya Iyer',
    role: 'Enterprise Solutions Director',
    location: 'Delhi, India',
    status: 'Online',
    avatar: '/freelancers/ananya-iyer.jpg',
    specialty: 'Custom SLAs & Agency Hiring',
  },
];

export default function ContactPage() {
  const formRef = useRef(null);
  const faqRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    category: 'Hiring & Contracts',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (categoryName) => {
    setFormData((prev) => ({ ...prev, category: categoryName }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Thank you! Your inquiry has been dispatched to our engineering team.');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#080B12] text-slate-900 dark:text-[#F5F9FF] blueprint-grid transition-colors duration-300 pt-24 pb-24 overflow-hidden">
      
      {/* 1. Ambient Lighting & Concentric Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#002366]/20 via-[#0A84FF]/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-[-10%] w-[700px] h-[700px] bg-gradient-to-bl from-[#2FA8FF]/15 via-[#0A84FF]/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#0A84FF]/10 pointer-events-none hidden lg:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-dashed border-[#2FA8FF]/5 pointer-events-none hidden lg:block" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">

        {/* 2. HERO SECTION (Full-Width with Custom Support Illustration) */}
        <section className="pt-6 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Heading, Subtitle & Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              {/* Pulsing Support Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF6FF] dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-800 dark:text-[#EAF4FF] tracking-wide uppercase">
                  24/7 Support • Verified Marketplace
                </span>
              </div>

              {/* High-Impact Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-slate-900 dark:text-white">
                Let’s Build Something{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#2FA8FF] dark:via-[#0A84FF] dark:to-white">
                  Great Together
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-[#A8C0D8] max-w-xl leading-relaxed">
                Whether you’re a high-growth startup scouting elite engineers, a freelance specialist scaling your business, or need dedicated milestone escrow assistance—our global support and solutions team is here for you 24/7.
              </p>

              {/* Dual CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => scrollToSection(formRef)}
                  className="shadow-xl shadow-[#0A84FF]/25 font-bold"
                >
                  <span>Contact Support</span>
                  <ArrowRight size={18} className="ml-2" />
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => scrollToSection(faqRef)}
                  className="font-semibold"
                >
                  <HelpCircle size={18} className="mr-2 text-[#0A84FF] dark:text-[#2FA8FF]" />
                  <span>Browse Help & FAQ</span>
                </Button>
              </div>

              {/* Trust Micro-Row */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-500 dark:text-[#A8C0D8]">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-500" />
                  <span>&lt; 2-Hour Response Time</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#0A84FF]" />
                  <span>100% Escrow Protection</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive Support Telemetry Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-6"
            >
              <ContactHeroIllustration />
            </motion.div>

          </div>
        </section>

        {/* 3. QUICK STATS STRIP */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-[#101826]/80 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter to={40000} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#A8C0D8] mt-1">
                Modern Teams Supported
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-[#101826]/80 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter to={120000} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#A8C0D8] mt-1">
                Verified Freelancers
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-[#101826]/80 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl">
              <div className="text-2xl sm:text-3xl font-black text-[#0A84FF] dark:text-[#2FA8FF] tracking-tight">
                <AnimatedCounter to={98} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#A8C0D8] mt-1">
                Customer Satisfaction
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-[#101826]/80 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-xl">
              <div className="text-2xl sm:text-3xl font-black text-emerald-500 tracking-tight">
                &lt; 2h
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-[#A8C0D8] mt-1">
                Average Resolution Time
              </div>
            </div>
          </div>
        </section>

        {/* 4. CONTACT OPTIONS (4 Premium Glass Cards) */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Connect Directly with WorkStation
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-[#A8C0D8]">
              Choose the channel that best suits your project timeline and urgency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Live Chat */}
            <div
              onClick={() => scrollToSection(formRef)}
              className="group cursor-pointer p-6 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF] shadow-workstation-card dark:shadow-workstation-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#002366] to-[#0A84FF] text-white flex items-center justify-center shadow-md shadow-blue-500/20 mb-4 group-hover:scale-105 transition-transform">
                  <MessageSquare size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] transition-colors">
                  Live Support Chat
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-[#A8C0D8] leading-relaxed">
                  Real-time assistance with technical questions, escrow approvals, and contracts.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1E2C42] flex items-center justify-between text-xs">
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  &lt; 2 min response
                </span>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Email Support */}
            <a
              href="mailto:punittak2005@gmail.com"
              className="group p-6 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] dark:hover:border-[#0A84FF] shadow-workstation-card dark:shadow-workstation-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-[#0A84FF] text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-4 group-hover:scale-105 transition-transform">
                  <Mail size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] transition-colors">
                  Email Support
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-[#A8C0D8] leading-relaxed">
                  Send detailed project scopes, invoice inquiries, or account verification files.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1E2C42] flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A8C0D8] font-mono font-medium truncate">
                  punittak2005@gmail.com
                </span>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* 3. Phone Support */}
            <a
              href="tel:+916367088841"
              className="group p-6 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] hover:border-emerald-500 dark:hover:border-emerald-500 shadow-workstation-card dark:shadow-workstation-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-4 group-hover:scale-105 transition-transform">
                  <Phone size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  Phone Support
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-[#A8C0D8] leading-relaxed">
                  Direct voice assistance for complex enterprise hiring and urgent escrow disputes.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1E2C42] flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A8C0D8] font-mono font-medium">
                  +91 6367088841
                </span>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* 4. Business Partnerships */}
            <div
              onClick={() => handleCategorySelect('Enterprise Solutions')}
              className="group cursor-pointer p-6 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] hover:border-purple-500 dark:hover:border-purple-500 shadow-workstation-card dark:shadow-workstation-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 mb-4 group-hover:scale-105 transition-transform">
                  <Building2 size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                  Enterprise Partners
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-[#A8C0D8] leading-relaxed">
                  Custom corporate billing, agency partnerships, and dedicated staffing agreements.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1E2C42] flex items-center justify-between text-xs">
                <span className="text-purple-500 font-semibold">
                  Same-day callback
                </span>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </section>

        {/* 5. SUPPORT CATEGORIES (Interactive 6-Card Grid) */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore By Topic
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-[#A8C0D8]">
              Select a category below to automatically tailor your message to the appropriate specialist team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUPPORT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.name;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                    isSelected
                      ? 'bg-[#EAF6FF] dark:bg-[#16253D] border-[#0A84FF] shadow-lg shadow-[#0A84FF]/10 -translate-y-1'
                      : 'bg-white/80 dark:bg-[#101826]/80 border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/60 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-3.5 mb-2.5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Icon size={19} />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#A8C0D8] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. CONTACT FORM & DIRECT OFFICE INFO */}
        <section ref={formRef} id="contact-form" className="scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* Left: Office Details & Direct Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-[32px] bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark backdrop-blur-2xl space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-bold uppercase tracking-wider">
                    Official Headquarters
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
                    WorkStation Global Hub
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8C0D8] mt-1.5 leading-relaxed">
                    Our international technology operations and escrow mediation headquarters.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A]">
                    <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Headquarters Address</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        184 B Block, Sector 14, Hiran Magri
                      </span>
                      <p className="text-xs text-slate-500 dark:text-[#A8C0D8] mt-0.5">
                        Udaipur, Rajasthan, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A]">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Customer Support Hours</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Mon – Sat: 9:00 AM – 8:00 PM IST
                      </span>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        24/7 Automated Escrow Protection Active
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-200/60 dark:border-[#22324A]">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Globe size={20} />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Global Coverage</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Worldwide Client Matching
                      </span>
                      <p className="text-xs text-slate-500 dark:text-[#A8C0D8] mt-0.5">
                        India • USA • Europe • Singapore • UAE
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#002366]/5 to-[#0A84FF]/10 dark:from-[#131F33] dark:to-[#101826] border border-[#D6EFFF] dark:border-[#22324A]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0A84FF] dark:text-[#2FA8FF] mb-1">
                      <Sparkles size={14} />
                      <span>Direct Escalations</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#A8C0D8] leading-relaxed">
                      For active project contract emergencies or disputed deliverables, our support triage system automatically flags your message for immediate priority review.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Glassmorphic Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-[32px] bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl shadow-blue-500/10 dark:shadow-black/60 backdrop-blur-2xl relative overflow-hidden">
                
                {/* Top Accent Rim */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF]" />

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Message Dispatched!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-[#A8C0D8] max-w-md mx-auto leading-relaxed">
                      Thank you for contacting WorkStation. Our support engineering team will review your inquiry and reach back to <span className="font-semibold text-[#0A84FF]">{formData.email}</span> within 2 hours.
                    </p>
                    <div className="pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            company: '',
                            subject: '',
                            category: 'Hiring & Contracts',
                            message: '',
                          });
                        }}
                      >
                        Send Another Inquiry
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Send a Direct Message
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8C0D8] mt-1">
                        Fill out the details below and our specialists will respond promptly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500">
                            <UserCheck size={18} className="text-[#0A84FF]" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full h-12 pl-11 pr-4 rounded-xl text-sm bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500">
                            <Mail size={18} className="text-[#0A84FF]" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            className="w-full h-12 pl-11 pr-4 rounded-xl text-sm bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Company (Optional) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500">
                            <Building size={18} />
                          </div>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Acme Tech Studio"
                            className="w-full h-12 pl-11 pr-4 rounded-xl text-sm bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Category Dropdown */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Support Category
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500">
                            <Layers size={18} className="text-[#0A84FF]" />
                          </div>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-12 pl-11 pr-10 rounded-xl text-sm bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20 outline-none transition-all appearance-none cursor-pointer font-medium"
                          >
                            {SUPPORT_CATEGORIES.map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        Subject Line <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500">
                          <FileText size={18} className="text-[#0A84FF]" />
                        </div>
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g. Escrow deposit inquiry for mobile app contract"
                          className="w-full h-12 pl-11 pr-4 rounded-xl text-sm bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        Detailed Message <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          rows={4}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Describe your inquiry, project milestone, or partnership request in detail..."
                          className="w-full p-4 rounded-xl text-sm bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0A84FF] focus:ring-4 focus:ring-[#0A84FF]/20 outline-none transition-all resize-y min-h-[120px]"
                        />
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <motion.button
                      whileHover={!isSubmitting ? { scale: 1.01, y: -1 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#0A84FF]/25 hover:shadow-xl hover:shadow-[#0A84FF]/35 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#0A84FF]/40 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={19} className="animate-spin" />
                          <span>Dispatching Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Support Inquiry</span>
                          <Send size={16} />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* 7. SUPPORT & SOLUTIONS TEAM SHOWCASE */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Meet Your Dedicated Support Team
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-[#A8C0D8]">
              Real engineering leads and client success partners managing contracts and marketplace reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="group p-5 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] shadow-workstation-card dark:shadow-workstation-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl text-center flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#0A84FF] shadow-md group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = '/logo.png';
                    }}
                  />
                  <div className="absolute -bottom-1 right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{member.status}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h4>
                <p className="text-xs text-[#0A84FF] dark:text-[#2FA8FF] font-medium mt-0.5">
                  {member.role}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#A8C0D8] mt-2">
                  {member.specialty}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1E2C42] w-full text-[11px] text-slate-400">
                  {member.location}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. FAQ ACCORDION SECTION */}
        <section ref={faqRef} id="faq-section" className="scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-[#A8C0D8]">
              Quick answers about hiring, escrow security, proposal submissions, and billing.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3.5">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 sm:px-6 py-4.5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white text-sm sm:text-base hover:text-[#0A84FF] transition-colors gap-4"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#0A84FF] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-[#A8C0D8] leading-relaxed border-t border-slate-100 dark:border-[#1E2C42]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. TRUST BADGE BANNER */}
        <section>
          <div className="p-6 sm:p-8 rounded-[28px] bg-[#F4F9FF] dark:bg-[#0D1524] border border-[#D6EFFF] dark:border-[#1E2C42] text-center">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#A8C0D8] mb-4">
              Enterprise Trust & Compliance Standards
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              <div className="p-3 rounded-xl bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-[#F5F9FF]">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Escrow Protected</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-[#F5F9FF]">
                <Lock size={16} className="text-[#0A84FF]" />
                <span>PCI-DSS Compliant</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-[#F5F9FF]">
                <Users size={16} className="text-purple-500" />
                <span>Verified Specialists</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#162235] border border-slate-200 dark:border-[#22324A] flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-[#F5F9FF]">
                <Globe size={16} className="text-amber-500" />
                <span>Global 24/7 Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FINAL HIGH-CONVERSION CTA */}
        <section className="pb-6">
          <div className="relative rounded-[32px] bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-8 sm:p-12 lg:p-16 text-white text-center shadow-2xl shadow-blue-500/20 overflow-hidden">
            
            {/* Background Rings */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#001744]/30 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Start Your WorkStation Experience</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Ready to Start Your Next Project?
              </h2>

              <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
                Join over 40,000 modern teams and 120,000 verified specialists collaborating with milestone escrow protection.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  to="/freelancers"
                  className="px-6 py-3.5 rounded-xl bg-white text-[#002366] hover:bg-slate-100 font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  Hire Exceptional Talent
                </Link>

                <Link
                  to="/projects"
                  className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                >
                  Browse Freelance Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
