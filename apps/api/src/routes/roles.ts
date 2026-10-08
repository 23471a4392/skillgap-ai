import { Router } from 'express';
import { CAREER_ROLES } from '@skillgap/config';

const router = Router();

// GET /api/roles
router.get('/', (req, res) => {
  const { department, search } = req.query;

  let roles = [...CAREER_ROLES];

  if (department && typeof department === 'string') {
    roles = roles.filter((r) => r.department.toLowerCase() === department.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    roles = roles.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.requiredSkills.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  res.json({ roles });
});

// GET /api/roles/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const role = CAREER_ROLES.find((r) => r.id === id || r.slug === id);

  if (!role) {
    return res.status(404).json({ message: 'Career role definition not found.' });
  }

  res.json({ role });
});

export default router;
