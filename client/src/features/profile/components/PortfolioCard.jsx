import React, { useState } from 'react';
import { Briefcase, Plus, ExternalLink, Trash2, Camera, Link as LinkIcon } from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import toast from 'react-hot-toast';

export default function PortfolioCard({ user, onUpdate }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    projectUrl: '',
    imageUrl: ''
  });

  const portfolio = user?.portfolio && user.portfolio.length > 0
    ? user.portfolio
    : [
        {
          _id: 'p1',
          title: 'FinTech Wealth Analytics Dashboard',
          category: 'Web Development',
          description: 'Real-time portfolio management platform with high-frequency WebSockets.',
          images: [{ url: '/projects/analytics-dashboard.webp' }],
          projectUrl: 'https://github.com'
        },
        {
          _id: 'p2',
          title: 'Cloud Logistics ERP Platform',
          category: 'Enterprise SaaS',
          description: 'End-to-end supply chain fleet monitoring and dispatch telemetry.',
          images: [{ url: '/projects/crm-dashboard.webp' }],
          projectUrl: 'https://github.com'
        }
      ];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      toast.error('Project title is required');
      return;
    }
    try {
      setSaving(true);
      const updated = [
        ...portfolio,
        {
          title: newProject.title,
          category: newProject.category || 'Web Application',
          description: newProject.description,
          projectUrl: newProject.projectUrl || 'https://workstation.dev',
          images: newProject.imageUrl ? [{ url: newProject.imageUrl }] : [{ url: '/projects/crm-dashboard.webp' }]
        }
      ];
      await onUpdate({ portfolio: updated });
      setIsAddOpen(false);
      setNewProject({ title: '', category: 'Web Development', description: '', projectUrl: '', imageUrl: '' });
      toast.success('Project added to portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (idx) => {
    const updated = portfolio.filter((_, i) => i !== idx);
    await onUpdate({ portfolio: updated });
    toast.success('Project removed');
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 h-full flex flex-col justify-between">
        <div>
          {/* Universal Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center shrink-0">
                <Briefcase size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight truncate">
                  Featured Portfolio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Delivered project showcase & deliverables
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddOpen(true)}
              className="rounded-full text-xs px-3 py-1.5 flex items-center gap-1.5 border-slate-200 dark:border-slate-700 hover:border-[#0A84FF] text-slate-700 dark:text-slate-300 shrink-0 whitespace-nowrap"
            >
              <Plus size={14} />
              <span>Add Project</span>
            </Button>
          </div>

          {/* Mini Project Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.map((item, idx) => {
              const imgUrl = item.images?.[0]?.url || '/projects/crm-dashboard.webp';
              return (
                <div
                  key={idx}
                  className="group rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 overflow-hidden hover:border-[#0A84FF]/60 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="h-28 overflow-hidden relative">
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0A84FF] text-white shadow-xs">
                      {item.category || 'Featured'}
                    </span>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-[#0A84FF] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description || 'Verified production deliverable and codebase architecture.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                      {item.projectUrl ? (
                        <a
                          href={item.projectUrl.startsWith('http') ? item.projectUrl : `https://${item.projectUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0A84FF] hover:underline"
                        >
                          <span>Live View</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Internal Project</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                        title="Remove project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{portfolio.length} Production Showcase Items</span>
          <button
            onClick={() => setIsAddOpen(true)}
            className="text-xs font-medium text-[#0A84FF] hover:underline"
          >
            + Upload Screenshot
          </button>
        </div>
      </div>

      {/* Add Project Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Featured Project">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            placeholder="e.g. AI-Powered Freelance Hub"
            required
          />
          <Input
            label="Category"
            value={newProject.category}
            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
            placeholder="e.g. Full-Stack / Mobile / UI-UX"
          />
          <Input
            label="Live URL or GitHub Repo"
            value={newProject.projectUrl}
            onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })}
            placeholder="https://github.com/username/project"
          />
          <Input
            label="Screenshot Image URL"
            value={newProject.imageUrl}
            onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
            placeholder="/projects/crm-dashboard.webp"
          />
          <TextArea
            label="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            rows={3}
            placeholder="Key technical accomplishments, metrics, and problems solved..."
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Add Project
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
