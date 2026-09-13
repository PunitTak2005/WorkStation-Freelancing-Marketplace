import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  FileText,
  DollarSign,
  Users,
  Plus,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  ShieldCheck,
  Download,
  UserPlus,
  Sparkles,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Filter,
  Search,
  Layers,
  X,
  AlertCircle,
  Eye,
  Check,
  Zap,
  Lock,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import ChartTooltip from '@/components/common/ChartTooltip';
import toast from 'react-hot-toast';
import { downloadInvoicePDF, downloadReceiptPDF } from '@/utils/pdf';

// Smooth Animated Number Counter
function AnimatedCounter({ to, duration = 1.4, prefix = '', suffix = '' }) {
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
    <span className="font-mono tracking-tight">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Mini SVG Sparkline Component
function MiniSparkline({ color = '#0A84FF', data = [3, 7, 5, 9, 8, 12, 11, 15] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 64;
  const height = 24;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// Circular Progress Ring for Active vs Total Projects
function CircularProgressRing({ progress = 50, size = 44, strokeWidth = 4.5, color = '#0A84FF' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-extrabold font-mono text-slate-800 dark:text-slate-200">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

// Custom Fintech Tooltip for Total Spent Mini Chart
function FintechChartTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const formattedVal =
      dataPoint.amount >= 1000
        ? `₹${(dataPoint.amount / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`
        : `₹${Number(dataPoint.amount).toLocaleString()}`;
    return (
      <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0B132B] border border-gray-200 dark:border-[#0A84FF]/30 shadow-xl pointer-events-none z-50">
        <div className="flex items-center justify-between gap-2.5 text-[10px]">
          <span className="font-semibold text-[#0A84FF] dark:text-[#2FA8FF] uppercase tracking-wider">{dataPoint.name}</span>
          <span className="font-mono font-bold text-gray-900 dark:text-white">{formattedVal}</span>
        </div>
      </div>
    );
  }
  return null;
}

// Resilient Freelancer Avatar Component:
// Priority:
// 1. Uploaded/stored profileImage or avatar URL from DB (filters out any external Unsplash URLs)
// 2. High-grade initials-based gradient fallback (Linear/Stripe style)
function FreelancerAvatar({ freelancer, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);

  const rawUrl =
    freelancer?.profileImage ||
    freelancer?.avatar?.url ||
    (typeof freelancer?.avatar === 'string' ? freelancer?.avatar : '') ||
    freelancer?.photo ||
    '';

  const name = freelancer?.name || 'Freelancer';
  const initials = useMemo(() => {
    return name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'FL';
  }, [name]);

  const gradientClass = useMemo(() => {
    const gradients = [
      'from-blue-600 via-indigo-600 to-sky-500',
      'from-purple-600 via-pink-600 to-rose-500',
      'from-emerald-600 via-teal-600 to-cyan-500',
      'from-amber-500 via-orange-600 to-red-500',
      'from-indigo-600 via-violet-600 to-purple-500',
      'from-cyan-600 via-blue-600 to-indigo-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  }, [name]);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-9 h-9 text-xs font-semibold',
    xl: 'w-10 h-10 text-sm font-bold',
    '2xl': 'w-16 h-16 text-lg font-bold',
  }[size] || 'w-8 h-8 text-xs';

  const isUnsplash = typeof rawUrl === 'string' && rawUrl.includes('unsplash.com');
  const hasValidImage = rawUrl && !isUnsplash && !imgError;

  if (hasValidImage) {
    return (
      <img
        src={rawUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizeClasses} rounded-full object-cover shadow-xs ring-2 ring-white dark:ring-[#101826] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br ${gradientClass} text-white font-bold flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-[#101826] select-none ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}

// Milestone status styling helper
function getMilestoneStatusBadge(status) {
  switch (status) {
    case 'in_progress':
      return {
        label: 'In Progress',
        bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        dot: 'bg-blue-500',
      };
    case 'funded':
      return {
        label: 'Funded',
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-500',
      };
    case 'submitted':
      return {
        label: 'Review Needed',
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        dot: 'bg-amber-500',
      };
    case 'approved':
      return {
        label: 'Approved',
        bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-500',
      };
    case 'pending':
    default:
      return {
        label: 'Upcoming',
        bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        dot: 'bg-purple-500',
      };
  }
}

// Milestone priority styling helper
function getMilestonePriorityBadge(priority) {
  if (!priority) return '';
  const p = priority.toLowerCase();
  if (p.includes('high') || p.includes('urgent')) {
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  }
  if (p.includes('final')) {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }
  return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [escrowAmount, setEscrowAmount] = useState('18000');
  const [isFunding, setIsFunding] = useState(false);
  const [approvingMilestoneId, setApprovingMilestoneId] = useState(null);
  const [approvedMilestoneIds, setApprovedMilestoneIds] = useState(new Set());

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/client');
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        toast.error('Failed to load client workspace data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Display name resolution
  const displayName = useMemo(() => {
    if (user?.name) return user.name.split(' ')[0];
    if (data?.user?.name) return data.user.name.split(' ')[0];
    return 'Rajesh';
  }, [user, data]);

  // Current formatted date
  const currentDateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Real KPI Stats memoized from live MongoDB backend data
  const stats = useMemo(() => {
    // activeProjects from API is the array of project objects (for Kanban)
    const projectsArr = Array.isArray(data?.activeProjects) ? data.activeProjects : [];

    // ── Active Projects count ──────────────────────────────────────────────
    const activeArr = projectsArr.filter(p =>
      p.status === 'in_progress' || p.status === 'open'
    );
    const activeProjectsCount =
      data?.activeProjectsCount ??
      data?.stats?.activeProjectsCount ??
      activeArr.length;

    // ── In Progress = active projects with progress < 80% ──────────────────
    const inProgressCount =
      data?.inProgressCount ??
      data?.stats?.inProgressCount ??
      activeArr.filter(p => (p.progress || 0) < 80).length;

    // ── Near Done = active projects with progress 80–99% ──────────────────
    const nearCompletionCount =
      data?.nearCompletionCount ??
      data?.stats?.nearCompletionCount ??
      activeArr.filter(p => (p.progress || 0) >= 80 && (p.progress || 0) < 100).length;

    // ── Average completion % across all active projects ────────────────────
    const computedAvg = activeArr.length > 0
      ? Math.round(activeArr.reduce((s, p) => s + (p.progress || 0), 0) / activeArr.length)
      : 0;
    const avgCompletionPct =
      data?.avgCompletionPct ??
      data?.stats?.avgCompletionPct ??
      computedAvg;

    return {
      activeProjectsCount,
      inProgressCount,
      nearCompletionCount,
      avgCompletionPct,
      // Legacy fields used by other cards
      activeProjects: data?.stats?.activeProjects ?? activeProjectsCount,
      projectsInProgress: data?.projectsInProgress ?? data?.stats?.projectsInProgress ?? 2,
      projectsNearCompletion: data?.projectsNearCompletion ?? data?.stats?.projectsNearCompletion ?? 1,
      completedProjects: data?.completedProjects ?? data?.stats?.completedProjects ?? 2,
      totalProjects: data?.totalProjects ?? data?.stats?.totalProjects ?? 6,
      activeVsCompletedRatio: data?.activeVsCompletedRatio ?? data?.stats?.activeVsCompletedRatio ?? 50,
      pendingProposals: data?.pendingProposals ?? data?.stats?.pendingProposals ?? 18,
      newProposalsToday: data?.newProposalsToday ?? data?.stats?.newProposalsToday ?? 5,
      verifiedFreelancers: data?.verifiedFreelancers ?? data?.stats?.verifiedFreelancers ?? 8,
      totalSpent: data?.totalSpent ?? data?.stats?.totalSpent ?? 128860,
      monthlyGrowth: data?.monthlyGrowth ?? data?.stats?.monthlyGrowth ?? 12,
      avgMonthlySpend: data?.avgMonthlySpend ?? data?.stats?.avgMonthlySpend ?? 21477,
      lastPaymentDate: data?.lastPaymentDate ?? data?.stats?.lastPaymentDate ?? 'Sep 5, 2026',
      billingCyclesCount: data?.billingCyclesCount ?? data?.stats?.billingCyclesCount ?? 6,
      totalEscrowLocked: data?.totalEscrowLocked ?? data?.stats?.totalEscrowLocked ?? 28000,
      pendingApprovalCount: data?.pendingApprovalCount ?? data?.stats?.pendingApprovalCount ?? 2,
      upcomingReleasesAmount: data?.upcomingReleasesAmount ?? data?.stats?.upcomingReleasesAmount ?? 13000,
      activeMilestonesCount: data?.activeMilestonesCount ?? data?.stats?.activeMilestonesCount ?? 3,
      hiredFreelancersCount: data?.hiredFreelancersCount ?? data?.stats?.hiredFreelancersCount ?? 8,
      activeHiredFreelancers: data?.activeHiredFreelancers ?? data?.stats?.activeHiredFreelancers ?? 4,
    };
  }, [data]);

  // Hired Freelancers List with DB images and online status
  const hiredFreelancersList = useMemo(() => {
    if (data?.stats?.hiredFreelancers && data.stats.hiredFreelancers.length > 0) {
      return data.stats.hiredFreelancers;
    }
    if (data?.hiredFreelancers && data.hiredFreelancers.length > 0) {
      return data.hiredFreelancers;
    }
    return [
      { _id: '1', name: 'Aarav Mehta', profileImage: '/freelancers/aarav-sharma.webp', isOnline: true },
      { _id: '2', name: 'Priya Kapoor', profileImage: '/freelancers/priya-mehta.webp', isOnline: true },
      { _id: '3', name: 'Rohan Patel', profileImage: '/freelancers/rohan-kulkarni.webp', isOnline: false },
      { _id: '4', name: 'Neha Singh', profileImage: '/freelancers/neha-singh.webp', isOnline: true },
      { _id: '5', name: 'Kunal Verma', profileImage: '/freelancers/kunal-bhatia.webp', isOnline: false },
      { _id: '6', name: 'Sneha Iyer', profileImage: '/freelancers/sneha-patel.webp', isOnline: true },
      { _id: '7', name: 'Aditya Joshi', profileImage: '/freelancers/aditya-roy.webp', isOnline: false },
      { _id: '8', name: 'Meera Nair', profileImage: '/freelancers/kavita-sharma.webp', isOnline: false },
    ];
  }, [data]);

  // 1. Monthly Spending Chart Data
  const spendData = useMemo(() => {
    if (data?.monthlySpending && data.monthlySpending.length > 0) {
      return data.monthlySpending.map((m) => ({
        name: m.month || m.name,
        amount: m.spending || m.amount || 0,
      }));
    }
    return [
      { name: 'Apr', amount: 12000 },
      { name: 'May', amount: 18000 },
      { name: 'Jun', amount: 21500 },
      { name: 'Jul', amount: 28000 },
      { name: 'Aug', amount: 34000 },
      { name: 'Sep', amount: 15360 },
    ];
  }, [data]);

  // 2. Project Status Donut Chart Data
  const projectStatusData = useMemo(() => {
    if (data?.projectStatusDistribution && data.projectStatusDistribution.length > 0) {
      return data.projectStatusDistribution;
    }
    return [
      { name: 'Active', value: 3, percentage: 50, color: '#10B981' },
      { name: 'Reviewing', value: 1, percentage: 17, color: '#F59E0B' },
      { name: 'Completed', value: 2, percentage: 33, color: '#0A84FF' },
    ];
  }, [data]);

  // 3. Hiring Activity Data
  const hiringActivityData = useMemo(() => {
    if (data?.hiringActivityData && data.hiringActivityData.length > 0) {
      return data.hiringActivityData;
    }
    return [
      { month: 'Apr', proposals: 4, hired: 1 },
      { month: 'May', proposals: 7, hired: 2 },
      { month: 'Jun', proposals: 9, hired: 3 },
      { month: 'Jul', proposals: 6, hired: 2 },
      { month: 'Aug', proposals: 11, hired: 4 },
      { month: 'Sep', proposals: 8, hired: 2 },
    ];
  }, [data]);

  // 4. Active Projects List
  const activeProjects = useMemo(() => {
    return data?.activeProjects || [];
  }, [data]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return activeProjects.filter((proj) => {
      const matchesTab =
        activeTab === 'all'
          ? true
          : activeTab === 'in_progress'
          ? proj.status === 'in_progress'
          : activeTab === 'open'
          ? proj.status === 'open'
          : activeTab === 'completed'
          ? proj.status === 'completed'
          : true;

      const matchesSearch =
        projectSearch.trim() === '' ||
        proj.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        proj.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
        proj.freelancer?.name?.toLowerCase().includes(projectSearch.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeProjects, activeTab, projectSearch]);

  // 5. Recent Payments
  const recentPayments = useMemo(() => {
    return data?.recentPayments || [];
  }, [data]);

  // 6. Upcoming Milestones from MongoDB backend data
  const upcomingMilestones = useMemo(() => {
    if (data?.upcomingMilestones && data.upcomingMilestones.length > 0) {
      return data.upcomingMilestones;
    }
    return [
      {
        id: 'm1',
        title: 'API Integration',
        description: 'Implement secure backend RESTful APIs, authentication, and inventory endpoints.',
        amount: 8000,
        projectTitle: 'E-commerce Website',
        countdown: 'Due in 3 days',
        status: 'in_progress',
        statusLabel: 'In Progress',
        progress: 65,
        priority: 'High Priority',
        escrowStatus: '100% Escrow Protected',
        freelancer: {
          name: 'Aarav Mehta',
          profileImage: '',
          avatar: '',
          role: 'MERN Developer',
          isOnline: true,
        },
      },
      {
        id: 'm2',
        title: 'UI Approval',
        description: 'Deliver responsive storefront, checkout screens, and user profile management UI.',
        amount: 5000,
        projectTitle: 'E-commerce Website',
        countdown: 'Due in 5 days',
        status: 'funded',
        statusLabel: 'Funded',
        progress: 40,
        priority: 'Medium Priority',
        escrowStatus: '100% Escrow Protected',
        freelancer: {
          name: 'Aarav Mehta',
          profileImage: '',
          avatar: '',
          role: 'MERN Developer',
          isOnline: true,
        },
      },
      {
        id: 'm3',
        title: 'Final Delivery',
        description: 'Production deployment, payment gateway escrow setup, and performance sign-off.',
        amount: 15000,
        projectTitle: 'E-commerce Website',
        countdown: 'Due in 12 days',
        status: 'pending',
        statusLabel: 'Upcoming',
        progress: 15,
        priority: 'Final Stage',
        escrowStatus: '100% Escrow Protected',
        freelancer: {
          name: 'Aarav Mehta',
          profileImage: '',
          avatar: '',
          role: 'MERN Developer',
          isOnline: true,
        },
      },
    ];
  }, [data]);

  // Milestone Approval Handler with smooth escrow feedback
  const handleApproveMilestone = async (m) => {
    try {
      setApprovingMilestoneId(m.id);

      if (m.contractId && m.milestoneIndex !== undefined) {
        try {
          await api.post(`/contracts/${m.contractId}/milestones/${m.milestoneIndex}/approve`);
        } catch (apiErr) {
          console.warn('Backend milestone approve info:', apiErr?.response?.data?.message || apiErr.message);
        }
      }

      await new Promise((r) => setTimeout(r, 650));

      setApprovedMilestoneIds((prev) => new Set([...prev, m.id]));
      toast.success(`Milestone "${m.title}" approved! Released ₹${m.amount?.toLocaleString()} to ${m.freelancer?.name || 'freelancer'}.`, {
        icon: '🛡️',
        duration: 4000,
      });
    } catch (err) {
      toast.error('Failed to release escrow payment. Please try again.');
    } finally {
      setApprovingMilestoneId(null);
    }
  };

  // 7. Team Collaboration
  const teamCollaboration = useMemo(() => {
    return data?.teamCollaboration || [];
  }, [data]);

  // Handlers for Quick Actions
  const handleFundEscrow = () => {
    setIsFunding(true);
    setTimeout(() => {
      setIsFunding(false);
      setIsEscrowModalOpen(false);
      toast.success(`Successfully deposited ₹${Number(escrowAmount).toLocaleString()} into Escrow protection!`, {
        icon: '🛡️',
        duration: 4000,
      });
    }, 1000);
  };

  const handleDownloadInvoice = async (invoiceId = 'INV-2026-SEP02') => {
    try {
      toast.loading(`Generating Tax Invoice ${invoiceId}...`, { id: 'dash-inv-pdf' });
      await downloadInvoicePDF(
        {
          invoiceNumber: typeof invoiceId === 'string' ? invoiceId : 'INV-2026-SEP02',
          amount: 15360,
          description: 'Full-Stack Web App Development & Cloud Infrastructure',
          status: 'completed',
          client: user,
          freelancer: { name: 'Aarav Mehta', email: 'aarav.m@workstation.io' },
        },
        user
      );
      toast.success(`Tax Invoice ${invoiceId} downloaded!`, { id: 'dash-inv-pdf', icon: '📄' });
    } catch (err) {
      console.error('Invoice PDF download error:', err);
      toast.error('Failed to generate PDF. Please try again.', { id: 'dash-inv-pdf' });
    }
  };

  const handleDownloadReceipt = async (pay) => {
    try {
      toast.loading('Generating payment receipt...', { id: 'dash-rec-pdf' });
      await downloadReceiptPDF(
        {
          id: pay?.id || 'pay_live_settled',
          amount: pay?.amount || 12000,
          description: pay?.title || 'Milestone Escrow Funding',
          transactionId: pay?.id || 'pay_razorpay_settled',
          status: pay?.status || 'completed',
          createdAt: pay?.date || new Date(),
          client: user,
          freelancer: { name: pay?.freelancer || 'Aarav Mehta', email: 'specialist@workstation.io' },
        },
        user
      );
      toast.success('Payment receipt downloaded!', { id: 'dash-rec-pdf', icon: '📄' });
    } catch (err) {
      console.error('Receipt PDF download error:', err);
      toast.error('Failed to generate receipt PDF.', { id: 'dash-rec-pdf' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-36 bg-slate-200 dark:bg-slate-800/60 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800/60 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800/60 rounded-3xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Graceful empty fallback if user has completely zero records
  if (!loading && (!data || (activeProjects.length === 0 && !data.stats?.totalSpent))) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <EmptyState
          title="No projects yet"
          description="Your client workspace is ready. Publish your first project to start receiving bids, tracking milestones, and hiring vetted talent worldwide."
          action={
            <Button onClick={() => navigate('/dashboard/post-job')} icon={Plus}>
              Post Your First Project
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-900 dark:text-white space-y-8 relative">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#0A84FF]/10 via-[#2FA8FF]/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-[#002366]/15 via-[#0A84FF]/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. PREMIUM HERO SECTION                                                  */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-[#0D1525]/80 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/20"
      >
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF6FF] dark:bg-[#0A84FF]/15 text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#0A84FF]/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WorkStation Client Workspace • Udaipur Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#2FA8FF] dark:via-[#60A5FA] dark:to-white bg-clip-text text-transparent">
              {displayName}
            </span>{' '}
            👋
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8C0D8] leading-relaxed max-w-4xl">
            Your engineering pipeline is performing strong. Track milestone deliverables, review candidate proposals, and release verified escrow disbursements seamlessly.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 dark:text-[#7A92AA]">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0A84FF]" />
              <span>{currentDateFormatted}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Escrow Protection Active</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. KPI CARDS — 2×2 MATRIX (md: 2 cols, mobile: 1 col)                   */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── CARD 1: Active Projects ─────────────────────────────────────────── */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative p-6 rounded-[28px] bg-white/80 dark:bg-[#101826]/80 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:shadow-[#0A84FF]/10 transition-all flex flex-col justify-between gap-5 h-full min-w-0 group"
        >
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#0A84FF]/10 to-transparent rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex flex-col gap-5 min-w-0 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A8C0D8]">
                Active Projects
              </span>
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#0A84FF]/15 to-[#2FA8FF]/10 text-[#0A84FF] border border-[#0A84FF]/25 shadow-sm shrink-0">
                <Briefcase size={20} />
              </div>
            </div>

            {/* Big metric */}
            <div>
              <h3 className="text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-tight">
                <AnimatedCounter to={stats.activeProjectsCount} />
              </h3>
              <p className="text-sm text-slate-500 dark:text-[#A8C0D8] mt-1.5 font-medium">
                Current active contracts
              </p>
            </div>

            {/* Progress bar */}
            <div className="rounded-2xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-100 dark:border-[#22324A] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  <TrendingUp size={12} className="text-[#0A84FF]" />
                  Avg Progress
                </span>
                <span className="text-sm font-black text-[#0A84FF] tabular-nums">
                  {stats.avgCompletionPct}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200 dark:bg-[#22324A] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#0A84FF] to-[#2FA8FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.avgCompletionPct}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Average completion across active projects
              </p>
            </div>

            {/* Metric chips */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#EAF6FF] dark:bg-[#0A84FF]/10 border border-[#D6EFFF] dark:border-[#0A84FF]/20">
                <div className="flex items-center gap-1.5 text-[#0A84FF]">
                  <Clock size={14} />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-[#A8C0D8]">In Progress</span>
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  {stats.inProgressCount}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-[#A8C0D8]">Near Done</span>
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  {stats.nearCompletionCount}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs relative z-10">
            <span className="text-slate-500 dark:text-[#7A92AA] font-medium">
              {stats.completedProjects} Completed of {stats.totalProjects} total
            </span>
            <MiniSparkline color="#0A84FF" data={[1, 2, 2, 3, 2, 3]} />
          </div>
        </motion.div>

        {/* ── CARD 2: Pending Proposals ────────────────────────────────────────── */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative p-6 rounded-[28px] bg-white/80 dark:bg-[#101826]/80 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between gap-5 h-full min-w-0 group"
        >
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex flex-col gap-5 min-w-0 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A8C0D8]">
                Pending Proposals
              </span>
              <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/25 shadow-sm shrink-0">
                <FileText size={20} />
              </div>
            </div>

            {/* Big metric + badge */}
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-tight">
                  <AnimatedCounter to={stats.pendingProposals} />
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {stats.newProposalsToday} New Today
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-[#A8C0D8] mt-1.5 font-medium">
                Applications awaiting review
              </p>
            </div>

            {/* Metric chips */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#EAF6FF] dark:bg-[#0A84FF]/10 border border-[#D6EFFF] dark:border-[#0A84FF]/20">
                <div className="flex items-center gap-1.5 text-[#0A84FF]">
                  <ShieldCheck size={14} />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-[#A8C0D8]">Verified</span>
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  {stats.verifiedFreelancers}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center leading-tight">
                  Freelancers
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <TrendingUp size={14} />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-[#A8C0D8]">Pace</span>
                </div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  +28%
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center leading-tight">
                  Applicant Rate
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs relative z-10">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp size={13} />
              <span>+28% applicant pace this month</span>
            </span>
            <MiniSparkline color="#F59E0B" data={[4, 6, 8, 12, 14, 18]} />
          </div>
        </motion.div>

        {/* ── CARD 3: Total Spent / Live Escrow ────────────────────────────────── */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative p-6 rounded-[28px] bg-white/80 dark:bg-[#101826]/80 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/50 dark:hover:border-[#0A84FF]/50 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:shadow-[#0A84FF]/15 transition-all flex flex-col justify-between gap-5 h-full min-w-0 group"
        >
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute -top-12 -right-12 w-52 h-52 bg-gradient-to-br from-[#0A84FF]/20 via-[#2FA8FF]/10 to-transparent rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <svg className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.08]" viewBox="0 0 300 240" fill="none">
              <path d="M-20 180 C 60 120, 140 220, 220 140 C 260 100, 310 120, 340 90" stroke="#0A84FF" strokeWidth="2.5" strokeDasharray="4 4" />
            </svg>
          </div>

          <div className="flex flex-col gap-5 min-w-0 relative z-10">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#0A84FF] to-indigo-600 text-white shadow-md shadow-[#0A84FF]/25 shrink-0">
                  <CreditCard size={19} />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#A8C0D8]">
                  Total Spent
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Live Escrow</span>
              </div>
            </div>

            {/* Big metric */}
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight font-display text-slate-900 dark:text-white break-words">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0A84FF] dark:from-white dark:via-slate-100 dark:to-[#2FA8FF] bg-clip-text text-transparent">
                  <AnimatedCounter to={stats.totalSpent} prefix="₹" />
                </span>
              </h3>
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm shrink-0 cursor-default"
                title="Month over Month Escrow Growth"
              >
                <ArrowUpRight size={13} className="stroke-[2.5]" />
                <span>+{stats.monthlyGrowth || 12}% MoM</span>
              </motion.span>
            </div>

            {/* Spend chart */}
            <div className="w-full h-24 sm:h-28 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendData} margin={{ top: 6, right: 6, left: 6, bottom: 2 }}>
                  <defs>
                    <linearGradient id="fintechCardSpendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0A84FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<FintechChartTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#0A84FF" strokeWidth={2.5} fillOpacity={1} fill="url(#fintechCardSpendGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Escrow badge */}
            <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#0A84FF]/10 via-blue-500/5 to-indigo-500/5 dark:from-[#0A84FF]/15 dark:via-blue-500/10 dark:to-indigo-500/10 border border-[#0A84FF]/25 dark:border-[#0A84FF]/30 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0A84FF]/15 text-[#0A84FF] dark:text-[#2FA8FF] shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">100% Escrow Protected</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A84FF] bg-[#0A84FF]/10 px-2 py-0.5 rounded-md shrink-0">Secured</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#8FA7C2] mt-0.5 leading-relaxed">
                  Every payment is secured until milestone approval
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs relative z-10">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#7A92AA] font-medium">
              <Calendar size={14} className="text-[#0A84FF] shrink-0" />
              <span>Across {stats.billingCyclesCount || spendData.length || 6} Billing Cycles</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end text-[11px] sm:text-xs min-w-0">
              <span className="text-slate-500 dark:text-[#7A92AA]">Last: {stats.lastPaymentDate || 'Sep 5, 2026'} •</span>
              <span className="text-[#0A84FF] dark:text-[#2FA8FF] font-bold whitespace-nowrap">
                Avg: ₹{Number(stats.avgMonthlySpend || 21477).toLocaleString()}/mo
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── CARD 4: Hired Freelancers ─────────────────────────────────────────── */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative p-6 rounded-[28px] bg-white/80 dark:bg-[#101826]/80 backdrop-blur-xl border border-[#D6EFFF] dark:border-[#22324A] shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col justify-between gap-5 h-full min-w-0 group"
        >
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex flex-col gap-5 min-w-0 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A8C0D8]">
                Hired Freelancers
              </span>
              <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-500 border border-indigo-500/25 shadow-sm shrink-0">
                <Users size={20} />
              </div>
            </div>

            {/* Big metric */}
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-tight">
                  <AnimatedCounter to={hiredFreelancersList.length || stats.hiredFreelancersCount || 8} />
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {stats.activeHiredFreelancers || 4} Active Now
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-[#A8C0D8] mt-1.5 font-medium">
                Vetted talent on your team
              </p>
            </div>

            {/* 2×2 avatar mini-grid */}
            <div className="grid grid-cols-2 gap-3">
              {hiredFreelancersList.slice(0, 4).map((fl, idx) => (
                <motion.div
                  key={fl._id || idx}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#162235]/60 border border-slate-100 dark:border-[#22324A] min-w-0 cursor-default"
                >
                  <div className="relative shrink-0">
                    <FreelancerAvatar freelancer={fl} size="sm" />
                    {fl.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#162235]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                      {fl.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight mt-0.5">
                      {fl.isOnline ? (
                        <span className="text-emerald-500">● Online</span>
                      ) : (
                        <span>Offline</span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Overflow indicator */}
            {hiredFreelancersList.length > 4 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium text-center -mt-1">
                +{hiredFreelancersList.length - 4} more freelancers
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs relative z-10">
            <span className="text-slate-500 dark:text-[#7A92AA] font-medium flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-indigo-500" />
              Verified Marketplace Talent
            </span>
            <MiniSparkline color="#6366F1" data={[2, 3, 5, 4, 6, 7]} />
          </div>
        </motion.div>
      </section>


      {/* ========================================================================= */}
      {/* 3. QUICK ACTIONS BAR                                                     */}
      {/* ========================================================================= */}
      <section className="flex flex-wrap items-center gap-3">
        <Link to="/dashboard/post-job" className="flex-1 min-w-[200px]">
          <button className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#0A84FF]/20 hover:brightness-110 active:scale-[0.99] transition-all">
            <Plus size={16} />
            <span>Post New Project</span>
          </button>
        </Link>

        <Link to="/freelancers" className="flex-1 min-w-[170px]">
          <button className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-800 dark:text-[#F5F9FF] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-[#0A84FF] hover:text-[#0A84FF] active:scale-[0.99] transition-all shadow-xs">
            <UserPlus size={16} />
            <span>Invite Freelancer</span>
          </button>
        </Link>

        <Link to="/dashboard/projects" className="flex-1 min-w-[170px]">
          <button className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-800 dark:text-[#F5F9FF] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-[#0A84FF] hover:text-[#0A84FF] active:scale-[0.99] transition-all shadow-xs">
            <FileText size={16} />
            <span>View Proposals</span>
          </button>
        </Link>

        <button
          onClick={() => setIsEscrowModalOpen(true)}
          className="flex-1 min-w-[170px] py-3 px-4 rounded-2xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-800 dark:text-[#F5F9FF] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-500 active:scale-[0.99] transition-all shadow-xs"
        >
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Fund Escrow</span>
        </button>

        <button
          onClick={() => handleDownloadInvoice('INV-2026-SEP02')}
          className="flex-1 min-w-[170px] py-3 px-4 rounded-2xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-slate-800 dark:text-[#F5F9FF] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-[#0A84FF] hover:text-[#0A84FF] active:scale-[0.99] transition-all shadow-xs"
        >
          <Download size={16} />
          <span>Download Invoice</span>
        </button>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRIMARY CHARTS: SPENDING OVERVIEW & PROJECT PROGRESS                  */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Spending Area Chart (7 cols on xl) */}
        <div className="xl:col-span-7 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Monthly Spending Overview
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  +12% MoM
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A8C0D8] mt-1">
                Escrow milestone deposits & completed releases in INR (₹)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-[#0A84FF]/20 text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-semibold border border-blue-200 dark:border-[#0A84FF]/30">
                Apr 2026 – Sep 2026
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#475569' }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      formatter={(val) => [formatCurrency(val), 'Escrow Spent']}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0A84FF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#spendingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Metric footer */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Recorded</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">₹1,28,860</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Peak Month (Aug)</p>
              <p className="text-sm font-bold text-[#0A84FF] dark:text-[#2FA8FF]">₹34,000</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Avg Monthly Burn</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">₹21,476</p>
            </div>
          </div>
        </div>

        {/* Project Progress Analytics Card (5 cols on xl) */}
        <div className="xl:col-span-5 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-blue-50/40 to-blue-50/80 dark:from-[#101826] dark:via-[#131E30] dark:to-[#162235] border border-blue-100 dark:border-[#22324A] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">
                  Project Progress
                </h3>
                {/* Live Badge with animated pulse */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A8C0D8] mt-1">
                Live lifecycle distribution across {stats.totalProjects || 6} projects
              </p>
            </div>
          </div>

          {/* Circular Donut Visualization */}
          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  innerRadius={66}
                  outerRadius={88}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <ChartTooltip
                      formatter={(val, name) => [`${val} Projects`, name]}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-display leading-none">
                {stats.totalProjects || 6}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#A8C0D8] tracking-wider mt-1">
                Total Projects
              </span>
            </div>
          </div>

          {/* Three Colored Metric Cards (below donut) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            {/* Active Metric Card */}
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#121B2B]/80 backdrop-blur-md border border-emerald-200/90 dark:border-emerald-500/20 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Active
                </span>
                <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={13} />
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  3
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  50%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">In progress</p>
            </div>

            {/* Reviewing Metric Card */}
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#121B2B]/80 backdrop-blur-md border border-amber-200/90 dark:border-amber-500/20 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Reviewing
                </span>
                <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Clock size={13} />
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  1
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                  17%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Milestone audit</p>
            </div>

            {/* Completed Metric Card */}
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#121B2B]/80 backdrop-blur-md border border-blue-200/90 dark:border-blue-500/20 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A84FF] dark:text-[#2FA8FF]">
                  Completed
                </span>
                <span className="p-1 rounded-lg bg-blue-500/10 text-[#0A84FF] dark:text-[#2FA8FF]">
                  <CheckCircle2 size={13} />
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  2
                </span>
                <span className="text-xs font-bold text-[#0A84FF] dark:text-[#2FA8FF] font-mono">
                  33%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">Released</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. UPCOMING MILESTONES (Premium Escrow Management Workspace)              */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Upcoming Milestones
              </h3>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {upcomingMilestones.filter((m) => !approvedMilestoneIds.has(m.id) && m.status !== 'approved').length} Active Milestones
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8C0D8] mt-1">
              Deliverables awaiting review and escrow approval
            </p>
          </div>

          <Link
            to="/dashboard/contracts"
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#0A84FF] dark:text-[#2FA8FF] bg-[#0A84FF]/5 hover:bg-[#0A84FF]/10 dark:bg-[#0A84FF]/10 dark:hover:bg-[#0A84FF]/20 border border-[#0A84FF]/30 hover:border-[#0A84FF]/60 backdrop-blur-md transition-all duration-200 shadow-xs w-fit"
          >
            <span>View Contracts</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Escrow Summary Banner (3 Mini Metric Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Total Escrow Locked */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#0D1525]/70 backdrop-blur-md border border-[#D6EFFF]/80 dark:border-[#22324A] shadow-xs flex items-center gap-4 hover:border-[#0A84FF]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-[#0A84FF] flex items-center justify-center shrink-0 shadow-inner">
              <Lock size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                Total Escrow Locked
              </span>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                ₹{stats.totalEscrowLocked?.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-[#8899A6] truncate block">
                100% Guaranteed in custody
              </span>
            </div>
          </div>

          {/* Card 2: Pending Approval */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#0D1525]/70 backdrop-blur-md border border-[#D6EFFF]/80 dark:border-[#22324A] shadow-xs flex items-center gap-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
              <Clock size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                Pending Approval
              </span>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {stats.pendingApprovalCount} Milestones
              </div>
              <span className="text-[11px] text-slate-500 dark:text-[#8899A6] truncate block">
                Deliverables ready for review
              </span>
            </div>
          </div>

          {/* Card 3: Upcoming Releases */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#0D1525]/70 backdrop-blur-md border border-[#D6EFFF]/80 dark:border-[#22324A] shadow-xs flex items-center gap-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <Zap size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                Upcoming Releases
              </span>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                ₹{stats.upcomingReleasesAmount?.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-[#8899A6] truncate block">
                Scheduled within next 7 days
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Cards with Vertical Timeline Visualization */}
        {upcomingMilestones.length === 0 ? (
          <div className="p-10 sm:p-14 rounded-[28px] bg-white/80 dark:bg-[#101826]/80 backdrop-blur-md border border-[#D6EFFF] dark:border-[#22324A] text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center border border-[#0A84FF]/20 shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Pending Milestones</h4>
              <p className="text-xs text-slate-500 dark:text-[#A8C0D8] max-w-md mx-auto">
                All project deliverables have been reviewed and approved. Escrow funds are released to your freelancers.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/jobs/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0A84FF] hover:bg-[#0070E0] transition-colors shadow-sm"
              >
                <Plus size={14} />
                <span>Post a New Project</span>
              </Link>
              <Link
                to="/dashboard/contracts"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span>View Past Contracts</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative md:pl-8 space-y-5">
            {/* Vertical Timeline Track Line */}
            <div className="hidden md:block absolute left-[15px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#0A84FF] via-blue-500/40 to-slate-200 dark:to-slate-800" />

            {upcomingMilestones.map((m, idx) => {
              const isApproved = approvedMilestoneIds.has(m.id) || m.status === 'approved';
              const isApproving = approvingMilestoneId === m.id;
              const badge = getMilestoneStatusBadge(isApproved ? 'approved' : m.status);

              return (
                <div key={m.id} className="relative">
                  {/* Timeline Node on Left */}
                  <div className="hidden md:flex absolute -left-8 top-8 -translate-x-1/2 items-center justify-center z-10">
                    {isApproved ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 ring-4 ring-white dark:ring-[#080E1A]">
                        <Check size={16} className="stroke-[3]" />
                      </div>
                    ) : m.status === 'in_progress' || m.status === 'submitted' ? (
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0A84FF] text-white ring-4 ring-white dark:ring-[#080E1A] shadow-md shadow-blue-500/40">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#0A84FF] opacity-70 animate-ping" />
                        <Clock size={15} className="relative z-10" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#152033] border-2 border-slate-300 dark:border-slate-700 text-slate-400 flex items-center justify-center ring-4 ring-white dark:ring-[#080E1A]">
                        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Milestone Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="p-5 sm:p-6 lg:p-7 rounded-[28px] bg-white/90 dark:bg-[#0D1525]/90 backdrop-blur-md border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF]/50 shadow-md hover:shadow-xl dark:shadow-black/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
                      {/* Left: Freelancer & Deliverable */}
                      <div className="lg:col-span-5 flex items-start gap-4">
                        <div className="relative shrink-0">
                          <FreelancerAvatar freelancer={m.freelancer} size="2xl" />
                          {m.freelancer?.isOnline !== false && (
                            <span
                              className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0D1525] shadow-xs"
                              title="Online now"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                              {m.title}
                            </h4>
                            {m.priority && (
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getMilestonePriorityBadge(m.priority)}`}>
                                {m.priority}
                              </span>
                            )}
                          </div>

                          {m.description && (
                            <p className="text-xs text-slate-500 dark:text-[#A8C0D8] line-clamp-2 leading-relaxed">
                              {m.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-[#8899A6] pt-0.5">
                            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                              <Briefcase size={13} className="text-[#0A84FF] shrink-0" />
                              <span className="truncate max-w-[130px] sm:max-w-[180px]">{m.projectTitle}</span>
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-slate-600 dark:text-[#A8C0D8] truncate">
                              <span className="text-slate-400 dark:text-slate-500 mr-1">Assigned:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {m.freelancer?.name || 'Aarav Mehta'}
                              </span>
                              {m.freelancer?.role && (
                                <span className="text-slate-400 dark:text-slate-500 ml-1">
                                  • {m.freelancer.role}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Escrow Amount & Progress */}
                      <div className="lg:col-span-4 bg-slate-50/70 dark:bg-[#080E1A]/60 rounded-2xl p-4 border border-slate-100 dark:border-[#1E293B] space-y-2.5">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                              Escrow Protected
                            </span>
                            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                              ₹{m.amount?.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold font-mono text-[#0A84FF] dark:text-[#2FA8FF] block">
                              {isApproved ? 100 : m.progress}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Complete</span>
                          </div>
                        </div>

                        {/* Animated gradient progress bar */}
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${isApproved ? 100 : m.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              isApproved
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : 'bg-gradient-to-r from-[#0A84FF] via-indigo-500 to-cyan-400'
                            }`}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-0.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck size={13} />
                            <span>100% Escrow Protected</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-[#A8C0D8] font-medium">
                            <Calendar size={12} className="text-slate-400" />
                            <span>{m.countdown || 'Due soon'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right Side: Status & Approval Action */}
                      <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {isApproved ? 'Approved' : badge.label}
                          </span>
                        </div>

                        <div>
                          {isApproved ? (
                            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              <Check size={14} className="stroke-[3]" />
                              <span>Approved & Released</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApproveMilestone(m)}
                              disabled={isApproving}
                              className="group/btn relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0A84FF] to-[#0066CC] hover:from-[#0070E0] hover:to-[#0052A3] active:scale-95 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isApproving ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  <span>Releasing Escrow...</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck size={14} className="group-hover/btn:scale-110 transition-transform" />
                                  <span>Approve & Release</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. HIRING ACTIVITY & TALENT METRICS                                      */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-[28px] bg-white/80 dark:bg-[#101826]/80 backdrop-blur-md border border-[#D6EFFF] dark:border-[#22324A] shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hiring Activity & Talent Conversion</h3>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                31.1% Conversion Rate
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A8C0D8] mt-1">
              Proposals received vs talent hired over the last 6 months across all open projects
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0A111E] border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">Total Proposals</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">45 Received</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0A111E] border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px]">Talent Hired</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">14 Onboarded</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hiringActivityData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.4} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
              <Tooltip
                content={<ChartTooltip />}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(val) => <span className="text-slate-600 dark:text-[#A8C0D8] font-medium">{val}</span>}
              />
              <Bar dataKey="proposals" name="Proposals Received" fill="#818CF8" radius={[8, 8, 0, 0]} barSize={24} />
              <Bar dataKey="hired" name="Talent Hired" fill="#10B981" radius={[8, 8, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ACTIVE PROJECTS TABLE (Linear & Jira Inspired)                         */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#101826]/80 backdrop-blur-md border border-[#D6EFFF] dark:border-[#22324A] shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Projects & Pipeline</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF6FF] dark:bg-[#0A84FF]/20 text-[#0A84FF] dark:text-[#2FA8FF]">
                {activeProjects.length} Projects
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A8C0D8] mt-0.5">
              Live milestones, budgets, assigned talent, and proposal submissions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'open', label: 'Active/Review' },
                { id: 'completed', label: 'Completed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-800 text-[#0A84FF] shadow-xs'
                      : 'text-slate-500 dark:text-[#A8C0D8] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects or talent..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#0A84FF] transition-all w-48 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-50/75 dark:bg-slate-900/40">
                <th className="py-3.5 px-4">Project & Category</th>
                <th className="py-3.5 px-4">Assigned Freelancer</th>
                <th className="py-3.5 px-4">Budget</th>
                <th className="py-3.5 px-4">Milestone Progress</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No matching projects found. Try changing filters or search query.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr
                    key={proj.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* 1. Project & Priority */}
                    <td className="py-4 px-4 min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/jobs/${proj.id}`}
                          className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0A84FF] transition-colors line-clamp-1"
                        >
                          {proj.title}
                        </Link>
                        {proj.priority && (
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              proj.priority === 'Urgent'
                                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                : proj.priority === 'High'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {proj.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-[#7A92AA] mt-0.5">
                        {proj.category} • {proj.proposalsCount} proposals
                      </p>
                    </td>

                    {/* 2. Freelancer */}
                    <td className="py-4 px-4 min-w-[180px]">
                      {proj.freelancer?.name ? (
                        <div className="flex items-center gap-2.5">
                          <FreelancerAvatar freelancer={proj.freelancer} size="md" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{proj.freelancer.name}</p>
                            <p className="text-[11px] text-slate-400">{proj.freelancer.title}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Reviewing candidate bids</span>
                      )}
                    </td>

                    {/* 3. Budget */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white min-w-[110px]">
                      {formatCurrency(proj.budget)}
                    </td>

                    {/* 4. Progress */}
                    <td className="py-4 px-4 min-w-[160px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-700 dark:text-[#C5D8EA]">{proj.progress}%</span>
                        <span className="text-slate-400">
                          {proj.progress === 100 ? 'Completed' : proj.progress === 0 ? 'Pending' : 'In Flight'}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${proj.progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            proj.progress === 100
                              ? 'bg-emerald-500'
                              : proj.progress > 50
                              ? 'bg-[#0A84FF]'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </td>

                    {/* 5. Due Date */}
                    <td className="py-4 px-4 text-slate-600 dark:text-[#A8C0D8] min-w-[110px]">
                      {proj.dueDate}
                    </td>

                    {/* 6. Status Pill */}
                    <td className="py-4 px-4 min-w-[120px]">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          proj.status === 'in_progress'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : proj.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            proj.status === 'in_progress'
                              ? 'bg-amber-500'
                              : proj.status === 'completed'
                              ? 'bg-emerald-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span>{proj.statusLabel || proj.status}</span>
                      </span>
                    </td>

                    {/* 7. Actions */}
                    <td className="py-4 px-4 text-right min-w-[140px]">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/dashboard/projects`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0A84FF] hover:bg-[#EAF6FF] dark:hover:bg-[#0A84FF]/20 transition-colors"
                          title="View Proposals"
                        >
                          <Users size={15} />
                        </Link>
                        <Link
                          to={`/dashboard/chat`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          title="Message Freelancer"
                        >
                          <MessageSquare size={15} />
                        </Link>
                        <Link
                          to={`/jobs/${proj.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Project Details"
                        >
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. RECENT PAYMENTS LEDGER & TEAM COLLABORATION                            */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Escrow Payments (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#101826]/80 backdrop-blur-md border border-[#D6EFFF] dark:border-[#22324A] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Escrow Payments</h3>
              <p className="text-xs text-slate-500 dark:text-[#A8C0D8] mt-0.5">
                Funded milestones, verified payouts, and held escrow security
              </p>
            </div>
            <Link
              to="/dashboard/payments"
              className="text-xs text-[#0A84FF] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All Payments</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentPayments.map((pay) => (
              <div
                key={pay.id}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0A111E]/70 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FreelancerAvatar freelancer={pay.freelancer} size="xl" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{pay.project}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pay.escrowBadge === 'Held in Escrow'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : pay.escrowBadge === 'Processing'
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {pay.escrowBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {pay.id} • {pay.date} • Paid to {pay.freelancer?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatCurrency(pay.amount)}
                  </span>
                  <button
                    onClick={() => handleDownloadReceipt(pay)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                    title="Download Receipt"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Collaboration Sidebar Widget (1 col) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#101826]/80 backdrop-blur-md border border-[#D6EFFF] dark:border-[#22324A] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Team Collaboration</h3>
              <p className="text-xs text-slate-500 dark:text-[#A8C0D8] mt-0.5">
                Online freelancers & recent sprint updates
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>3 Online</span>
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {teamCollaboration.map((member, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50/70 dark:bg-[#0A111E]/60 border border-slate-200/70 dark:border-slate-800/80 flex items-start justify-between gap-3 hover:border-[#0A84FF]/30 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative shrink-0">
                    <FreelancerAvatar freelancer={member} size="lg" />
                    {member.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0A111E]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</h4>
                      <span className="text-[10px] text-amber-500 font-bold font-mono">★ {member.rating}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{member.role}</p>
                    <p className="text-[11px] text-slate-600 dark:text-[#889EBA] line-clamp-1 mt-0.5 italic">
                      "{member.message}"
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard/chat"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0A84FF] hover:bg-[#EAF6FF] dark:hover:bg-[#0A84FF]/20 transition-colors shrink-0"
                  title="Direct Message"
                >
                  <MessageSquare size={14} />
                </Link>
              </div>
            ))}
          </div>

          <Link to="/freelancers" className="block pt-2">
            <button className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-[#A8C0D8] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              <UserPlus size={14} />
              <span>Browse Marketplace Talent</span>
            </button>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ESCROW DEPOSIT MODAL                                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEscrowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] shadow-2xl space-y-5 text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-500">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Fund Escrow Protection</h3>
                    <p className="text-xs text-slate-400">Milestone security deposit</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEscrowModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Milestone
                  </label>
                  <select className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-[#0A84FF] outline-hidden">
                    <option>E-commerce Website — Milestone 1 (API Integration)</option>
                    <option>E-commerce Website — Milestone 2 (UI Approval)</option>
                    <option>Mobile Banking UI — Design System Escrow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deposit Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={escrowAmount}
                      onChange={(e) => setEscrowAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:border-[#0A84FF] outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#EAF6FF] dark:bg-[#0A84FF]/10 border border-[#D6EFFF] dark:border-[#0A84FF]/20 text-xs text-slate-600 dark:text-[#A8C0D8] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#0A84FF]">
                    <ShieldCheck size={14} />
                    <span>Razorpay Verified Escrow Vault</span>
                  </div>
                  <p className="text-[11px]">
                    Funds remain securely locked in escrow. They are only released to the freelancer once you review and approve work.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEscrowModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFundEscrow}
                  disabled={isFunding}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0A84FF] hover:bg-[#0070E0] text-white transition-colors shadow-md shadow-[#0A84FF]/20 disabled:opacity-50"
                >
                  {isFunding ? 'Processing...' : `Confirm Deposit of ₹${Number(escrowAmount).toLocaleString()}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

