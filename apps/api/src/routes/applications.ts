import { Router } from 'express';
import { prisma } from '../db';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { JobApplicationSchema } from '@skillgap/validation';

const router = Router();
router.use(authMiddleware);

// GET /api/applications
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const applications = await prisma.jobApplicationRecord.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ applications });
  } catch (error) {
    next(error);
  }
});

// POST /api/applications
router.post('/', validate(JobApplicationSchema), async (req: AuthRequest, res, next) => {
  try {
    const app = await prisma.jobApplicationRecord.create({
      data: {
        userId: req.user!.id,
        ...req.body,
        appliedDate: req.body.appliedDate || new Date().toISOString().split('T')[0],
      },
    });
    res.status(201).json({ application: app, message: 'Application logged.' });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/applications/:id
router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const app = await prisma.jobApplicationRecord.update({
      where: { id },
      data: req.body,
    });
    res.json({ application: app, message: 'Application status updated.' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    await prisma.jobApplicationRecord.delete({ where: { id } });
    res.json({ message: 'Application removed.' });
  } catch (error) {
    next(error);
  }
});

export default router;
