import { describe, expect, it } from 'vitest';
import { calculateSkillGap, extractRequirementsFromText, generatePersonalizedRoadmap } from '../packages/analytics/src';
import { Profile } from '../packages/types/src';

describe('SkillGap AI Deterministic Analytics Engine', () => {
  const dummyProfile: Profile = {
    id: 'test-profile-1',
    userId: 'user-1',
    headline: 'Software Engineer',
    location: 'Austin, TX',
    degree: 'Bachelor of Science',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: '3.8',
    targetRoleId: 'role-fullstack',
    skills: [
      { id: '1', skillName: 'React', category: 'Frontend', proficiency: 'intermediate', yearsOfExp: 2, verified: true },
      { id: '2', skillName: 'TypeScript', category: 'Programming Languages', proficiency: 'intermediate', yearsOfExp: 2, verified: true },
      { id: '3', skillName: 'SQL', category: 'Database', proficiency: 'intermediate', yearsOfExp: 1.5, verified: true },
      { id: '4', skillName: 'JavaScript', category: 'Programming Languages', proficiency: 'advanced', yearsOfExp: 3, verified: true },
    ],
    education: [
      { id: 'e1', institution: 'UT Austin', degree: 'B.S.', fieldOfStudy: 'Computer Science', startYear: 2022, endYear: 2026, isCurrent: true },
    ],
    experience: [
      {
        id: 'exp1',
        company: 'Apex Studios',
        role: 'Frontend Intern',
        startDate: 'May 2025',
        endDate: 'August 2025',
        isCurrent: false,
        isInternship: true,
        description: 'Frontend development',
        skillsUsed: ['React', 'TypeScript'],
      },
    ],
    projects: [
      {
        id: 'p1',
        title: 'TaskFlow',
        description: 'Full stack project',
        complexity: 'Intermediate',
        skillsUsed: ['React', 'TypeScript', 'SQL'],
        highlights: ['Built relational schema'],
      },
    ],
    certifications: [],
  };

  it('correctly extracts requirements from raw job description', () => {
    const jobText = `
      We are hiring a Full-Stack Engineer at TechCo.
      Requirements:
      - 2+ years of experience with React and Node.js
      - Solid database skills in PostgreSQL and SQL
      - Experience with Docker containers and automated testing
      - Nice to have: Next.js and Redis
    `;

    const extracted = extractRequirementsFromText(jobText, 'Full-Stack Engineer', 'role-fullstack');

    expect(extracted.requiredExperienceYears).toBe(2);
    expect(extracted.requiredSkills.some((s) => s.name === 'React')).toBe(true);
    expect(extracted.requiredSkills.some((s) => s.name === 'PostgreSQL')).toBe(true);
    expect(extracted.keywords.length).toBeGreaterThan(0);
  });

  it('calculates deterministic score and identifies partial vs missing gaps', () => {
    const jobText = `
      Software Engineer
      Requirements:
      - Strong knowledge of React (intermediate or higher)
      - Advanced SQL query optimization and indexing
      - Docker container workflows
    `;

    const extracted = extractRequirementsFromText(jobText, 'Software Engineer', 'role-fullstack');
    const result = calculateSkillGap(dummyProfile, extracted);

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);

    // React should be matched
    const reactMatch = result.matchedSkills.find((s) => s.name === 'React');
    expect(reactMatch).toBeDefined();

    // Docker should be missing
    const dockerMissing = result.missingSkills.find((s) => s.name === 'Docker');
    expect(dockerMissing).toBeDefined();
    expect(dockerMissing?.importance).toBe('critical');

    // Human explanation must be present
    expect(result.summaryReason.length).toBeGreaterThan(20);
  });

  it('generates a personalized 12-week roadmap targeting exact missing skills', () => {
    const jobText = `
      Backend Engineer
      Requirements:
      - Docker, Kubernetes, and PostgreSQL
    `;
    const extracted = extractRequirementsFromText(jobText, 'Backend Engineer', 'role-fullstack');
    const analysis = calculateSkillGap(dummyProfile, extracted);

    const roadmap = generatePersonalizedRoadmap(
      {
        ...analysis,
        id: 'analysis-1',
        userId: 'user-1',
        rawJobDescription: jobText,
        createdAt: new Date().toISOString(),
      },
      'Backend Engineer'
    );

    expect(roadmap.totalWeeks).toBeGreaterThan(0);
    expect(roadmap.estimatedHours).toBeGreaterThan(0);
    expect(roadmap.milestones.length).toBeGreaterThan(0);
    expect(roadmap.milestones[0].actionableTasks.length).toBeGreaterThan(0);
  });
});
