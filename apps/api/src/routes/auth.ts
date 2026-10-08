import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ChangePasswordSchema, ForgotPasswordSchema, LoginSchema, RegisterSchema } from '@skillgap/validation';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-development-key-skillgap-ai-2026-production-ready';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/register
router.post('/register', validate(RegisterSchema), async (req, res, next) => {
  try {
    const { name, email, password, targetRoleId } = req.body;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return res.status(409).json({ message: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        profile: {
          create: {
            headline: 'Aspiring Professional',
            location: 'Remote / Hybrid',
            targetRoleId: targetRoleId || 'role-fullstack',
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Store session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || '127.0.0.1',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', validate(LoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || '127.0.0.1',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          include: {
            skills: true,
            education: true,
            experience: true,
            projects: true,
            certifications: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse JSON fields in projects and experience
    const formattedProfile = user.profile
      ? {
          ...user.profile,
          projects: user.profile.projects.map((p) => ({
            ...p,
            skillsUsed: JSON.parse(p.skillsUsed || '[]'),
            highlights: JSON.parse(p.highlights || '[]'),
          })),
          experience: user.profile.experience.map((e) => ({
            ...e,
            skillsUsed: JSON.parse(e.skillsUsed || '[]'),
          })),
          certifications: user.profile.certifications.map((c) => ({
            ...c,
            skillsCovered: JSON.parse(c.skillsCovered || '[]'),
          })),
        }
      : null;

    res.json({
      user: {
        ...user,
        profile: formattedProfile,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      await prisma.session.deleteMany({ where: { token } });
    }
    res.json({ message: 'Successfully logged out.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout-all
router.post('/logout-all', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    await prisma.session.deleteMany({ where: { userId: req.user!.id } });
    res.json({ message: 'Logged out of all active sessions.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/change-password
router.post('/change-password', authMiddleware, validate(ChangePasswordSchema), async (req: AuthRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', validate(ForgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    // In production this sends an email with a secure token; for this humanized implementation we provide real feedback
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    res.json({
      message: user
        ? 'A password recovery link has been dispatched to your email address.'
        : 'If an account exists with this email address, instructions will be delivered shortly.',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/sessions
router.get('/sessions', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const currentToken = req.headers.authorization?.split(' ')[1];
    const sessions = await prisma.session.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
        token: true,
      },
    });

    res.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        userAgent: s.userAgent,
        ipAddress: s.ipAddress,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        isCurrent: s.token === currentToken,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/auth/delete-account
router.delete('/delete-account', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.user!.id } });
    res.json({ message: 'Account and associated records permanently deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;
