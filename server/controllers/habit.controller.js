import Habit from '../models/Habit.model.js';
import HabitLog from '../models/HabitLog.model.js';

/**
 * @route   POST /api/habits
 * @desc    Create a new habit
 * @access  Private
 */
export const createHabit = async (req, res, next) => {
    try {
        const { title, description, color, icon, frequency, goal, reminderTime } = req.body;

        const habit = await Habit.create({
            userId: req.user.id,
            title,
            description,
            color,
            icon,
            frequency,
            goal,
            reminderTime
        });

        res.status(201).json({
            success: true,
            data: habit
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/habits
 * @desc    Get all user habits
 * @access  Private
 */
export const getHabits = async (req, res, next) => {
    try {
        const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: habits
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/habits/logs
 * @desc    Get habit logs for date range
 * @access  Private
 */
export const getHabitLogs = async (req, res, next) => {
    try {
        const { start, end } = req.query;
        const userId = req.user.id;

        const query = { userId };

        if (start && end) {
            query.date = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }

        const logs = await HabitLog.find(query).sort({ date: -1 });

        res.json({
            success: true,
            data: logs
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /api/habits/:id
 * @desc    Update a habit
 * @access  Private
 */
export const updateHabit = async (req, res, next) => {
    try {
        const habit = await Habit.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!habit) {
            return res.status(404).json({ success: false, message: 'Habit not found' });
        }

        res.json({
            success: true,
            data: habit
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/habits/:id
 * @desc    Delete a habit
 * @access  Private
 */
export const deleteHabit = async (req, res, next) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!habit) {
            return res.status(404).json({ success: false, message: 'Habit not found' });
        }

        // Clean up logs
        await HabitLog.deleteMany({ habitId: req.params.id });

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Validates if the date string is a valid date
 * @param {string} dateString 
 * @returns {Date|null}
 */
const parseDate = (dateString) => {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? null : d;
};


/**
 * @route   POST /api/habits/:id/complete
 * @desc    Mark habit as completed (or toggle) for a specific date
 * @access  Private
 */
export const toggleCompletion = async (req, res, next) => {
    try {
        const { date } = req.body; // Expecting ISO date string or similar
        const targetDate = date ? parseDate(date) : new Date();

        // Normalize to start of day for consistency
        targetDate.setHours(0, 0, 0, 0);

        // Prevent marking future dates as complete
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (targetDate > today) {
            return res.status(400).json({
                success: false,
                message: 'Cannot mark future dates as complete'
            });
        }

        const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
        if (!habit) {
            return res.status(404).json({ success: false, message: 'Habit not found' });
        }

        // Check existing log
        const existingLog = await HabitLog.findOne({
            habitId: habit._id,
            date: targetDate
        });

        let action;
        let newStatus;

        if (!existingLog) {
            // No log exists → Create as 'completed'
            await HabitLog.create({
                habitId: habit._id,
                userId: req.user.id,
                date: targetDate,
                status: 'completed'
            });
            habit.totalCompletions += 1;
            habit.currentStreak += 1;
            habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
            action = 'completed';
            newStatus = 'completed';
        } else if (existingLog.status === 'completed') {
            // Completed → Change to 'missed'
            existingLog.status = 'missed';
            await existingLog.save();
            habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
            habit.currentStreak = Math.max(0, habit.currentStreak - 1);
            action = 'marked as missed';
            newStatus = 'missed';
        } else if (existingLog.status === 'missed') {
            // Missed → Delete (unmarked)
            await HabitLog.findByIdAndDelete(existingLog._id);
            action = 'unmarked';
            newStatus = 'unmarked';
        } else {
            // Unmarked → Change to 'completed'
            existingLog.status = 'completed';
            await existingLog.save();
            habit.totalCompletions += 1;
            habit.currentStreak += 1;
            habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
            action = 'completed';
            newStatus = 'completed';
        }

        await habit.save();

        res.json({
            success: true,
            message: `Habit ${action}`,
            data: {
                habitId: habit._id,
                date: targetDate,
                status: newStatus,
                stats: {
                    currentStreak: habit.currentStreak,
                    totalCompletions: habit.totalCompletions
                }
            }
        });

    } catch (error) {
        next(error);
    }
};
