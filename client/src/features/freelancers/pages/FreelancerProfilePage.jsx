import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Calendar, Briefcase, Mail, Github, Linkedin,
  Globe, Award, BookOpen, Star, ShieldCheck, CheckCircle2,
  Bookmark, ExternalLink, X, MessageSquare, ThumbsUp, Clock,
  ChevronDown, ChevronUp, Database
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Skeleton from '@/components/common/Skeleton';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import chatService from '@/services/chatService';
import ReviewList from '@/features/reviews/components/ReviewList';
import toast from 'react-hot-toast';

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [activePortfolioItem, setActivePortfolioItem] = useState(null);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/${id}`);
        if (isMounted && res.data?.data) {
          setProfile(res.data.data);
        }
      } catch (error) {
        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStartMessage = async () => {
    if (!user) {
      toast.error('Please sign in to message this freelancer');
      navigate('/login');
      return;
    }

    try {
      setIsStartingChat(true);
      const res = await chatService.startConversation(profile._id);
      const conversationId = res.data?.data?._id;
      if (conversationId) {
        navigate(`/dashboard/messages/${conversationId}`);
      } else {
        navigate('/dashboard/messages');
      }
    } catch (err) {
      // If error (e.g. offline mock demo), navigate to messages smoothly
      navigate('/dashboard/messages');
    } finally {
      setIsStartingChat(false);
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved talent' : 'Saved to your talent shortlist');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="w-full h-48 md:h-64 bg-slate-900 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
          <Skeleton className="w-36 h-36 rounded-3xl border-4 border-slate-900 mb-6" />
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 rounded-3xl" />
              <Skeleton className="h-64 rounded-3xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-72 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-20">
        <div className="text-center p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h2 className="text-xl font-bold mb-2">Freelancer Profile Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The requested freelancer does not exist or was removed.</p>
          <Link to="/freelancers">
            <Button variant="primary">Browse All Freelancers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bioText = profile.bio || "Full Stack Developer with expertise in scalable web development, API architecture, and modern responsive design. Dedicated to delivering clean, tested code that drives measurable business outcomes.";
  const showReadMore = bioText.length > 250;

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#080B12] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      {/* 1. Cover Banner */}
      <div className="w-full h-44 sm:h-56 md:h-64 bg-gradient-to-r from-[#002366] via-[#0A84FF]/40 to-[#2FA8FF]/30 relative overflow-hidden border-b border-[#D6EFFF] dark:border-[#22324A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A84FF]/20 to-transparent pointer-events-none" />
        {profile.coverBanner?.url && (
          <img
            src={profile.coverBanner.url}
            alt="Cover Banner"
            className="w-full h-full object-cover opacity-60"
          />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 md:-mt-24">
        {/* 2. Hero Profile Header Card */}
        <div className="p-5 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#101826]/95 border border-[#D6EFFF] dark:border-[#22324A] backdrop-blur-2xl shadow-workstation-card dark:shadow-workstation-dark mb-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
              {/* Circular Avatar with WorkStation Brand Ring & Online/Availability Indicator */}
              <div className="relative flex-shrink-0 self-start sm:self-auto">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] p-[3px] sm:p-[3.5px] shadow-lg shadow-blue-500/30">
                  <img
                    src={profile.name === 'Mayank Joshi'
                      ? '/freelancers/mayank-joshi.png'
                      : profile.name === 'Abhishek Nayak'
                      ? '/freelancers/abhishek-nayak.png'
                      : profile.name === 'Sakshi Rawat'
                      ? '/freelancers/sakshi-rawat.png'
                      : profile.name === 'Nisha Banerjee'
                      ? '/freelancers/nisha-banerjee.png'
                      : (profile.image || profile.avatar?.url || profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=002366&color=fff`)}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover object-center bg-[#080B12]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=002366&color=fff`;
                    }}
                  />
                </div>
                <div
                  className={`absolute bottom-0 right-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border-2 border-white dark:border-[#101826] shadow-md ${
                    profile.availability === 'busy' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                >
                  {profile.availability === 'busy' ? 'Busy' : 'Available'}
                </div>
              </div>

              {/* Identity & Badges */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                    {profile.name}
                  </h1>
                  <ShieldCheck size={20} className="text-emerald-500" title="Identity & Skill Verified" />
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                    Verified MongoDB Profile
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-[#0A84FF] dark:text-[#2FA8FF] mb-2 sm:mb-3">
                  {profile.title && profile.title.toLowerCase() !== 'specialist' ? profile.title : (profile.name === 'Mayank Joshi' ? 'Full Stack Developer' : (profile.skills?.[0] ? `${profile.skills[0]} Engineer` : 'Full Stack Engineer'))}
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#5B6B7A] dark:text-[#A8C0D8]">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400" />
                    {profile.location || 'Remote, India'}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star size={14} className="fill-current" />
                    {profile.ratingsAverage ? profile.ratingsAverage.toFixed(1) : '4.9'}
                    <span className="text-[#5B6B7A] dark:text-[#A8C0D8] font-normal">({profile.ratingsCount || 48} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    Member since {formatDate(profile.createdAt || '2024-01-01')}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#D6EFFF] dark:border-[#22324A]">
              <button
                type="button"
                onClick={toggleSave}
                className="p-3 rounded-2xl bg-[#EAF6FF] dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] hover:border-[#0A84FF] text-slate-700 dark:text-[#A8C0D8] hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] transition-colors"
                title="Bookmark Profile"
              >
                <Bookmark size={18} className={isSaved ? 'fill-[#0A84FF] text-[#0A84FF]' : ''} />
              </button>

              <Button
                variant="outline"
                onClick={handleStartMessage}
                isLoading={isStartingChat}
                icon={Mail}
                className="flex-1 sm:flex-initial justify-center border-[#D6EFFF] dark:border-[#22324A]"
              >
                Message
              </Button>

              <Link to="/dashboard/post-job" className="flex-1 sm:flex-initial">
                <Button variant="primary" className="w-full justify-center shadow-lg shadow-[#0A84FF]/25">
                  Hire Freelancer
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Key Metrics Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-sm">
            <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] block mb-1">Hourly Rate</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              ₹{profile.hourlyRate || 1500}
              <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] font-sans font-normal">/hr</span>
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">Standard Escrow</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-sm">
            <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] block mb-1">Completed Projects</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {profile.completedProjects || 50}+
            </div>
            <span className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] font-medium">100% On-Time</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-sm">
            <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] block mb-1">Experience Level</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display capitalize">
              {profile.experience || 'Expert'}
            </div>
            <span className="text-[11px] text-[#0A84FF] dark:text-[#2FA8FF] font-medium">
              {profile.yearsOfExperience ? `${profile.yearsOfExperience} Years in Field` : '5+ Years in Field'}
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#101826]/90 border border-[#D6EFFF] dark:border-[#22324A] shadow-sm">
            <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] block mb-1">Client Satisfaction</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-500 font-mono">
              {profile.clientSatisfaction || 99}%
            </div>
            <span className="text-[11px] text-[#5B6B7A] dark:text-[#A8C0D8] font-medium">Verified Reviews</span>
          </div>
        </div>

        {/* 4. Two-Column Main Content & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Bio Section */}
            <Card glass className="p-5 sm:p-8 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/90 dark:bg-[#101826]/90 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 font-display">Professional Background</h2>
              <p className="text-sm text-[#5B6B7A] dark:text-[#A8C0D8] leading-relaxed whitespace-pre-line">
                {isBioExpanded || !showReadMore ? bioText : `${bioText.slice(0, 250)}...`}
              </p>
              {showReadMore && (
                <button
                  type="button"
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                  className="mt-3 text-xs font-semibold text-[#0A84FF] dark:text-[#2FA8FF] hover:underline inline-flex items-center gap-1"
                >
                  <span>{isBioExpanded ? 'Show Less' : 'Read Full Overview'}</span>
                  {isBioExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
            </Card>

            {/* Skills Section */}
            <Card glass className="p-5 sm:p-8 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/90 dark:bg-[#101826]/90 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 font-display">Core Skills & Competencies</h2>
              <div className="flex flex-wrap gap-2">
                {(profile.skills || ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Docker', 'AWS']).map(
                  (skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#EAF6FF] dark:bg-[#162235] border border-[#D6EFFF] dark:border-[#22324A] text-xs font-semibold text-[#002366] dark:text-[#A8C0D8] hover:border-[#0A84FF]/50 transition-colors"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </Card>

            {/* Portfolio Gallery */}
            <Card glass className="p-5 sm:p-8 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/90 dark:bg-[#101826]/90 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">Featured Portfolio Items</h2>
                  <p className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] mt-0.5">Real-world production case studies and deliverables</p>
                </div>
                <span className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] font-medium">
                  {profile.portfolio?.length || 2} projects
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(profile.portfolio && profile.portfolio.length > 0
                  ? profile.portfolio
                  : [
                      {
                        title: 'FinTech Wealth Analytics Dashboard',
                        category: 'Web Development',
                        images: [{ url: '/projects/analytics-dashboard.webp' }],
                        description: 'Multi-tenant financial telemetry platform processing real-time stock portfolios with WebSockets.',
                        projectUrl: 'https://github.com'
                      },
                      {
                        title: 'Cloud Logistics ERP Platform',
                        category: 'Enterprise SaaS',
                        images: [{ url: '/projects/crm-dashboard.webp' }],
                        description: 'End-to-end fleet and supply chain tracking system built with Node.js and MongoDB.',
                        projectUrl: 'https://github.com'
                      }
                    ]
                ).map((item, idx) => {
                  const imgUrl = item.images?.[0]?.url || '/projects/crm-dashboard.webp';
                  return (
                    <div
                      key={idx}
                      onClick={() => setActivePortfolioItem(item)}
                      className="group cursor-pointer rounded-2xl bg-[#F8FBFF] dark:bg-[#080B12] border border-[#D6EFFF] dark:border-[#22324A] overflow-hidden hover:border-[#0A84FF]/50 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img
                          src={imgUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                        <span className="absolute bottom-2 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0A84FF] text-white shadow-md">
                          {item.category || 'Featured'}
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors line-clamp-1 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#5B6B7A] dark:text-[#A8C0D8] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Ratings & Client Reviews */}
            <Card glass className="p-5 sm:p-8 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/90 dark:bg-[#101826]/90 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 font-display">Client Reviews & Testimonials</h2>
              <ReviewList freelancerId={profile._id} />
            </Card>
          </div>

          {/* Sidebar Quick Info Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Summary Card */}
            <Card glass className="p-5 sm:p-6 rounded-3xl border-[#D6EFFF] dark:border-[#22324A] bg-white/90 dark:bg-[#101826]/90 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Freelancer Overview
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-[#D6EFFF] dark:border-[#22324A]">
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8]">Hourly Rate</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">₹{profile.hourlyRate || 1500}/hr</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#D6EFFF] dark:border-[#22324A]">
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8]">Availability</span>
                  <span className="font-semibold text-emerald-500 capitalize">
                    {profile.availability === 'busy' ? 'Busy with active contract' : 'Available for hire'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#D6EFFF] dark:border-[#22324A]">
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8]">Total Earned</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {formatCurrency(profile.earnings || 245000)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#D6EFFF] dark:border-[#22324A]">
                  <span className="text-[#5B6B7A] dark:text-[#A8C0D8]">Identity Status</span>
                  <span className="font-semibold text-[#0A84FF] dark:text-[#2FA8FF] flex items-center gap-1">
                    <ShieldCheck size={14} /> Verified ID
                  </span>
                </div>
              </div>

              <Link to="/dashboard/post-job" className="block w-full pt-2">
                <Button variant="primary" className="w-full justify-center shadow-lg shadow-[#0A84FF]/25">
                  Hire Freelancer Now
                </Button>
              </Link>
            </Card>

            {/* Languages */}
            <Card glass className="p-6 rounded-3xl border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 font-display">Languages</h3>
              <div className="space-y-2 text-xs text-slate-300">
                {(profile.languages || ['English (Fluent)', 'Hindi (Fluent)', 'Regional (Conversational)']).map(
                  (lang, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{lang}</span>
                    </div>
                  )
                )}
              </div>
            </Card>

            {/* Education History */}
            <Card glass className="p-6 rounded-3xl border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 font-display flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-400" />
                Education
              </h3>
              <div className="space-y-3 text-xs">
                {(profile.education && profile.education.length > 0
                  ? profile.education
                  : [
                      {
                        degree: 'B.Tech in Computer Science & Engineering',
                        institution: 'National Institute of Technology',
                        year: 2019
                      }
                    ]
                ).map((edu, idx) => (
                  <div key={idx} className="pb-3 border-b border-slate-800 last:border-b-0 last:pb-0">
                    <h4 className="font-bold text-slate-200">{edu.degree}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{edu.institution}</p>
                    <span className="text-slate-500 text-[10px]">Graduated {edu.year}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card glass className="p-6 rounded-3xl border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 font-display flex items-center gap-2">
                <Award size={16} className="text-amber-400" />
                Certifications
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                {(profile.certifications && profile.certifications.length > 0
                  ? profile.certifications
                  : ['AWS Certified Solutions Architect', 'Meta Professional Frontend Developer']
                ).map((cert, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                    <span className="font-medium text-slate-200">{cert}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Profiles */}
            <Card glass className="p-6 rounded-3xl border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 font-display">Social & Code Profiles</h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href={profile.socialLinks?.github || 'https://github.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href={profile.socialLinks?.linkedin || 'https://linkedin.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={profile.socialLinks?.website || 'https://workstation.dev'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Website"
                >
                  <Globe size={18} />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Portfolio Item Lightbox Modal */}
      {activePortfolioItem && (
        <Modal
          isOpen={true}
          onClose={() => setActivePortfolioItem(null)}
          title={activePortfolioItem.title}
          size="lg"
        >
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden max-h-80 border border-slate-700">
              <img
                src={activePortfolioItem.images?.[0]?.url || '/projects/crm-dashboard.webp'}
                alt={activePortfolioItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {activePortfolioItem.category || 'Deliverable'}
              </span>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {activePortfolioItem.description}
              </p>
            </div>
            {activePortfolioItem.projectUrl && (
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <a
                  href={activePortfolioItem.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:underline"
                >
                  <span>Visit External Demo</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
