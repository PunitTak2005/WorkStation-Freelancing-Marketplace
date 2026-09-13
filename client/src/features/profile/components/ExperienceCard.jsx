import React, { useState } from 'react';
import { TrendingUp, Plus, Building2, Calendar, Trash2 } from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import toast from 'react-hot-toast';

export default function ExperienceCard({ user, onUpdate }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    duration: '',
    description: ''
  });

  // Default timeline experiences if user doesn't have custom ones yet
  const experiences = user?.experiences && user.experiences.length > 0
    ? user.experiences
    : [
        {
          role: 'Lead Full-Stack Architect',
          company: 'HyperScale Solutions',
          duration: '2023 - Present',
          description: 'Architecting distributed microservices, WebSockets, and real-time dashboard analytics with React and Node.js.'
        },
        {
          role: 'Senior React Engineer',
          company: 'Veloce Digital Systems',
          duration: '2021 - 2023',
          description: 'Engineered high-performance client applications, state management workflows, and UI component libraries.'
        },
        {
          role: 'Software Developer',
          company: 'Infosys Technologies',
          duration: '2019 - 2021',
          description: 'Developed enterprise RESTful APIs, optimized MongoDB queries, and automated testing pipelines.'
        }
      ];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newExp.role.trim() || !newExp.company.trim()) {
      toast.error('Role and company are required');
      return;
    }
    try {
      setSaving(true);
      const updated = [
        {
          role: newExp.role,
          company: newExp.company,
          duration: newExp.duration || '2024 - Present',
          description: newExp.description
        },
        ...experiences
      ];
      await onUpdate({ experiences: updated });
      setIsAddOpen(false);
      setNewExp({ role: '', company: '', duration: '', description: '' });
      toast.success('Experience record added');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (index) => {
    const updated = experiences.filter((_, idx) => idx !== index);
    await onUpdate({ experiences: updated });
    toast.success('Experience record removed');
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 h-full flex flex-col justify-between">
        <div>
          {/* Universal Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight truncate">
                  Work Experience
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Verified career timeline & history
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
              <span>Add Experience</span>
            </Button>
          </div>

          {/* Connected Professional Timeline */}
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {experiences.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-[#0A84FF] ring-4 ring-blue-50 dark:ring-blue-950/60 transition-transform group-hover:scale-125" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {item.role}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Building2 size={13} className="text-slate-400" />
                        {item.company}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                      <span className="flex items-center gap-1 text-slate-400 font-normal">
                        <Calendar size={13} />
                        {item.duration}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-slate-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{experiences.length} Career Milestones Tracked</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            5+ Years Commercial Experience
          </span>
        </div>
      </div>

      {/* Add Experience Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Work Experience">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Role / Title"
            value={newExp.role}
            onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
            placeholder="e.g. Lead Frontend Architect"
            required
          />
          <Input
            label="Company or Organization"
            value={newExp.company}
            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
            placeholder="e.g. Acme Corp"
            required
          />
          <Input
            label="Duration / Timeframe"
            value={newExp.duration}
            onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
            placeholder="e.g. 2022 - Present"
          />
          <TextArea
            label="Responsibilities & Impact"
            value={newExp.description}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            rows={3}
            placeholder="Highlight architecture decisions, tech stacks, and team contributions..."
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Add Experience
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
