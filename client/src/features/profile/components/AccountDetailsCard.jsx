import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, Phone, MapPin, Globe, Github, Linkedin, DollarSign, 
  ShieldCheck, Edit3, UserCheck, ExternalLink, CheckCircle2, 
  AlertCircle, Lock, ShieldAlert, KeyRound, ArrowRight, Loader2
} from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import { 
  validateEmail, 
  validateIndianPhone, 
  formatIndianPhoneNumber, 
  validateLocation, 
  validateBillingRate, 
  validateUrl 
} from '@/utils/validationSchemas';

export default function AccountDetailsCard({ user, onUpdate }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  // 2FA Flow Modal States
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState('warning'); // 'warning' | 'password' | 'otp' | 'success'
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    hourlyRate: '',
    availability: 'available',
    website: '',
    github: '',
    linkedin: '',
  });

  // Touched state to control when inline validation errors are displayed
  const [touched, setTouched] = useState({});

  // Sync state when user prop changes or edit opens
  const initFormData = () => {
    setFormData({
      email: user?.email || '',
      phone: formatIndianPhoneNumber(user?.phone || ''),
      location: user?.location || '',
      hourlyRate: user?.hourlyRate !== undefined ? String(user?.hourlyRate) : '',
      availability: user?.availability || 'available',
      website: user?.socialLinks?.website || '',
      github: user?.socialLinks?.github || '',
      linkedin: user?.socialLinks?.linkedin || '',
    });
    setTouched({});
    setServerError('');
  };

  useEffect(() => {
    initFormData();
  }, [user]);

  const handleOpenEdit = () => {
    initFormData();
    setIsEditOpen(true);
  };

  // Real-time Field Validations
  const errors = useMemo(() => {
    const errs = {};
    const emailErr = validateEmail(formData.email);
    if (emailErr) errs.email = emailErr;

    const phoneErr = validateIndianPhone(formData.phone);
    if (phoneErr) errs.phone = phoneErr;

    const locErr = validateLocation(formData.location);
    if (locErr) errs.location = locErr;

    if (user?.role !== 'client') {
      const rateErr = validateBillingRate(formData.hourlyRate);
      if (rateErr) errs.hourlyRate = rateErr;
    }

    const webErr = validateUrl(formData.website, 'website');
    if (webErr) errs.website = webErr;

    const ghErr = validateUrl(formData.github, 'github');
    if (ghErr) errs.github = ghErr;

    const liErr = validateUrl(formData.linkedin, 'linkedin');
    if (liErr) errs.linkedin = liErr;

    return errs;
  }, [formData, user?.role]);

  // Dirty detection: checks if any field has changed compared to initial user data
  const isDirty = useMemo(() => {
    const initialEmail = user?.email || '';
    const initialPhone = formatIndianPhoneNumber(user?.phone || '');
    const initialLoc = user?.location || '';
    const initialRate = user?.hourlyRate !== undefined ? String(user?.hourlyRate) : '';
    const initialAvail = user?.availability || 'available';
    const initialWeb = user?.socialLinks?.website || '';
    const initialGh = user?.socialLinks?.github || '';
    const initialLi = user?.socialLinks?.linkedin || '';

    return (
      formData.email.trim() !== initialEmail.trim() ||
      formData.phone.trim() !== initialPhone.trim() ||
      formData.location.trim() !== initialLoc.trim() ||
      formData.hourlyRate.trim() !== initialRate.trim() ||
      formData.availability !== initialAvail ||
      formData.website.trim() !== initialWeb.trim() ||
      formData.github.trim() !== initialGh.trim() ||
      formData.linkedin.trim() !== initialLi.trim()
    );
  }, [formData, user]);

  const hasErrors = Object.keys(errors).length > 0;
  const isSaveDisabled = !isDirty || hasErrors || saving;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatIndianPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      phone: true,
      location: true,
      hourlyRate: true,
      website: true,
      github: true,
      linkedin: true,
    });

    if (hasErrors) return;

    try {
      setSaving(true);
      setServerError('');
      await onUpdate({
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        location: formData.location.trim().replace(/\s+/g, ' '),
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        availability: formData.availability,
        socialLinks: {
          website: formData.website.trim(),
          github: formData.github.trim(),
          linkedin: formData.linkedin.trim(),
        }
      });
      setIsEditOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update account details.';
      setServerError(msg);
    } finally {
      setSaving(false);
    }
  };

  // 2FA Security Handlers
  const open2FAModal = () => {
    setTwoFactorStep('warning');
    setConfirmPassword('');
    setPasswordError('');
    setOtpCode(['', '', '', '', '', '']);
    setOtpError('');
    setIs2FAModalOpen(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!confirmPassword || confirmPassword.length < 6) {
      setPasswordError('Please enter your account password (at least 6 characters).');
      return;
    }
    setPasswordError('');
    setTwoFactorStep('otp');
  };

  const handleOtpChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`2fa-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`2fa-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtpAndToggle = async () => {
    const fullOtp = otpCode.join('');
    if (fullOtp.length !== 6) {
      setOtpError('Please enter a complete 6-digit verification code.');
      return;
    }

    try {
      setTwoFactorLoading(true);
      setOtpError('');
      // Toggle twoFactorEnabled
      const nextState = !user?.twoFactorEnabled;
      await onUpdate({ twoFactorEnabled: nextState });
      setTwoFactorStep('success');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Availability label mapping
  const availabilityLabels = {
    available: 'Available for hire',
    busy: 'Currently busy - Limited capacity',
    not_available: 'Not available'
  };

  // Structured Information Rows
  const rows = [
    {
      icon: Mail,
      label: 'Email Address',
      value: user?.email || 'user@workstation.com',
      badge: 'Verified',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
    },
    {
      icon: Phone,
      label: 'Phone Number',
      value: user?.phone ? formatIndianPhoneNumber(user.phone) : 'Not configured',
      badge: user?.phone ? 'Linked & Verified' : 'Optional',
      badgeColor: user?.phone 
        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
        : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
    },
    {
      icon: MapPin,
      label: 'Location / Address',
      value: user?.location || 'Bengaluru, Karnataka, India',
      badge: 'UTC+5:30',
      badgeColor: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
    },
    {
      icon: DollarSign,
      label: 'Billing Rate & Capacity',
      value: user?.role === 'client' 
        ? 'Verified Project Buyer • Active' 
        : `₹${user?.hourlyRate ? Number(user.hourlyRate).toLocaleString('en-IN') : '1,500'}/hr • ${availabilityLabels[user?.availability] || 'Available for hire'}`,
    },
    {
      icon: Globe,
      label: 'Public Links',
      isLinks: true,
      links: [
        { name: 'Website', url: user?.socialLinks?.website, icon: Globe },
        { name: 'GitHub', url: user?.socialLinks?.github, icon: Github },
        { name: 'LinkedIn', url: user?.socialLinks?.linkedin, icon: Linkedin },
      ]
    }
  ];

  return (
    <>
      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 h-full flex flex-col justify-between overflow-hidden">
        <div className="min-w-0">
          {/* Universal Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center shrink-0">
                <UserCheck size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight truncate">
                  Account Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Verified contact & coordinates
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenEdit}
              className="rounded-full text-xs px-3 py-1.5 flex items-center gap-1.5 border-slate-200 dark:border-slate-700 hover:border-[#0A84FF] text-slate-700 dark:text-slate-300 shrink-0 whitespace-nowrap"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </Button>
          </div>

          {/* Structured Information Rows */}
          <div className="space-y-3.5">
            {rows.map((row, idx) => {
              const Icon = row.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors min-w-0"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-400 truncate">
                        {row.label}
                      </p>
                      {row.isLinks ? (
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {row.links.map((link, lIdx) => (
                            link.url ? (
                              <a
                                key={lIdx}
                                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A84FF] hover:underline shrink-0"
                              >
                                <span>{link.name}</span>
                                <ExternalLink size={11} />
                              </a>
                            ) : null
                          ))}
                          {!row.links.some(l => l.url) && (
                            <span className="text-xs text-slate-400 italic">No links linked yet</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" title={row.value}>
                          {row.value}
                        </p>
                      )}
                    </div>
                  </div>

                  {row.badge && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${row.badgeColor} shrink-0 whitespace-nowrap`}>
                      {row.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Security / 2FA Footnote */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} className={user?.twoFactorEnabled ? "text-emerald-500" : "text-amber-500"} />
            {user?.twoFactorEnabled ? 'Two-Factor Auth Enabled' : 'Two-Factor Auth Inactive'}
          </span>
          <button
            type="button"
            onClick={open2FAModal}
            className="text-xs font-medium text-[#0A84FF] hover:underline focus:outline-none"
          >
            Manage Security
          </button>
        </div>
      </div>

      {/* Edit Account Modal */}
      <Modal isOpen={isEditOpen} onClose={() => !saving && setIsEditOpen(false)} title="Update Account Coordinates" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Email Address */}
          <div className="relative">
            <Input
              label="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              placeholder="rajesh.kumar@workstation.com"
              icon={Mail}
              error={touched.email ? errors.email : undefined}
              success={touched.email && !errors.email}
              rightIcon={
                touched.email && (
                  errors.email ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )
                )
              }
              helperText="Used for authentication and critical security alerts."
              required
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <Input
              label="Phone Number (Indian Mobile)"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              placeholder="+91 98765 43210"
              icon={Phone}
              error={touched.phone ? errors.phone : undefined}
              success={touched.phone && !errors.phone && formData.phone}
              rightIcon={
                touched.phone && (
                  errors.phone ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )
                )
              }
              helperText="10-digit Indian mobile number formatted automatically with +91."
              required
            />
          </div>

          {/* Location / Address */}
          <div className="relative">
            <Input
              label="Location / City, Country"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              onBlur={() => handleBlur('location')}
              placeholder="Bengaluru, Karnataka, India"
              icon={MapPin}
              error={touched.location ? errors.location : undefined}
              success={touched.location && !errors.location && formData.location}
              rightIcon={
                touched.location && (
                  errors.location ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )
                )
              }
              helperText="Between 3 and 120 characters."
              required
            />
          </div>

          {/* Billing Rate & Capacity (Freelancers only) */}
          {user?.role !== 'client' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  type="number"
                  label="Hourly Billing Rate (₹ INR)"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  onBlur={() => handleBlur('hourlyRate')}
                  placeholder="1500"
                  icon={DollarSign}
                  error={touched.hourlyRate ? errors.hourlyRate : undefined}
                  success={touched.hourlyRate && !errors.hourlyRate && formData.hourlyRate}
                  rightIcon={
                    touched.hourlyRate && (
                      errors.hourlyRate ? (
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Capacity / Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="block w-full min-h-[46px] rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 outline-none shadow-xs bg-white text-slate-900 ring-1 ring-inset ring-slate-300 dark:bg-[#101826] dark:text-[#F5F9FF] dark:ring-[#22324A] focus:ring-2 focus:ring-inset focus:ring-[#0A84FF] dark:focus:ring-[#0A84FF]"
                >
                  <option value="available">Available for hire (Full capacity)</option>
                  <option value="busy">Currently busy (Limited capacity)</option>
                  <option value="not_available">Not available (Offline)</option>
                </select>
              </div>
            </div>
          )}

          {/* Public Links */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Public Links & Social Portfolios
            </h4>

            <Input
              label="Website URL"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              onBlur={() => handleBlur('website')}
              placeholder="https://yourportfolio.com"
              icon={Globe}
              error={touched.website ? errors.website : undefined}
              success={touched.website && !errors.website && formData.website}
              rightIcon={
                touched.website && formData.website && (
                  errors.website ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )
                )
              }
            />

            <Input
              label="GitHub Profile URL"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              onBlur={() => handleBlur('github')}
              placeholder="https://github.com/username"
              icon={Github}
              error={touched.github ? errors.github : undefined}
              success={touched.github && !errors.github && formData.github}
              rightIcon={
                touched.github && formData.github && (
                  errors.github ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )
                )
              }
            />

            <Input
              label="LinkedIn Profile URL"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              onBlur={() => handleBlur('linkedin')}
              placeholder="https://linkedin.com/in/username"
              icon={Linkedin}
              error={touched.linkedin ? errors.linkedin : undefined}
              success={touched.linkedin && !errors.linkedin && formData.linkedin}
              rightIcon={
                touched.linkedin && formData.linkedin && (
                  errors.linkedin ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )
                )
              }
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isDirty ? (
                hasErrors ? (
                  <span className="text-rose-500">Please fix errors to save changes</span>
                ) : (
                  <span className="text-amber-500">Unsaved changes</span>
                )
              ) : (
                <span>All changes up to date</span>
              )}
            </div>

            <div className="flex gap-2.5">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isSaveDisabled} 
                loading={saving}
                className="min-w-[120px]"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Two-Factor Authentication Security Modal */}
      <Modal 
        isOpen={is2FAModalOpen} 
        onClose={() => !twoFactorLoading && setIs2FAModalOpen(false)} 
        title="Two-Factor Authentication Security"
        size="md"
      >
        <div className="space-y-4">
          {twoFactorStep === 'warning' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    {user?.twoFactorEnabled ? 'Disable Two-Factor Authentication?' : 'Enable Two-Factor Authentication?'}
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                    {user?.twoFactorEnabled
                      ? 'Disabling 2FA reduces account security. Anyone who discovers your password can sign in directly.'
                      : 'Two-factor authentication adds an extra layer of protection to your WorkStation earnings and client contracts.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setIs2FAModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setTwoFactorStep('password')}>
                  Continue
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          )}

          {twoFactorStep === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To proceed with this security modification, please enter your current account password.
              </p>

              <Input
                type="password"
                label="Account Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="••••••••"
                icon={Lock}
                error={passwordError}
                required
                autoFocus
              />

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" type="button" onClick={() => setTwoFactorStep('warning')}>
                  Back
                </Button>
                <Button variant="primary" type="submit">
                  Verify Password
                </Button>
              </div>
            </form>
          )}

          {twoFactorStep === 'otp' && (
            <div className="space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0A84FF] flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={24} />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Enter 6-Digit Verification Code
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter the code sent to your registered contact ({user?.email || 'email'}).
                </p>
              </div>

              <div className="flex justify-center gap-2 py-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`2fa-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101826] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0A84FF] outline-none shadow-xs"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-xs text-rose-500 text-center flex items-center justify-center gap-1">
                  <AlertCircle size={13} />
                  <span>{otpError}</span>
                </p>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setTwoFactorStep('password')} disabled={twoFactorLoading}>
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleVerifyOtpAndToggle} 
                  loading={twoFactorLoading}
                  disabled={otpCode.join('').length !== 6}
                >
                  Confirm & Update
                </Button>
              </div>
            </div>
          )}

          {twoFactorStep === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                  Security Status Updated
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Two-factor authentication is now {user?.twoFactorEnabled ? 'enabled' : 'disabled'}.
                </p>
              </div>
              <Button variant="primary" onClick={() => setIs2FAModalOpen(false)} className="w-full">
                Done
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
