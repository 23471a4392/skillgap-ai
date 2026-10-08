import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Download,
  Key,
  Lock,
  LogOut,
  Shield,
  Smartphone,
  Trash2,
  User,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const SettingsPage: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState<any[]>([]);

  // Danger zone modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await api.auth.getSessions();
      setSessions(res.sessions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage('');
    setPwError('');

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }

    setPwSubmitting(true);
    try {
      const res = await api.auth.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPwMessage(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.message || 'Failed to update password');
    } finally {
      setPwSubmitting(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('Log out from all active sessions on other browsers and devices?')) return;
    try {
      await api.auth.logoutAll();
      await fetchSessions();
      alert('Successfully logged out of all other sessions.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportData = () => {
    const exportPayload = {
      user,
      profile,
      exportedAt: new Date().toISOString(),
      generator: 'SkillGap AI Privacy Engine',
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skillgap-profile-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type DELETE to confirm account removal.');
      return;
    }

    setDeleting(true);
    try {
      await api.auth.deleteAccount();
      await logout();
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Account Settings & Security
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage credentials, session tokens, GDPR privacy exports, and security preferences
        </p>
      </div>

      {/* Account Info Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <User className="h-4 w-4 text-brand-600" />
          Account Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block mb-1">Account Name</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user?.name}</span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-1">Registered Email</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user?.email}</span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-1">Account Role</span>
            <span className="font-semibold uppercase text-zinc-700 dark:text-zinc-300">{user?.role}</span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-1">Member Since</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <Key className="h-4 w-4 text-emerald-600" />
          Update Password
        </h3>

        {pwMessage && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" /> {pwMessage}
          </div>
        )}

        {pwError && (
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
            <AlertCircle className="h-4 w-4" /> {pwError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, uppercase, number"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwSubmitting}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-brand-600 dark:hover:bg-brand-700 transition disabled:opacity-50"
          >
            {pwSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Active Sessions Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-zinc-600" />
            Active Browser Sessions ({sessions.length})
          </h3>
          <button
            onClick={handleLogoutAll}
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
          >
            <LogOut className="h-3 w-3" /> Log Out From All Sessions
          </button>
        </div>

        <div className="space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 text-xs"
            >
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {s.userAgent || 'Web Browser'}
                </span>
                <p className="text-[11px] text-zinc-500">
                  IP: {s.ipAddress} • Created {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </div>
              {s.isCurrent && <Badge variant="success" size="sm">Current Session</Badge>}
            </div>
          ))}
        </div>
      </div>

      {/* GDPR Data Portability & Export */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <Download className="h-4 w-4 text-emerald-600" />
          Data Portability & Export
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Download a complete, machine-readable JSON copy of your profile, projects, tracked skills, and historical job analyses for your personal archives.
        </p>
        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
        >
          <Download className="h-3.5 w-3.5" /> Export All Profile & Analysis Data (JSON)
        </button>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-6 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20 space-y-3">
        <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          Danger Zone
        </h3>
        <p className="text-xs text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
          Permanently delete your SkillGap AI account and all associated profile, project, and analysis records. This operation is immediate and irrevocable.
        </p>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete Account Permanently
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Account Deletion">
        <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
          <p className="font-semibold text-rose-600">
            This action cannot be undone. All your skills, roadmaps, and past analyses will be purged from the database.
          </p>
          <p>
            Please type <strong className="text-zinc-900 dark:text-zinc-100 font-mono">DELETE</strong> in the box below to confirm:
          </p>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== 'DELETE' || deleting}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-40"
            >
              {deleting ? 'Deleting...' : 'Permanently Delete Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
