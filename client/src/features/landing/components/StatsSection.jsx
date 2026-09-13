import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dashboardService from '@/services/dashboardService';

export default function StatsSection() {
  const [metrics, setMetrics] = useState({
    activeUsers: '0',
    activeProjects: '0',
    volume: '₹0',
    clientSatisfaction: '99%',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const res = await dashboardService.getPublicStats();
        const data = res.data?.data;
        if (isMounted && data) {
          const totalFreelancers = data.totalFreelancers || 0;
          const projectsCount = data.activeProjects ?? 0;
          const volumeValue = data.totalVolume
            ? data.totalVolume >= 10000000
              ? `₹${(data.totalVolume / 10000000).toFixed(1)} Cr+`
              : `₹${(data.totalVolume / 100000).toFixed(0)} Lakh+`
            : '₹0';
          const satisfaction = data.satisfactionRate ? `${data.satisfactionRate}%` : '99%';

          setMetrics({
            activeUsers: `${totalFreelancers.toLocaleString()}+`,
            activeProjects: `${projectsCount.toLocaleString()}+`,
            volume: volumeValue,
            clientSatisfaction: satisfaction,
          });
        }
      } catch (err) {
        // Keep clean stats
      }
    };
    fetchLiveStats();

    window.addEventListener('project:count_changed', fetchLiveStats);
    return () => {
      isMounted = false;
      window.removeEventListener('project:count_changed', fetchLiveStats);
    };
  }, []);

  const metricCards = [
    {
      value: metrics.activeUsers,
      label: 'Verified Freelancers',
      desc: 'Screened engineers, product designers, and technical specialists ready for work.',
      percent: '92%',
    },
    {
      value: metrics.activeProjects,
      label: 'Active Projects',
      desc: 'Milestone-based contracts and verified opportunities open for talent.',
      percent: '96%',
    },
    {
      value: metrics.volume,
      label: 'Total Platform Volume',
      desc: 'Direct, transparent milestone volume secured and protected by WorkStation escrow.',
      percent: '100%',
    },
    {
      value: metrics.clientSatisfaction,
      label: 'Client Satisfaction',
      desc: 'Continuous peer validation, milestone dispute protection, and high ratings.',
      percent: '99%',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#F8FBFF] dark:bg-[#080B12] relative overflow-hidden border-y border-[#D6EFFF] dark:border-[#22324A] transition-colors duration-300">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#0A84FF]/5 dark:bg-[#0A84FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF6FF] dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] text-[#0A84FF] dark:text-[#2FA8FF] text-xs font-semibold uppercase tracking-wider mb-3">
            Marketplace Scale
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 font-display tracking-tight">
            WorkStation in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF]">
              Numbers
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#5B6B7A] dark:text-[#A8C0D8]">
            Real transactions, verified escrow deliveries, and transparent collaboration metrics.
          </p>
        </div>

        {/* 4 Brand Metrics with Circular Motifs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="relative p-7 rounded-2xl bg-white dark:bg-[#101826] border border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark hover:border-[#0A84FF]/60 dark:hover:border-[#0A84FF]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Circular Ring Accent in Background */}
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full border border-[#0A84FF]/10 dark:border-[#0A84FF]/20 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF6FF] dark:bg-[#162235] text-[#0A84FF] dark:text-[#2FA8FF] border border-[#D6EFFF] dark:border-[#22324A]">
                    {metric.percent} Rate
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] group-hover:animate-ping" />
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-1 font-display tracking-tight group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors">
                  {metric.value}
                </h3>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                  {metric.label}
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#A8C0D8] leading-relaxed">
                  {metric.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
