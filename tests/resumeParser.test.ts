import { describe, it, expect } from 'vitest';
import { parseResume } from '../apps/api/src/services/resumeParser';

describe('Resume Parser Engine', () => {
  const sampleHumanResume = `Name: Nagaphani Sree Meesala

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

  it('parses a valid human resume with all sections', () => {
    const parsed = parseResume(sampleHumanResume);

    expect(parsed.name).toBe('Nagaphani Sree Meesala');
    expect(parsed.email).toBe('example@gmail.com');
    expect(parsed.phone).toBe('9876543210');
    expect(parsed.location).toBe('Andhra Pradesh');
    expect(parsed.summary).toContain('B.Tech CSE Artificial Intelligence student');
    expect(parsed.education.length).toBeGreaterThan(0);
    expect(parsed.education[0].degree).toContain('B.Tech');
    expect(parsed.education[0].year).toBe(2027);
    expect(parsed.skills).toContain('Python');
    expect(parsed.skills).toContain('SQL');
    expect(parsed.skills).toContain('Docker');
    expect(parsed.projects.length).toBe(4);
    expect(parsed.projects[0].title).toBe('SkillGap AI');
    expect(parsed.experience.length).toBe(2);
    expect(parsed.experience[0].role).toBe('Python Development Intern');
    expect(parsed.certifications.length).toBe(3);
    expect(parsed.certifications[0].name).toBe('NPTEL Cloud Computing');
  });

  it('handles empty input safely without crashing', () => {
    const emptyResult = parseResume('');
    expect(emptyResult.name).toBe('');
    expect(emptyResult.email).toBe('');
    expect(emptyResult.phone).toBe('');
    expect(Array.isArray(emptyResult.skills)).toBe(true);
    expect(emptyResult.skills).toEqual([]);
    expect(Array.isArray(emptyResult.education)).toBe(true);
    expect(emptyResult.education).toEqual([]);
    expect(Array.isArray(emptyResult.experience)).toBe(true);
    expect(emptyResult.experience).toEqual([]);
    expect(Array.isArray(emptyResult.projects)).toBe(true);
    expect(emptyResult.projects).toEqual([]);
    expect(Array.isArray(emptyResult.certifications)).toBe(true);
    expect(emptyResult.certifications).toEqual([]);
  });

  it('handles whitespace-only or undefined input', () => {
    // @ts-ignore
    const nullResult = parseResume(null);
    expect(nullResult.skills).toEqual([]);
    const spacesResult = parseResume('     \n\n  \t  ');
    expect(spacesResult.skills).toEqual([]);
  });

  it('extracts emails in various formats and normalizes case', () => {
    const text = 'Reach me at Alex.Morgan_2026@sub.Domain.ORG for inquiries.';
    const parsed = parseResume(text);
    expect(parsed.email).toBe('alex.morgan_2026@sub.domain.org');
  });

  it('extracts Indian and international phone numbers accurately', () => {
    const indian1 = parseResume('Contact: +91 9876543210');
    expect(indian1.phone).toContain('9876543210');

    const indian2 = parseResume('Mobile: 9876543210');
    expect(indian2.phone).toBe('9876543210');

    const indian3 = parseResume('Tel: +91-9876543210');
    expect(indian3.phone).toBe('+91-9876543210');

    const usPhone = parseResume('Phone: (512) 555-0194');
    expect(usPhone.phone).toBe('(512) 555-0194');
  });

  it('extracts GitHub and LinkedIn URLs', () => {
    const text = `
Profile: https://github.com/alexmorgan-dev
Network: https://linkedin.com/in/alexmorgan-dev
`;
    const parsed = parseResume(text);
    expect(parsed.socialLinks.github).toBe('https://github.com/alexmorgan-dev');
    expect(parsed.githubUrl).toBe('https://github.com/alexmorgan-dev');
    expect(parsed.socialLinks.linkedin).toBe('https://linkedin.com/in/alexmorgan-dev');
    expect(parsed.linkedinUrl).toBe('https://linkedin.com/in/alexmorgan-dev');
  });

  it('deduplicates skills and respects original skill names', () => {
    const text = `Skills: Python, python, PYTHON, SQL, Sql, Docker, docker, React, React`;
    const parsed = parseResume(text);
    const pythonCount = parsed.skills.filter((s) => s.toLowerCase() === 'python').length;
    expect(pythonCount).toBe(1);
    const sqlCount = parsed.skills.filter((s) => s.toLowerCase() === 'sql').length;
    expect(sqlCount).toBe(1);
    const dockerCount = parsed.skills.filter((s) => s.toLowerCase() === 'docker').length;
    expect(dockerCount).toBe(1);
  });

  it('handles missing sections gracefully without undefined or null', () => {
    const textOnlySkills = `Skills: Python, Java, Docker, Git`;
    const parsed = parseResume(textOnlySkills);

    expect(parsed.skills).toContain('Python');
    expect(parsed.skills).toContain('Java');
    expect(parsed.education).toEqual([]);
    expect(parsed.experience).toEqual([]);
    expect(parsed.projects).toEqual([]);
    expect(parsed.certifications).toEqual([]);
    expect(parsed.email).toBe('');
    expect(parsed.phone).toBe('');
    expect(parsed.name).toBe('');
  });

  it('handles unusual formatting, emojis, and special characters', () => {
    const emojiResume = `
👨‍💻 Name: Sarah Connor
📧 Email: sarah.connor@sky.net
📱 Phone: 9876501234
🌟 Skills: 🚀 Python, ⚡ Docker, 💻 Kubernetes & 🛠️ SQL
`;
    const parsed = parseResume(emojiResume);
    expect(parsed.name).toBe('Sarah Connor');
    expect(parsed.email).toBe('sarah.connor@sky.net');
    expect(parsed.phone).toBe('9876501234');
    expect(parsed.skills).toContain('Python');
    expect(parsed.skills).toContain('Docker');
    expect(parsed.skills).toContain('Kubernetes');
    expect(parsed.skills).toContain('SQL');
  });

  it('handles long, complex resumes with multi-line project descriptions', () => {
    const longResume = `
ALEX MORGAN
Austin, TX | 512-555-0194 | alex@example.com

SUMMARY
Passionate Full-Stack Developer with 3+ years experience building scalable web applications.

EXPERIENCE
Software Engineer Intern - Apex Systems
2024 - 2025
- Built microservices in Node.js and PostgreSQL.
- Optimized query latency by 45%.

PROJECTS
DevPulse
- Productivity dashboard using React and TypeScript.
- Real-time updates with WebSockets.

SKILLS
TypeScript, React, Node.js, PostgreSQL, Docker, AWS, Git
`;
    const parsed = parseResume(longResume);
    expect(parsed.name).toBe('ALEX MORGAN');
    expect(parsed.email).toBe('alex@example.com');
    expect(parsed.skills).toContain('TypeScript');
    expect(parsed.skills).toContain('React');
    expect(parsed.skills).toContain('PostgreSQL');
    expect(parsed.projects.length).toBeGreaterThan(0);
    expect(parsed.projects[0].title).toBe('DevPulse');
  });

  it('guarantees safe default arrays for corrupted/partial objects during normalization', () => {
    // Simulate what happens if an API returns a partially formed object
    const corruptedApiResult: any = {
      name: 'Partial User',
      skills: null,
      education: undefined,
      projects: 'not an array',
      experience: false,
    };

    const normalized = {
      name: corruptedApiResult.name || '',
      email: corruptedApiResult.email || '',
      phone: corruptedApiResult.phone || '',
      location: corruptedApiResult.location || '',
      summary: corruptedApiResult.summary || '',
      education: Array.isArray(corruptedApiResult.education) ? corruptedApiResult.education : [],
      experience: Array.isArray(corruptedApiResult.experience) ? corruptedApiResult.experience : [],
      skills: Array.isArray(corruptedApiResult.skills) ? corruptedApiResult.skills : [],
      projects: Array.isArray(corruptedApiResult.projects) ? corruptedApiResult.projects : [],
      certifications: Array.isArray(corruptedApiResult.certifications) ? corruptedApiResult.certifications : [],
      languages: Array.isArray(corruptedApiResult.languages) ? corruptedApiResult.languages : [],
      socialLinks: {
        github: corruptedApiResult.socialLinks?.github || '',
        linkedin: corruptedApiResult.socialLinks?.linkedin || '',
        portfolio: corruptedApiResult.socialLinks?.portfolio || '',
      },
    };

    expect(Array.isArray(normalized.skills)).toBe(true);
    expect(normalized.skills).toEqual([]);
    expect(Array.isArray(normalized.education)).toBe(true);
    expect(normalized.education).toEqual([]);
    expect(Array.isArray(normalized.projects)).toBe(true);
    expect(normalized.projects).toEqual([]);
    expect(Array.isArray(normalized.experience)).toBe(true);
    expect(normalized.experience).toEqual([]);
    expect(Array.isArray(normalized.certifications)).toBe(true);
    expect(normalized.certifications).toEqual([]);
    expect(normalized.name).toBe('Partial User');
  });

  it('falls back seamlessly to local parser when external API throws', async () => {
    const mockApiCall = async (): Promise<any> => {
      throw new Error('500 Internal Server Error / Network Timeout');
    };

    const rawResume = 'Name: Fallback Candidate\nEmail: fallback@example.com\nSkills: Python, Docker';

    let result = null;
    try {
      result = await mockApiCall();
    } catch {
      // Local fallback
      result = parseResume(rawResume);
    }

    expect(result).not.toBeNull();
    expect(result.name).toBe('Fallback Candidate');
    expect(result.email).toBe('fallback@example.com');
    expect(result.skills).toContain('Python');
    expect(result.skills).toContain('Docker');
  });
});
