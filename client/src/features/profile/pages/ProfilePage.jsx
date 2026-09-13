import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { ExternalLink, ShieldCheck, Sparkles, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileOverview from '../components/ProfileOverview';
import AccountDetailsCard from '../components/AccountDetailsCard';
import SkillsCard from '../components/SkillsCard';
import PortfolioCard from '../components/PortfolioCard';
import ExperienceCard from '../components/ExperienceCard';
import CertificationsCard from '../components/CertificationsCard';

export default function ProfilePage() {
  const { user, updateUserData } = useAuth();
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (payload) => {
    try {
      setUpdating(true);
      const res = await api.put('/users/profile', payload);
      if (res.data?.data?.user && updateUserData) {
        updateUserData(res.data.data.user);
      }
      toast.success('Profile updated successfully');
      return res.data?.data?.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0A84FF] border border-blue-200/60 dark:border-blue-800/60">
              <Sparkles size={13} />
              Professional Workspace Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Profile Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your verified identity, credentials, competencies, and client-facing deliverables.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {user?._id && (
            <Link
              to={`/freelancers/${user._id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#0A84FF] hover:text-[#0A84FF] transition-all shadow-xs"
            >
              <span>View Public Profile</span>
              <ExternalLink size={13} />
            </Link>
          )}
        </div>
      </div>

      {/* Responsive 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Row 1: Profile Overview & Account Details */}
        <div className="h-full">
          <ProfileOverview user={user} onUpdate={handleUpdate} />
        </div>
        <div className="h-full">
          <AccountDetailsCard user={user} onUpdate={handleUpdate} />
        </div>

        {/* Row 2: Skills & Featured Portfolio */}
        <div className="h-full">
          <SkillsCard user={user} onUpdate={handleUpdate} />
        </div>
        <div className="h-full">
          <PortfolioCard user={user} onUpdate={handleUpdate} />
        </div>

        {/* Row 3: Work Experience & Certifications */}
        <div className="h-full">
          <ExperienceCard user={user} onUpdate={handleUpdate} />
        </div>
        <div className="h-full">
          <CertificationsCard user={user} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
}
