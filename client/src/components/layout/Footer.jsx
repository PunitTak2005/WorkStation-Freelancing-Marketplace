import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Github, Twitter, Linkedin, Instagram, Mail, Phone, MapPin,
  Send, ShieldCheck, CheckCircle2, ArrowRight, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import BrandLogo from '../common/BrandLogo';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      toast.success('Subscribed! You will receive weekly project digests.');
      setNewsletterEmail('');
    }, 600);
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Projects', path: '/projects' },
    { name: 'Freelancers', path: '/freelancers' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Contact', path: '/contact' },
  ];

  const resourceLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Help Center', path: '/help' },
    { name: 'FAQ', path: '/faq' },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com',
      hoverColor: 'hover:text-white hover:border-slate-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com',
      hoverColor: 'hover:text-[#0A84FF] hover:border-[#0A84FF]/60',
    },
    {
      name: 'X',
      icon: Twitter,
      url: 'https://x.com',
      hoverColor: 'hover:text-[#2FA8FF] hover:border-[#2FA8FF]/60',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      hoverColor: 'hover:text-pink-400 hover:border-pink-500/60',
    },
  ];

  return (
    <footer className="relative bg-[#080B12] text-[#A8C0D8] text-sm overflow-hidden z-10 transition-colors duration-300">
      {/* 9. Top Glowing 2px Gradient Line */}
      <div
        className="w-full h-[2px] bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] shadow-[0_0_12px_rgba(10,132,255,0.6)] relative z-20"
      />

      {/* 8. Decorative Background Blueprint Grid & Glows (<8% opacity) */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.04] pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 rounded-full bg-[#0A84FF]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-10 w-96 h-96 rounded-full bg-[#002366]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full border border-[#0A84FF]/5 pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full border border-[#2FA8FF]/5 pointer-events-none" />

      {/* Subtle Glowing Pulse Dots */}
      <span className="absolute top-20 left-1/4 w-1.5 h-1.5 rounded-full bg-[#0A84FF]/30 animate-pulse pointer-events-none" />
      <span className="absolute bottom-24 right-1/3 w-1.5 h-1.5 rounded-full bg-[#2FA8FF]/30 animate-pulse pointer-events-none" />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl py-16 relative z-10">
        {/* 1. 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#22324A]/80">
          
          {/* Column 1: Brand Section (NO "WorkStation" text, ONLY logo in white container) */}
          <div className="md:col-span-1 lg:col-span-4 space-y-5">
            {/* White Rounded Container Behind Logo - NO Text Beside Logo */}
            <Link
              to="/"
              className="inline-block focus:outline-none group"
              aria-label="WorkStation Home"
            >
              <BrandLogo size="md" showText={false} />
            </Link>

            {/* Tagline Underneath */}
            <p className="text-sm text-[#A8C0D8]/80 leading-relaxed max-w-sm">
              Connect clients with talented freelancers through a modern, secure collaborative workspace.
            </p>

            {/* 2. Verified Escrow Pill Badge */}
            <div className="p-3.5 rounded-2xl bg-[#101826]/90 border border-[#22324A] shadow-md backdrop-blur-md flex items-start gap-3 max-w-sm group hover:border-[#0A84FF]/30 transition-colors">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white font-display">Verified Escrow</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-[#A8C0D8]/70 leading-normal mt-0.5">
                  Secure milestone payments and protected collaboration.
                </p>
              </div>
            </div>

            {/* 6. Social Media Circular Buttons */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3 font-display">
                Follow Us
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`WorkStation on ${social.name}`}
                      className={`w-11 h-11 rounded-full bg-[#101826] border border-[#22324A] text-slate-400 flex items-center justify-center transition-all duration-250 hover:bg-[#0A84FF]/10 hover:border-[#0A84FF] hover:shadow-[0_0_15px_rgba(10,132,255,0.35)] hover:-translate-y-0.5 ${social.hoverColor}`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-1 lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase font-display flex items-center gap-2">
              <span>Quick Links</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group relative inline-flex items-center text-sm text-[#A8C0D8] hover:text-white transition-colors duration-200 py-1 min-h-[32px]"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1.5">
                      {link.name}
                    </span>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0A84FF] to-[#2FA8FF] transition-all duration-200 group-hover:w-full rounded-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="md:col-span-1 lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase font-display flex items-center gap-2">
              <span>Resources</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2FA8FF]" />
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group relative inline-flex items-center text-sm text-[#A8C0D8] hover:text-[#2FA8FF] transition-colors duration-200 py-1 min-h-[32px]"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1.5">
                      {link.name}
                    </span>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0A84FF] to-[#2FA8FF] transition-all duration-200 group-hover:w-full rounded-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Floating Contact Card & Newsletter */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4">
            {/* 5. Floating Contact Card */}
            <div className="p-4 rounded-2xl bg-[#101826]/90 border border-[#22324A] shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-[#0A84FF]/40 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <span>Direct Contact</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <a
                  href="mailto:punittak2005@gmail.com"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#080B12] text-[#A8C0D8] hover:text-white transition-all group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF] group-hover/item:scale-110 transition-transform">
                    <Mail size={15} />
                  </div>
                  <span className="truncate font-medium">punittak2005@gmail.com</span>
                </a>

                <a
                  href="tel:+916367088841"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#080B12] text-[#A8C0D8] hover:text-white transition-all group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform">
                    <Phone size={15} />
                  </div>
                  <span className="font-mono font-medium">+91 6367088841</span>
                </a>

                <div className="flex items-start gap-3 p-2 rounded-xl text-[#A8C0D8]">
                  <div className="w-8 h-8 rounded-lg bg-[#2FA8FF]/10 border border-[#2FA8FF]/20 flex items-center justify-center text-[#2FA8FF] flex-shrink-0 mt-0.5">
                    <MapPin size={15} />
                  </div>
                  <span className="font-medium text-[11px] leading-tight">184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India</span>
                </div>
              </div>
            </div>

            {/* 7. Newsletter Redesign Card */}
            <div className="p-4 rounded-2xl bg-[#101826]/90 border border-[#22324A] shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-[#0A84FF]/40 transition-all duration-200">
              <div className="space-y-1 mb-3">
                <span className="text-xs font-bold text-white block font-display">
                  Stay Updated
                </span>
                <p className="text-[11px] text-[#A8C0D8]/70">
                  Get weekly freelance opportunities and engineering insights.
                </p>
              </div>

              {isSubscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  <span>Subscribed! You will receive weekly project digests.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your work email"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080B12] border border-[#22324A] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF]/30 transition-all min-h-[38px]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] hover:from-[#001c52] hover:via-[#0977e6] hover:to-[#2896e6] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#0A84FF]/25 hover:shadow-[#0A84FF]/40 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group/btn min-h-[38px] disabled:opacity-60"
                  >
                    {/* Shine effect */}
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                    <span>{isSubscribing ? 'Subscribing...' : 'Subscribe'}</span>
                    <Send size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* 10. Bottom Bar Redesign */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center md:text-left">
          <p className="flex items-center flex-wrap justify-center md:justify-start gap-1.5">
            <span>© {new Date().getFullYear()} WorkStation.</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span>Made with MERN Stack</span>
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/privacy" className="hover:text-white transition-colors py-1">Privacy</Link>
            <span className="text-slate-600">•</span>
            <Link to="/terms" className="hover:text-white transition-colors py-1">Terms</Link>
            <span className="text-slate-600">•</span>
            <Link to="/contact" className="hover:text-white transition-colors py-1">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
