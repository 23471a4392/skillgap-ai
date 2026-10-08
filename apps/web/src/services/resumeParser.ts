import { MASTER_SKILLS } from '@skillgap/config';

export interface EducationItem {
  degree: string;
  institution: string;
  year?: number | string;
  grade?: string;
  fieldOfStudy?: string;
  description?: string;
}

export interface ExperienceItem {
  role: string;
  company?: string;
  duration?: string;
  description?: string;
  skillsUsed?: string[];
}

export interface ProjectItem {
  title: string;
  description?: string;
  techStack?: string[];
  link?: string;
}

export interface CertificationItem {
  name: string;
  issuingOrg?: string;
  date?: string;
}

export interface StructuredResume {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  skillsDetailed: Array<{
    skillName: string;
    category: string;
    proficiency: string;
  }>;
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  degree: string;
  graduationYear: number;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  extractedCount: number;
}

const STANDARD_SKILLS_DICTIONARY: Array<{ name: string; category: string; aliases?: string[] }> = [
  // Programming Languages
  { name: 'Python', category: 'Programming Languages' },
  { name: 'JavaScript', category: 'Programming Languages', aliases: ['js', 'es6', 'javascript'] },
  { name: 'TypeScript', category: 'Programming Languages', aliases: ['ts', 'typescript'] },
  { name: 'Java', category: 'Programming Languages' },
  { name: 'C', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages', aliases: ['cpp'] },
  { name: 'C#', category: 'Programming Languages', aliases: ['csharp'] },
  { name: 'Go', category: 'Programming Languages', aliases: ['golang'] },
  { name: 'Rust', category: 'Programming Languages' },
  { name: 'PHP', category: 'Programming Languages' },
  { name: 'Ruby', category: 'Programming Languages' },
  { name: 'Swift', category: 'Programming Languages' },
  { name: 'Kotlin', category: 'Programming Languages' },
  { name: 'R', category: 'Programming Languages' },
  { name: 'SQL', category: 'Databases' },

  // Frontend
  { name: 'HTML', category: 'Frontend', aliases: ['html5'] },
  { name: 'CSS', category: 'Frontend', aliases: ['css3'] },
  { name: 'React', category: 'Frontend', aliases: ['reactjs', 'react.js'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['nextjs', 'next'] },
  { name: 'Vue', category: 'Frontend', aliases: ['vuejs', 'vue.js'] },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss'] },
  { name: 'Bootstrap', category: 'Frontend' },

  // Backend
  { name: 'Node.js', category: 'Backend', aliases: ['nodejs', 'node'] },
  { name: 'Express', category: 'Backend', aliases: ['expressjs', 'express.js'] },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend', aliases: ['springboot', 'spring'] },
  { name: 'REST APIs', category: 'Backend', aliases: ['rest', 'restful api', 'rest api', 'rest apis'] },
  { name: 'GraphQL', category: 'Backend' },
  { name: 'Microservices', category: 'Backend' },

  // Databases
  { name: 'MySQL', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases', aliases: ['postgres'] },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },
  { name: 'SQLite', category: 'Databases' },
  { name: 'Oracle', category: 'Databases' },

  // Data Science & AI
  { name: 'Data Analytics', category: 'Data & Analytics', aliases: ['data analysis'] },
  { name: 'Power BI', category: 'Data & Analytics', aliases: ['powerbi'] },
  { name: 'Tableau', category: 'Data & Analytics' },
  { name: 'Pandas', category: 'Data & Analytics' },
  { name: 'NumPy', category: 'Data & Analytics', aliases: ['numpy'] },
  { name: 'Matplotlib', category: 'Data & Analytics' },
  { name: 'Seaborn', category: 'Data & Analytics' },
  { name: 'Excel', category: 'Data & Analytics' },
  { name: 'Machine Learning', category: 'AI & Machine Learning', aliases: ['ml'] },
  { name: 'Artificial Intelligence', category: 'AI & Machine Learning', aliases: ['ai'] },
  { name: 'Deep Learning', category: 'AI & Machine Learning' },
  { name: 'NLP', category: 'AI & Machine Learning', aliases: ['natural language processing'] },
  { name: 'Computer Vision', category: 'AI & Machine Learning' },
  { name: 'Scikit-learn', category: 'AI & Machine Learning', aliases: ['sklearn', 'scikit learn'] },
  { name: 'TensorFlow', category: 'AI & Machine Learning' },
  { name: 'PyTorch', category: 'AI & Machine Learning' },

  // DevOps & Cloud
  { name: 'Git', category: 'DevOps & Tools' },
  { name: 'GitHub', category: 'DevOps & Tools' },
  { name: 'GitLab', category: 'DevOps & Tools' },
  { name: 'Docker', category: 'DevOps & Tools' },
  { name: 'Kubernetes', category: 'DevOps & Tools', aliases: ['k8s'] },
  { name: 'Linux', category: 'DevOps & Tools' },
  { name: 'CI/CD', category: 'DevOps & Tools', aliases: ['cicd'] },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Azure', category: 'Cloud' },
  { name: 'GCP', category: 'Cloud', aliases: ['google cloud'] },
  { name: 'Cloud Computing', category: 'Cloud' },
  { name: 'IoT', category: 'IoT & Embedded', aliases: ['internet of things'] },
];

export function parseResume(rawText: string): StructuredResume {
  const result: StructuredResume = {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    education: [],
    experience: [],
    skills: [],
    skillsDetailed: [],
    projects: [],
    certifications: [],
    languages: [],
    socialLinks: {
      github: '',
      linkedin: '',
      portfolio: '',
    },
    degree: '',
    graduationYear: 2026,
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    extractedCount: 0,
  };

  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return result;
  }

  const cleanText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = cleanText.split('\n').map((l) => l.trim());

  // 1. Email Extraction
  const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/i;
  const emailMatch = cleanText.match(emailRegex);
  if (emailMatch) {
    result.email = emailMatch[0].toLowerCase();
  }

  // 2. Phone Extraction (Supports Indian formats: +91 9876543210, 9876543210, +91-9876543210, US/Intl formats)
  const phoneRegexes = [
    /(?:\+?91[\s-]?)?[6-9]\d{9}\b/,
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\b\d{10}\b/,
  ];
  for (const regex of phoneRegexes) {
    const match = cleanText.match(regex);
    if (match) {
      result.phone = match[0].trim();
      break;
    }
  }

  // 3. Social Links
  const githubMatch = cleanText.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) {
    result.socialLinks.github = githubMatch[0];
    result.githubUrl = githubMatch[0];
  }

  const linkedinMatch = cleanText.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) {
    result.socialLinks.linkedin = linkedinMatch[0];
    result.linkedinUrl = linkedinMatch[0];
  }

  const portfolioMatch = cleanText.match(/https?:\/\/(?:www\.)?(?!github|linkedin)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
  if (portfolioMatch) {
    result.socialLinks.portfolio = portfolioMatch[0];
    result.portfolioUrl = portfolioMatch[0];
  }

  // 4. Name & Location Explicit Check
  for (const line of lines) {
    const nameMatch = line.match(/(?:^|[^a-zA-Z0-9])Name:\s*(.+)$/i);
    if (nameMatch && !result.name) {
      result.name = nameMatch[1].replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
    }

    const locMatch = line.match(/(?:^|[^a-zA-Z0-9])(?:Location|Address|City):\s*(.+)$/i);
    if (locMatch && !result.location) {
      result.location = locMatch[1].replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
    }
  }

  // 5. Fallback Name Detection
  if (!result.name) {
    for (const rawLine of lines) {
      const line = rawLine.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
      if (!line) continue;
      if (
        line.includes('@') ||
        line.startsWith('http') ||
        /\b\d{10}\b/.test(line) ||
        /^(?:resume|curriculum vitae|cv|profile)\b/i.test(line) ||
        isHeaderLine(line)
      ) {
        continue;
      }
      const words = line.split(/\s+/).filter(Boolean);
      if (words.length >= 1 && words.length <= 5 && !/[;,.!?:]/.test(line)) {
        result.name = line;
        break;
      }
    }
  }

  // 6. Section Partitioning
  type SectionKey = 'summary' | 'skills' | 'education' | 'experience' | 'projects' | 'certifications' | 'languages' | 'other';
  const sections: Record<SectionKey, string[]> = {
    summary: [],
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
    other: [],
  };

  let currentSection: SectionKey = 'other';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const detectedHeader = identifySectionHeader(line);
    if (detectedHeader) {
      currentSection = detectedHeader;
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const afterColon = line.slice(colonIdx + 1).trim();
        if (afterColon) {
          sections[currentSection].push(afterColon);
        }
      }
      continue;
    }

    sections[currentSection].push(line);
  }

  // 7. Parse Summary
  if (sections.summary.length > 0) {
    result.summary = sections.summary.join(' ').trim();
  }

  // 8. Parse Skills
  const extractedSkillsMap = new Map<string, { skillName: string; category: string; proficiency: string }>();

  const skillsText = sections.skills.join('\n');
  const skillTokens = skillsText
    .split(/[,;\n•|\/]/)
    .map((s) => s.replace(/^[*-]\s*/, '').replace(/^(?:languages|frontend|backend|databases?|tools?|devops|frameworks?|libraries):\s*/i, '').trim())
    .filter((s) => s.length > 1 && s.length < 40);

  const combinedDict: Array<{ name: string; category: string; aliases?: string[] }> = [
    ...STANDARD_SKILLS_DICTIONARY,
    ...MASTER_SKILLS.map((s) => ({
      name: s.name,
      category: s.category,
      aliases: [s.slug],
    })),
  ];

  const addSkill = (name: string, category: string = 'Technical Skills') => {
    const lower = name.toLowerCase();
    if (!extractedSkillsMap.has(lower)) {
      extractedSkillsMap.set(lower, {
        skillName: name,
        category,
        proficiency: 'intermediate',
      });
    }
  };

  for (const token of skillTokens) {
    const matched = combinedDict.find(
      (d) =>
        d.name.toLowerCase() === token.toLowerCase() ||
        (d.aliases && d.aliases.some((a) => a.toLowerCase() === token.toLowerCase()))
    );
    if (matched) {
      addSkill(matched.name, matched.category);
    } else if (/^[a-zA-Z0-9+#. -]{2,25}$/.test(token) && !isCommonEnglishWord(token)) {
      addSkill(token, 'Technical Skills');
    }
  }

  const fullTextLower = cleanText.toLowerCase();
  for (const skill of combinedDict) {
    const escaped = skill.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (regex.test(fullTextLower)) {
      addSkill(skill.name, skill.category);
      continue;
    }
    if (skill.aliases) {
      for (const alias of skill.aliases) {
        const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const aliasRegex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escapedAlias}(?:$|[^a-zA-Z0-9_#+])`, 'i');
        if (aliasRegex.test(fullTextLower)) {
          addSkill(skill.name, skill.category);
          break;
        }
      }
    }
  }

  result.skills = Array.from(extractedSkillsMap.values()).map((s) => s.skillName);
  result.skillsDetailed = Array.from(extractedSkillsMap.values());
  result.extractedCount = result.skills.length;

  // 9. Parse Education
  const eduLines = sections.education;
  if (eduLines.length > 0) {
    let currentEdu: Partial<EducationItem> = {};
    for (const line of eduLines) {
      const degreeRegex = /(?:b\.?\s*tech|bachelor|b\.?\s*e\.?|b\.?\s*s\.?|m\.?\s*tech|master|m\.?\s*s\.?|ph\.?d|diploma|higher\s+secondary|intermediate)/i;
      const yearMatch = line.match(/\b(20\d{2})\b/);
      const cgpaMatch = line.match(/(?:cgpa|gpa|percentage|score)?\s*[:=]?\s*([0-9]{1,2}(?:\.[0-9]{1,2})?(?:\s*\/\s*10|\s*\/\s*4)?%?)/i);

      if (degreeRegex.test(line) && !currentEdu.degree) {
        currentEdu.degree = line;
      } else if (line.toLowerCase().includes('college') || line.toLowerCase().includes('university') || line.toLowerCase().includes('institute') || line.toLowerCase().includes('school')) {
        currentEdu.institution = line;
      } else if (yearMatch && !currentEdu.year) {
        currentEdu.year = parseInt(yearMatch[1], 10);
      }

      if (cgpaMatch && cgpaMatch[1] && (line.toLowerCase().includes('cgpa') || line.toLowerCase().includes('gpa'))) {
        currentEdu.grade = line;
      }
    }

    if (currentEdu.degree || currentEdu.institution) {
      result.education.push({
        degree: currentEdu.degree || 'Bachelor of Technology',
        institution: currentEdu.institution || 'Engineering College',
        year: currentEdu.year || 2026,
        grade: currentEdu.grade || '',
      });
    } else {
      result.education.push({
        degree: eduLines[0] || 'Bachelor Degree',
        institution: eduLines[1] || 'University',
        year: 2026,
      });
    }
  }

  if (result.education.length > 0) {
    result.degree = result.education[0].degree || '';
    result.graduationYear = typeof result.education[0].year === 'number' ? result.education[0].year : 2026;
  } else {
    if (/b\.?\s*tech/i.test(cleanText)) result.degree = 'B.Tech – Computer Science Engineering';
    else if (/bachelor/i.test(cleanText)) result.degree = 'Bachelor of Science';
    else if (/master/i.test(cleanText)) result.degree = 'Master of Science';
    const yearMatch = cleanText.match(/\b(20[12]\d)\b/g);
    if (yearMatch) result.graduationYear = parseInt(yearMatch[yearMatch.length - 1], 10);
  }

  // 10. Parse Projects
  const projLines = sections.projects;
  if (projLines.length > 0) {
    for (const line of projLines) {
      if (line.length > 2 && !line.startsWith('-') && !line.startsWith('•')) {
        result.projects.push({
          title: line.replace(/^[0-9]+[.)]\s*/, '').trim(),
        });
      } else if (result.projects.length > 0 && (line.startsWith('-') || line.startsWith('•'))) {
        const last = result.projects[result.projects.length - 1];
        last.description = (last.description ? last.description + ' ' : '') + line.replace(/^[•*-]\s*/, '').trim();
      }
    }
  }

  // 11. Parse Experience
  const expLines = sections.experience;
  if (expLines.length > 0) {
    for (const line of expLines) {
      if (line.length > 2 && !line.startsWith('-') && !line.startsWith('•')) {
        result.experience.push({
          role: line.replace(/^[0-9]+[.)]\s*/, '').trim(),
        });
      } else if (result.experience.length > 0 && (line.startsWith('-') || line.startsWith('•'))) {
        const last = result.experience[result.experience.length - 1];
        last.description = (last.description ? last.description + ' ' : '') + line.replace(/^[•*-]\s*/, '').trim();
      }
    }
  }

  // 12. Parse Certifications
  const certLines = sections.certifications;
  if (certLines.length > 0) {
    for (const line of certLines) {
      if (line.length > 2) {
        result.certifications.push({
          name: line.replace(/^[•*-]\s*/, '').replace(/^[0-9]+[.)]\s*/, '').trim(),
        });
      }
    }
  }

  // 13. Parse Languages
  const langLines = sections.languages;
  if (langLines.length > 0) {
    const joined = langLines.join(', ');
    result.languages = joined
      .split(/[,;\n•|]/)
      .map((l) => l.trim())
      .filter((l) => l.length > 1 && l.length < 25);
  }

  return result;
}

function isHeaderLine(line: string): boolean {
  return identifySectionHeader(line) !== null;
}

function identifySectionHeader(line: string): 'summary' | 'skills' | 'education' | 'experience' | 'projects' | 'certifications' | 'languages' | null {
  const trimmed = line.trim();
  const clean = trimmed
    .replace(/^#+\s*/, '')
    .replace(/^[0-9]+[.)]\s*/, '')
    .replace(/[:\-*]+$/, '')
    .trim()
    .toLowerCase();

  if (/^(?:summary|profile|about(?:\s+me)?|professional\s+summary|career\s+objective|objective)$/i.test(clean)) {
    return 'summary';
  }
  if (/^(?:skills|technical\s+skills|skills\s*(?:&|and)?\s*technologies?|technologies|tools\s*(?:&|and)?\s*technologies|core\s+competencies|tech\s+stack|areas\s+of\s+expertise)$/i.test(clean)) {
    return 'skills';
  }
  if (/^(?:education|academic\s+background|academics|academic\s+qualifications|educational\s+qualifications|qualifications)$/i.test(clean)) {
    return 'education';
  }
  if (/^(?:work\s+experience|professional\s+experience|experience|employment\s+history|internships?|work\s+history)$/i.test(clean)) {
    return 'experience';
  }
  if (/^(?:projects|academic\s+projects|key\s+projects|personal\s+projects|technical\s+projects)$/i.test(clean)) {
    return 'projects';
  }
  if (/^(?:certifications?|certificates?|certifications\s*(?:&|and)?\s*licenses?|achievements?|courses|workshops?)$/i.test(clean)) {
    return 'certifications';
  }
  if (/^(?:languages?|languages?\s+known)$/i.test(clean)) {
    return 'languages';
  }
  return null;
}

function isCommonEnglishWord(word: string): boolean {
  const common = new Set([
    'and', 'the', 'with', 'for', 'from', 'using', 'built', 'worked', 'developed',
    'student', 'knowledge', 'student', 'knowledge', 'intern', 'engineering',
  ]);
  return common.has(word.toLowerCase());
}
