import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[0-9]/, 'Must include at least one number'),
  targetRoleId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ProfileUpdateSchema = z.object({
  headline: z.string().max(120).optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(25).optional(),
  degree: z.string().max(100).optional(),
  branch: z.string().max(100).optional(),
  graduationYear: z.number().int().min(1970).max(2035).optional().nullable(),
  cgpa: z.string().max(20).optional(),
  targetRoleId: z.string().optional(),
  githubUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  linkedinUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  portfolioUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  bio: z.string().max(2000).optional(),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

export const UserSkillSchema = z.object({
  skillName: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.enum(['beginner', 'elementary', 'intermediate', 'advanced', 'expert']),
  yearsOfExp: z.number().min(0).max(50).default(1),
  lastUsedYear: z.number().int().min(1990).max(2030).optional(),
  verified: z.boolean().default(false),
});

export type UserSkillInput = z.infer<typeof UserSkillSchema>;

export const EducationSchema = z.object({
  institution: z.string().min(2, 'Institution is required'),
  degree: z.string().min(2, 'Degree is required'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  startYear: z.number().int().min(1970).max(2035),
  endYear: z.number().int().min(1970).max(2035).optional().nullable(),
  grade: z.string().max(20).optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(1000).optional(),
});

export type EducationInput = z.infer<typeof EducationSchema>;

export const ExperienceSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  role: z.string().min(2, 'Job title is required'),
  location: z.string().max(100).optional(),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  isInternship: z.boolean().default(false),
  description: z.string().min(10, 'Description should be at least 10 characters').max(2000),
  skillsUsed: z.array(z.string()).default([]),
});

export type ExperienceInput = z.infer<typeof ExperienceSchema>;

export const ProjectSchema = z.object({
  title: z.string().min(2, 'Project title is required'),
  description: z.string().min(15, 'Project description must be at least 15 characters').max(2500),
  repoUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  liveUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  complexity: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Intermediate'),
  skillsUsed: z.array(z.string()).min(1, 'Please select or add at least one skill used'),
  highlights: z.array(z.string()).default([]),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

export const CertificationSchema = z.object({
  name: z.string().min(2, 'Certification name is required'),
  issuingOrg: z.string().min(2, 'Issuing organization is required'),
  issueDate: z.string().min(4, 'Issue date is required'),
  expiryDate: z.string().optional(),
  credentialId: z.string().max(100).optional(),
  credentialUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  skillsCovered: z.array(z.string()).default([]),
});

export type CertificationInput = z.infer<typeof CertificationSchema>;

export const JobAnalysisInputSchema = z.object({
  jobTitle: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().max(100).optional(),
  rawJobDescription: z.string().min(50, 'Job description must be at least 50 characters to produce a meaningful analysis'),
  targetRoleId: z.string().optional(),
});

export type JobAnalysisInput = z.infer<typeof JobAnalysisInputSchema>;

export const JobApplicationSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  status: z.enum(['wishlist', 'applied', 'screening', 'technical', 'offer', 'rejected']),
  jobUrl: z.string().url().or(z.literal('')).optional(),
  notes: z.string().max(2000).optional(),
  appliedDate: z.string().optional(),
  lastFollowUp: z.string().optional(),
  analysisId: z.string().optional(),
});

export type JobApplicationInput = z.infer<typeof JobApplicationSchema>;

export const ProgressLogSchema = z.object({
  activityType: z.enum(['course_completed', 'project_built', 'skill_practiced', 'roadmap_milestone', 'assessment']),
  description: z.string().min(5, 'Description is required'),
  hoursSpent: z.number().min(0.5).max(100),
  completedItem: z.string().min(2, 'Item name is required'),
  skillName: z.string().optional(),
});

export type ProgressLogInput = z.infer<typeof ProgressLogSchema>;
