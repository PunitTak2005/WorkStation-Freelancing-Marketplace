import React, { useState, useEffect } from 'react';
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import Skeleton from '@/components/common/Skeleton';
import ProjectCard from '@/components/ProjectCard';
import jobService from '@/services/jobService';

// Dynamically filter open projects only (exclude completed, assigned, closed, cancelled, in-progress)
const isOpenProject = (project) => {
  const statusStr = (project.status || project.featuredStatus || '').trim().toLowerCase();
  
  // Explicitly excluded states
  const excludedStatuses = [
    'completed',
    'assigned',
    'closed',
    'cancelled',
    'archived',
    'in progress',
    'in_progress'
  ];
  if (excludedStatuses.includes(statusStr)) {
    return false;
  }

  // Permitted active states
  const openStatuses = ['open', 'hiring', 'urgent'];
  return openStatuses.includes(statusStr) || statusStr === '';
};

export default function TrendingJobs() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchTrending = async () => {
      try {
        const res = await jobService.getTrendingJobs();
        const apiJobs = res.data?.data?.jobs || res.data?.data || [];
        
        // Dynamically filter open projects only
        const openApiJobs = Array.isArray(apiJobs) ? apiJobs.filter(isOpenProject) : [];

        if (isMounted) {
          const formatted = openApiJobs.slice(0, 6).map((apiJob) => {
            const rawStatus = (apiJob.status || apiJob.featuredStatus || '').toLowerCase();
            
            let normalizedStatus = 'Open';
            if (rawStatus === 'urgent') normalizedStatus = 'Urgent';
            else if (rawStatus === 'hiring') normalizedStatus = 'Hiring';
            
            const clientObj = typeof apiJob.client === 'object' ? apiJob.client : null;
            const clientName = clientObj?.name || (typeof apiJob.client === 'string' ? apiJob.client : 'Client');
            const clientRole = clientObj?.role || clientObj?.title || 'Client';
            const clientAvatar = clientObj?.avatar?.url || clientObj?.fullAvatarUrl || null;
            const clientInitials = clientName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || 'CL';

            return {
              _id: apiJob._id,
              title: apiJob.title,
              category: typeof apiJob.category === 'object' ? (apiJob.category?.name || 'General') : (apiJob.category || 'General'),
              status: normalizedStatus,
              budget: apiJob.budget || { min: 0, max: 0, type: 'fixed' },
              timeline: apiJob.timeline || 'Flexible',
              proposalsCount: apiJob.proposalCount || apiJob.proposalsCount || 0,
              locationType: apiJob.locationType || 'Remote',
              client: {
                name: clientName,
                company: apiJob.company || clientObj?.company || '',
                role: clientRole,
                avatar: clientAvatar,
                verified: clientObj?.verified ?? true,
                initials: clientInitials
              },
              skillsRequired: Array.isArray(apiJob.skillsRequired) ? apiJob.skillsRequired : []
            };
          });
          setProjects(formatted);
        }
      } catch (err) {
        if (isMounted) {
          setProjects([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-24 bg-[#F8FBFF] dark:bg-[#080B12] relative overflow-hidden border-t border-[#D6EFFF] dark:border-[#22324A] transition-colors duration-300">
      {/* Subtle Background Blueprint Grid & Lighting Accents (Opacity < 10%) */}
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
      <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-[#0A84FF]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-[#002366]/10 dark:bg-[#0A84FF]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Sparkles size={13} className="text-[#0A84FF]" />
              Accepting Proposals
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              Featured{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]">
                Projects
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#5B6B7A] dark:text-[#A8C0D8] mt-2 max-w-2xl">
              Verified active milestone opportunities seeking skilled independent talent. Review project scopes, timelines, and submit your proposal.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" className="font-semibold group whitespace-nowrap" icon={ArrowRight} iconPosition="right">
              Explore All Projects
            </Button>
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="p-10 sm:p-14 text-center rounded-3xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark max-w-xl mx-auto backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[3px] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#101826] flex items-center justify-center">
                <Briefcase size={26} className="text-[#0A84FF]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-2">
              No open featured projects at the moment.
            </h3>
            <p className="text-sm text-[#5B6B7A] dark:text-[#A8C0D8] mb-6 max-w-md mx-auto">
              All current featured milestones are either in progress or filled. Explore all available listings on the project board.
            </p>
            <Link to="/jobs">
              <Button variant="primary" icon={ArrowRight} iconPosition="right" className="font-bold">
                Browse All Projects
              </Button>
            </Link>
          </div>
        ) : (
          /* Projects Grid: 3 Desktop, 2 Tablet, 1 Mobile with 100% Consistent Height & Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {projects.map((project, i) => (
              <ProjectCard key={project._id || i} project={project} index={i} />
            ))}
          </div>
        )}

        {/* Section Bottom CTA Button */}
        <div className="text-center mt-14">
          <Link to="/jobs">
            <Button
              variant="outline"
              size="lg"
              className="font-bold border-[#0A84FF] text-[#0A84FF] dark:text-[#2FA8FF] hover:bg-[#0A84FF] hover:text-white px-8 shadow-sm"
              icon={ArrowRight}
              iconPosition="right"
            >
              Browse All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
