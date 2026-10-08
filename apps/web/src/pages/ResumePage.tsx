import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  CheckCircle2,
  FileCheck,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
  QrCode,
  Smartphone,
  Sparkles,
  Upload,
  AlertCircle,
  MapPin,
  User,
  Briefcase,
  Award,
  Layers,
  Code2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { QRCodeModal } from '../components/common/QRCodeModal';
import { parseResume, StructuredResume } from '../services/resumeParser';

export const ResumePage: React.FC = () => {
  const { refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<StructuredResume | null>(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const sampleResume = `Name: Nagaphani Sree Meesala

Email: example@gmail.com

Phone: 9876543210

Location: Andhra Pradesh

Summary:
B.Tech CSE Artificial Intelligence student with knowledge of Python, SQL, Data Analytics and AI.

Education:
B.Tech – Computer Science Engineering (Artificial Intelligence)
Narasaraopeta Engineering College
2027
CGPA: 8.65

Skills:
Python, SQL, MySQL, HTML, CSS, JavaScript, Power BI, Pandas, NumPy, Git, GitHub, Docker

Projects:
SkillGap AI
LifeOS
FarmMind
Explainable AI-Based Academic Stress Detection

Experience:
Python Development Intern
Full Stack Development Intern

Certifications:
NPTEL Cloud Computing
NPTEL IoT
Power BI Workshop`;

  const handleParse = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setMessage('');

    if (!resumeText || !resumeText.trim()) {
      setErrorMessage('Please paste your resume content before parsing.');
      return;
    }

    setParsing(true);
    try {
      let result: any = null;

      // 1. Try backend API parser first
      try {
        const res = await api.resume.parse(resumeText);
        if (res && res.parsed) {
          result = res.parsed;
        }
      } catch (apiErr) {
        console.warn('Backend API parse encountered issue, running local fallback parser:', apiErr);
      }

      // 2. Fallback to local rule-based parser if API was offline or unavailable
      if (!result) {
        result = parseResume(resumeText);
      }

      // 3. Normalize into safe structured object
      const normalized: StructuredResume = {
        name: result.name || '',
        email: result.email || '',
        phone: result.phone || '',
        location: result.location || '',
        summary: result.summary || '',
        education: Array.isArray(result.education) ? result.education : [],
        experience: Array.isArray(result.experience) ? result.experience : [],
        skills: Array.isArray(result.skills) ? result.skills : [],
        skillsDetailed: Array.isArray(result.skillsDetailed) ? result.skillsDetailed : [],
        projects: Array.isArray(result.projects) ? result.projects : [],
        certifications: Array.isArray(result.certifications) ? result.certifications : [],
        languages: Array.isArray(result.languages) ? result.languages : [],
        socialLinks: {
          github: result.socialLinks?.github || result.githubUrl || '',
          linkedin: result.socialLinks?.linkedin || result.linkedinUrl || '',
          portfolio: result.socialLinks?.portfolio || result.portfolioUrl || '',
        },
        degree: result.degree || result.education?.[0]?.degree || '',
        graduationYear: result.graduationYear || result.education?.[0]?.year || 2026,
        githubUrl: result.githubUrl || result.socialLinks?.github || '',
        linkedinUrl: result.linkedinUrl || result.socialLinks?.linkedin || '',
        portfolioUrl: result.portfolioUrl || result.socialLinks?.portfolio || '',
        extractedCount: Array.isArray(result.skills) ? result.skills.length : 0,
      };

      setParsedData(normalized);
      setSuccessMessage('Resume Parsed Successfully');
    } catch (err: any) {
      console.error('Resume parsing failure:', err);
      setErrorMessage('Unable to parse the resume. Please check the content and try again.');
    } finally {
      setParsing(false);
    }
  };

  const handleApplyToProfile = async () => {
    if (!parsedData) return;
    setApplying(true);
    setErrorMessage('');
    try {
      await api.resume.apply({
        name: parsedData.name,
        location: parsedData.location,
        summary: parsedData.summary,
        skills: parsedData.skills,
        degree: parsedData.degree,
        graduationYear: parsedData.graduationYear,
        githubUrl: parsedData.githubUrl,
        linkedinUrl: parsedData.linkedinUrl,
        portfolioUrl: parsedData.portfolioUrl,
        phone: parsedData.phone,
        education: parsedData.education,
        experience: parsedData.experience,
        projects: parsedData.projects,
        certifications: parsedData.certifications,
      });
      await refreshUserData();
      setMessage('Successfully synced extracted skills & credentials to your profile!');
    } catch (err: any) {
      console.error('Failed to sync to profile:', err);
      setErrorMessage('Failed to apply resume to profile. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Resume Entity Extractor
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Extract skills, education credentials, and links directly from your resume text
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
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
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Continue from your phone
              <span className="text-[10px] font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full">
                Instant Sync
              </span>
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Scan this QR code with your phone to upload your resume and link GitHub & LinkedIn.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Continue from your phone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Textarea */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-600" /> Paste Resume Content
            </h3>
            <button
              type="button"
              onClick={() => setResumeText(sampleResume)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
            >
              Load Sample Resume
            </button>
          </div>

          <textarea
            rows={16}
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Paste plain text, markdown, or copied PDF text from your resume here..."
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-xs font-mono text-zinc-900 focus:outline-none focus:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 leading-relaxed"
          />

          {/* Inline Feedback Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2 font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 font-medium animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-400">
              {resumeText.length} characters entered
            </span>
            <button
              type="button"
              onClick={handleParse}
              disabled={parsing}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-brand-600 dark:hover:bg-brand-700 transition disabled:opacity-50 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              {parsing ? 'Parsing Resume...' : 'Parse Resume'}
            </button>
          </div>
        </div>

        {/* Right: Parsed Preview */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-600" /> Extracted Profile Data
            </h3>
            {parsedData && (
              <Badge variant="success" size="sm">
                {parsedData.skills.length} Skills Detected
              </Badge>
            )}
          </div>

          {parsedData ? (
            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
              {/* Contact info extracted */}
              <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Extracted Contact & Profile Info
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700 dark:text-zinc-300">
                  {parsedData.name && (
                    <div className="flex items-center gap-1.5 truncate font-semibold text-zinc-900 dark:text-zinc-100">
                      <User className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{parsedData.name}</span>
                    </div>
                  )}
                  {parsedData.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{parsedData.email}</span>
                    </div>
                  )}
                  {parsedData.phone && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>{parsedData.phone}</span>
                    </div>
                  )}
                  {parsedData.location && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span>{parsedData.location}</span>
                    </div>
                  )}
                  {parsedData.githubUrl && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Github className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{parsedData.githubUrl}</span>
                    </div>
                  )}
                  {parsedData.linkedinUrl && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Linkedin className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{parsedData.linkedinUrl}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {parsedData.summary && (
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Professional Summary:
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {parsedData.summary}
                  </p>
                </div>
              )}

              {/* Education */}
              {parsedData.education.length > 0 && (
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 text-brand-600" /> Education
                  </span>
                  <div className="space-y-1.5">
                    {parsedData.education.map((edu, idx) => (
                      <div key={idx} className="border-l-2 border-brand-500 pl-2">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{edu.degree}</p>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                          {edu.institution} {edu.year ? `• ${edu.year}` : ''} {edu.grade ? `• ${edu.grade}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Skills */}
              {parsedData.skills.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    Recognized Technical Stack ({parsedData.skills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {parsedData.skills.map((skillName: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      >
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                        {skillName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {parsedData.projects.length > 0 && (
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-secondary-500" /> Projects ({parsedData.projects.length})
                  </span>
                  <div className="space-y-1">
                    {parsedData.projects.map((proj, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{proj.title}</span>
                          {proj.description && (
                            <p className="text-[11px] text-zinc-500 mt-0.5">{proj.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {parsedData.experience.length > 0 && (
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-amber-600" /> Experience ({parsedData.experience.length})
                  </span>
                  <div className="space-y-1">
                    {parsedData.experience.map((exp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{exp.role}</span>
                          {exp.company && (
                            <span className="text-[11px] text-zinc-500 ml-1.5">({exp.company})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {parsedData.certifications.length > 0 && (
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-brand-600" /> Certifications ({parsedData.certifications.length})
                  </span>
                  <div className="space-y-1">
                    {parsedData.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-brand-600 shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">{cert.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action button */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleApplyToProfile}
                  disabled={applying}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {applying ? 'Syncing to Profile...' : 'Sync Extracted Entities to My Profile'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-zinc-500 space-y-2">
              <FileText className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p>Paste your resume on the left and click "Parse Resume".</p>
              <p className="text-[11px] text-zinc-400">
                We'll parse and map your technologies directly to your profile.
              </p>
            </div>
          )}
        </div>
      </div>

      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onSuccess={() => {
          setMessage('Profile successfully updated via Mobile QR Scan!');
        }}
      />
    </div>
  );
};
