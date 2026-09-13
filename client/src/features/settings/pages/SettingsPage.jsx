import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { 
  Settings as SettingsIcon, Save, RotateCcw, 
  AlertCircle, CheckCircle2, Sparkles, Loader2 
} from 'lucide-react';
import Button from '@/components/common/Button';
import SettingsSidebar from '../components/SettingsSidebar';
import GeneralSettings from '../components/GeneralSettings';
import AccountSettings from '../components/AccountSettings';
import SecuritySettings from '../components/SecuritySettings';
import NotificationSettings from '../components/NotificationSettings';
import AppearanceSettings from '../components/AppearanceSettings';
import PrivacySettings from '../components/PrivacySettings';
import BillingSettings from '../components/BillingSettings';
import ConnectedAccounts from '../components/ConnectedAccounts';
import DataExport from '../components/DataExport';
import DangerZone from '../components/DangerZone';
import { 
  validateEmail, 
  validateIndianPhone, 
  validateLocation, 
  formatIndianPhoneNumber 
} from '@/utils/validationSchemas';

export default function SettingsPage() {
  const { user, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initial & Working State
  const [initialData, setInitialData] = useState(null);
  const [workingData, setWorkingData] = useState({
    general: {
      name: '',
      username: '',
      displayName: '',
      language: 'English (US)',
      timeZone: 'UTC+05:30 (India Standard Time - IST)',
      dateFormat: 'DD/MM/YYYY'
    },
    account: {
      email: '',
      phone: '',
      location: '',
      jobTitle: '',
      company: ''
    },
    notifications: {
      email: { messages: true, proposals: true, payments: true, projectUpdates: true },
      push: { chat: true, deadlines: true, offers: false },
      sms: { securityAlerts: true, paymentConfirmations: true }
    },
    appearance: {
      theme: 'light',
      accentColor: '#0A84FF',
      density: 'comfortable',
      fontSize: 'medium'
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showLastSeen: true,
      allowDirectMessages: true,
      searchEngineIndexing: true,
      freelancerRecommendations: true
    },
    billing: {
      currentPlan: 'Pro Freelancer',
      billingCycle: 'monthly',
      paymentMethods: []
    },
    connectedAccounts: {
      google: { connected: false, email: '' },
      github: { connected: true, username: 'rajesh-dev' },
      linkedin: { connected: true, username: 'in/rajesh-kumar' },
      microsoft: { connected: false, email: '' }
    },
    sessions: []
  });

  const [touched, setTouched] = useState({});

  // Fetch full settings from backend
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      const { user: userRes, settings } = res.data.data;

      const structured = {
        general: {
          name: userRes?.name || '',
          username: settings?.general?.username || '',
          displayName: settings?.general?.displayName || userRes?.name || '',
          language: settings?.general?.language || 'English (US)',
          timeZone: settings?.general?.timeZone || 'UTC+05:30 (India Standard Time - IST)',
          dateFormat: settings?.general?.dateFormat || 'DD/MM/YYYY'
        },
        account: {
          email: userRes?.email || '',
          phone: formatIndianPhoneNumber(userRes?.phone || ''),
          location: userRes?.location || '',
          jobTitle: settings?.account?.jobTitle || userRes?.title || '',
          company: settings?.account?.company || ''
        },
        notifications: settings?.notifications || {
          email: { messages: true, proposals: true, payments: true, projectUpdates: true },
          push: { chat: true, deadlines: true, offers: false },
          sms: { securityAlerts: true, paymentConfirmations: true }
        },
        appearance: settings?.appearance || {
          theme: 'light',
          accentColor: '#0A84FF',
          density: 'comfortable',
          fontSize: 'medium'
        },
        privacy: settings?.privacy || {
          profileVisibility: 'public',
          showOnlineStatus: true,
          showLastSeen: true,
          allowDirectMessages: true,
          searchEngineIndexing: true,
          freelancerRecommendations: true
        },
        billing: settings?.billing || {
          currentPlan: 'Pro Freelancer',
          billingCycle: 'monthly',
          paymentMethods: [
            { id: 'pm_1', brand: 'Visa', last4: '4242', expMonth: '08', expYear: '28', isDefault: true }
          ]
        },
        connectedAccounts: settings?.connectedAccounts || {
          google: { connected: false, email: '' },
          github: { connected: true, username: 'rajesh-dev' },
          linkedin: { connected: true, username: 'in/rajesh-kumar' },
          microsoft: { connected: false, email: '' }
        },
        sessions: settings?.sessions || []
      };

      setWorkingData(structured);
      setInitialData(JSON.parse(JSON.stringify(structured)));
    } catch (err) {
      console.error('Failed to load settings', err);
      toast.error('Failed to load settings from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Validation Checks
  const errors = useMemo(() => {
    const errs = {};

    // General
    if (!workingData.general.name?.trim()) {
      errs.name = 'Full name is required.';
    } else if (workingData.general.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!workingData.general.username?.trim()) {
      errs.username = 'Username is required.';
    } else if (!/^[a-zA-Z0-9_-]{3,30}$/.test(workingData.general.username.trim())) {
      errs.username = 'Username must be 3-30 characters (letters, numbers, hyphens, underscores).';
    }

    // Account
    const emailErr = validateEmail(workingData.account.email);
    if (emailErr) errs.email = emailErr;

    const phoneErr = validateIndianPhone(workingData.account.phone);
    if (phoneErr) errs.phone = phoneErr;

    const locErr = validateLocation(workingData.account.location);
    if (locErr) errs.location = locErr;

    return errs;
  }, [workingData]);

  // Dirty state detection by section
  const sectionDirty = useMemo(() => {
    if (!initialData) return {};
    return {
      general: JSON.stringify(workingData.general) !== JSON.stringify(initialData.general),
      account: JSON.stringify(workingData.account) !== JSON.stringify(initialData.account),
      notifications: JSON.stringify(workingData.notifications) !== JSON.stringify(initialData.notifications),
      appearance: JSON.stringify(workingData.appearance) !== JSON.stringify(initialData.appearance),
      privacy: JSON.stringify(workingData.privacy) !== JSON.stringify(initialData.privacy),
      billing: JSON.stringify(workingData.billing) !== JSON.stringify(initialData.billing),
    };
  }, [workingData, initialData]);

  const hasAnyDirty = Object.values(sectionDirty).some(Boolean);
  const hasErrors = Object.keys(errors).length > 0;

  // Handlers for child sections
  const handleGeneralChange = (field, value) => {
    setWorkingData((prev) => ({
      ...prev,
      general: { ...prev.general, [field]: value }
    }));
  };

  const handleAccountChange = (field, value) => {
    setWorkingData((prev) => ({
      ...prev,
      account: { ...prev.account, [field]: value }
    }));
  };

  const handleNotificationsChange = (category, value) => {
    setWorkingData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [category]: value }
    }));
  };

  const handleAppearanceChange = (field, value) => {
    setWorkingData((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, [field]: value }
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setWorkingData((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value }
    }));
  };

  const handleBillingChange = (field, value) => {
    setWorkingData((prev) => ({
      ...prev,
      billing: { ...prev.billing, [field]: value }
    }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Reset to initial
  const handleReset = () => {
    if (initialData) {
      setWorkingData(JSON.parse(JSON.stringify(initialData)));
      setTouched({});
      toast.success('Preferences reset to saved state');
    }
  };

  // Save changes for all dirty sections
  const handleSaveChanges = async () => {
    setTouched({
      name: true,
      username: true,
      email: true,
      phone: true,
      location: true
    });

    if (hasErrors) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      setSaving(true);

      // Save General if dirty
      if (sectionDirty.general) {
        const res = await api.put('/settings/general', workingData.general);
        if (res.data?.data?.user && updateUserData) {
          updateUserData(res.data.data.user);
        }
      }

      // Save Account if dirty
      if (sectionDirty.account) {
        const res = await api.put('/settings/account', workingData.account);
        if (res.data?.data?.user && updateUserData) {
          updateUserData(res.data.data.user);
        }
      }

      // Save Notifications if dirty
      if (sectionDirty.notifications) {
        await api.put('/settings/notifications', workingData.notifications);
      }

      // Save Appearance if dirty
      if (sectionDirty.appearance) {
        await api.put('/settings/appearance', workingData.appearance);
      }

      // Save Privacy if dirty
      if (sectionDirty.privacy) {
        await api.put('/settings/privacy', workingData.privacy);
      }

      // Save Billing if dirty
      if (sectionDirty.billing) {
        await api.put('/settings/billing', workingData.billing);
      }

      setInitialData(JSON.parse(JSON.stringify(workingData)));
      toast.success('All settings saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Connected accounts toggle
  const handleToggleConnected = async (provider) => {
    try {
      const res = await api.post(`/settings/connected-accounts/${provider}/toggle`);
      setWorkingData((prev) => ({
        ...prev,
        connectedAccounts: res.data.data.connectedAccounts
      }));
      setInitialData((prev) => ({
        ...prev,
        connectedAccounts: res.data.data.connectedAccounts
      }));
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update connected account');
    }
  };

  // Session termination
  const handleTerminateSession = async (sessionId) => {
    try {
      const res = await api.delete(`/settings/sessions/${sessionId}`);
      setWorkingData((prev) => ({ ...prev, sessions: res.data.data.sessions }));
      setInitialData((prev) => ({ ...prev, sessions: res.data.data.sessions }));
      toast.success('Device session terminated');
    } catch {
      toast.error('Failed to terminate session');
    }
  };

  const handleSignOutAll = async () => {
    try {
      const res = await api.post('/settings/sessions/signout-all');
      setWorkingData((prev) => ({ ...prev, sessions: res.data.data.sessions }));
      setInitialData((prev) => ({ ...prev, sessions: res.data.data.sessions }));
      toast.success('Signed out of all other devices');
    } catch {
      toast.error('Failed to sign out other devices');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A84FF]" />
        <p className="text-xs text-slate-500 font-medium">Loading settings dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#0A84FF] border border-blue-200/60 dark:border-blue-800/60">
              <Sparkles size={13} />
              Platform Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your WorkStation account preferences, communication channels, and credentials security.
          </p>
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={!hasAnyDirty || saving}
            className="rounded-full text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSaveChanges}
            disabled={!hasAnyDirty || hasErrors || saving}
            loading={saving}
            className="rounded-full text-xs px-4 py-2 flex items-center gap-1.5 min-w-[130px]"
          >
            <Save size={13} />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Main Settings Responsive Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar Navigation */}
        <SettingsSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingCounts={sectionDirty}
        />

        {/* Settings Content Area */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {activeTab === 'general' && (
            <GeneralSettings
              data={workingData.general}
              onChange={handleGeneralChange}
              errors={errors}
              touched={touched}
              onBlur={handleBlur}
            />
          )}

          {activeTab === 'account' && (
            <AccountSettings
              data={workingData.account}
              onChange={handleAccountChange}
              errors={errors}
              touched={touched}
              onBlur={handleBlur}
              user={user}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettings
              user={user}
              onUpdateUser={async (patch) => {
                const res = await api.put('/users/profile', patch);
                if (res.data?.data?.user && updateUserData) {
                  updateUserData(res.data.data.user);
                }
              }}
              sessions={workingData.sessions}
              onTerminateSession={handleTerminateSession}
              onSignOutAll={handleSignOutAll}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings
              data={workingData.notifications}
              onChange={handleNotificationsChange}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSettings
              data={workingData.appearance}
              onChange={handleAppearanceChange}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacySettings
              data={workingData.privacy}
              onChange={handlePrivacyChange}
            />
          )}

          {activeTab === 'billing' && (
            <BillingSettings
              data={workingData.billing}
              onChange={handleBillingChange}
            />
          )}

          {activeTab === 'connected' && (
            <ConnectedAccounts
              data={workingData.connectedAccounts}
              onToggle={handleToggleConnected}
            />
          )}

          {activeTab === 'export' && (
            <DataExport />
          )}

          {activeTab === 'danger' && (
            <DangerZone />
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar when changes are pending */}
      {hasAnyDirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              You have unsaved changes in your preferences.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="xs"
              variant="outline"
              onClick={handleReset}
              disabled={saving}
              className="text-xs px-3"
            >
              Reset
            </Button>
            <Button
              size="xs"
              variant="primary"
              onClick={handleSaveChanges}
              disabled={hasErrors || saving}
              loading={saving}
              className="text-xs px-4"
            >
              Save Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
