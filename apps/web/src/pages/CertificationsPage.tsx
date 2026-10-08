import React, { useState } from 'react';
import { Award, CheckCircle2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const CertificationsPage: React.FC = () => {
  const { profile, refreshUserData } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [skillsCoveredString, setSkillsCoveredString] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const certs = profile?.certifications || [];

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !issuingOrg) return;

    setSubmitting(true);
    try {
      const skillsCovered = skillsCoveredString
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await api.profile.addCertification({
        name,
        issuingOrg,
        issueDate,
        credentialId: credentialId || undefined,
        credentialUrl: credentialUrl || undefined,
        skillsCovered,
      });

      await refreshUserData();
      setModalOpen(false);
      setName('');
      setIssuingOrg('');
      setIssueDate('');
      setCredentialId('');
      setCredentialUrl('');
      setSkillsCoveredString('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Remove this certification?')) return;
    try {
      await api.profile.deleteCertification(id);
      await refreshUserData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Professional Certifications ({certs.length})
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Verified credentials demonstrate continuous learning and specialized competencies
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Certification
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {c.issuingOrg}
                </span>
                <span className="text-[11px] text-zinc-400">Issued {c.issueDate}</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">{c.name}</h3>

              {c.credentialId && (
                <p className="text-xs text-zinc-500 font-mono">
                  Credential ID: {c.credentialId}
                </p>
              )}

              {c.skillsCovered && c.skillsCovered.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.skillsCovered.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-[10px] rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              {c.credentialUrl ? (
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" /> Verify Credential
                </a>
              ) : (
                <span className="text-[11px] text-zinc-400">Self-attested</span>
              )}

              <button
                onClick={() => handleDeleteCert(c.id)}
                className="text-zinc-400 hover:text-rose-600 p-1"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {certs.length === 0 && (
          <div className="col-span-2 text-center py-12 rounded-xl border border-dashed border-zinc-300 p-8 space-y-2">
            <Award className="h-8 w-8 mx-auto text-zinc-400" />
            <p className="text-xs text-zinc-500">
              No certifications added yet. AWS, Coursera, Meta, and Docker credentials can be linked here.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Professional Certification">
        <form onSubmit={handleAddCert} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Certification Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meta Front-End Developer Specialization"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                required
                value={issuingOrg}
                onChange={(e) => setIssuingOrg(e.target.value)}
                placeholder="e.g. Meta / Coursera / AWS"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Issue Date (Month/Year)
              </label>
              <input
                type="text"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="e.g. 2024-11"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Credential ID (Optional)
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="e.g. META-FE-99482"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Verification URL
              </label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://coursera.org/verify/..."
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Skills Covered (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsCoveredString}
              onChange={(e) => setSkillsCoveredString(e.target.value)}
              placeholder="React, JavaScript, HTML, CSS"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
            >
              {submitting ? 'Saving...' : 'Save Certification'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
