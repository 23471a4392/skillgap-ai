import React, { useState } from 'react';
import {
  ExternalLink,
  FolderKanban,
  Github,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const ProjectsPage: React.FC = () => {
  const { profile, refreshUserData } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [complexity, setComplexity] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [skillsString, setSkillsString] = useState('');
  const [highlightsString, setHighlightsString] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const projects = profile?.projects || [];

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    try {
      const skillsUsed = skillsString
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const highlights = highlightsString
        .split('\n')
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      await api.profile.addProject({
        title,
        description,
        repoUrl: repoUrl || undefined,
        liveUrl: liveUrl || undefined,
        complexity,
        skillsUsed,
        highlights,
      });

      await refreshUserData();
      setModalOpen(false);
      setTitle('');
      setDescription('');
      setRepoUrl('');
      setLiveUrl('');
      setSkillsString('');
      setHighlightsString('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Remove this project from your portfolio?')) return;
    try {
      await api.profile.deleteProject(id);
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
            Portfolio Projects ({projects.length})
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Demonstrating skills in projects directly verifies requirements in the scoring engine (10-15% weight)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {proj.title}
                </h3>
                <Badge variant={proj.complexity === 'Advanced' ? 'warning' : 'success'} size="sm">
                  {proj.complexity}
                </Badge>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                {proj.description}
              </p>

              {/* Highlights */}
              {proj.highlights && proj.highlights.length > 0 && (
                <div className="mb-4 space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400">
                  {proj.highlights.map((h: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-brand-600 font-bold">•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Used */}
              <div className="flex flex-wrap gap-1 mb-4">
                {proj.skillsUsed?.map((s: string) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 text-[10px] font-medium rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {proj.repoUrl && (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  >
                    <Github className="h-3.5 w-3.5" /> Repository
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                  </a>
                )}
              </div>

              <button
                onClick={() => handleDeleteProject(proj.id)}
                className="text-zinc-400 hover:text-rose-600 p-1"
                title="Remove Project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-2 text-center py-16 rounded-xl border border-dashed border-zinc-300 p-8 space-y-2">
            <FolderKanban className="h-8 w-8 mx-auto text-zinc-400" />
            <p className="text-xs text-zinc-500">
              No portfolio projects recorded yet. Projects are critical proof-of-work in technical screens!
            </p>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Portfolio Project">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DevPulse — Developer Productivity Hub"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description & Architecture
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full stack web app with JWT authentication, relational PostgreSQL schema, and real-time activity metrics..."
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Repository URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Live Demo URL
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Complexity
              </label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="Beginner">Beginner (Frontend static / basic CRUD)</option>
                <option value="Intermediate">Intermediate (Full-stack / auth / DB)</option>
                <option value="Advanced">Advanced (High-scale / microservices / ML)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Skills Demonstrated (Comma-separated)
              </label>
              <input
                type="text"
                required
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
                placeholder="React, TypeScript, Node.js, PostgreSQL"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Key Engineering Highlights (1 per line)
            </label>
            <textarea
              rows={3}
              value={highlightsString}
              onChange={(e) => setHighlightsString(e.target.value)}
              placeholder="Normalized database schema with 8 relational tables&#10;Achieved 82% unit test coverage&#10;Sub-100ms API response time with Redis caching"
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
              {submitting ? 'Saving...' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
