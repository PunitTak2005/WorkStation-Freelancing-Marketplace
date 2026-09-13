import React from 'react';
import { UserCheck, Mail, Phone, MapPin, Briefcase, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import Input from '@/components/common/Input';
import { formatIndianPhoneNumber } from '@/utils/validationSchemas';

export default function AccountSettings({ data, onChange, errors = {}, touched = {}, onBlur, user }) {
  const handlePhoneChange = (e) => {
    const formatted = formatIndianPhoneNumber(e.target.value);
    onChange('phone', formatted);
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Account Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified communication details, geographic location, and organizational role.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800">
            <CheckCircle2 size={12} />
            Verified Email
          </span>
          {data.phone && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] border border-blue-200/70 dark:border-blue-800">
              <CheckCircle2 size={12} />
              Linked Phone
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Email */}
        <div>
          <Input
            label="Email Address"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => onBlur && onBlur('email')}
            placeholder="rajesh.kumar@workstation.com"
            icon={Mail}
            error={touched.email ? errors.email : undefined}
            success={touched.email && !errors.email && Boolean(data.email)}
            rightIcon={
              touched.email && (
                errors.email ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )
            }
            helperText="Primary email for two-step verifications and payout alerts."
            required
          />
        </div>

        {/* Phone */}
        <div>
          <Input
            label="Mobile Phone (India +91)"
            value={data.phone || ''}
            onChange={handlePhoneChange}
            onBlur={() => onBlur && onBlur('phone')}
            placeholder="+91 98765 43210"
            icon={Phone}
            error={touched.phone ? errors.phone : undefined}
            success={touched.phone && !errors.phone && Boolean(data.phone)}
            rightIcon={
              touched.phone && (
                errors.phone ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )
            }
            helperText="Auto-formatted 10-digit Indian mobile number."
            required
          />
        </div>

        {/* Location */}
        <div>
          <Input
            label="Location / City, Country"
            value={data.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            onBlur={() => onBlur && onBlur('location')}
            placeholder="Udaipur, Rajasthan, India"
            icon={MapPin}
            error={touched.location ? errors.location : undefined}
            success={touched.location && !errors.location && Boolean(data.location)}
            rightIcon={
              touched.location && (
                errors.location ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )
            }
            helperText="Enables client timezone matching and regional contracts."
            required
          />
        </div>

        {/* Job Title */}
        <div>
          <Input
            label="Professional Title"
            value={data.jobTitle || ''}
            onChange={(e) => onChange('jobTitle', e.target.value)}
            placeholder="Full-Stack Cloud Architect"
            icon={Briefcase}
            helperText="Highlighted in marketplace search listings and client proposals."
          />
        </div>

        {/* Company (Optional) */}
        <div className="md:col-span-2">
          <Input
            label="Company / Agency Name (Optional)"
            value={data.company || ''}
            onChange={(e) => onChange('company', e.target.value)}
            placeholder="Apex Systems & Solutions Pvt Ltd"
            icon={Building}
            helperText="If you operate as a registered studio, LLC, or agency."
          />
        </div>
      </div>
    </div>
  );
}
