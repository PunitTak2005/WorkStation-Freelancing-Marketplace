import React from 'react';
import { Check, X } from 'lucide-react';

export default function PasswordStrengthIndicator({ password = '' }) {
  if (!password) return null;

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
    { label: 'Contains special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter(c => c.met).length;

  const getStrengthMeta = () => {
    if (score <= 1) return { text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-400', width: '25%' };
    if (score === 2) return { text: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-400', width: '50%' };
    if (score === 3) return { text: 'Good', color: 'bg-indigo-500', textColor: 'text-indigo-400', width: '75%' };
    return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400', width: '100%' };
  };

  const { text, color, textColor, width } = getStrengthMeta();

  return (
    <div className="mt-2 space-y-2 text-xs">
      <div className="flex justify-between items-center text-[11px]">
        <span className="text-slate-400">Password strength:</span>
        <span className={`font-semibold ${textColor}`}>{text}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width }}
        />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            {check.met ? (
              <Check size={12} className="text-emerald-400 flex-shrink-0" />
            ) : (
              <X size={12} className="text-slate-500 flex-shrink-0" />
            )}
            <span className={check.met ? 'text-slate-300' : 'text-slate-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
