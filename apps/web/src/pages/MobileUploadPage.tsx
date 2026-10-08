import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Github,
  Linkedin,
  Sparkles,
  CheckCircle2,
  Upload,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Layers,
  FileCheck,
  Check,
} from 'lucide-react';
import { api } from '../services/api';

const POPULAR_ROLES = [
  { id: 'full-stack-developer', name: 'Full Stack Developer' },
  { id: 'frontend-developer', name: 'Frontend Developer' },
  { id: 'backend-developer', name: 'Backend Developer' },
  { id: 'python-developer', name: 'Python Developer' },
  { id: 'data-analyst', name: 'Data Analyst' },
  { id: 'data-scientist', name: 'Data Scientist' },
  { id: 'machine-learning-engineer', name: 'Machine Learning / AI Engineer' },
  { id: 'devops-engineer', name: 'DevOps & Cloud Engineer' },
  { id: 'cybersecurity-analyst', name: 'Cybersecurity Analyst' },
  { id: 'qa-engineer', name: 'QA & Test Automation Engineer' },
];

export const MobileUploadPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  // Session state
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionData, setSessionData] = useState<{
    valid: boolean;
    expired?: boolean;
    userName?: string;
    userEmail?: string;
    expiresAt?: string;
  } | null>(null);
  const [sessionError, setSessionError] = useState<string>('');

  // Form Fields
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [targetRoleId, setTargetRoleId] = useState('full-stack-developer');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedDetails, setCompletedDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Tab between upload and paste
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');

  // Load and validate session on mount
  useEffect(() => {
    if (!token) {
      setSessionError('No QR token provided in URL.');
      setLoadingSession(false);
      return;
    }

    const checkSession = async () => {
      try {
        setLoadingSession(true);
        const data = await api.resume.getQrSession(token);
        if (data.valid) {
          setSessionData(data);
          if (data.completed) {
            setCompleted(true);
          }
        } else {
          setSessionError(data.message || 'This upload session has expired or is invalid.');
        }
      } catch (err: any) {
        setSessionError(err.message || 'This upload session has expired.');
      } finally {
        setLoadingSession(false);
      }
    };

    checkSession();
  }, [token]);

  // Handle local file read
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = (event.target?.result as string) || '';
      setResumeText(text);
      if (text.length > 20) {
        parseText(text);
      }
    };
    reader.readAsText(file);
  };

  // Parse text for instant skill feedback
  const parseText = async (text: string) => {
    try {
      setIsParsing(true);
      const res = await api.resume.parse(text);
      if (res.parsed) {
        if (!githubUrl && res.parsed.githubUrl) setGithubUrl(res.parsed.githubUrl);
        if (!linkedinUrl && res.parsed.linkedinUrl) setLinkedinUrl(res.parsed.linkedinUrl);
        if (res.parsed.skills) {
          setExtractedSkills(res.parsed.skills.map((s: any) => s.skillName));
        }
      }
    } catch {
      // Ignore preview parse errors
    } finally {
      setIsParsing(false);
    }
  };

  // One click sample loader for testing on phone
  const loadSample = () => {
    const sample = `ALEX MORGAN\nAustin, TX | alex.morgan@example.com\nhttps://github.com/alexmorgan-dev | https://linkedin.com/in/alexmorgan-dev\n\nTECHNICAL SKILLS\nLanguages: JavaScript, TypeScript, Python, SQL\nFrontend: React, Tailwind CSS, Next.js\nBackend: Node.js, Express, PostgreSQL, REST APIs\nDevOps: Docker, Git, CI/CD, Linux`;
    setResumeFileName('sample-resume.txt');
    setResumeText(sample);
    setGithubUrl('https://github.com/alexmorgan-dev');
    setLinkedinUrl('https://linkedin.com/in/alexmorgan-dev');
    parseText(sample);
  };

  // Submit to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!resumeText && !githubUrl && !linkedinUrl) {
      setErrorMessage('Please provide a resume, GitHub URL, or LinkedIn profile URL.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const res = await api.resume.mobileUpload(token, {
        resumeFileName,
        resumeText,
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        targetRoleId,
      });

      if (res.success) {
        setCompleted(true);
        setCompletedDetails(res.data);
      } else {
        setErrorMessage(res.message || 'Failed to submit profile.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sync with computer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Loading state
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-3 border-brand-500 border-t-transparent animate-spin mb-4" />
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Connecting to your desktop session...
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Verifying secure QR token</p>
      </div>
    );
  }

  // 2. Expired / Invalid state
  if (sessionError || !sessionData?.valid) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 border border-rose-200 dark:border-rose-900">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          This upload session has expired
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          {sessionError || 'For your security, QR upload sessions are valid for 10 minutes. Please generate a new QR code on your computer screen.'}
        </p>
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-left text-xs text-zinc-500 space-y-2 w-full">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">How to continue:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Return to your computer screen.</li>
            <li>Click <strong>"Generate New QR"</strong>.</li>
            <li>Scan the fresh code with your phone camera.</li>
          </ol>
        </div>
      </div>
    );
  }

  // 3. Completed State
  if (completed) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-900 animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full mb-2">
          Synced Successfully
        </span>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Upload Complete!
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          Your Resume, GitHub, and LinkedIn profiles have been synced to your desktop SkillGap AI session.
        </p>

        {completedDetails && (
          <div className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-emerald-200 dark:border-emerald-900 p-4 text-left space-y-2.5 text-xs mb-6 shadow-sm">
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Synced to {sessionData.userName || 'Profile'}:
            </h4>
            {completedDetails.githubUrl && (
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Github className="w-4 h-4 text-zinc-600 shrink-0" />
                <span className="truncate">{completedDetails.githubUrl}</span>
              </div>
            )}
            {completedDetails.linkedinUrl && (
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Linkedin className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="truncate">{completedDetails.linkedinUrl}</span>
              </div>
            )}
            {completedDetails.skillsCount > 0 && (
              <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-medium">
                <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{completedDetails.skillsCount} skills mapped & added to profile</span>
              </div>
            )}
          </div>
        )}

        <div className="w-full p-4 bg-brand-50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-900 text-left text-xs text-brand-900 dark:text-brand-200 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-brand-600" />
            Switch back to your computer
          </p>
          <p className="text-brand-700 dark:text-brand-300">
            Your desktop browser has automatically detected this submission and refreshed your profile. You can close this tab now.
          </p>
        </div>
      </div>
    );
  }

  // 4. Form State (Designed for Phone Screens)
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              SG
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              SKILLGAP AI
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-md mx-auto px-4 pt-5">
        {/* Intro Banner */}
        <div className="mb-5 text-center">
          <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            Mobile Quick-Fill
          </span>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            Complete your profile
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Uploading information for{' '}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {sessionData?.userName || 'your desktop account'}
            </strong>
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Resume Upload */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-600" />
                Resume Document
              </label>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`px-2 py-0.5 rounded-md font-medium transition ${
                    inputMode === 'upload'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-500'
                  }`}
                >
                  File
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`px-2 py-0.5 rounded-md font-medium transition ${
                    inputMode === 'paste'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'text-zinc-500'
                  }`}
                >
                  Paste
                </button>
              </div>
            </div>

            {inputMode === 'upload' ? (
              <div>
                <label className="relative flex flex-col items-center justify-center p-5 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-brand-500 dark:hover:border-brand-500 rounded-xl cursor-pointer bg-zinc-50/50 dark:bg-zinc-950/50 transition group">
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {resumeFileName ? resumeFileName : 'Tap to choose Resume file'}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-0.5">
                    Supports .pdf, .docx, .txt, .md
                  </span>
                </label>
              </div>
            ) : (
              <div>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    if (e.target.value.length > 30) {
                      parseText(e.target.value);
                    }
                  }}
                  placeholder="Paste your plain text resume or LinkedIn summary here..."
                  className="w-full text-xs p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}

            {/* Quick Demo Filler */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-zinc-500">Need a quick test?</span>
              <button
                type="button"
                onClick={loadSample}
                className="text-brand-600 dark:text-brand-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Auto-fill Sample Resume
              </button>
            </div>

            {/* Extracted Skills Pill Preview */}
            {isParsing ? (
              <div className="flex items-center gap-2 text-xs text-zinc-500 py-1">
                <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <span>Extracting technologies from resume...</span>
              </div>
            ) : extractedSkills.length > 0 ? (
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1.5">
                  Detected {extractedSkills.length} skills from resume:
                </span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {extractedSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-secondary-100 dark:bg-secondary-950/80 text-secondary-700 dark:text-secondary-300 rounded-md border border-secondary-200 dark:border-secondary-800"
                    >
                      <Check className="w-2.5 h-2.5 text-secondary-500" />
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Section 2: Online Profiles (GitHub & LinkedIn) */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-secondary-500" />
              Online Profiles
            </label>

            {/* GitHub URL */}
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1">
                <Github className="w-3.5 h-3.5 text-zinc-600" />
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1">
                <Linkedin className="w-3.5 h-3.5 text-brand-600" />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Section 3: Target Role */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Target Role
            </label>
            <select
              value={targetRoleId}
              onChange={(e) => setTargetRoleId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {POPULAR_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Syncing to Desktop...</span>
              </>
            ) : (
              <>
                <span>Submit & Sync to Computer</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security and Session info footer */}
        <div className="mt-6 text-center space-y-2 text-[11px] text-zinc-500">
          <div className="flex items-center justify-center gap-1 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>End-to-end encrypted temporary transfer session</span>
          </div>
          <p>
            Connected to user <strong>{sessionData?.userEmail || sessionData?.userName}</strong>
          </p>
        </div>
      </main>
    </div>
  );
};
