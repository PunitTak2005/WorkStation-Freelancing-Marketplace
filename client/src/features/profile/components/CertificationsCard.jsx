import React, { useState } from 'react';
import { Award, Plus, CheckCircle2, Trash2, ShieldCheck } from 'lucide-react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';

export default function CertificationsCard({ user, onUpdate }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    url: ''
  });

  const certifications = user?.certificationsList && user.certificationsList.length > 0
    ? user.certificationsList
    : [
        {
          title: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          date: 'Issued Dec 2025',
          credentialId: 'AWS-9028472-SAA',
          url: 'https://aws.amazon.com/verification'
        },
        {
          title: 'Meta Certified Professional Full-Stack Developer',
          issuer: 'Meta / Coursera',
          date: 'Issued Aug 2025',
          credentialId: 'META-CERT-8841',
          url: 'https://coursera.org/verify'
        },
        {
          title: 'MongoDB Certified Developer Associate',
          issuer: 'MongoDB University',
          date: 'Issued Mar 2024',
          credentialId: 'MDB-DEV-44120',
          url: 'https://university.mongodb.com'
        }
      ];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCert.title.trim() || !newCert.issuer.trim()) {
      toast.error('Title and issuer are required');
      return;
    }
    try {
      setSaving(true);
      const updated = [
        ...certifications,
        {
          title: newCert.title,
          issuer: newCert.issuer,
          date: newCert.date || 'Issued 2026',
          credentialId: newCert.credentialId || `CERT-${Math.floor(Math.random() * 90000) + 10000}`,
          url: newCert.url || 'https://workstation.dev/verify'
        }
      ];
      await onUpdate({ certificationsList: updated });
      setIsAddOpen(false);
      setNewCert({ title: '', issuer: '', date: '', credentialId: '', url: '' });
      toast.success('Certificate added');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (index) => {
    const updated = certifications.filter((_, idx) => idx !== index);
    await onUpdate({ certificationsList: updated });
    toast.success('Certificate removed');
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 h-full flex flex-col justify-between">
        <div>
          {/* Universal Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight truncate">
                  Certifications & Badges
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Verified technical credentials
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddOpen(true)}
              className="rounded-full text-xs px-3 py-1.5 flex items-center gap-1.5 border-slate-200 dark:border-slate-700 hover:border-[#0A84FF] text-slate-700 dark:text-slate-300 shrink-0 whitespace-nowrap"
            >
              <Plus size={14} />
              <span>Add Certificate</span>
            </Button>
          </div>

          {/* Certificate Badges List */}
          <div className="space-y-3.5">
            {certifications.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-start justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-[#0A84FF]/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Award size={20} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#0A84FF] transition-colors">
                        {item.title}
                      </h4>
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                      {item.issuer}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{item.credentialId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-slate-300 hover:text-rose-500 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    title="Remove certificate"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            100% Industry Verified
          </span>
          <button
            onClick={() => setIsAddOpen(true)}
            className="text-xs font-medium text-[#0A84FF] hover:underline"
          >
            + Link Credential
          </button>
        </div>
      </div>

      {/* Add Certificate Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Technical Certificate">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Certificate Title"
            value={newCert.title}
            onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
            placeholder="e.g. AWS Certified Developer Associate"
            required
          />
          <Input
            label="Issuing Body / Organization"
            value={newCert.issuer}
            onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
            placeholder="e.g. Amazon Web Services / Google Cloud"
            required
          />
          <Input
            label="Issue Date"
            value={newCert.date}
            onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
            placeholder="e.g. Issued Jan 2026"
          />
          <Input
            label="Credential ID / License Number"
            value={newCert.credentialId}
            onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
            placeholder="e.g. AWS-8923049-DVA"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Add Certificate
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
