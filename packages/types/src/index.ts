export type ProficiencyLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'expert';

export type SkillCategory =
  | 'Programming Languages'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Cloud'
  | 'DevOps'
  | 'Data Analytics'
  | 'AI/ML'
  | 'Cybersecurity'
  | 'Testing'
  | 'Tools'
  | 'Soft Skills'
  | 'Business Skills'
  | 'Communication'
  | 'Leadership';

export interface LearningResource {
  title: string;
  url: string;
  type: 'documentation' | 'course' | 'tutorial' | 'book' | 'interactive';
  isFree: boolean;
  provider?: string;
  durationHours?: number;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: SkillCategory;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  relatedSkills: string[];
  prerequisites: string[];
  learningResources: LearningResource[];
  typicalProficiencyLevels: Record<ProficiencyLevel, string>;
}

export interface UserSkill {
  id: string;
  skillId?: string;
  skillName: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsOfExp: number;
  lastUsedYear?: number;
  verified: boolean;
  verifiedSource?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  grade?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  isInternship: boolean;
  description: string;
  skillsUsed: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsUsed: string[];
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skillsCovered: string[];
}

export interface Profile {
  id: string;
  userId: string;
  headline: string;
  location: string;
  phone?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  cgpa?: string;
  targetRoleId?: string;
  targetRoleTitle?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  skills: UserSkill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface UserSession {
  id: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

export interface RoleSkillRequirement {
  name: string;
  category: SkillCategory;
  minProficiency: ProficiencyLevel;
  weight: number; // 1 to 5
  description?: string;
}

export interface RoadmapMilestoneTemplate {
  order: number;
  phase: 'Foundation' | 'Core Engineering' | 'Advanced System Design' | 'Capstone & Proof of Work' | 'Interview Mastery';
  title: string;
  description: string;
  skillsFocus: string[];
  estimatedWeeks: number;
  actionableTasks: string[];
  resources: LearningResource[];
}

export interface CareerRole {
  id: string;
  title: string;
  slug: string;
  department: string;
  description: string;
  minExperienceYears: number;
  minEducationDegree: string;
  averageSalaryUsd: string;
  marketDemand: 'High' | 'Very High' | 'Moderate';
  requiredSkills: RoleSkillRequirement[];
  preferredSkills: RoleSkillRequirement[];
  softSkills: string[];
  weights: {
    technicalSkills: number;
    experience: number;
    education: number;
    softSkills: number;
    projects: number;
  };
  roadmaps: RoadmapMilestoneTemplate[];
}

export interface ExtractedJobRequirements {
  jobTitle: string;
  company: string;
  location?: string;
  requiredSkills: Array<{ name: string; category: SkillCategory; minProficiency: ProficiencyLevel; weight: number }>;
  preferredSkills: Array<{ name: string; category: SkillCategory; minProficiency: ProficiencyLevel; weight: number }>;
  requiredExperienceYears: number;
  minDegree: string;
  softSkills: string[];
  toolsAndPlatforms: string[];
  responsibilities: string[];
  keywords: string[];
}

export interface MatchedSkillItem {
  name: string;
  category: SkillCategory;
  userProficiency: ProficiencyLevel;
  requiredProficiency: ProficiencyLevel;
  isRequirementMet: boolean;
  scoreContribution: number;
  evidenceSource?: string;
}

export interface MissingSkillItem {
  name: string;
  category: SkillCategory;
  requiredProficiency: ProficiencyLevel;
  importance: 'critical' | 'preferred';
  estimatedHoursToAcquire: number;
  recommendedResource: LearningResource;
}

export interface PartialGapItem {
  skillName: string;
  currentProficiency: ProficiencyLevel;
  targetProficiency: ProficiencyLevel;
  gapSeverity: 'low' | 'medium' | 'high';
  humanExplanation: string;
  actionableTopics: string[];
}

export interface JobAnalysis {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  location?: string;
  rawJobDescription: string;
  targetRoleId?: string;
  targetRoleTitle?: string;
  overallScore: number;
  potentialScore: number;
  technicalScore: number;
  experienceScore: number;
  educationScore: number;
  softSkillsScore: number;
  projectScore: number;
  keywordMatchScore: number;
  verdict: 'Interview Ready' | 'Competitive Contender' | 'Upskilling Needed' | 'Significant Gap';
  summaryReason: string;
  matchedSkills: MatchedSkillItem[];
  missingSkills: MissingSkillItem[];
  partialGaps: PartialGapItem[];
  recommendedActions: string[];
  weightsUsed: {
    technicalSkills: number;
    experience: number;
    education: number;
    softSkills: number;
    projects: number;
  };
  createdAt: string;
}

export interface RoadmapMilestone {
  id: string;
  roadmapId: string;
  order: number;
  phase: string;
  title: string;
  description: string;
  skillsFocus: string[];
  estimatedWeeks: number;
  completed: boolean;
  completedAt?: string;
  actionableTasks: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  resources: LearningResource[];
}

export interface Roadmap {
  id: string;
  userId: string;
  analysisId?: string;
  title: string;
  targetRole: string;
  totalWeeks: number;
  estimatedHours: number;
  status: 'active' | 'completed' | 'archived';
  progressPercentage: number;
  milestones: RoadmapMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgressLog {
  id: string;
  userId: string;
  activityType: 'course_completed' | 'project_built' | 'skill_practiced' | 'roadmap_milestone' | 'assessment';
  description: string;
  hoursSpent: number;
  completedItem: string;
  scoreDelta?: number;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  jobTitle: string;
  location?: string;
  salaryRange?: string;
  status: 'wishlist' | 'applied' | 'screening' | 'technical' | 'offer' | 'rejected';
  jobUrl?: string;
  notes?: string;
  appliedDate?: string;
  lastFollowUp?: string;
  analysisId?: string;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompareAnalysisResult {
  jobAnalyses: JobAnalysis[];
  comparisonMetrics: {
    highestMatchId: string;
    fastestToCloseGapId: string;
    sharedMissingSkills: string[];
    roleComparison: Array<{
      analysisId: string;
      jobTitle: string;
      company: string;
      score: number;
      criticalGapsCount: number;
      estimatedWeeksToReady: number;
      verdict: string;
    }>;
  };
  recommendation: string;
}
