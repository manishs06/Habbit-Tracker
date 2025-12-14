import { body, validationResult } from 'express-validator';

export const validateHabit = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title too long'),

    body('frequency')
        .optional()
        .custom((value) => {
            if (typeof value === 'string') return ['Daily', 'Weekly'].includes(value);
            // If we want detailed days like ["Mon", "Tue"], we'd check if array
            // For now adhering to simple Daily/Weekly string or array Logic from controller
            return true;
        }),

    body('goal')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Goal must be at least 1'),

    body('color')
        .optional()
        .matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
        .withMessage('Invalid color format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: errors.array()
            });
        }
        next();
    }
];
