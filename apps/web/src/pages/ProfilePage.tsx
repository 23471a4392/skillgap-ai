import React, { useState } from 'react';
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Plus,
  QrCode,
  Save,
  Smartphone,
  Trash2,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { QRCodeModal } from '../components/common/QRCodeModal';
import { CAREER_ROLES } from '@skillgap/config';

export const ProfilePage: React.FC = () => {
  const { profile, refreshUserData } = useAuth();

  // Basic Info Form State
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [degree, setDegree] = useState(profile?.degree || '');
  const [branch, setBranch] = useState(profile?.branch || '');
  const [graduationYear, setGraduationYear] = useState<number | string>(profile?.graduationYear || 2026);
  const [cgpa, setCgpa] = useState(profile?.cgpa || '');
  const [targetRoleId, setTargetRoleId] = useState(profile?.targetRoleId || 'role-fullstack');
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolioUrl || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Education Modal State
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStartYear, setEduStartYear] = useState(2022);
  const [eduEndYear, setEduEndYear] = useState(2026);
  const [eduGrade, setEduGrade] = useState('');

  // Experience Modal State
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expIsInternship, setExpIsInternship] = useState(false);
  const [expDescription, setExpDescription] = useState('');
  const [expSkills, setExpSkills] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.profile.update({
        headline,
        location,
        phone,
        degree,
        branch,
        graduationYear: Number(graduationYear),
        cgpa,
        targetRoleId,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        bio,
      });
      await refreshUserData();
      setMessage('Profile saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.profile.addEducation({
        institution: eduInstitution,
        degree: eduDegree,
        fieldOfStudy: eduField,
        startYear: Number(eduStartYear),
        endYear: Number(eduEndYear),
        grade: eduGrade,
      });
      await refreshUserData();
      setEduModalOpen(false);
      setEduInstitution('');
      setEduDegree('');
      setEduField('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Remove this education entry?')) return;
    try {
      await api.profile.deleteEducation(id);
      await refreshUserData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = expSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await api.profile.addExperience({
        company: expCompany,
        role: expRole,
        startDate: expStartDate,
        endDate: expEndDate,
        isInternship: expIsInternship,
        description: expDescription,
        skillsUsed: skillsArray,
      });
      await refreshUserData();
      setExpModalOpen(false);
      setExpCompany('');
      setExpRole('');
      setExpDescription('');
      setExpSkills('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Remove this experience entry?')) return;
    try {
      await api.profile.deleteExperience(id);
      await refreshUserData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Professional Profile
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Your profile details directly inform the deterministic scoring engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-50 border border-brand-200 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-300 transition shadow-sm"
          >
            <QrCode className="h-4 w-4 text-brand-600" />
            <span>Scan QR on Mobile (మొబైల్ ఫిల్)</span>
          </button>

          {message && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> {message}
            </div>
          )}
        </div>
      </div>

      {/* Mobile QR Quick-Fill Banner */}
      <div className="bg-gradient-to-r from-brand-50 via-brand-50/50 to-transparent dark:from-brand-950/50 dark:via-brand-950/20 dark:to-transparent border border-brand-200 dark:border-brand-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Continue from your phone
              <span className="text-[10px] font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full">
                Phone Sync
              </span>
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Scan this QR code with your phone to upload your resume and link GitHub & LinkedIn.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setQrModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Continue from your phone</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Basic & Contact Info */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 pb-2 dark:border-zinc-800">
            1. Core Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Aspiring Full-Stack Software Engineer"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Target Benchmark Role
              </label>
              <select
                value={targetRoleId}
                onChange={(e) => setTargetRoleId(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {CAREER_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.department})
                  </option>
                ))}
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
                placeholder="e.g. Austin, TX / Remote"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Professional Summary / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your technical strengths, interests, and engineering projects..."
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                GitHub URL
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                LinkedIn URL
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Portfolio URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button for Section 1 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-brand-600 dark:hover:bg-brand-700 transition"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Education Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              2. Formal Education
            </h3>
            <p className="text-xs text-zinc-500">Degree and coursework factored into Education scoring (10%)</p>
          </div>
          <button
            onClick={() => setEduModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add Degree
          </button>
        </div>

        <div className="space-y-3">
          {profile?.education && profile.education.length > 0 ? (
            profile.education.map((edu) => (
              <div
                key={edu.id}
                className="flex items-start justify-between rounded-lg border border-zinc-200 p-4 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/40"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {edu.degree} in {edu.fieldOfStudy}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {edu.institution} • {edu.startYear} - {edu.endYear || 'Present'} {edu.grade ? `(${edu.grade})` : ''}
                  </p>
                  {edu.description && (
                    <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="text-zinc-400 hover:text-rose-600 p-1"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-zinc-500">
              No education entries added yet. Click "+ Add Degree" above.
            </div>
          )}
        </div>
      </div>

      {/* Experience & Internships Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              3. Experience & Internships
            </h3>
            <p className="text-xs text-zinc-500">Work experience and internships factored into Experience scoring (20%)</p>
          </div>
          <button
            onClick={() => setExpModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add Experience
          </button>
        </div>

        <div className="space-y-3">
          {profile?.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp) => (
              <div
                key={exp.id}
                className="flex items-start justify-between rounded-lg border border-zinc-200 p-4 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{exp.role}</h4>
                    {exp.isInternship && <Badge size="sm" variant="info">Internship</Badge>}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {exp.company} • {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {exp.skillsUsed.map((s) => (
                        <span key={s} className="px-2 py-0.5 text-[10px] rounded bg-white text-zinc-700 border border-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="text-zinc-400 hover:text-rose-600 p-1 ml-4"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-zinc-500">
              No experience added yet. Internships and research assistantships count!
            </div>
          )}
        </div>
      </div>

      {/* Add Education Modal */}
      <Modal isOpen={eduModalOpen} onClose={() => setEduModalOpen(false)} title="Add Degree / Education">
        <form onSubmit={handleAddEducation} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Institution / University
            </label>
            <input
              type="text"
              required
              value={eduInstitution}
              onChange={(e) => setEduInstitution(e.target.value)}
              placeholder="e.g. University of Texas at Austin"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Degree</label>
              <input
                type="text"
                required
                value={eduDegree}
                onChange={(e) => setEduDegree(e.target.value)}
                placeholder="e.g. Bachelor of Science"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Field of Study</label>
              <input
                type="text"
                required
                value={eduField}
                onChange={(e) => setEduField(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Start Year</label>
              <input
                type="number"
                value={eduStartYear}
                onChange={(e) => setEduStartYear(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">End Year</label>
              <input
                type="number"
                value={eduEndYear}
                onChange={(e) => setEduEndYear(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Grade / CGPA</label>
              <input
                type="text"
                value={eduGrade}
                onChange={(e) => setEduGrade(e.target.value)}
                placeholder="3.8 / 4.0"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEduModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
            >
              Save Education
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Experience Modal */}
      <Modal isOpen={expModalOpen} onClose={() => setExpModalOpen(false)} title="Add Work Experience / Internship">
        <form onSubmit={handleAddExperience} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Company / Organization</label>
              <input
                type="text"
                required
                value={expCompany}
                onChange={(e) => setExpCompany(e.target.value)}
                placeholder="e.g. Apex Web Studios"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Role / Job Title</label>
              <input
                type="text"
                required
                value={expRole}
                onChange={(e) => setExpRole(e.target.value)}
                placeholder="e.g. Frontend Engineering Intern"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Start Date</label>
              <input
                type="text"
                required
                value={expStartDate}
                onChange={(e) => setExpStartDate(e.target.value)}
                placeholder="May 2025"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">End Date</label>
              <input
                type="text"
                value={expEndDate}
                onChange={(e) => setExpEndDate(e.target.value)}
                placeholder="August 2025 (or Present)"
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isIntern"
              checked={expIsInternship}
              onChange={(e) => setExpIsInternship(e.target.checked)}
              className="rounded text-brand-600"
            />
            <label htmlFor="isIntern" className="text-xs text-zinc-700 dark:text-zinc-300">
              This was an internship position
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Key Responsibilities & Impact</label>
            <textarea
              rows={3}
              required
              value={expDescription}
              onChange={(e) => setExpDescription(e.target.value)}
              placeholder="Built responsive client dashboards using React... Reduced load latency by 25%..."
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Skills Used (Comma-separated)</label>
            <input
              type="text"
              value={expSkills}
              onChange={(e) => setExpSkills(e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS, Git"
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2 px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setExpModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
            >
              Save Experience
            </button>
          </div>
        </form>
      </Modal>

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onSuccess={() => {
          setMessage('Profile successfully updated via Mobile QR Scan!');
        }}
      />
    </div>
  );
};
