import express from 'express';
import {
    createHabit,
    getHabits,
    getHabitLogs,
    updateHabit,
    deleteHabit,
    toggleCompletion
} from '../controllers/habit.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

import { validateHabit } from '../middlewares/validators.js';

const router = express.Router();

router.use(authenticate);

router.route('/')
    .post(validateHabit, createHabit)
    .get(getHabits);

// Specific routes must come before parameterized routes
router.get('/logs', getHabitLogs);
router.post('/:id/complete', toggleCompletion);

router.route('/:id')
    .put(updateHabit)
    .delete(deleteHabit);

export default router;
