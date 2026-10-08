import React, { useState } from 'react';
import { CheckCircle2, Layers, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { MASTER_SKILLS, PROFICIENCY_LABELS, SKILL_CATEGORIES } from '@skillgap/config';
import { ProficiencyLevel } from '@skillgap/types';

export const SkillsPage: React.FC = () => {
  const { profile, refreshUserData } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Programming Languages');
  const [proficiency, setProficiency] = useState<ProficiencyLevel>('intermediate');
  const [yearsOfExp, setYearsOfExp] = useState(1.5);
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const skills = profile?.skills || [];

  const filteredSkills = skills.filter((s) => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchSearch = s.skillName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) return;

    setSubmitting(true);
    try {
      await api.profile.addSkill({
        skillName,
        category,
        proficiency,
        yearsOfExp: Number(yearsOfExp),
        verified,
      });
      await refreshUserData();
      setAddModalOpen(false);
      setSkillName('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Remove this skill from your profile?')) return;
    try {
      await api.profile.deleteSkill(id);
      await refreshUserData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSelectMasterSkill = (name: string, cat: string) => {
    setSkillName(name);
    setCategory(cat);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Technical & Soft Skill Inventory
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Calibrate your proficiencies across {skills.length} tracked skills
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Skill to Profile
        </button>
      </div>

      {/* Proficiency Guidance Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Proficiency Tier Standards (How We Grade Gaps)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-100 border border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">1. Beginner</span>
            <p className="text-[11px] text-zinc-500 mt-1">Familiar with syntax, basic types, and hello-world execution.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-100 border border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">2. Elementary</span>
            <p className="text-[11px] text-zinc-500 mt-1">Can write standalone functions, simple scripts, and basic CRUD.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
            <span className="font-bold text-amber-800 dark:text-amber-300">3. Intermediate</span>
            <p className="text-[11px] text-zinc-500 mt-1">Can build and debug production features independently without hand-holding.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-brand-50 border border-brand-200 dark:bg-brand-950/30 dark:border-brand-800">
            <span className="font-bold text-brand-800 dark:text-brand-300">4. Advanced</span>
            <p className="text-[11px] text-zinc-500 mt-1">Understands internals, query optimization, concurrency, and architecture.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-secondary-100 border border-secondary-200 dark:bg-secondary-950/30 dark:border-secondary-800">
            <span className="font-bold text-secondary-800 dark:text-secondary-300">5. Expert</span>
            <p className="text-[11px] text-zinc-500 mt-1">Authoring frameworks, mentoring teams, and leading high-scale distributed systems.</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by skill name..."
            className="w-full rounded-lg border border-zinc-300 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {['All', ...SKILL_CATEGORIES.slice(0, 7)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-brand-600'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSkills.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {s.category}
                </span>
                {s.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold" title="Evidenced in Projects/Experience">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{s.skillName}</h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                {s.yearsOfExp} {s.yearsOfExp === 1 ? 'Year' : 'Years'} Practical Usage
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <Badge
                variant={
                  s.proficiency === 'advanced' || s.proficiency === 'expert'
                    ? 'success'
                    : s.proficiency === 'intermediate'
                    ? 'info'
                    : 'default'
                }
                size="sm"
              >
                {s.proficiency}
              </Badge>

              <button
                onClick={() => handleDeleteSkill(s.id)}
                className="text-zinc-400 hover:text-rose-600 p-1"
                title="Remove Skill"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-dashed border-zinc-300 p-8">
          <p className="text-xs text-zinc-500">No skills found matching your filter criteria.</p>
        </div>
      )}

      {/* Add Skill Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Skill to Inventory">
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              required
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. React, SQL, Docker, Python..."
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />

            {/* Quick Pick from Master Database */}
            <div className="mt-2">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Quick picks from master catalog:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {MASTER_SKILLS.slice(0, 8).map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => handleSelectMasterSkill(m.name, m.category)}
                    className="px-2 py-0.5 text-[10px] rounded bg-zinc-100 hover:bg-brand-50 hover:text-brand-700 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                  >
                    + {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Proficiency Level
              </label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="beginner">Beginner (Basic Syntax)</option>
                <option value="elementary">Elementary (Can write small scripts)</option>
                <option value="intermediate">Intermediate (Build independently)</option>
                <option value="advanced">Advanced (Deep internals & optimization)</option>
                <option value="expert">Expert (System architecture & mentorship)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Years of Practical Usage
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={yearsOfExp}
                onChange={(e) => setYearsOfExp(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="flex items-center pt-5">
              <input
                type="checkbox"
                id="verifyCheck"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 mr-2"
              />
              <label htmlFor="verifyCheck" className="text-xs text-zinc-700 dark:text-zinc-300">
                Evidenced in public portfolio
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
            >
              {submitting ? 'Saving...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
