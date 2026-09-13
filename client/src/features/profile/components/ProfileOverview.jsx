import React, { useState } from 'react';
import { User, MapPin, Calendar, ShieldCheck, Edit3, Camera, Sparkles, CheckCircle2 } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import { formatDate } from '@/utils/formatters';

export default function ProfileOverview({ user, onUpdate }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    location: user?.location || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatar?.url || ''
  });

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    const checks = [
      Boolean(user?.name),
      Boolean(user?.email),
      Boolean(user?.avatar?.url && !user.avatar.url.includes('ui-avatars')),
      Boolean(user?.bio && user.bio.length > 20),
      Boolean(user?.location),
      Boolean(user?.phone),
      Boolean(user?.skills && user.skills.length >= 3),
      Boolean(user?.hourlyRate || user?.companyDescription),
      Boolean(user?.portfolio && user.portfolio.length >= 1),
      Boolean(user?.socialLinks?.github || user?.socialLinks?.linkedin || user?.socialLinks?.website)
    ];
    const total = checks.length;
    checks.forEach(c => { if (c) score += 1; });
    return Math.round((score / total) * 100);
  };

  const completionRate = calculateCompletion();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || '',
      title: user?.title || '',
      location: user?.location || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatar?.url || ''
    });
    setIsEditOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updates = {
        name: formData.name,
        title: formData.title,
        location: formData.location,
        bio: formData.bio
      };
      if (formData.avatarUrl && formData.avatarUrl !== user?.avatar?.url) {
        updates.avatar = { url: formData.avatarUrl };
      }
      await onUpdate(updates);
      setIsEditOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 h-full flex flex-col justify-between">
        <div>
          {/* Universal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                  Profile Overview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Public identity & completion standing
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenEdit}
              className="rounded-full text-xs px-3 py-1.5 flex items-center gap-1.5 border-slate-200 dark:border-slate-700 hover:border-[#0A84FF] text-slate-700 dark:text-slate-300"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </Button>
          </div>

          {/* Profile Identity Hero */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            {/* 96-104px Avatar with online status */}
            <div className="relative shrink-0 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800 shadow-sm">
                <Avatar
                  src={user?.avatar?.url}
                  name={user?.name || 'User'}
                  size="2xl"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"
                title="Active Now"
              />
              <button
                onClick={handleOpenEdit}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change Avatar"
              >
                <Camera size={22} />
              </button>
            </div>

            {/* User Meta Information */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'WorkStation Member'}
                </h2>
                <Badge variant={user?.role === 'client' ? 'purple' : 'primary'} size="sm" className="capitalize">
                  {user?.role || 'Freelancer'}
                </Badge>
                {user?.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={13} /> Verified
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                {user?.title || (user?.role === 'client' ? 'Project Owner & Client' : 'Senior Full-Stack Specialist')}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 max-w-full">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate" title={user?.location}>{user?.location || 'Bengaluru, India'}</span>
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <Calendar size={14} className="text-slate-400" />
                  Joined {user?.createdAt ? formatDate(user.createdAt) : '2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Bio Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">About</span>
            {user?.bio || 'No professional biography added yet. Click Edit to describe your background, strengths, and offerings.'}
          </div>
        </div>

        {/* Profile Completion Meter Ring */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-transparent to-transparent dark:from-blue-950/20 p-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-200 dark:text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-[#0A84FF] transition-all duration-1000 ease-out"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 19}
                  strokeDashoffset={2 * Math.PI * 19 - (completionRate / 100) * (2 * Math.PI * 19)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-slate-800 dark:text-white">
                {completionRate}%
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Profile Completeness
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {completionRate >= 90 ? 'Profile is fully optimized for clients' : 'Complete remaining fields to rank higher'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A84FF] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
            <Sparkles size={13} />
            {completionRate}% Complete
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile Overview">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Professional Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Senior Full-Stack Engineer"
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Bengaluru, India"
          />
          <Input
            label="Avatar Image URL (or /freelancers/...)"
            value={formData.avatarUrl}
            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            placeholder="/freelancers/aarav-mehta.webp"
          />
          <TextArea
            label="Professional Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            placeholder="Write a brief intro highlighting your expertise and value proposition..."
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
