import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  MessageSquare,
  Bell,
  Search,
  CheckCircle2,
  Star,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Code,
  FolderGit2,
  Activity,
  Layers
} from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Modular Subcomponents
import FreelancerHero from '../components/FreelancerHero';
import StatsCard from '../components/StatsCard';
import EarningsChart from '../components/EarningsChart';
import WorkHoursCard from '../components/WorkHoursCard';
import ProposalConversionCard from '../components/ProposalConversionCard';
import ProposalTracker from '../components/ProposalTracker';
import MilestonesCard from '../components/MilestonesCard';
import ContractCard from '../components/ContractCard';
import ActivityFeed from '../components/ActivityFeed';
import ReviewCard from '../components/ReviewCard';
import PortfolioCard from '../components/PortfolioCard';
import WorkLogsModal from '../components/WorkLogsModal';
import AllReviewsModal from '../components/AllReviewsModal';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProposalFilter, setSelectedProposalFilter] = useState('all');
  const [showTimeLogsModal, setShowTimeLogsModal] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/freelancer');
        setData(res.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Monthly Earnings (Apr - Sep: ₹18,60,000)
  const monthlyEarningsData = useMemo(() => {
    if (data?.monthlyEarnings && data.monthlyEarnings.length > 0) {
      return data.monthlyEarnings.map((m) => ({
        name: m.name || monthNames[((m._id?.month || 1) - 1) % 12],
        amount: m.earnings || m.amount || 0,
      }));
    }
    return [
      { name: 'Apr', amount: 210000 },
      { name: 'May', amount: 320000 },
      { name: 'Jun', amount: 275000 },
      { name: 'Jul', amount: 390000 },
      { name: 'Aug', amount: 415000 },
      { name: 'Sep', amount: 250000 },
    ];
  }, [data]);

  // Weekly September Releases
  const weeklyEarningsData = useMemo(() => {
    if (data?.weeklyEarnings && data.weeklyEarnings.length > 0) {
      return data.weeklyEarnings;
    }
    return [
      { date: 'Sep 2', name: 'Sep 2', amount: 8000, project: 'Core Web Vitals Audit' },
      { date: 'Sep 5', name: 'Sep 5', amount: 12000, project: 'API Authentication' },
      { date: 'Sep 8', name: 'Sep 8', amount: 15000, project: 'CRM Sprint 1' },
      { date: 'Sep 10', name: 'Sep 10', amount: 9000, project: 'Pipeline Telemetry' },
      { date: 'Sep 12', name: 'Sep 12', amount: 18000, project: 'Edge Caching' },
      { date: 'Sep 15', name: 'Sep 15', amount: 22000, project: 'CRM Charts Engine' },
    ];
  }, [data]);

  // Work Hours Data (Mon - Sun: 39 hours)
  const workHoursData = useMemo(() => {
    if (data?.workHoursData && data.workHoursData.length > 0) {
      return data.workHoursData;
    }
    return [
      { day: 'Mon', hours: 6.5 },
      { day: 'Tue', hours: 7.0 },
      { day: 'Wed', hours: 5.5 },
      { day: 'Thu', hours: 8.0 },
      { day: 'Fri', hours: 6.0 },
      { day: 'Sat', hours: 4.0 },
      { day: 'Sun', hours: 2.0 },
    ];
  }, [data]);

  const totalWeeklyHours = workHoursData.reduce((acc, curr) => acc + curr.hours, 0);

  // Filtered proposals list
  const filteredProposals = useMemo(() => {
    if (!data?.recentProposals) return [];
    if (selectedProposalFilter === 'all') return data.recentProposals;
    return data.recentProposals.filter((p) => p.status === selectedProposalFilter);
  }, [data, selectedProposalFilter]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="lg:col-span-4 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const currentUser = data?.user || user;
  const displayEarnings = data?.totalEarnings ?? data?.stats?.totalEarnings ?? 1860000;
  const displayContracts = data?.activeContracts ?? data?.stats?.activeContracts ?? 3;
  const displayProposals = data?.proposalsSent ?? data?.stats?.proposalsSent ?? 12;
  const displaySuccessRate = data?.successRate ?? data?.stats?.successRate ?? 42;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8 animate-fadeIn">
      {/* 1. Hero Header Banner (Upwork & Linear style) */}
      <FreelancerHero
        user={currentUser}
        totalEarnings={displayEarnings}
        thisMonthEarnings={250000}
        successRate={displaySuccessRate}
        activeContractsCount={displayContracts}
        onOpenLogsModal={() => setShowTimeLogsModal(true)}
      />

      {/* 2. Overview 4-Column KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        <StatsCard
          title="Total Earnings"
          value={displayEarnings}
          formattedValue={formatCurrency(displayEarnings)}
          subtitle="6 Months Settled"
          icon={DollarSign}
          trend="+24% this month"
          trendPositive={true}
          color="emerald"
          sparklineData={[12, 16, 15, 22, 20, 26, 28, 32]}
        />

        <StatsCard
          title="Active Contracts"
          value={displayContracts}
          formattedValue={displayContracts.toString()}
          subtitle={`${data?.disputeStats?.activeDisputes ?? data?.stats?.activeDisputes ?? 2} in dispute`}
          icon={Briefcase}
          trend="3 In Progress"
          trendPositive={true}
          color="blue"
          sparklineData={[1, 2, 2, 3, 2, 3, 3, 3]}
        />

        <StatsCard
          title="Proposals Sent"
          value={displayProposals}
          formattedValue={displayProposals.toString()}
          subtitle={`${data?.stats?.acceptedProposals ?? 5} Hired • ${data?.stats?.rejectedProposals ?? 3} Rejected`}
          icon={FileText}
          trend="12 Submitted"
          trendPositive={true}
          color="purple"
          sparklineData={[3, 5, 7, 8, 10, 11, 11, 12]}
        />

        <StatsCard
          title="Success Rate"
          value={`${displaySuccessRate}%`}
          formattedValue={`${displaySuccessRate}%`}
          subtitle="Top 10% on platform"
          icon={TrendingUp}
          trend="+12% vs average"
          trendPositive={true}
          color="amber"
          sparklineData={[35, 38, 40, 42, 40, 44, 43, 42]}
        />
      </div>

      {/* 3. Hero Visualizations Row: Weekly Earnings Chart (8 cols) + Work Hours Card (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <EarningsChart
            weeklyData={weeklyEarningsData}
            monthlyData={monthlyEarningsData}
            totalEarnings={displayEarnings}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <WorkHoursCard
            workHoursData={workHoursData}
            totalWeeklyHours={totalWeeklyHours}
            weeklyTarget={45}
            onOpenLogsModal={() => setShowTimeLogsModal(true)}
          />
        </div>
      </div>

      {/* 4. Active Contracts Section (3 Project Cards) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display flex flex-wrap items-center gap-2">
              <Briefcase size={20} className="text-[#0A84FF]" />
              <span>Active Contracts ({displayContracts})</span>
              {(data?.disputeStats?.activeDisputes ?? data?.stats?.activeDisputes ?? 2) > 0 && (
                <Link
                  to="/dashboard/contracts?status=disputed"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>{data?.disputeStats?.activeDisputes ?? data?.stats?.activeDisputes ?? 2} in dispute</span>
                </Link>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Engagements with live milestones, client messaging, and time logging
            </p>
          </div>
          <Link to="/dashboard/contracts">
            <Button variant="ghost" size="sm" className="text-xs text-[#0A84FF]">
              <span>All Contracts</span>
              <ChevronRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {(data?.activeContractsList || [
            {
              title: 'API Integration & Pipeline Analytics',
              client: { name: 'Rajesh Sharma', company: 'Sharma Enterprises', avatar: '/freelancers/rajesh-kumar.webp' },
              budget: 95000,
              progress: 72,
              dueDate: '17 Sept 2026',
              statusLabel: 'Active',
              statusColor: 'blue',
            },
            {
              title: 'CRM Dashboard Modernization',
              client: { name: 'Priya Kapoor', company: 'Kapoor Digital Labs', avatar: '/freelancers/priya-kapoor.webp' },
              budget: 65000,
              progress: 46,
              dueDate: '24 Sept 2026',
              statusLabel: 'In Review',
              statusColor: 'amber',
            },
            {
              title: 'E-Commerce Performance Optimization',
              client: { name: 'Rohan Patel', company: 'Patel Technologies', avatar: '/freelancers/rohan-patel.webp' },
              budget: 82000,
              progress: 88,
              dueDate: '20 Sept 2026',
              statusLabel: 'Near Completion',
              statusColor: 'emerald',
            },
          ]).map((contract, idx) => (
            <div key={contract.id || idx} className="flex flex-col h-full">
              <ContractCard
                contract={contract}
                onLogTime={() => setShowTimeLogsModal(true)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Funnel & Milestones Row: Proposal Conversion Funnel (5 cols) + Milestones Card (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <ProposalConversionCard
            proposalsSent={displayProposals}
            accepted={data?.stats?.acceptedProposals ?? 5}
            shortlisted={data?.stats?.shortlistedProposals ?? 2}
            pending={data?.stats?.pendingProposals ?? 2}
            rejected={data?.stats?.rejectedProposals ?? 3}
            completed={5}
            successRate={displaySuccessRate}
            shortlistRate={17}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <MilestonesCard upcomingMilestones={data?.upcomingMilestones || []} />
        </div>
      </div>

      {/* 6. Recent Proposals Table + Skills Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Recent Proposals Table (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display truncate">
                      Recent Proposals Table
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Live proposal submissions with expected timelines and status
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium self-end sm:self-auto shrink-0">
                  {['all', 'accepted', 'shortlisted', 'pending', 'rejected'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedProposalFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                        selectedProposalFilter === filter
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Project</th>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Budget</th>
                      <th className="py-3 px-3">Timeline</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredProposals.slice(0, 5).map((proposal, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{proposal.title}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">
                            {proposal.coverLetter}
                          </p>
                        </td>
                        <td className="py-3 px-3 min-w-0">
                          <div className="flex items-center gap-2">
                            <img
                              src={proposal.client?.avatar || '/freelancers/rajesh-kumar.webp'}
                              alt={proposal.client?.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                              {proposal.client?.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap">
                          {formatCurrency(proposal.budget)}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {proposal.deliveryTime ? `${proposal.deliveryTime} days` : '3 weeks'}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full font-bold capitalize text-[10px] ${
                              proposal.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                                : proposal.status === 'shortlisted'
                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40'
                                : proposal.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40'
                            }`}
                          >
                            {proposal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>Showing 5 of {filteredProposals.length} proposals</span>
              <Link to="/dashboard/my-proposals" className="text-[#0A84FF] font-semibold hover:underline flex items-center gap-1">
                <span>View All Proposals</span>
                <ChevronRight size={12} />
              </Link>
            </div>
          </Card>
        </div>

        {/* Skills Performance Widget (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex justify-between items-start gap-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Code className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display truncate">
                      Skills Proficiency
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Verified job counts across primary technologies
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] dark:text-[#2FA8FF] shrink-0">
                  Top 1% Rank
                </span>
              </div>

              <div className="space-y-4">
                {(data?.skillsPerformance || [
                  { skill: 'React', jobs: 24, percentage: 95, color: '#0A84FF' },
                  { skill: 'Node.js', jobs: 19, percentage: 80, color: '#10B981' },
                  { skill: 'MongoDB', jobs: 16, percentage: 70, color: '#14B8A6' },
                  { skill: 'TypeScript', jobs: 12, percentage: 55, color: '#3B82F6' },
                  { skill: 'Docker', jobs: 8, percentage: 40, color: '#6366F1' },
                ]).map((s, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-slate-800 dark:text-slate-200 font-bold truncate">{s.skill}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono shrink-0">
                          {s.jobs} jobs
                        </span>
                      </div>
                      <span className="text-slate-500 font-mono shrink-0 ml-2">{s.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${s.percentage}%`, backgroundColor: s.color || '#0A84FF' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium truncate min-w-0">
                <CheckCircle2 size={13} className="shrink-0" />
                <span className="truncate">Skill certifications verified by WorkStation</span>
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* 7. Completed Portfolio Showcase (6 Projects Grid) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <FolderGit2 size={20} className="text-[#0A84FF]" />
              <span>Completed Portfolio Projects ({data?.portfolio?.length || 6})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Production deployments with verified architectures and live demos
            </p>
          </div>
          <Link to="/freelancers">
            <Button variant="ghost" size="sm" className="text-xs text-[#0A84FF]">
              <span>Public Profile</span>
              <ChevronRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {(data?.portfolio || [
            {
              title: 'CRM Dashboard Modernization',
              description: 'High performance enterprise CRM with live charts, sales pipeline analytics, and multi-tenant access control.',
              techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
              completionDate: 'Aug 2026',
              projectUrl: 'https://crm.workstation.io',
            },
            {
              title: 'Analytics Platform & Data Stream',
              description: 'Real-time financial streaming analytics and transactional fraud detection platform handling 50k+ events/sec.',
              techStack: ['Node.js', 'Kafka', 'Redis', 'React'],
              completionDate: 'Jul 2026',
              projectUrl: 'https://analytics.workstation.io',
            },
            {
              title: 'E-Commerce Store & Escrow Marketplace',
              description: 'Multi-vendor marketplace featuring headless checkout, automated escrow settlements, and inventory sync.',
              techStack: ['Next.js', 'Express', 'MongoDB', 'Razorpay'],
              completionDate: 'Jun 2026',
              projectUrl: 'https://store.workstation.io',
            },
            {
              title: 'Project Management App (WorkStation)',
              description: 'Collaborative agile task workspace with WebSocket push updates, sprint timelines, and time logging.',
              techStack: ['React', 'Redux Toolkit', 'Socket.io'],
              completionDate: 'May 2026',
              projectUrl: 'https://projects.workstation.io',
            },
            {
              title: 'HR Portal & Automated Payroll',
              description: 'Full lifecycle employee management, attendance biometric sync, tax compliance, and automated payroll disbursements.',
              techStack: ['React', 'Node.js', 'MongoDB', 'AWS S3'],
              completionDate: 'Apr 2026',
              projectUrl: 'https://hr.workstation.io',
            },
            {
              title: 'Restaurant Ordering & POS Cloud System',
              description: 'Real-time kitchen order display, table QR ordering, digital menu management, and automated inventory deduction.',
              techStack: ['React', 'TypeScript', 'Node.js'],
              completionDate: 'Mar 2026',
              projectUrl: 'https://pos.workstation.io',
            },
          ]).map((proj, idx) => (
            <div key={idx} className="flex flex-col h-full">
              <PortfolioCard project={proj} />
            </div>
          ))}
        </div>
      </div>

      {/* 8. Client Reviews & Testimonials Section (16 Reviews Grid) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              <span>Client Reviews & Testimonials ({data?.reviews?.length || 16})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified feedback from enterprise clients with a 4.9 average rating
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllReviewsModal(true)}
            className="text-xs text-[#0A84FF]"
          >
            <span>View All ({data?.reviews?.length || 16})</span>
            <ChevronRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {(data?.reviews?.slice(0, 4) || [
            {
              reviewerName: 'Rajesh Sharma',
              reviewerCompany: 'Sharma Enterprises',
              avatar: '/freelancers/rajesh-kumar.webp',
              rating: 5.0,
              comment: 'Excellent communication and high-quality work. Aarav delivered our backend architecture ahead of schedule with zero bugs.',
              date: 'Sep 5, 2026',
            },
            {
              reviewerName: 'Rohan Patel',
              reviewerCompany: 'Patel Technologies',
              avatar: '/freelancers/rohan-patel.webp',
              rating: 5.0,
              comment: 'Aarav is top 1% engineering talent. Cut our storefront response latency by 60% and achieved a 98 Lighthouse score.',
              date: 'Sep 2, 2026',
            },
            {
              reviewerName: 'Priya Kapoor',
              reviewerCompany: 'Kapoor Digital Labs',
              avatar: '/freelancers/priya-kapoor.webp',
              rating: 5.0,
              comment: 'Outstanding developer! Clean modular code, proactive updates, and great UI integration with Figma tokens.',
              date: 'Sep 8, 2026',
            },
            {
              reviewerName: 'Neha Singh',
              reviewerCompany: 'Singh AI Innovations',
              avatar: '/freelancers/neha-singh.webp',
              rating: 4.8,
              comment: 'Delivered ahead of schedule. Great understanding of cloud infrastructure, Docker, and API security.',
              date: 'Aug 20, 2026',
            },
          ]).map((rev, idx) => (
            <div key={idx} className="flex flex-col h-full">
              <ReviewCard review={rev} />
            </div>
          ))}
        </div>
      </div>

      {/* 9. Messages, Activity Feed & Notifications Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Active Conversations Widget */}
        <div className="flex flex-col h-full">
          <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex justify-between items-start gap-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display truncate">
                      Direct Messages
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Client conversations and project syncs
                    </p>
                  </div>
                </div>
                <Link to="/dashboard/messages">
                  <Button variant="ghost" size="sm" className="text-xs text-[#0A84FF]">
                    <span>Inbox</span>
                    <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {(data?.activeConversations || [
                  {
                    name: 'Rajesh Sharma',
                    avatar: '/freelancers/rajesh-kumar.webp',
                    lastMessage: 'Great work on the dashboard updates. Let us schedule a demo tomorrow.',
                    unreadCount: 1,
                    isOnline: true,
                  },
                  {
                    name: 'Priya Kapoor',
                    avatar: '/freelancers/priya-kapoor.webp',
                    lastMessage: 'Can we finalize the API documentation? I want to share it with our design team.',
                    unreadCount: 1,
                    isOnline: true,
                  },
                  {
                    name: 'Rohan Patel',
                    avatar: '/freelancers/rohan-patel.webp',
                    lastMessage: "I've reviewed your implementation. The response times are drastically faster!",
                    unreadCount: 0,
                    isOnline: false,
                  },
                ]).map((conv, idx) => (
                  <Link
                    key={idx}
                    to="/dashboard/messages"
                    className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all duration-200"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.avatar || '/freelancers/rajesh-kumar.webp'}
                        alt={conv.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h5 className="font-bold text-slate-900 dark:text-white text-xs truncate">{conv.name}</h5>
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#0A84FF] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-relaxed">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Average response: &lt; 15 mins</span>
              <span className="text-emerald-500 font-medium">Active</span>
            </div>
          </Card>
        </div>

        {/* Recent Activity Timeline Widget */}
        <div className="flex flex-col h-full">
          <ActivityFeed activities={data?.recentActivity || []} />
        </div>

        {/* Notifications Widget */}
        <div className="flex flex-col h-full">
          <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex justify-between items-start gap-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display truncate">
                      Notifications
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Escrow payouts & milestone reminders
                    </p>
                  </div>
                </div>
                <Link to="/dashboard/notifications">
                  <Button variant="ghost" size="sm" className="text-xs text-[#0A84FF]">
                    <span>All Alerts</span>
                    <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {(data?.notifications?.slice(0, 4) || [
                  {
                    title: 'Milestone Approved',
                    message: 'Rajesh Sharma approved Milestone: Backend Authentication (₹35,000 transferred).',
                    read: false,
                    createdAt: 'Today',
                  },
                  {
                    title: 'Escrow Released',
                    message: 'Escrow release of ₹18,000 processed for E-Commerce Performance Sprint.',
                    read: false,
                    createdAt: 'Today',
                  },
                  {
                    title: 'New Proposal Viewed',
                    message: 'Singh AI Innovations viewed your proposal for Healthcare Patient Portal.',
                    read: true,
                    createdAt: 'Yesterday',
                  },
                  {
                    title: 'Deadline Reminder',
                    message: 'Milestone API Integration & Pipeline Analytics is due in 5 days.',
                    read: false,
                    createdAt: 'Yesterday',
                  },
                ]).map((notif, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-xs transition-colors overflow-hidden ${
                      !notif.read
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40'
                        : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-xs truncate mr-2">{notif.title}</span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0A84FF] shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed truncate">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Instant push notifications enabled</span>
              <Link to="/settings" className="text-[#0A84FF] hover:underline font-medium">Settings</Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <WorkLogsModal
        isOpen={showTimeLogsModal}
        onClose={() => setShowTimeLogsModal(false)}
        timeLogs={data?.timeLogs || []}
        totalWeeklyHours={totalWeeklyHours}
      />

      <AllReviewsModal
        isOpen={showAllReviewsModal}
        onClose={() => setShowAllReviewsModal(false)}
        reviews={data?.reviews || []}
        averageRating={4.9}
      />
    </div>
  );
}
