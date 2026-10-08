import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  X,
  Code,
  GraduationCap,
  Phone,
  User,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

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

export const QuickFillPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();

  const syncToken = searchParams.get('syncToken') || '';

  // Session state from QR token
  const [sessionInfo, setSessionInfo] = useState<{
    valid: boolean;
    userName?: string;
    userEmail?: string;
  } | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);

  // Form Fields
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [targetRoleId, setTargetRoleId] = useState('full-stack-developer');
  const [phone, setPhone] = useState('');
  const [degree, setDegree] = useState('Bachelor of Science / B.Tech');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [resumeText, setResumeText] = useState('');
  const [detectedSkills, setDetectedSkills] = useState<Array<{ skillName: string; category: string; proficiency: string }>>([]);

  // UI state
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sample Resume template for fast one-click filling
  const sampleResumeData = `ALEX MORGAN
Austin, TX | (512) 555-0194 | alex.morgan@example.com
https://github.com/alexmorgan-dev | https://linkedin.com/in/alexmorgan-dev

EDUCATION
University of Texas at Austin — Bachelor of Science in Computer Science
Graduation: May 2026 | GPA: 3.82/4.0

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL, HTML/CSS
Frontend: React, Next.js, Tailwind CSS
Backend: Node.js, Express, REST APIs, Microservices
Databases: PostgreSQL, MySQL, Redis
DevOps & Cloud: Git, GitHub Actions, Docker, CI/CD, Linux, AWS

EXPERIENCE
Apex Web Studios — Frontend Engineering Intern (May 2025 – August 2025)
- Built responsive UI components with React & TypeScript.
- Integrated REST APIs with caching, cutting load latency by 28%.
`;

  // Fetch QR session info if syncToken provided
  useEffect(() => {
    if (syncToken) {
      setLoadingSession(true);
      api.resume
        .getQrSession(syncToken)
        .then((res) => {
          setSessionInfo(res);
        })
        .catch(() => {
          setSessionInfo({ valid: false });
        })
        .finally(() => setLoadingSession(false));
    }
  }, [syncToken]);

  // Extract GitHub username for live preview
  const getGithubUsername = (url: string) => {
    const cleaned = url.trim().replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/.*$/, '');
    return cleaned && /^[a-zA-Z0-9-_]+$/.test(cleaned) ? cleaned : null;
  };

  const githubUsername = getGithubUsername(githubUrl);

  // Quick Resume Parser Handler
  const handleAnalyzeResume = async (textToParse?: string) => {
    const text = textToParse || resumeText;
    if (!text.trim() || text.length < 15) return;
    setIsParsing(true);
    setErrorMessage('');
    try {
      const res = await api.resume.parse(text);
      if (res.parsed) {
        setDetectedSkills(res.parsed.skills || []);
        if (res.parsed.githubUrl && !githubUrl) setGithubUrl(res.parsed.githubUrl);
        if (res.parsed.linkedinUrl && !linkedinUrl) setLinkedinUrl(res.parsed.linkedinUrl);
        if (res.parsed.phone && !phone) setPhone(res.parsed.phone);
        if (res.parsed.degree && !degree) setDegree(res.parsed.degree);
        if (res.parsed.graduationYear) setGraduationYear(String(res.parsed.graduationYear));
      }
    } catch (err: any) {
      console.warn('Parsing warning:', err);
    } finally {
      setIsParsing(false);
    }
  };

  // Handle Load Sample
  const handleLoadSample = () => {
    setResumeText(sampleResumeData);
    setGithubUrl('https://github.com/alexmorgan-dev');
    setLinkedinUrl('https://linkedin.com/in/alexmorgan-dev');
    setPhone('(512) 555-0194');
    setDegree('Bachelor of Science / B.Tech');
    setGraduationYear('2026');
    handleAnalyzeResume(sampleResumeData);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
        handleAnalyzeResume(content);
      }
    };
    reader.readAsText(file);
  };

  // Remove a detected skill
  const handleRemoveSkill = (skillName: string) => {
    setDetectedSkills(detectedSkills.filter((s) => s.skillName !== skillName));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Format GitHub and LinkedIn URLs
    let normalizedGithub = githubUrl.trim();
    if (normalizedGithub && !normalizedGithub.startsWith('http')) {
      normalizedGithub = `https://github.com/${normalizedGithub}`;
    }

    let normalizedLinkedin = linkedinUrl.trim();
    if (normalizedLinkedin && !normalizedLinkedin.startsWith('http')) {
      normalizedLinkedin = `https://linkedin.com/in/${normalizedLinkedin}`;
    }

    try {
      const payload = {
        syncToken: syncToken || undefined,
        githubUrl: normalizedGithub || undefined,
        linkedinUrl: normalizedLinkedin || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        targetRoleId,
        phone: phone.trim() || undefined,
        degree: degree.trim() || undefined,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
        resumeText: resumeText.trim() || undefined,
        skills: detectedSkills,
      };

      const res = await api.resume.quickFill(payload);
      setSuccessDetails(res.syncedData || {});
      setIsSuccess(true);
      await refreshUserData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sync profile. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      {/* Top Mobile-First App Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              SG
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              SkillGap <span className="text-brand-600">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/80 py-1 px-2.5 rounded-full border border-brand-200 dark:border-brand-800">
              <Smartphone className="w-3.5 h-3.5 text-brand-600" />
              <span>Mobile Quick-Fill</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Session Status Banner */}
        {syncToken && (
          <div className="bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <div>
                <p className="font-semibold text-brand-950 dark:text-brand-200">
                  {loadingSession
                    ? 'Connecting to Desktop Session...'
                    : sessionInfo?.userName
                    ? `సింక్ అవుతోంది: ${sessionInfo.userName}`
                    : 'Active QR Sync Session'}
                </p>
                <p className="text-[11px] text-brand-700 dark:text-brand-400">
                  Submitting will update your live SkillGap profile instantly.
                </p>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
          </div>
        )}

        {/* Success Screen */}
        {isSuccess ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ అయ్యింది!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                Your Resume, GitHub, and LinkedIn profile have been synced to SkillGap AI.
              </p>
            </div>

            {/* Summary Highlights */}
            {successDetails && (
              <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4 text-left space-y-2.5 text-xs sm:text-sm border border-zinc-200 dark:border-zinc-700/60">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Synced Profile Details:
                </div>
                {successDetails.githubUrl && (
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                    <Github className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">GitHub:</span>
                    <span className="truncate">{successDetails.githubUrl}</span>
                  </div>
                )}
                {successDetails.linkedinUrl && (
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                    <Linkedin className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">LinkedIn:</span>
                    <span className="truncate">{successDetails.linkedinUrl}</span>
                  </div>
                )}
                {successDetails.skillsCount > 0 && (
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                    <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">Extracted Skills:</span>
                    <span>{successDetails.skillsCount} skills mapped into your skill inventory</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>డ్యాష్‌బోర్డ్‌కి వెళ్లండి (Go to Dashboard)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/job-analysis')}
                className="flex-1 py-3 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl text-sm transition"
              >
                Analyze Target Job
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Instructions */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Quick Profile Intake
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                మీ <strong>GitHub</strong>, <strong>LinkedIn</strong> ప్రొఫైల్ మరియు <strong>Resume</strong> వివరాలను ఫిల్ చేయండి.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-3.5 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Social Profiles (GitHub & LinkedIn) */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Developer & Professional Links
                  </h2>
                </div>
                <span className="text-[11px] text-brand-600 font-medium">Required for analysis</span>
              </div>

              {/* GitHub Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <span>GitHub Profile Link</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="w-full text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>
                {githubUsername && (
                  <div className="flex items-center gap-2 text-xs text-brand-700 dark:text-brand-300 bg-brand-50/60 dark:bg-brand-950/40 p-2 rounded-lg border border-brand-100 dark:border-brand-900">
                    <img
                      src={`https://avatars.githubusercontent.com/${githubUsername}`}
                      alt={githubUsername}
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                      className="w-5 h-5 rounded-full ring-1 ring-brand-300"
                    />
                    <span className="font-medium">@{githubUsername}</span>
                    <span className="text-[11px] text-zinc-500">— GitHub profile detected</span>
                  </div>
                )}
              </div>

              {/* LinkedIn Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Linkedin className="w-4 h-4 text-brand-600" />
                  <span>LinkedIn Profile Link</span>
                </label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>

              {/* Portfolio / Website Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span>Portfolio / Personal Website (Optional)</span>
                </label>
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>

              {/* Target Career Role */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-brand-600" />
                  <span>Target Career Goal (లక్ష్యం)</span>
                </label>
                <select
                  value={targetRoleId}
                  onChange={(e) => setTargetRoleId(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                >
                  {POPULAR_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Resume Upload & Parsing */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Resume & Skill Information
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 dark:bg-brand-950/70 py-1 px-2.5 rounded-md transition"
                >
                  ⚡ Sample Resume Paste
                </button>
              </div>

              {/* Upload Drop Area */}
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 text-center hover:border-brand-500 transition group cursor-pointer relative bg-zinc-50/50 dark:bg-zinc-950/30">
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                  <Upload className="w-6 h-6 text-zinc-400 group-hover:text-brand-600 transition" />
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Click or Drag to Upload Resume file (.txt, .md, .pdf)
                  </p>
                  <p className="text-[11px] text-zinc-400">or paste the text directly below</p>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <span>Resume Content / Skills Summary</span>
                  </label>
                  {resumeText && (
                    <button
                      type="button"
                      onClick={() => handleAnalyzeResume()}
                      disabled={isParsing}
                      className="text-[11px] font-semibold text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isParsing ? 'Analyzing...' : 'Re-extract Skills'}</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={6}
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                  }}
                  onBlur={() => {
                    if (resumeText.length > 20 && detectedSkills.length === 0) {
                      handleAnalyzeResume();
                    }
                  }}
                  placeholder="Paste your education, skills, projects, and work history here..."
                  className="w-full text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition leading-relaxed"
                />
              </div>

              {/* Extracted Skills Preview Pills */}
              {detectedSkills.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                      <span>Extracted Skills ({detectedSkills.length})</span>
                    </span>
                    <span className="text-[11px] text-zinc-400">Click X to remove</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                    {detectedSkills.map((s) => (
                      <span
                        key={s.skillName}
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 px-2.5 py-1 rounded-md border border-brand-200 dark:border-brand-800"
                      >
                        <span>{s.skillName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s.skillName)}
                          className="hover:text-red-500 ml-0.5"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Education & Contact Credentials */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                <div className="w-6 h-6 rounded-md bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Credentials & Education (విద్యా వివరాలు)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Degree</span>
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="B.Tech Computer Science"
                    className="w-full text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="2026"
                    className="w-full text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full text-xs sm:text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>ప్రొఫైల్ సింక్ అవుతోంది (Syncing Profile)...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Sync to SkillGap AI Profile (భద్రపరచు)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-zinc-500">
                🔒 Your GitHub and LinkedIn links and resume data are parsed securely and tied to your account.
              </p>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-4 px-4 text-center text-xs text-zinc-500">
        SkillGap AI — Know where you stand. Know what to learn next.
      </footer>
    </div>
  );
};

export default QuickFillPage;
