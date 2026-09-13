import React from 'react';
import { CreditCard, Download, Plus, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

export default function BillingSettings({ data, onChange }) {
  const paymentMethods = data.paymentMethods || [
    { id: 'pm_1', brand: 'Visa', last4: '4242', expMonth: '08', expYear: '28', isDefault: true }
  ];

  const handleDownloadInvoice = (invoiceNum) => {
    toast.success(`Downloading invoice ${invoiceNum}...`);
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Billing & Payments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage subscription tier, saved payout cards, and tax invoices.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800">
          <CheckCircle2 size={13} />
          {data.currentPlan || 'Pro Freelancer'}
        </span>
      </div>

      {/* Active Plan Overview */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data.currentPlan || 'Pro Freelancer'}</span>
            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-[#0A84FF] text-white">Active</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            ₹1,999 / billed {data.billingCycle || 'monthly'} • Next invoice due on Oct 12, 2026
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="xs" variant="outline" onClick={() => toast.success('Plan management opened')}>
            Change Tier
          </Button>
          <Button size="xs" variant="primary" onClick={() => toast.success('Switching to annual billing saves 20%!')}>
            Switch to Annual
          </Button>
        </div>
      </div>

      {/* Saved Payment Methods */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Payment & Payout Methods
          </h4>
          <Button size="xs" variant="outline" onClick={() => toast.success('Add card modal triggered')}>
            <Plus size={13} className="mr-1" />
            Add Card
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 text-blue-600 font-extrabold text-[11px] flex items-center justify-center">
                  {pm.brand}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {pm.brand} ending in {pm.last4}
                  </p>
                  <p className="text-[11px] text-slate-500">Expires {pm.expMonth}/{pm.expYear}</p>
                </div>
              </div>
              {pm.isDefault ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  Default
                </span>
              ) : (
                <button
                  onClick={() => toast.success('Removed card')}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Invoice History */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Recent Invoices
        </h4>
        <div className="space-y-2">
          {[
            { num: 'WS-INV-2026-08', date: 'Aug 12, 2026', amount: '₹1,999.00', status: 'Paid' },
            { num: 'WS-INV-2026-07', date: 'Jul 12, 2026', amount: '₹1,999.00', status: 'Paid' }
          ].map((inv) => (
            <div
              key={inv.num}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{inv.num}</p>
                  <p className="text-[11px] text-slate-500">{inv.date} • {inv.amount}</p>
                </div>
              </div>
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleDownloadInvoice(inv.num)}
                className="text-xs"
              >
                <Download size={13} className="mr-1" />
                PDF
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
