import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  FileText,
  Wallet,
  Layers,
  ShieldCheck,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  X,
  Plus,
  Trash2,
  Globe,
  Building,
  MapPin,
  Eye,
  Lock,
  RefreshCw,
  Briefcase,
  Zap,
  Users,
  TrendingUp,
  Clock,
  IndianRupee,
  Star,
  Rocket,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

import FormSection from '../components/FormSection';
import CategoryCard, { CATEGORY_OPTIONS } from '../components/CategoryCard';
import SkillChip from '../components/SkillChip';
import BudgetSelector from '../components/BudgetSelector';
import TimelineSelector from '../components/TimelineSelector';
import ProjectPreviewCard from '../components/ProjectPreviewCard';

// ─── Constants ────────────────────────────────────────────────────────────
const POPULAR_SKILLS = [
  'React', 'Node.js', 'TypeScript', 'MongoDB', 'Next.js',
  'Figma', 'Python', 'Tailwind CSS', 'Docker', 'AWS',
];

const DEFAULT_DELIVERABLES = [
  'Responsive UI with mobile & tablet support',
  'Clean, modular and documented source code',
  'REST API integration with error handling',
  'Production deployment & deployment guide',
];

const STEPS = [
  { id: 1, label: 'Project Basics',    icon: FileText,    desc: 'Title, category & scope' },
  { id: 2, label: 'Budget & Timeline', icon: Wallet,      desc: 'Pricing & milestones'    },
  { id: 3, label: 'Skills & Scope',    icon: Layers,      desc: 'Tech stack & deliverables'},
  { id: 4, label: 'Review & Launch',   icon: ShieldCheck, desc: 'Visibility & publish'    },
];

const HERO_STATS = [
  { icon: Users,        value: '40,000+', label: 'Vetted Freelancers',  color: 'from-blue-500 to-cyan-500'    },
  { icon: Clock,        value: '< 24h',   label: 'Avg First Proposal',  color: 'from-indigo-500 to-purple-500' },
  { icon: Star,         value: '95%',     label: 'Project Success Rate',color: 'from-emerald-500 to-teal-500' },
  { icon: IndianRupee,  value: '₹50L+',   label: 'Paid to Freelancers', color: 'from-amber-500 to-orange-500' },
];

// ─── Animated count-up for hero stats ─────────────────────────────────────
function HeroStatCard({ icon: Icon, value, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 dark:bg-[#162235]/80 backdrop-blur-sm border border-slate-200/80 dark:border-[#22324A] shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={16} />
      </div>
      <div>
        <div className="text-sm font-black text-slate-900 dark:text-white font-mono leading-none">{value}</div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function CreateJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState(['React', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [deliverables, setDeliverables] = useState(DEFAULT_DELIVERABLES);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdJob, setCreatedJob] = useState(null);

  const defaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    experienceLevel: 'intermediate',
    description: '',
    budgetType: 'fixed',
    minBudget: '15000',
    maxBudget: '30000',
    deadline: defaultDeadline(),
    locationType: 'remote',
    visibility: 'public',
  });

  // ─── Dropzone ───────────────────────────────────────────────────────────
  const onDrop = (acceptedFiles) => {
    if (files.length + acceptedFiles.length > 5) {
      toast.error('You can upload a maximum of 5 files.');
      return;
    }
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 5 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/zip': ['.zip'],
    },
  });

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (skillToAdd) => {
    const s = skillToAdd.trim();
    if (!s) return;
    if (!skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput('');
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(skillInput); }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddDeliverable = () => {
    if (deliverableInput.trim()) {
      setDeliverables((prev) => [...prev, deliverableInput.trim()]);
      setDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (index) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleBudgetPreset = (min, max) => {
    setFormData((prev) => ({ ...prev, minBudget: String(min), maxBudget: String(max) }));
  };

  const handleTimelinePreset = (days) => {
    if (!days) return;
    const target = new Date();
    target.setDate(target.getDate() + days);
    setFormData((prev) => ({ ...prev, deadline: target.toISOString().split('T')[0] }));
  };

  // ─── Validation ─────────────────────────────────────────────────────────
  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.title.trim()) { toast.error('Please provide a project title'); return false; }
      if (formData.title.trim().length < 5) { toast.error('Title must be at least 5 characters'); return false; }
      if (!formData.category) { toast.error('Please select a project category'); return false; }
      if (!formData.description.trim()) { toast.error('Please provide a project description'); return false; }
      if (formData.description.trim().length < 20) { toast.error('Description must be at least 20 characters'); return false; }
    } else if (currentStep === 2) {
      const minB = Number(formData.minBudget);
      const maxB = Number(formData.maxBudget);
      if (!minB || minB <= 0 || !maxB || maxB <= 0) { toast.error('Please enter valid minimum and maximum budgets'); return false; }
      if (minB > maxB) { toast.error('Minimum budget cannot exceed maximum budget'); return false; }
      if (!formData.deadline) { toast.error('Please select a project deadline'); return false; }
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) { toast.error('Deadline must be a future date'); return false; }
    } else if (currentStep === 3) {
      if (skills.length === 0) { toast.error('Please add at least one required skill'); return false; }
    }
    return true;
  };

  // Scroll the <main> dashboard scroll container to the top on step change.
  // The DashboardLayout renders <main> with overflow-y-auto as the scroll root.
  const scrollMainToTop = useCallback(() => {
    const mainEl =
      document.querySelector('[data-dashboard-main]') ||
      document.querySelector('main[class*="overflow-y-auto"]');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
      scrollMainToTop();
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    scrollMainToTop();
  };

  // ─── Submission ──────────────────────────────────────────────────────────
  const handleSubmit = async (overrideStatus = null) => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    try {
      setIsSubmitting(true);
      const data = new FormData();

      let finalDescription = formData.description;
      if (deliverables.length > 0 && !finalDescription.includes('Key Deliverables')) {
        finalDescription +=
          '\n\n### Key Deliverables:\n' +
          deliverables.map((d) => `- [ ] ${d}`).join('\n');
      }

      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('description', finalDescription);
      data.append('experienceLevel', formData.experienceLevel);
      data.append('locationType', formData.locationType);

      const targetStatus = overrideStatus || (formData.visibility === 'draft' ? 'draft' : 'open');
      data.append('status', targetStatus);
      data.append('deadline', formData.deadline);
      data.append('skillsRequired', JSON.stringify(skills));
      data.append('budget', JSON.stringify({
        min: Number(formData.minBudget),
        max: Number(formData.maxBudget),
        type: formData.budgetType,
      }));
      files.forEach((file) => data.append('attachments', file));

      const res = await api.post('/jobs', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newJob = res.data?.data?.job || res.data?.job || res.data?.data;
      setCreatedJob(newJob || { title: formData.title });
      setIsSuccess(true);
      toast.success(targetStatus === 'draft' ? 'Project draft saved!' : 'Project published successfully!');
      window.dispatchEvent(new CustomEvent('project:count_changed'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Web Development',
      experienceLevel: 'intermediate',
      description: '',
      budgetType: 'fixed',
      minBudget: '15000',
      maxBudget: '30000',
      deadline: defaultDeadline(),
      locationType: 'remote',
      visibility: 'public',
    });
    setSkills(['React', 'Node.js']);
    setDeliverables(DEFAULT_DELIVERABLES);
    setFiles([]);
    setIsSuccess(false);
    setCreatedJob(null);
    setStep(1);
  };

  // ─── Progress % — Step 1 = 25%, Step 2 = 50%, Step 3 = 75%, Step 4 = 100% ──
  const progressPct = Math.round((step / STEPS.length) * 100);

  return (
    <div className="relative max-w-7xl mx-auto pb-20 px-3 sm:px-6">

      {/* ── PAGE-LEVEL BACKGROUND DECORATION ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-400/8 dark:bg-blue-600/8 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-400/8 dark:bg-indigo-600/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-400/4 dark:bg-cyan-600/4 blur-[160px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative z-10 space-y-8 pt-2">

        {/* ================================================================
            1. PREMIUM HERO HEADER
           ================================================================ */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Main gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-white to-[#EEF2FF] dark:from-[#0D1829] dark:via-[#101826] dark:to-[#111827]" />

          {/* Floating blob decorations */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-400/15 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-400/12 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-cyan-400/10 dark:bg-cyan-600/8 blur-2xl pointer-events-none" />

          {/* Top gradient bar */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] via-[#4F46E5] to-[#7C3AED]" />

          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-slate-200/80 dark:border-[#22324A]" />

          <div className="relative p-7 sm:p-10 lg:p-12">
            {/* Badge row */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#3B82F6]/15 to-[#4F46E5]/15 dark:from-[#3B82F6]/20 dark:to-[#4F46E5]/20 text-[#3B82F6] dark:text-[#60A5FA] border border-blue-200/80 dark:border-blue-800/40 shadow-sm">
                <Sparkles size={12} />
                SaaS Project Creator
                <span className="w-1 h-1 rounded-full bg-current" />
                <span className="text-slate-500 dark:text-slate-400 font-semibold">⚡ ~3 min setup</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck size={12} />
                Escrow Protected
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-[#1A263A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#22324A]">
                <CheckCircle2 size={12} className="text-[#3B82F6]" />
                Free to Publish
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="max-w-2xl mb-8"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-[1.1] mb-3">
                Post Your Next{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#4F46E5] bg-clip-text text-transparent">
                    Project
                  </span>
                  {/* Underline decoration */}
                  <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4" preserveAspectRatio="none">
                    <path d="M0 2 Q50 0 100 2 Q150 4 200 2" stroke="url(#heroUnderlineGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="heroUnderlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#4F46E5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Find talented freelancers faster with a professional project listing. Reach over{' '}
                <strong className="text-slate-800 dark:text-white">40,000+ vetted engineers</strong>,
                designers, and consultants in minutes.
              </p>
            </motion.div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {HERO_STATS.map((stat, i) => (
                <HeroStatCard key={i} {...stat} delay={0.15 + i * 0.07} />
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            2. STICKY MULTI-STEP PROGRESS STEPPER
           ================================================================ */}
        {/*
          ┌─ Why this works ────────────────────────────────────────────────┐
          │  <main> has overflow-y-auto → it is the scroll container.      │
          │  sticky top-0 anchors to the top of that scroll viewport,      │
          │  right below the fixed dashboard header.                        │
          │  Negative -mx + matching px restores full-bleed width so the   │
          │  card spans edge-to-edge inside the max-w-7xl content column.  │
          │  Solid bg-[#F8FBFF]/dark bg prevents scroll bleed-through.     │
          └─────────────────────────────────────────────────────────────────┘
        */}
        <div id="post-job-stepper">
          <div className="py-3 sm:py-4">
          <div className="bg-white dark:bg-[#101826] rounded-2xl border border-slate-200/90 dark:border-[#22324A] shadow-sm overflow-hidden">

            {/* ── Animated progress bar (25 / 50 / 75 / 100%) ── */}
            <div className="h-1.5 bg-slate-100 dark:bg-[#1A263A]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: progressPct === 100
                    ? 'linear-gradient(to right, #22c55e, #10b981)'
                    : 'linear-gradient(to right, #3B82F6, #4F46E5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="p-3 sm:p-4">
              {/* ── Step cards ── */}
              <nav aria-label="Form progress">
                <ol className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {STEPS.map((s) => {
                    const isCompleted = step > s.id;
                    const isCurrent   = step === s.id;
                    const StepIcon    = s.icon;

                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          aria-current={isCurrent ? 'step' : undefined}
                          aria-label={`Step ${s.id} of ${STEPS.length}: ${s.label}${isCompleted ? ' – completed' : isCurrent ? ' – current' : ''}`}
                          onClick={() => {
                            if (s.id < step) setStep(s.id);
                            else if (s.id === step + 1 && validateStep(step)) setStep(s.id);
                          }}
                          className={`
                            w-full relative flex items-center gap-2.5 sm:gap-3
                            px-3 py-2.5 min-h-[44px] rounded-xl border text-left
                            transition-all duration-200
                            focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-[#3B82F6] focus-visible:ring-offset-1
                            ${isCurrent
                              ? 'bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-blue-950/50 dark:to-indigo-950/30 border-[#3B82F6] shadow-sm scale-[1.02] cursor-pointer'
                              : isCompleted
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/70 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-800 cursor-pointer'
                              : 'bg-slate-50/40 dark:bg-transparent border-slate-200/50 dark:border-slate-800/40 opacity-45 cursor-default pointer-events-none'
                            }
                          `}
                        >
                          {/* Icon circle */}
                          <div
                            className={`
                              w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                              transition-all duration-200
                              ${isCurrent
                                ? 'bg-gradient-to-br from-[#3B82F6] to-[#4F46E5] text-white shadow-md shadow-blue-500/30'
                                : isCompleted
                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-[#1A263A] text-slate-400 dark:text-slate-500'
                              }
                            `}
                          >
                            {isCompleted ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                              >
                                <Check size={14} strokeWidth={3} />
                              </motion.span>
                            ) : (
                              <StepIcon size={14} />
                            )}
                          </div>

                          {/* Label & subtitle */}
                          <div className="min-w-0 flex-1">
                            <span className={`
                              block text-xs font-bold leading-tight
                              ${isCurrent   ? 'text-[#3B82F6] dark:text-[#60A5FA]' :
                                isCompleted ? 'text-slate-700 dark:text-slate-300'  :
                                              'text-slate-400 dark:text-slate-600'  }
                            `}>
                              {s.label}
                            </span>
                            <span className="hidden sm:block text-[10px] mt-0.5 leading-tight">
                              {isCompleted
                                ? <span className="text-emerald-500 dark:text-emerald-400 font-semibold">✓ Complete</span>
                                : <span className="text-slate-400 dark:text-slate-500">{s.desc}</span>
                              }
                            </span>
                          </div>

                          {/* Animated pulse dot for active step */}
                          {isCurrent && (
                            <motion.span
                              aria-hidden="true"
                              className="absolute right-2.5 top-2.5 w-2 h-2 rounded-full bg-[#3B82F6]"
                              animate={{ scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
                              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              {/* ── Footer: step label (left) + percentage (right) ── */}
              <div
                className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1E2C42] flex items-center justify-between gap-3"
                role="status"
                aria-live="polite"
                aria-label={`Step ${step} of ${STEPS.length}: ${STEPS[step - 1].label}, ${progressPct} percent complete`}
              >
                <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 leading-none">
                  <span className="font-black text-slate-900 dark:text-white">Step {step}</span>
                  {' of '}{STEPS.length}
                  <span className="mx-1.5 opacity-40">—</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{STEPS[step - 1].label}</span>
                </span>
                <span className={`text-xs font-black tabular-nums whitespace-nowrap ${
                  progressPct === 100
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-[#3B82F6] dark:text-[#60A5FA]'
                }`}>
                  {progressPct}% Complete
                </span>
              </div>
            </div>
          </div>{/* /.inner-card */}
          </div>{/* /.py-3 padding wrapper */}
        </div>{/* /.sticky outer */}

        {/* ================================================================
            3. TWO-COLUMN WORKSPACE
           ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT COLUMN (70%): FORM ──────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">

              {/* STEP 1: PROJECT BASICS */}
              {step === 1 && (
                <FormSection
                  key="step-1"
                  stepNumber={1}
                  icon={FileText}
                  title="Project Basics"
                  subtitle="Provide the fundamental details that define your project scope."
                  badge="Essential"
                >
                  {/* Project Title */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <FileText size={12} className="text-[#3B82F6]" />
                        Project Title *
                      </label>
                      <span className="text-[11px] font-mono font-semibold text-slate-400">
                        {formData.title.length}/100
                      </span>
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="e.g. Build a MERN-based admin dashboard for customer management"
                      className="w-full h-12 px-4 text-sm font-semibold rounded-xl bg-white dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                      Be specific about what you need built and the primary technology stack.
                    </p>
                  </div>

                  {/* Visual Category Cards */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                      Select Project Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <CategoryCard
                          key={cat.id}
                          category={cat}
                          selectedCategory={formData.category}
                          onSelect={(catId) => setFormData((prev) => ({ ...prev, category: catId }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Expertise Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                      Required Expertise Level *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'entry',        label: 'Entry Level',    desc: 'Foundational skills, budget friendly',            icon: '🌱', color: 'from-emerald-500 to-teal-500' },
                        { id: 'intermediate', label: 'Intermediate',   desc: 'Experienced specialist, balanced value',          icon: '🚀', color: 'from-blue-500 to-indigo-500'  },
                        { id: 'expert',       label: 'Expert Level',   desc: 'Senior architect, enterprise-grade',              icon: '⭐', color: 'from-amber-500 to-orange-500' },
                      ].map((level) => {
                        const isSelected = formData.experienceLevel === level.id;
                        return (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, experienceLevel: level.id }))}
                            className={`relative p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden group ${
                              isSelected
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#3B82F6] ring-2 ring-[#3B82F6]/20 shadow-sm'
                                : 'bg-slate-50/60 dark:bg-[#121B2B] border-slate-200/80 dark:border-[#22324A] hover:bg-slate-100 dark:hover:bg-[#162235] hover:border-slate-300'
                            }`}
                          >
                            {/* Shine on hover */}
                            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-lg">{level.icon}</span>
                              <span className={`text-xs font-bold ${isSelected ? 'text-[#3B82F6] dark:text-[#60A5FA]' : 'text-slate-900 dark:text-white'}`}>
                                {level.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                              {level.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Project Description *
                      </label>
                      <span className="text-[11px] font-mono font-semibold text-slate-400">
                        {formData.description.length}/5000
                      </span>
                    </div>
                    <textarea
                      name="description"
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      maxLength={5000}
                      placeholder="Describe the project scope, technical requirements, goals, and any specific constraints..."
                      className="w-full p-4 text-xs sm:text-sm rounded-2xl bg-white dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none leading-relaxed transition-all resize-y"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                      Minimum 20 characters. Outline what success looks like for this engagement.
                    </p>
                  </div>
                </FormSection>
              )}

              {/* STEP 2: BUDGET & TIMELINE */}
              {step === 2 && (
                <FormSection
                  key="step-2"
                  stepNumber={2}
                  icon={Wallet}
                  title="Budget & Timeline"
                  subtitle="Define your financial scope, payment mode, and estimated completion date."
                  badge="Financials"
                >
                  <BudgetSelector
                    budgetType={formData.budgetType}
                    minBudget={formData.minBudget}
                    maxBudget={formData.maxBudget}
                    onChange={handleChange}
                    onPresetSelect={handleBudgetPreset}
                  />

                  <div className="pt-6 border-t border-slate-100 dark:border-[#1E2C42]">
                    <TimelineSelector
                      deadline={formData.deadline}
                      onChange={handleChange}
                      onPresetSelect={handleTimelinePreset}
                    />
                  </div>

                  {/* Location Type */}
                  <div className="pt-6 border-t border-slate-100 dark:border-[#1E2C42]">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Work Location Preference
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'remote', label: '100% Remote', icon: Globe,    desc: 'Work anywhere worldwide'       },
                        { id: 'hybrid', label: 'Hybrid',      icon: Building, desc: 'Mixed on-site and remote'     },
                        { id: 'onsite', label: 'On-Site',     icon: MapPin,   desc: 'Physical presence required'   },
                      ].map((loc) => {
                        const isSelected = formData.locationType === loc.id;
                        const LocIcon = loc.icon;
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, locationType: loc.id }))}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer group ${
                              isSelected
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#3B82F6] ring-2 ring-[#3B82F6]/20 text-[#3B82F6] dark:text-[#60A5FA]'
                                : 'bg-slate-50/60 dark:bg-[#121B2B] border-slate-200/80 dark:border-[#22324A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#162235]'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-[#3B82F6]/10' : 'bg-slate-100 dark:bg-[#1A263A] group-hover:bg-slate-200 dark:group-hover:bg-[#22324A]'}`}>
                              <LocIcon size={16} />
                            </div>
                            <div>
                              <span className="block text-xs font-bold">{loc.label}</span>
                              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{loc.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </FormSection>
              )}

              {/* STEP 3: SKILLS, DELIVERABLES & ATTACHMENTS */}
              {step === 3 && (
                <FormSection
                  key="step-3"
                  stepNumber={3}
                  icon={Layers}
                  title="Skills & Scope"
                  subtitle="Select the tech stack, list expected deliverables, and upload reference files."
                  badge="Requirements"
                >
                  {/* Skills */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Required Skills & Technologies *
                      </label>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-[#3B82F6] dark:text-[#60A5FA] border border-blue-100 dark:border-blue-900/40">
                        {skills.length} added
                      </span>
                    </div>

                    {/* Selected chips container */}
                    <div className="flex flex-wrap gap-2 mb-3 min-h-[44px] p-2.5 rounded-2xl bg-slate-50 dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A]">
                      {skills.length === 0 ? (
                        <span className="text-xs text-slate-400 italic p-1 flex items-center gap-1.5">
                          <Sparkles size={12} /> Type below or pick from suggestions
                        </span>
                      ) : (
                        skills.map((skill) => (
                          <SkillChip key={skill} skill={skill} onRemove={handleRemoveSkill} />
                        ))
                      )}
                    </div>

                    {/* Input + Add button */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Type a skill (e.g. React Native, AWS, Docker) and press Enter"
                        className="flex-1 h-11 px-4 text-xs font-semibold rounded-xl bg-white dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSkill(skillInput)}
                        className="px-4 h-11 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] text-white text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>

                    {/* Suggested chips */}
                    <div className="mt-3">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mb-2">
                        Suggested:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                          <SkillChip key={skill} skill={skill} isSuggested onAdd={handleAddSkill} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="pt-6 border-t border-slate-100 dark:border-[#1E2C42]">
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Expected Project Deliverables
                      </label>
                      <span className="text-[11px] text-slate-400">Milestone checklist</span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {deliverables.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-[#121B2B] border border-slate-200/80 dark:border-[#22324A] group hover:border-[#3B82F6]/30 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{item}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDeliverable(idx)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer flex-shrink-0 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={13} />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={deliverableInput}
                        onChange={(e) => setDeliverableInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDeliverable(); } }}
                        placeholder="Add another deliverable (e.g. Test coverage above 80%)"
                        className="flex-1 h-11 px-4 text-xs font-semibold rounded-xl bg-white dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#3B82F6] transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddDeliverable}
                        className="px-4 h-11 rounded-xl bg-slate-100 dark:bg-[#1A263A] hover:bg-slate-200 dark:hover:bg-[#22324A] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-[#22324A]"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="pt-6 border-t border-slate-100 dark:border-[#1E2C42]">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      Project Attachments <span className="font-normal text-slate-400">(Optional)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      Upload UI mockups, technical specs, wireframes, or sample datasets (PDF, DOCX, PNG, JPG, ZIP — up to 5MB each).
                    </p>

                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                        isDragActive
                          ? 'border-[#3B82F6] bg-blue-50/60 dark:bg-blue-950/20 scale-[0.99]'
                          : 'border-slate-300 dark:border-[#22324A] hover:border-[#3B82F6]/50 hover:bg-slate-50/50 dark:hover:bg-[#121B2B]/50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#4F46E5]/10 text-[#3B82F6] flex items-center justify-center mx-auto mb-3">
                        <Upload size={22} />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isDragActive ? 'Drop files here…' : <>Drag & drop files, or <span className="text-[#3B82F6]">browse</span></>}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Max 5 files · 5MB per file</p>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {files.map((file, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-center justify-between p-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText size={14} className="text-[#3B82F6] flex-shrink-0" />
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                              <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(fIdx)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormSection>
              )}

              {/* STEP 4: REVIEW & PUBLISH */}
              {step === 4 && (
                <FormSection
                  key="step-4"
                  stepNumber={4}
                  icon={ShieldCheck}
                  title="Review & Launch"
                  subtitle="Configure posting visibility and double-check your project before publishing."
                  badge="Final Step"
                >
                  {/* Visibility Cards */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Posting Visibility
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'public',
                          label: 'Public Marketplace',
                          icon: Globe,
                          desc: 'Visible to all talent. Maximum proposal response.',
                          color: 'from-blue-500 to-cyan-500',
                        },
                        {
                          id: 'invite_only',
                          label: 'Invite Only',
                          icon: Lock,
                          desc: 'Only invited talent can view and bid.',
                          color: 'from-purple-500 to-indigo-500',
                        },
                        {
                          id: 'draft',
                          label: 'Save as Draft',
                          icon: FileText,
                          desc: 'Save privately without notifying the marketplace.',
                          color: 'from-slate-400 to-slate-500',
                        },
                      ].map((vis) => {
                        const isSelected = formData.visibility === vis.id;
                        const VisIcon = vis.icon;
                        return (
                          <button
                            key={vis.id}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, visibility: vis.id }))}
                            className={`relative p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden group ${
                              isSelected
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#3B82F6] ring-2 ring-[#3B82F6]/20'
                                : 'bg-slate-50/60 dark:bg-[#121B2B] border-slate-200/80 dark:border-[#22324A] hover:bg-slate-100 dark:hover:bg-[#162235]'
                            }`}
                          >
                            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${vis.color} text-white flex items-center justify-center shadow-sm`}>
                                <VisIcon size={14} />
                              </div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{vis.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{vis.desc}</p>
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center">
                                <Check size={11} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Review Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50/80 to-blue-50/30 dark:from-[#121B2B] dark:to-[#0E1F35] border border-slate-200/90 dark:border-[#22324A] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Rocket size={15} className="text-[#3B82F6]" />
                        Project Specification Summary
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-[#3B82F6] hover:underline"
                      >
                        Edit Basics
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { label: 'Project Title',    value: formData.title },
                        { label: 'Category & Tier',  value: `${formData.category} · ${formData.experienceLevel}` },
                        { label: 'Budget',            value: `₹${formData.minBudget} – ₹${formData.maxBudget} (${formData.budgetType})` },
                        { label: 'Delivery Deadline', value: formData.deadline },
                      ].map((row) => (
                        <div key={row.label} className="p-3 rounded-xl bg-white dark:bg-[#162235] border border-slate-200/80 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-0.5">{row.label}</span>
                          <strong className="text-slate-900 dark:text-white font-bold">{row.value || '—'}</strong>
                        </div>
                      ))}
                    </div>

                    {skills.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/70 dark:border-[#1E2C42]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">Required Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-[#162235] text-[#3B82F6] dark:text-[#60A5FA] border border-blue-100 dark:border-blue-900/40"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {deliverables.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/70 dark:border-[#1E2C42]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
                          Deliverables ({deliverables.length})
                        </span>
                        <ul className="space-y-1">
                          {deliverables.map((d, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                              <span className="truncate">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Ready banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-200/80 dark:border-emerald-800/40 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong>Ready to receive proposals:</strong> Once published, specialists matching your required skills will be notified immediately. You can review proposals, chat in real-time, and fund milestone escrow securely.
                    </div>
                  </div>
                </FormSection>
              )}

            </AnimatePresence>

            {/* ── BOTTOM ACTION BAR ──────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-[#22324A]">
              <div>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="group px-5 h-12 rounded-xl bg-white dark:bg-[#162235] hover:bg-slate-50 dark:hover:bg-[#1E2E44] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#22324A] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer hover:border-slate-300 shadow-sm"
                  >
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                    Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmit('draft')}
                    disabled={isSubmitting}
                    className="px-4 h-12 rounded-xl bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-[#1E2E44] text-slate-600 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-[#22324A] disabled:opacity-50"
                  >
                    Save Draft
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="group relative px-6 h-12 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    {/* Shine sweep */}
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    <span>Continue</span>
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    className="group relative px-8 h-12 rounded-xl bg-gradient-to-r from-[#002366] via-[#3B82F6] to-[#60A5FA] hover:opacity-95 text-white text-sm font-black flex items-center gap-2 shadow-xl shadow-blue-500/30 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden disabled:opacity-60"
                  >
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Publishing…
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Publish Project Now
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (30%): STICKY SIDEBAR ───────────────────── */}
          <div className="lg:col-span-4 sticky top-[168px] space-y-0">
            <ProjectPreviewCard
              formData={formData}
              skills={skills}
              deliverables={deliverables}
              clientUser={user}
            />
          </div>

        </div>
      </div>

      {/* ================================================================
          4. SUCCESS MODAL
         ================================================================ */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] shadow-2xl overflow-hidden"
            >
              {/* Top gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />

              <div className="p-8 text-center space-y-5">
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                  className="w-18 h-18 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 border-2 border-emerald-500/30 flex items-center justify-center mx-auto"
                  style={{ width: 72, height: 72 }}
                >
                  <CheckCircle2 size={36} className="text-emerald-500" />
                </motion.div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                    Project Published! 🎉
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Your project brief is now live on the WorkStation marketplace. Specialists matching your criteria are being notified.
                  </p>
                </div>

                {/* Title preview */}
                <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#162235] dark:to-[#1A2840] border border-blue-100 dark:border-blue-900/40 text-xs font-bold text-[#3B82F6] dark:text-[#60A5FA] truncate">
                  {createdJob?.title || formData.title}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  {createdJob?._id && (
                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${createdJob._id}`)}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      <Eye size={14} />
                      View Public Project Post
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/projects')}
                    className="w-full h-11 rounded-xl bg-white dark:bg-[#162235] hover:bg-slate-50 dark:hover:bg-[#1E2E44] text-slate-800 dark:text-white border border-slate-200 dark:border-[#22324A] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Briefcase size={14} />
                    Manage in Project Workspace
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full h-9 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    + Post Another Project
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
