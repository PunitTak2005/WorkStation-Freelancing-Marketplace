import React from 'react';
import Card from '@/components/common/Card';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export default function PortfolioCard({ project }) {
  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden group">
      <div className="min-w-0">
        {/* Top bar: Completion badge & Link icon */}
        <div className="flex justify-between items-center gap-2 mb-3.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 shrink-0">
            <CheckCircle2 size={11} className="shrink-0" />
            <span className="truncate">{project.completionDate || 'Delivered'}</span>
          </span>

          <a
            href={project.projectUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors shrink-0"
            aria-label="Open project"
          >
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Title: 1-2 lines */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0A84FF] transition-colors mb-2 line-clamp-1 min-w-0">
          {project.title}
        </h4>

        {/* Description: 2 lines */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-w-0">
          {project.description}
        </p>
      </div>

      {/* Tech badges and action */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
        <div className="flex flex-wrap gap-1.5 overflow-hidden">
          {(project.techStack || ['React', 'Node.js', 'MongoDB']).map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 shrink-0"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.projectUrl || '#'}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-[#0A84FF] hover:underline flex items-center justify-between mt-1 pt-1"
        >
          <span>View Case Study</span>
          <ExternalLink size={12} className="shrink-0" />
        </a>
      </div>
    </Card>
  );
}
