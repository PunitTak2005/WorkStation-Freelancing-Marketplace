import React, { useState } from 'react';
import { Download, FileJson, FileText, CheckCircle2, Loader2, Archive } from 'lucide-react';
import Button from '@/components/common/Button';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function DataExport() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTriggerExport = async (type) => {
    try {
      setExporting(true);
      setProgress(25);
      
      const res = await api.post('/settings/export', { type });
      setProgress(75);

      const blob = new Blob([JSON.stringify(res.data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workstation_export_${type}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      toast.success('Data archive exported successfully!');
    } catch {
      toast.error('Failed to compile data export.');
    } finally {
      setTimeout(() => {
        setExporting(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Download size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Export Your Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Take your verified proposals, invoice receipts, and marketplace portfolio with you.
            </p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { id: 'profile', label: 'Download Profile', desc: 'JSON snapshot of bio & skills', icon: FileJson },
          { id: 'messages', label: 'Export Messages', desc: 'Chat transcript history', icon: FileText },
          { id: 'invoices', label: 'Export Invoices', desc: 'PDF and tax payment records', icon: FileText },
          { id: 'projects', label: 'Export Projects', desc: 'Contracts & milestones summary', icon: Archive }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className="text-[#0A84FF]" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.label}</h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleTriggerExport(item.id)}
                disabled={exporting}
                className="w-full justify-center text-xs"
              >
                Export
              </Button>
            </div>
          );
        })}
      </div>

      {/* Complete Data Export Request */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Request Complete WorkStation Archive
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generates a password-protected zip file containing your complete marketplace activity.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => handleTriggerExport('full')}
          loading={exporting}
          className="shrink-0 text-xs font-semibold"
        >
          Request Complete Archive
        </Button>
      </div>

      {exporting && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Compiling encrypted archive...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-[#0A84FF] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
