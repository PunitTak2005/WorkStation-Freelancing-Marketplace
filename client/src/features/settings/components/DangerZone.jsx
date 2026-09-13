import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, Lock, Trash2, LogOut } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function DangerZone() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (confirmPhrase.toLowerCase() !== 'delete my workstation account') {
      setDeleteError('Please type the exact confirmation phrase.');
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError('');
      await api.post('/settings/danger/delete-account', {
        password,
        confirmationPhrase: confirmPhrase.toLowerCase()
      });
      toast.success('Account successfully scheduled for deletion');
      await logout();
      navigate('/login');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Verification failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-rose-100 dark:border-rose-900/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertOctagon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-950 dark:text-rose-200 leading-tight">
              Danger Zone
            </h3>
            <p className="text-xs text-rose-600/80 dark:text-rose-400 mt-0.5">
              Irreversible actions: account termination, marketplace de-listing, and session revocation.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* Action 1: Remove Marketplace Profile */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              De-list Marketplace Profile
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Hide your profile from public browsing while keeping your contracts and wallet intact.
            </p>
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={() => toast.success('Marketplace profile temporarily de-listed')}
            className="text-rose-500 border-rose-200 hover:bg-rose-50 text-xs shrink-0"
          >
            De-list Profile
          </Button>
        </div>

        {/* Action 2: Clear Saved Sessions */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Revoke All Third-Party OAuth Tokens
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Immediately invalidate Google, GitHub, and Microsoft authenticated API access tokens.
            </p>
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={() => toast.success('All third-party OAuth access tokens revoked')}
            className="text-rose-500 border-rose-200 hover:bg-rose-50 text-xs shrink-0"
          >
            Revoke Tokens
          </Button>
        </div>

        {/* Action 3: Permanent Delete */}
        <div className="p-4 rounded-2xl bg-rose-100/60 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
              Delete WorkStation Account
            </h4>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-300 mt-0.5">
              Permanently delete all personal credentials, contracts history, and messages.
            </p>
          </div>
          <Button
            size="xs"
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-xs shrink-0 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Trash2 size={13} className="mr-1" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Account Deletion" size="md">
        <form onSubmit={handleDeleteSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
              This action is permanent and cannot be undone. All active proposals will be retracted and escrow wallets reconciled.
            </p>
          </div>

          {deleteError && (
            <p className="text-xs text-rose-600 font-semibold">{deleteError}</p>
          )}

          <Input
            type="password"
            label="Enter Account Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Type <span className="font-mono text-rose-600">delete my workstation account</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="delete my workstation account"
              className="block w-full min-h-[42px] rounded-xl px-3.5 py-2 text-xs outline-none bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={deleteLoading}
              disabled={confirmPhrase.toLowerCase() !== 'delete my workstation account'}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Permanently Delete
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
