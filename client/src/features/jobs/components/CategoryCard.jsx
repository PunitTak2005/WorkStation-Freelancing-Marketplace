import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Smartphone,
  Palette,
  Sparkles,
  Database,
  Cloud,
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CATEGORY_OPTIONS = [
  {
    id: 'Web Development',
    title: 'Web Development',
    tag: 'Full-Stack, Frontend & Backend',
    icon: Code2,
    color: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'Mobile App Development',
    title: 'Mobile App',
    tag: 'iOS, Android & React Native',
    icon: Smartphone,
    color: 'from-purple-500/20 to-indigo-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'UI/UX Design',
    title: 'UI/UX Design',
    tag: 'Figma, Wireframing & Design Systems',
    icon: Palette,
    color: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'AI & Machine Learning',
    title: 'AI & ML',
    tag: 'LLMs, PyTorch & Deep Learning',
    icon: Sparkles,
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'Data Science',
    title: 'Data Science',
    tag: 'Analytics, ETL & Visualization',
    icon: Database,
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'DevOps & Cloud',
    title: 'DevOps & Cloud',
    tag: 'AWS, Docker & CI/CD Pipelines',
    icon: Cloud,
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'Content Writing',
    title: 'Content & Copy',
    tag: 'Technical Writing, SEO & Blogs',
    icon: FileText,
    color: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    id: 'Cybersecurity',
    title: 'Cybersecurity',
    tag: 'Audits, Pen-Testing & Hardening',
    icon: ShieldCheck,
    color: 'from-slate-500/20 to-gray-500/20',
    iconColor: 'text-slate-600 dark:text-slate-400',
  },
];

export default function CategoryCard({
  category,
  selectedCategory,
  onSelect,
}) {
  const isSelected = selectedCategory === category.id || selectedCategory === category.title;
  const Icon = category.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(category.id)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-blue-50/70 dark:bg-[#0E2038] border-[#0A84FF] shadow-md shadow-blue-500/10 ring-2 ring-[#0A84FF]/20'
          : 'bg-slate-50/50 dark:bg-[#121B2B]/60 border-slate-200/80 dark:border-[#22324A] hover:bg-white dark:hover:bg-[#162235] hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Selection Checkmark Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0A84FF] text-white flex items-center justify-center shadow-xs">
          <Check size={12} strokeWidth={3} />
        </div>
      )}

      {/* Category Icon Container */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} ${category.iconColor} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>

      {/* Category Title */}
      <h3 className={`text-sm font-bold leading-tight ${isSelected ? 'text-[#0A84FF] dark:text-[#2FA8FF]' : 'text-slate-900 dark:text-white'}`}>
        {category.title}
      </h3>

      {/* Subtitle / Tag */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-1">
        {category.tag}
      </p>
    </motion.button>
  );
}
