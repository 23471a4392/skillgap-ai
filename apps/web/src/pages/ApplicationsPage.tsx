import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('Remote');
  const [salaryRange, setSalaryRange] = useState('');
  const [status, setStatus] = useState<'wishlist' | 'applied' | 'screening' | 'technical' | 'offer' | 'rejected'>('applied');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.applications.getAll();
      setApplications(res.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !jobTitle) return;

    setSubmitting(true);
    try {
      await api.applications.create({
        company,
        jobTitle,
        location,
        salaryRange: salaryRange || undefined,
        status,
        jobUrl: jobUrl || undefined,
        notes: notes || undefined,
      });

      await fetchApplications();
      setModalOpen(false);
      setCompany('');
      setJobTitle('');
      setSalaryRange('');
      setNotes('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.applications.update(id, { status: newStatus });
      await fetchApplications();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this application from tracker?')) return;
    try {
      await api.applications.delete(id);
      await fetchApplications();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns = [
    { key: 'wishlist', title: 'Wishlist' },
    { key: 'applied', title: 'Applied' },
    { key: 'screening', title: 'Screening' },
    { key: 'technical', title: 'Technical Interview' },
    { key: 'offer', title: 'Offer Extended' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Job Application Tracker ({applications.length})
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Organize your career search pipeline and track readiness scores alongside interview stages
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Track New Role
        </button>
      </div>

      {/* Kanban Board View */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const appsInCol = applications.filter((a) => a.status === col.key);
          return (
            <div
              key={col.key}
              className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col min-w-[220px]"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {col.title}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  {appsInCol.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {appsInCol.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-lg border border-zinc-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {app.jobTitle}
                        </h4>
                        <span className="text-[11px] text-zinc-500 font-medium block">
                          {app.company}
                        </span>
                      </div>
                      {app.matchScore && (
                        <Badge variant={app.matchScore >= 80 ? 'success' : 'info'} size="sm">
                          {app.matchScore}%
                        </Badge>
                      )}
                    </div>

                    {app.salaryRange && (
                      <p className="text-[11px] text-zinc-500">{app.salaryRange}</p>
                    )}

                    {app.notes && (
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 bg-zinc-50 dark:bg-zinc-800/40 p-1.5 rounded">
                        {app.notes}
                      </p>
                    )}

                    {/* Move stage dropdown & delete */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="text-[10px] rounded border border-zinc-300 bg-white py-1 px-1 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        <option value="wishlist">Wishlist</option>
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="technical">Technical</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {appsInCol.length === 0 && (
                  <div className="text-center py-6 text-[11px] text-zinc-400">
                    No roles in {col.title.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Track Job Application">
        <form onSubmit={handleAddApplication} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, Meta"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="technical">Technical</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Target Salary
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="$120k - $145k"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Job Posting URL (Optional)
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://company.com/careers/..."
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Recruiter & Interview Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Recruiter contact, scheduled screen date, key topics to prepare..."
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
              {submitting ? 'Saving...' : 'Add Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
