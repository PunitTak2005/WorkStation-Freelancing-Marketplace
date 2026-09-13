import React, { useState } from 'react';
import { 
  Shield, KeyRound, Smartphone, Monitor, Laptop, 
  CheckCircle2, AlertCircle, Lock, LogOut, Check
} from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function SecuritySettings({ user, onUpdateUser, sessions = [], onTerminateSession, onSignOutAll }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Password Strength Calculation
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(newPassword);
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Very Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (strength < 4) {
      setPasswordError('Please meet all password strength requirements.');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError('');
      await api.put('/settings/security', { currentPassword, newPassword, confirmPassword });
      toast.success('Password updated successfully');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      const nextState = !user?.twoFactorEnabled;
      await onUpdateUser({ twoFactorEnabled: nextState });
      toast.success(`Two-Factor Authentication ${nextState ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Failed to toggle 2FA');
    }
  };

  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('phone') || device.toLowerCase().includes('mobile')) return Smartphone;
    if (device.toLowerCase().includes('macbook') || device.toLowerCase().includes('laptop')) return Laptop;
    return Monitor;
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Security Center
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Protect your earnings, authentication credentials, and active device logins.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800">
          <CheckCircle2 size={13} />
          System Protected
        </span>
      </div>

      {/* Row 1: Credentials & 2FA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Change Password Card */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/30 flex flex-col justify-between space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <KeyRound size={17} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Account Password</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Last changed 2 months ago. Use at least 8 characters with symbols.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full justify-center text-xs font-semibold"
          >
            Change Password
          </Button>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/30 flex flex-col justify-between space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-emerald-500 flex items-center justify-center shrink-0">
              <Shield size={17} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Two-Factor Auth</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user?.twoFactorEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Requires 6-digit OTP verification code upon signing in from unknown devices.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={user?.twoFactorEnabled ? "outline" : "primary"}
            onClick={handleToggle2FA}
            className="w-full justify-center text-xs font-semibold"
          >
            {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA Protection'}
          </Button>
        </div>
      </div>

      {/* Row 2: Active Sessions & Device Management */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Authorized Sessions</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Devices currently authenticated to your WorkStation profile.
            </p>
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={onSignOutAll}
            className="text-xs text-rose-500 hover:text-rose-600 border-slate-200 dark:border-slate-800 hover:border-rose-200"
          >
            <LogOut size={13} className="mr-1" />
            Sign Out All Devices
          </Button>
        </div>

        <div className="space-y-2.5">
          {sessions.map((sess) => {
            const Icon = getDeviceIcon(sess.device);
            return (
              <div
                key={sess.sessionId}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {sess.device} • {sess.browser}
                      </p>
                      {sess.current && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0A84FF] dark:bg-blue-950/60 dark:text-blue-400">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {sess.location} • IP {sess.ip} • {sess.os}
                    </p>
                  </div>
                </div>

                {!sess.current && (
                  <button
                    onClick={() => onTerminateSession(sess.sessionId)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline shrink-0 px-2 py-1"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Change Account Password" size="md">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <Input
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <Input
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {strengthLabels[Math.max(0, strength - 1)] || 'Too Weak'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 h-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${i < strength ? strengthColors[strength - 1] : 'bg-slate-200 dark:bg-slate-700'}`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span className={newPassword.length >= 8 ? 'text-emerald-500 font-medium' : ''}>• 8+ characters</span>
                <span className={/[A-Z]/.test(newPassword) ? 'text-emerald-500 font-medium' : ''}>• 1 uppercase letter</span>
                <span className={/[0-9]/.test(newPassword) ? 'text-emerald-500 font-medium' : ''}>• 1 number</span>
                <span className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-500 font-medium' : ''}>• 1 special symbol</span>
              </div>
            </div>
          )}

          <Input
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={passwordLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
