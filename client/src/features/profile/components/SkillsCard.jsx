import React, { useState } from 'react';
import { Code2, Plus, X, Sparkles } from 'lucide-react';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

export default function SkillsCard({ user, onUpdate }) {
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const currentSkills = user?.skills || [
    'React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Docker', 'AWS', 'Next.js'
  ];

  const suggestedSkills = [
    'GraphQL', 'PostgreSQL', 'Python', 'Redis', 'Kubernetes', 'Express.js', 'Figma', 'System Design'
  ].filter(s => !currentSkills.includes(s));

  const handleAddSkill = async (skillToAdd) => {
    const val = (skillToAdd || newSkill).trim();
    if (!val) return;
    if (currentSkills.map(s => s.toLowerCase()).includes(val.toLowerCase())) {
      toast.error('Skill already added');
      return;
    }
    const updated = [...currentSkills, val];
    setNewSkill('');
    setIsAdding(false);
    await onUpdate({ skills: updated });
    toast.success(`Added "${val}" to skills`);
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updated = currentSkills.filter(s => s !== skillToRemove);
    await onUpdate({ skills: updated });
    toast.success(`Removed "${skillToRemove}"`);
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 h-full flex flex-col justify-between">
      <div>
        {/* Universal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center shrink-0">
              <Code2 size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight truncate">
                Skills & Tech Stack
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Core competencies & tools
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shrink-0 whitespace-nowrap">
            {currentSkills.length} Skills
          </span>
        </div>

        {/* Skill Chips Cloud */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {currentSkills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50/80 dark:bg-blue-950/40 text-[#0A84FF] dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50 hover:border-[#0A84FF] dark:hover:border-blue-400 transition-all shadow-xs group"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-blue-400 hover:text-rose-500 rounded-full p-0.5 transition-colors focus:outline-none"
                title={`Remove ${skill}`}
                aria-label={`Remove ${skill}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>

        {/* Suggested Quick Add Chips */}
        {suggestedSkills.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles size={12} className="text-[#0A84FF]" /> Suggested additions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedSkills.slice(0, 5).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 hover:text-[#0A84FF] dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center gap-1"
                >
                  <Plus size={11} /> {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Input Bar */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add a new skill (e.g. Docker, GraphQL, Kubernetes)..."
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all"
          />
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleAddSkill()}
            disabled={!newSkill.trim()}
            className="text-xs px-4 py-2 rounded-xl"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
